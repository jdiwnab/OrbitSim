    //Lagrange points
    /* 
    
    
    * L1 = R * (1-cuberoot((M2/(M1+M2))/3))
    * L2 = R * (1+cuberoot((M2/(M1+M2))/3))
    * L3 = -1R * (1+5/12 * (M2/(M1+M2)))

    
    *  r1 = R * cuberoot(M2/3*M1) = > R1 = R - r1
    *  r2 = R * cuberoot(M2/3*M1) = > R2 = R + r2
    *  R3 = R * (7 * M2)/(12* M1)
    *  R4 = R (60 deg)
    *  R5 = R (-60deg)

    * 
    *  Te = 2 * pi * sqrt(R^3/(G*(M1+M2)))
    *  v1 = (2 * pi * R1) / Te = R1/sqrt(R^3/M1)
    *  v2 = (2 * pi * R2) / Te = R2/sqrt(R^3/M1)

    *  v = sqrt(G*M1/R)
    */

engine.loadLagrange = function() {
    engine.orbit_data.planet_array = [];
    engine.addPlanet('Sun', new Cart3(0,0,0), 1.3275E+011, new Cart3(0,0,0), 'yellow', 60000, false);

    var vel = Math.sqrt(1.3275E+011/200000000);
    engine.addPlanet('Earth', new Cart3(200000000,0,0), 500000, new Cart3(0,0,vel), 'blue', 6000, false);
    
    var planet = engine.orbit_data.planet_array[1];
    var sun = engine.orbit_data.planet_array[0];
    
    var R = planet.pos.abs();
    var period_planet =  2 * Math.PI * Math.sqrt(R * R * R / (sun.mass+planet.mass));
    var deltaLimit = 1/(Math.pow(10, Math.round(Math.log10(R*100))));

    engine.loadL1(sun, planet, R, deltaLimit, period_planet);
    engine.loadL2(sun, planet, R, deltaLimit, period_planet);
    engine.loadL3(sun, planet, R, deltaLimit, period_planet);
    engine.loadL4(sun, planet);
    engine.loadL5(sun, planet);
}

engine.lagrangePoint = function(point, radius, m_sun, m_planet, R, period) {
    var alpha = R * m_planet / (m_sun + m_planet)

    //Point 3 is opposite of sun
    if (point == 3) {
        //Projected speed
        var v = 2 * Math.PI * (radius + alpha) / period;
        var beta = (v * v) / (radius + alpha);
    } else  {
        //Others are near planet
        var v = 2 * Math.PI * (radius - alpha) / period;
        var beta = (v * v) / (radius - alpha);
    }

    if (point == 1) {
       // M1 / r^2 - M2 / ((r-R)*(r-R))
       var gamma = (m_sun / (radius * radius)) - (m_planet / ((radius - R) * (radius-R)));
    } else if (point == 2) {
       var gamma = (m_sun / (radius * radius)) + (m_planet / ((radius - R) * (radius-R)));  
    } else {
       var gamma = (m_sun / (radius * radius)) + (m_planet / ((radius + R) * (radius+R)));
    }            

    return beta - gamma;
}

engine.loadL1 = function(sun, planet, R, deltaLimit, period_planet) {

    var radius = 1;
    var delta = 1000000000000; 
    //hill climbing until crossing the top, then back off and narrow delta to refine search
    while (delta > deltaLimit) {
        do {
            var a = engine.lagrangePoint (1, radius,         sun.mass, planet.mass, R, period_planet);
            var b = engine.lagrangePoint (1, radius + delta, sun.mass, planet.mass, R, period_planet);
            radius += delta;
        } while (Math.abs(a) > Math.abs(b))
        radius -= 2 * delta;
        delta = delta / 10;
    }

    // L1 = R * (1-cuberoot((M2/(M1+M2))/3))

    var dist = 2 * Math.PI * radius;
    var vel = dist/period_planet;
    engine.addPlanet('L1', new Cart3(radius,0,0), 50, new Cart3(0,0,vel), 'red', 6000, false);
}

engine.loadL2 = function(sun, planet, R, deltaLimit, period_planet) {
    var radius = R + 1;
    var delta = 1000000000000; 

    while (delta > deltaLimit) {
        do {
            var a = engine.lagrangePoint (2, radius,         sun.mass, planet.mass, R, period_planet);
            var b = engine.lagrangePoint (2, radius + delta, sun.mass, planet.mass, R, period_planet);
            radius += delta;
        } while (Math.abs(a) > Math.abs(b))
        radius -= 2 * delta;
        delta = delta / 10;
    }
    // L2 = R * (1+cuberoot((M2/(M1+M2))/3))
    var dist = 2 * Math.PI * radius;
    var vel = dist/period_planet;
    engine.addPlanet('L2', new Cart3(radius,0,0), 50, new Cart3(0,0,vel), 'green', 6000, false);
}

engine.loadL3 = function(sun, planet, R, deltaLimit, period_planet) {
    var radius = 1;
    var delta = 1000000000000; 
    //hill climbing until crossing the top, then back off and narrow delta to refine search
    while (delta > deltaLimit) {
        do {
            var a = engine.lagrangePoint (3, radius,         sun.mass, planet.mass, R, period_planet);
            var b = engine.lagrangePoint (3, radius + delta, sun.mass, planet.mass, R, period_planet);
            radius += delta;
        } while (Math.abs(a) > Math.abs(b))
        radius -= 2 * delta;
        delta = delta / 10;
    }

    // L3 = -1R * (1+5/12 * (M2/(M1+M2)))
    var dist = 2 * Math.PI * radius;
    var vel = dist/period_planet;
    engine.addPlanet('L3', new Cart3(-radius,0,0), 50, new Cart3(0,0,-vel), 'orange', 6000, false);
}

engine.loadL4 = function(sun, planet) {
    //L4 = - 60deg
    var radius = planet.pos.abs();
    var vel = planet.vel.abs();
    var pos_x = radius * Math.cos( -60 * Math.PI / 180);
    var pos_y = radius * Math.sin( -60 * Math.PI / 180);
    var vel_x = vel * Math.cos( 30 * Math.PI / 180);
    var vel_y = vel * Math.sin( 30 * Math.PI / 180);
    engine.addPlanet('L4', new Cart3(pos_x,0,pos_y), 50, new Cart3(vel_x,0,vel_y), 'magenta', 6000, false);
}

engine.loadL5 = function(sun, planet) {
    //L5 = +60deg
    var radius = planet.pos.abs();
    var vel = planet.vel.abs();
    var pos_x = radius * Math.cos( 60 * Math.PI / 180);
    var pos_y = radius * Math.sin( 60 * Math.PI / 180);
    var vel_x = vel * Math.cos( 150 * Math.PI / 180);
    var vel_y = vel * Math.sin( 150 * Math.PI / 180);
    engine.addPlanet('L5', new Cart3(pos_x,0,pos_y), 50, new Cart3(vel_x,0,vel_y), 'cyan', 6000, false);
}