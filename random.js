engine.loadRandomPlanets = function(n) {
    engine.orbit_data.planet_array = [];
    engine.addPlanet('Sun', new Cart3(0,0,0), 1.3275E+011, new Cart3(0,0,0), 'yellow', 60000, true);
    engine.randomPlanets(n);
}
engine.randomPlanets = function(n) {
    for(var i = 0; i< n; i++) {
        engine.randomPlanet();
    }
}
engine.randomPlanet = function() {
    var pos = engine.randomInt(0, 1000000000);
    var pos_angle = engine.randomInt(0,360);
    var pos_x = pos * Math.cos(pos_angle);
    var pos_y = pos * Math.sin(pos_angle);
    
    var vel = engine.randomInt(-50,50);
    var vel_angle = engine.randomInt(0,360);
    var vel_x = vel * Math.cos(vel_angle);
    var vel_y = vel * Math.sin(vel_angle);
    
    var mass = engine.randomInt(100,100000);
    
    var color = engine.orbit_data.planetColors[engine.randomInt(0,engine.orbit_data.planetColors.length-1)];
    
    var radius = engine.randomInt(10,1000);
    
    engine.addPlanet('', new Cart3(pos_x, 0, pos_y), mass, new Cart3(vel_x, 0, vel_y), color, radius, false);   
}

engine.randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}