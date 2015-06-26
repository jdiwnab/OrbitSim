engine.loadRandomPlanets = function(n) {
    engine.orbit_data.planet_array = [];
    var mass = 1.3275E+011
    var radius = Math.cbrt(mass*100000000); // r = cbrt(m/d * (3/4pi)) d = 1.4 for sun, 0.17 calculates for constants, scaling up because of size
    engine.addPlanet('Sun', new Cart3(0,0,0), mass, new Cart3(0,0,0), 'yellow', radius, true);
    engine.randomPlanets(n);
}
engine.randomPlanets = function(n) {
    for(var i = 0; i< n; i++) {
        engine.randomPlanet(i);
    }
}
engine.randomPlanet = function(i) {
    var pos = engine.randomInt(0, 1000000000);
    var pos_angle = engine.randomInt(0,360);
    var pos_x = pos * Math.cos(pos_angle);
    var pos_y = pos * Math.sin(pos_angle);
    
    var vel = engine.randomInt(0,10);
    var vel_angle = engine.randomInt(0,360);
    var vel_x = vel * Math.cos(vel_angle);
    var vel_y = vel * Math.sin(vel_angle);
    
    var mass = engine.randomInt(100,10000000000);
    
    var color = engine.orbit_data.planetColors[engine.randomInt(0,engine.orbit_data.planetColors.length-1)];
    
    //var radius = engine.randomInt(10,1000);
    var radius = Math.cbrt(mass*100000000);
    
    engine.addPlanet(i, new Cart3(pos_x, 0, pos_y), mass, new Cart3(vel_x, 0, vel_y), color, radius, false);   
}

engine.randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}