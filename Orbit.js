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
//engine.frame_delay_ms = 4; // delay between frames. Not to be confused with frame rate
engine.drawingScale = 1e-9;
//engine.drawingScale = 1e-2;
engine.substeps = 4;
engine.fps = 0; //for performance monitoring
engine.tps = 0; //for performance monitoring
engine.algorithm = "rk";
engine.collisions = true;
engine.history = true;
engine.clipping = true;
engine.basestep = 360;
engine.timestepmulti = 10;
engine.maxDistance = 100000000000;
engine.bhTheta = 0.5;
engine.useBhTree = false;

// Mass: Kg
// Distance: Meters
// time: Seconds

engine.id = function(s) { return document.getElementById(s); }


engine.reset = function() {
    if(engine.animate) {
        engine.id("start").click();

    }
    engine.animate = false;
    engine.frame_count = 0;
    
    engine.canvas = engine.id("orbit_disp");
    engine.ctx = engine.canvas.getContext("2d");
    engine.ctx.canvas.width = document.body.clientWidth;// -16;
    engine.ctx.canvas.height= document.body.scrollHeight -6;
    engine.xsize = engine.ctx.canvas.width;
    engine.ysize = engine.ctx.canvas.height;
    engine.yorig = Math.floor(engine.ysize /2 );
    engine.xorig = Math.floor(engine.xsize /2 );
    engine.xctr  = engine.xorig;
    engine.yctr  = engine.yorig;
    
    engine.zoom = 1.0;
    engine.timestepmulti = 10;
    engine.timeStep = engine.basestep * engine.timestepmulti;
    engine.stepsPerFrame = 1;
    engine.id('stepcount').textContent = engine.stepsPerFrame;
    engine.id('stepvalue').textContent = engine.timestepmulti;
    engine.elapsedTime = 0;
    engine.fps = 0;
    
    engine.legend = true;

    engine.orbit_data = orbit_data;
    engine.orbit_data.resetPlanets();
    engine.bhTree = null;
    engine.perform(0, true);
}

engine.resize = function() {
    engine.ctx.canvas.width = document.body.clientWidth;// -16;
    engine.ctx.canvas.height= document.body.scrollHeight -6;
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
    if(engine.animate == true) {
        engine.animate = false;
    } else {
        engine.animate = true;
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
    if(engine.useBhTree) {
        engine.bhTree = new bhTree();
        engine.bhTree.addArray(array);
    }

    //Calculate Accelerations
    for(var i = 0; i<array.length; i++) {
        if(array[i].fixed || array[i].destroyed) { 
            continue;
        }
        array[i].oldVel = array[i].vel;
        
        if(engine.algorithm === "rk") {
            engine.rkIterate(array[i],dt,array);
        } else if(engine.algorithm === "verlet") {
            engine.verletIntegrate(array[i], dt, array);
        } else if(engine.algorithm === "ruth2") {
            engine.ruth2Integrate(array[i], dt, array);
        } else if(engine.algorithm === "ruth3") {
            engine.ruth3Integrate(array[i], dt, array);
        } else if(engine.algorithm === "ruth4") {
            engine.ruth4Integrate(array[i], dt, array);
        } else {
            engine.eulerIntegrate(array[i], dt, array);
        }
    }
    //Update position/velocity
    for(var i = 0; i<array.length; i++) {
        if(array[i].fixed || array[i].destroyed) { 
            continue;
        }
        array[i].updatePosition();
    }
    
    //Calculate other bits
    for(var i = 0; i<array.length; i++) {
        if(array[i].fixed || array[i].destroyed) { 
            continue;
        }
        if(engine.collisions) {
            engine.calcCollision(array[i],array);
        }
        
        if(engine.clipping) {
            engine.calcClipping(array[i]);
        
        }
    }
    engine.elapsedTime += dt;
}

engine.updateOrbitHistory = function(pa, unlimited) {
    //if(!engine.history) return;

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
    var accel;
    if(engine.useBhTree) {
        //console.log('Calculating for '+pa.name);
        accel = engine.bhTree.calcAccel(pa,pos,array);
    } else {
        accel = new Cart3();
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
                    engine.log('collide: '+pa.name+' with '+pb.name);
                    pa.mass += pb.mass;
                    // add 'volumes' of spheres together and get a new radius
                    var radius = Math.cbtr(Math.pow(pa.radius,3) + Math.pow(pb.radius,3));
                    pa.radius = radius;
                    pa.vel = vf;
                    //array.splice(i,1);
                    array[i].destroyed = true;
                    break; //only one collision at a time for now.
                }
            }
        }
    }
}
engine.calcClipping = function(pa) {
    if(pa.pos.abs() > engine.maxDistance) {
        pa.destroyed = true;
    }
}




// Polyfill for older browsers
Math.cbtr = Math.cbrt || function(x) {
    var y = Math.pow(Math.abs(x),1/3);
    return x<0? -y: y;
}



