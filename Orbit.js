function addEvent(o,e,f) {
    if(o.addEventListener) {
        o.addEventListener(e,f,false);
        return true;
    } else if(o.attachEvent) {
        return o.attachEvent("on"+e,f);
    } else {
        return false;
    }
}


var orbit_data = new OrbitData();
//orbit_data.genPlanets();

var engine = engine || {}
//engine.G = 6.6742e-11 // universal gravitational constant - factored out to 1
engine.toRad = Math.PI /180.0 //convert degree to radians
engine.frame_delay_ms = 4; // delay between frames. Not to be confused with frame rate
engine.drawingScale = 1e-9;
engine.substeps = 4;
engine.fps = 0; //for performance monitoring
engine.algorithm = "rk";

// Mass: Kg
// Distance: Meters
// time: Seconds

engine.id = function(s) { return document.getElementById(s); }


engine.reset = function() {
    engine.animate = false;
    engine.frame_count = 0;
    
    engine.canvas = engine.id("orbit_disp");
    engine.ctx = engine.canvas.getContext("2d");
    engine.ctx.canvas.width = window.innerWidth;
    engine.ctx.canvas.height= window.innerHeight/2;
    engine.xsize = engine.ctx.canvas.width;
    engine.ysize = engine.ctx.canvas.height;
    engine.yorig = Math.floor(engine.ysize /2 );
    engine.xorig = Math.floor(engine.xsize /2 );
    engine.xctr  = engine.xorig;
    engine.yctr  = engine.yorig;
    
    engine.zoom = 1.0;
    engine.pFactor = 1000;
    engine.timeStep = 3600;
    engine.stepsPerFrame = 1;
    engine.elapsedTime = 0;
    engine.fps = 0;
    //engine.algorithm = "rk";

    
    engine.legend = true;
    
    $("#timestep").val(10);
    $("#framestep").val(1);
    if(engine.id("stop").value==="stop") {
        engine.id("stop").click();
    }
    //engine.id("algo3").checked = true;

    engine.orbit_data = orbit_data;
    engine.orbit_data.resetPlanets();
    engine.perform(0, true);
}

engine.resize = function() {
    engine.ctx.canvas.width = window.innerWidth;
    engine.ctx.canvas.height= window.innerHeight/2;
    engine.xsize = engine.ctx.canvas.width;
    engine.ysize = engine.ctx.canvas.height;
    engine.yorig = Math.floor(engine.ysize /2 );
    engine.xorig = Math.floor(engine.xsize /2 );
    engine.xctr  = engine.xorig;
    engine.yctr  = engine.yorig;
    engine.perform(0, true);
}

engine.log = function(err) {
  engine.id('console').textContent = err;
}

engine.pause = function(e) {
    if(e.target.value == "stop") {
        engine.animate = false;
        e.target.value = "start";
        e.target.textContent = "Start";
    } else {
        engine.animate = true;
        e.target.value = "stop";
        e.target.textContent = "Stop";
        if(engine.orbitTimer == null) {
            engine.perform(0, false);
        }
    }
}

//For the submit button of a form, old
/*engine.addBody = function(e) {
    engine.animate = false;
    var name = engine.id('new_name').value;
    var pos = engine.id('new_pos').value;
    //var radius = engine.id('new_radius').value;
    var radius = 10;
    var mass = engine.id('new_mass').value;
    var vel = engine.id('new_vel').value;
    var color = engine.id('new_color').value;
    var body = new OrbitBody(name, parseFloat(radius), new Cart3(parseFloat(pos),0,0), new Cart3(0,0,parseFloat(vel)), parseFloat(mass), color);
    orbit_data.planet_array.push(body);
    //orbit_data.addToTable(body);
    engine.id('new_name').value = '';
    engine.id('new_pos').value = '';
    //engine.id('new_radius').value = '';
    engine.id('new_mass').value = '';
    engine.id('new_vel').value = '';
    engine.id('new_color').value = '';
    engine.reset();
}*/

//For the modal dialog, sends basic info
/*engine.addObject = function(name, pos, mass, vel, color) {
    engine.animate = false;
    var radius = 10;
    var body = new OrbitBody(name, parseFloat(radius), new Cart3(parseFloat(pos),0,0), new Cart3(0,0,parseFloat(vel)), parseFloat(mass), color);
    orbit_data.planet_array.push(body);
    engine.reset();
}*/

//Takes cart3 for position and velocity
engine.addPlanet = function(name, pos, mass, vel, color, radius, fixed) {
    engine.animate = false;
    var body = new OrbitBody(name, radius, pos, vel, mass, color);
    body.fixed = fixed;
    orbit_data.planet_array.push(body);
    engine.reset();
}


engine.updateObjects = function(array, dt) {
    for(var i = 0; i<array.length; i++) {
        if(array[i].fixed) { 
            continue;
        }
        if(engine.algorithm === "rk") {
            engine.rkIterate(array[i],dt,array);
        } else if(engine.algorithm === "verlet") {
            engine.verletIntegrate(array[i], dt, array);
        } else {
            engine.eulerIntegrate(array[i], dt, array);
        }
    }
    engine.elapsedTime += dt;
}

engine.updateOrbitHistory = function(pa, unlimited) {
    if(pa.history.length >= 1000 && !unlimited) {
        pa.history.shift();
    }
    pa.history.push(new Cart3(pa.pos));
    pa.history[pa.history.length-1].timestamp = engine.elapsedTime;
}

engine.precalculate = function(dt, time) {
    engine.precalcStep(dt);
    if(engine.elapsedTime < time) {
        engine.log("Calculating... ("+(engine.elapsedTime/time) * 100+"%)");
        engine.orbitTimer = requestAnimationFrame(function() {engine.precalculate( dt,time);});
    } else {
        engine.csvexport();
    }
}

engine.precalcStep = function(dt) {
    engine.updateObjects(engine.orbit_data.planet_array,dt);
    for(var i = 0; i < engine.orbit_data.planet_array.length; i++) {
        var p = engine.orbit_data.planet_array[i]
        engine.updateOrbitHistory(p, true);
    }
}

engine.calcAccel = function(pa, pos, array) {
    var accel = new Cart3();
    var radius = new Cart3();
    for(var i = 0; i<array.length; i++) {
        var pb = array[i];
        //don't compute self-gravitation
        if(pa != undefined && pb != undefined && pa != pb) {
            //1. vel += dt * radius * -G * mass * radius.abs()^(-3/2)
            //2. pos += dt * vel
            //G is normalized to 1, so removed here
            radius.x=0;radius.y=0;radius.z=0;
            radius.addTo(pos).subFrom(pb.pos);
            accel.addTo(radius.multBy( (-1 * pb.mass * radius.invSumCube())));
        }
    }
    return accel;
}

function OrbitBody(name, radius, pos, vel, mass, color) {

    this.name = name; //string
    this.radius = radius; //scalar
    this.mass = mass; //scalar
    this.pos = pos; //cart3 vector
    this.oldPos = undefined; //cart3 vector
    this.vel = vel; //cart3 vector
    this.color = color; //string
    this.startpos = new Cart3(pos);
    this.startvel = new Cart3(vel);
    this.history = [new Cart3(pos)];
    this.scaledHistory; //cart3 array;
    this.fixed = false;
    this.renderPos = new Cart3();
    this.reset = function() {
        this.pos = new Cart3(this.startpos);
        this.vel = new Cart3(this.startvel);
        this.history = [new Cart3(this.startpos)];
        this.scaledHistory = undefined; 
        this.oldPos = undefined;
    }
    this.resetScaledHistory = function() {
        this.scaledHistory = undefined;
    }
}




