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
engine.tps = 0; //for performance monitoring
engine.algorithm = "rk";
engine.collisions = false;
engine.history = true;

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
        if(array[i].fixed || array[i].destroyed) { 
            continue;
        }
        array[i].oldVel = array[i].vel;
        
        if(engine.algorithm === "rk") {
            engine.rkIterate(array[i],dt,array);
        } else if(engine.algorithm === "verlet") {
            engine.verletIntegrate(array[i], dt, array);
        } else {
            engine.eulerIntegrate(array[i], dt, array);
        }
        if(engine.collisions) {
            engine.calcCollision(array[i],array);
        }
        
        engine.updateOrbitHistory(array[i], false);
    }
    engine.elapsedTime += dt;
}

engine.updateOrbitHistory = function(pa, unlimited) {
    if(!engine.history) return;

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
        if(pa != undefined && pb != undefined && pa != pb && !pb.destroyed) {
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

engine.calcCollision = function(pa, array) {
    var radius = new Cart3();
    for(var i = 0; i<array.length; i++) {
        var pb = array[i];
        if(pa != undefined && pb != undefined && pa != pb && !pb.destroyed) {
            if(pa.mass >= pb.mass) { //otherwise, wait for pb to become pa
                radius.x=0;radius.y=0;radius.z=0;
                radius.addTo(pa.pos).subFrom(pb.pos);
                if(radius.abs() < pa.radius + pb.radius) {
                    //collision!
                    var p_a = new Cart3(pa.oldVel).multBy(pa.mass);
                    var p_b = new Cart3(pb.oldVel).multBy(pb.mass);
                    var vf = new Cart3(p_a).addTo(p_b).divBy(pa.mass+pb.mass);
                    engine.log('collide: '+p_a.toString()+' with '+p_b.toString()+' = '+vf.toString());
                    pa.mass += pb.mass;
                    pa.vel = vf;
                    //array.splice(i,1);
                    array[i].destroyed = true;
                    break; //only one collision at a time for now.
                }
            }
        }
    }
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
    this.startmass = mass;
    this.history = [new Cart3(pos)];
    this.scaledHistory; //cart3 array;
    this.fixed = false;
    this.renderPos = new Cart3();
    this.destroyed = false;
    this.reset = function() {
        this.pos = new Cart3(this.startpos);
        this.vel = new Cart3(this.startvel);
        this.mass = this.startmass;
        this.history = [new Cart3(this.startpos)];
        this.scaledHistory = undefined; 
        this.oldPos = undefined;
        this.destroyed = false;
    }
    this.resetScaledHistory = function() {
        this.scaledHistory = undefined;
    }
}




