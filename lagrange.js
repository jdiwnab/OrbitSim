    /*Lagrange points
        
    * Orbital period
    * T = 2 * pi * sqrt(R^3/(G*(M1+M2)))
    * Orbital velocity
    * V = sqrt(G*M1/R)
    * Orbital Distance
    * D = 2 * pi * R
    
    * Centrifugal force
    * F = (v^2) / (R)
    * Gravitational force
    * F = G*M/R^2
    * Barrycenter
    * a = R*M2/(M1+M2)
    * Proposed New orbital velocity
    * 2*pi*R/(period)
    
    * Approx solutions
    * L1 = R * (1-cuberoot((M2/(M1+M2))/3))
    * L2 = R * (1+cuberoot((M2/(M1+M2))/3))
    * L3 = -1R * (1+5/12 * (M2/(M1+M2)))
    * L4 = -60deg
    * L5 = +60deg
    * r1 = R * cuberoot(M2/3*M1) = > R1 = R - r1
    * r2 = R * cuberoot(M2/3*M1) = > R2 = R + r2
    * R3 = R * (7 * M2)/(12* M1)
    * R4 = R (60 deg)
    * R5 = R (-60deg)
    * v1 = (2 * pi * R1) / Te = R1/sqrt(R^3/M1)
    * v2 = (2 * pi * R2) / Te = R2/sqrt(R^3/M1)
    
    * Full solution
    * u = distance from M2
    * a = M2/(M1+M2)
    * s0 = sign(u), s1 = sign(u+1)
    * u^2 ( (1-s1) + 3u + 3u^2 + u^3 ) = a ( s0 + 2s0u + (1+s0-s1)u^2 + 2u^3 + u^4 )
    
    * L1: s0 = s1 = -1
    * u^2 ( 2 + 3u + 3u^2 + u^3 ) = a ( -1 -2u + u^2 + 2u^3 + u^4 )
    * L2: s0 = s1 = 1
    * u^3 ( 3 + 3u + u^2 ) = a (1 + 2u + u^2 + 2u^3 + u^4 )

    
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
    var deltaLimit = 1/(Math.pow(10, Math.round(Math.log10(R))));

    engine.loadL1(sun, planet, R, deltaLimit, period_planet);
    engine.loadL2(sun, planet, R, deltaLimit, period_planet);
    engine.loadL3(sun, planet, R, deltaLimit, period_planet);
    engine.loadL4(sun, planet);
    engine.loadL5(sun, planet);
}

engine.lagrangeForces = function(point, radius, m_sun, m_planet, R, period) {
    //point is which lagrange point we are solving for
    //radius is the proposed radius of vehicle, based on barrycenter
    //m_sun is mass of primary object
    //m_planet is mass of secondary object
    //R is distance between primary and secondary
    //period is orbital period of secondary around primary
    
    //L1 is between sun and planet

    //distance of sun from barrycenter
    var r_1 = R * m_planet / (m_sun + m_planet)

    //centrifugal force
    var v = 2 * Math.PI * (radius) / period;
    var centrifugal = (v * v) / (radius);
    
    var distance_from_sun = radius-r_1;
    // L3 is behind sun, so add full distance, else find difference
    if(point == 3) {
        var distance_from_earth = Math.abs(distance_from_sun+R);
    } else {
        var distance_from_earth = Math.abs(R-distance_from_sun);
    }
    // L1 is between, so gravity cancels, else adds.
    if(point == 1) {
        var gravitational = (m_sun / (Math.pow(distance_from_sun, 2))) - (m_planet / (Math.pow(distance_from_earth,2)));
    } else {
        var gravitational = (m_sun / (Math.pow(distance_from_sun, 2))) + (m_planet / (Math.pow(distance_from_earth,2)));
    }
  
    //centrifugal force - gravitational force.
    return centrifugal - gravitational;
}

engine.loadL1 = function(sun, planet, R, deltaLimit, period_planet) {

    var radius = 1;
    var delta = 1000000000000; 
    // iteratively minimize forces. If b < a, b is better, so go there. if a > b, went too far, so back up and reduce step size.
    while (delta > deltaLimit) {
        do {
            var a = engine.lagrangeForces (1, radius,         sun.mass, planet.mass, R, period_planet);
            var b = engine.lagrangeForces (1, radius + delta, sun.mass, planet.mass, R, period_planet);
            radius += delta;
        } while (Math.abs(a) > Math.abs(b))
        radius -= 2 * delta;
        delta = delta / 10;
    }
    //radius is currently from barrycenter, so correct to from true center
    radius += R * planet.mass / (sun.mass + planet.mass);

    var dist = 2 * Math.PI * radius;
    var vel = dist/period_planet;
    engine.addPlanet('L1', new Cart3(radius,0,0), 1, new Cart3(0,0,vel), 'red', 6000, false);
}

engine.loadL2 = function(sun, planet, R, deltaLimit, period_planet) {
    var radius = R + 1;
    var delta = 1000000000000; 

    while (delta > deltaLimit) {
        do {
            var a = engine.lagrangeForces (2, radius,         sun.mass, planet.mass, R, period_planet);
            var b = engine.lagrangeForces (2, radius + delta, sun.mass, planet.mass, R, period_planet);
            radius += delta;
        } while (Math.abs(a) > Math.abs(b))
        radius -= 2 * delta;
        delta = delta / 10;
    }
    
    //radius is currently from barrycenter, so correct to from true center
    radius += R * planet.mass / (sun.mass + planet.mass);
    
    var dist = 2 * Math.PI * radius;
    var vel = dist/period_planet;
    engine.addPlanet('L2', new Cart3(radius,0,0), 1, new Cart3(0,0,vel), 'green', 6000, false);
}

engine.loadL3 = function(sun, planet, R, deltaLimit, period_planet) {
    var radius = 1;
    var delta = 1000000000000; 
    //hill climbing until crossing the top, then back off and narrow delta to refine search
    while (delta > deltaLimit) {
        do {
            var a = engine.lagrangeForces (3, radius,         sun.mass, planet.mass, R, period_planet);
            var b = engine.lagrangeForces (3, radius + delta, sun.mass, planet.mass, R, period_planet);
            radius += delta;
        } while (Math.abs(a) > Math.abs(b))
        radius -= 2 * delta;
        delta = delta / 10;
    }
    
    //radius is currently from barrycenter, so correct to from true center
    radius -= R * planet.mass / (sun.mass + planet.mass);
    
    var dist = 2 * Math.PI * radius;
    var vel = dist/period_planet;
    engine.addPlanet('L3', new Cart3(-radius,0,0), 1, new Cart3(0,0,-vel), 'orange', 6000, false);
}

engine.loadL4 = function(sun, planet) {
    //L4 = - 60deg
    var radius = planet.pos.abs();
    var vel = planet.vel.abs();
    var pos_x = radius * Math.cos( -60 * Math.PI / 180);
    var pos_y = radius * Math.sin( -60 * Math.PI / 180);
    var vel_x = vel * Math.cos( 30 * Math.PI / 180);
    var vel_y = vel * Math.sin( 30 * Math.PI / 180);
    engine.addPlanet('L4', new Cart3(pos_x,0,pos_y), 1, new Cart3(vel_x,0,vel_y), 'magenta', 6000, false);
}

engine.loadL5 = function(sun, planet) {
    //L5 = +60deg
    var radius = planet.pos.abs();
    var vel = planet.vel.abs();
    var pos_x = radius * Math.cos( 60 * Math.PI / 180);
    var pos_y = radius * Math.sin( 60 * Math.PI / 180);
    var vel_x = vel * Math.cos( 150 * Math.PI / 180);
    var vel_y = vel * Math.sin( 150 * Math.PI / 180);
    engine.addPlanet('L5', new Cart3(pos_x,0,pos_y), 1, new Cart3(vel_x,0,vel_y), 'cyan', 6000, false);
}