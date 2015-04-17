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
    
    engine.id("timestep").value=10;
    engine.id("framestep").value=1;
    if(engine.id("stop").value==="stop") {
        engine.id("stop").click();
    }
    //engine.id("algo3").checked = true;

    engine.orbit_data = orbit_data;
    engine.orbit_data.resetPlanets();
    engine.perform(true);
}

engine.setupControlEvents = function() {
    //Zoom with mouse wheel
    engine.canvas.addEventListener('mousewheel', function(e) {
        engine.mouseZoom(e);
        return false;
    }, false);
    engine.canvas.addEventListener('DOMMouseScroll', function(e) {
        engine.mouseZoom(e);
        return false;
    }, false);
    //Start drag to pan
    engine.canvas.addEventListener('mousedown', function(e) {
        e.preventDefault();
        engine.mouseX = e.clientX;
        engine.mouseY = e.clientY;
        engine.initX = engine.xorig;
        engine.initY = engine.yorig;
        engine.mouseDown=true;
    }, false);
    //Update panning
    engine.canvas.addEventListener('mousemove', function(e) {
        e.preventDefault();
        if(engine.mouseDown) {
            engine.xorig = engine.initX + (e.clientX - engine.mouseX);
            engine.yorig = engine.initY + (e.clientY - engine.mouseY);
            engine.mouseMotion(e);
        }
    }, false);
    //Mouse up seems unreliable, so use click instead
    engine.canvas.addEventListener('click', function(e) {
        engine.mouseDown = false;
        //determine if the user clicked on an object;
        for(var i = 0; i<engine.orbit_data.planet_array.length; i++) {
            var pa = engine.orbit_data.planet_array[i];
            var pos = new Cart3(pa.renderPos);
            pos.x += engine.xorig;
            pos.z += engine.yorig
            
            if( engine.mouseX < pos.x + 10 && engine.mouseX > pos.x - 10 &&
                engine.mouseY < pos.z + 10 && engine.mouseY > pos.z - 10) {
                console.log("Clicked on "+pa.name);
            }
        }
    }, false);
    
    //touch events
    engine.canvas.addEventListener("touchstart", function(e) {
        e.preventDefault();
        //Each touch shows up as it's own event
        //but each has it's own identifier so we can tell the difference
        var touches = e.changedTouches;
        var touch = touches[0];
        //engine.log('touch start '+touch.identifier);
        if(engine.taid === undefined) {
            //first touch is for panning
            //engine.log('touch start 1 ('+touch.clientX+','+touch.clientY+')');
            engine.zoomFlag = false;
            engine.tax = touch.clientX;
            engine.tay = touch.clientY;
            engine.taid= touch.identifier;
            engine.initX = engine.xorig;
            engine.initY = engine.yorig;
               
        } else if(engine.tbid === undefined) {
            //second touch is for zoom/pan
            //engine.log('touch start 2 ('+touch.clientX+','+touch.clientY+')');
            var tbx = touch.clientX;
            var tby = touch.clientY;
            engine.tbid = touch.identifier;
            engine.oldZoom = engine.zoom;
            //How far apart the two fingers are sets the initial zoom for comparison
            engine.oldMag = Math.sqrt(Math.pow(tbx-engine.tax,2)+Math.pow(tby-engine.tay,2));
            
        }
    }, false);
    //All of these are ways to end touch events
    engine.canvas.addEventListener("touchend", function(e) {
        e.preventDefault();
        var touch = e.changedTouches[0].identifier;
        //engine.log("touch end "+touch);
        if(touch === engine.taid) {
            engine.tax = undefined;
            engine.tay = undefined;
            engine.taid =undefined;
        } else if(touch === engine.tbid) {
            engine.tbid = undefined;
        }
        engine.oldZoom = engine.zoom;
    }, false);
    engine.canvas.addEventListener("touchcancel", function(e) {
        e.preventDefault();
        var touch = e.changedTouches[0].identifier;
        //engine.log("touch end "+touch);
        if(touch === engine.taid) {
            engine.tax = undefined;
            engine.tay = undefined;
            engine.taid =undefined;
        } else if(touch === engine.tbid) {
            engine.tbid = undefined;
        }
        engine.oldZoom = engine.zoom;
    }, false);
    engine.canvas.addEventListener("touchleave", function(e) {
        e.preventDefault();
        var touch = e.changedTouches[0].identifier;
        //engine.log("touch end "+touch);
        if(touch === engine.taid) {
            engine.tax = undefined;
            engine.tay = undefined;
            engine.taid =undefined;
        } else if(touch === engine.tbid) {
            engine.tbid = undefined;
        }
        engine.oldZoom = engine.zoom;
    }, false);
    //Update pan and zoom
    engine.canvas.addEventListener("touchmove", function(e) {
        e.preventDefault();
        try {
            var touches = e.changedTouches;
            var touch = touches[0];
            
            var dax = touch.clientX;
            var day = touch.clientY;
            // if two touches, compute new scale
            if(touches.length >1 && engine.oldZoom != undefined) {
                touch2 = touches[1];
                var dbx = touch2.clientX;
                var dby = touch2.clientY;
                var newMag = Math.sqrt(Math.pow(dbx-dax,2)+Math.pow(dby-day,2));
                var r = newMag/engine.oldMag;
                engine.zoom = engine.oldZoom * r;
                //adjust the origin point, so that the view stays centred
                //engine.xorig = (engine.xorig-engine.xctr)*r + engine.xctr;
                //engine.yorig = (engine.yorig-engine.yctr)*r + engine.yctr;
                engine.perform(true);
                engine.mouseMotion();
                //If zooming, don't pan, or else it will cause weirdness
                engine.zoomFlag = true;
                //engine.log('zooming ('+engine.zoom+')');
            }
            else {
                if(!engine.zoomFlag) {
                    engine.xorig = engine.initX + (dax - engine.tax);
                    engine.yorig = engine.initY + (day - engine.tay);
                    engine.mouseMotion();
                    //engine.log('moving ('+dax+','+day+'), ('+engine.tax+','+engine.tay+')');
                }
            }
        } catch(err) {
            engine.log(err);
            console.log(err);
        }
    }, false);

    //form inputs
    engine.id("timestep").addEventListener('input', function(e) {
        engine.timeStep = 360 * e.srcElement.value;
        engine.id("stepvalue").textContent = e.srcElement.value;
        return false;
    }, false);
    engine.id("framestep").addEventListener('input', function(e) {
        engine.stepsPerFrame = e.srcElement.value
        return false;
    }, false);
    engine.id("stop").addEventListener('click', function(e) {
        engine.pause(e);
        return false;
    }, false);
    engine.id("add").addEventListener('click', function(e) {
        engine.addBody(e);
        return false;
    },false);
    engine.id("reset").addEventListener('click', function(e) {
        engine.reset();
        return false;
    }, false);
    engine.id("saveLocal").addEventListener('click', function(e) {
        engine.saveData(localStorage);
        return false;
    }, false);
    engine.id("export").addEventListener('click', function(e) {
        engine.exportData();
        return false;
    }, false);
    engine.id("import").addEventListener('change', function(e) {
        engine.importData();
        return false;
    }, false);
    engine.id("loadSetup").addEventListener('click', function(e) {
        engine.loadData(localStorage, false);
        return false;
    }, false);
    engine.id("loadState").addEventListener('click', function(e) {
        engine.loadData(localStorage, true);
        return false;
    }, false);
    /*engine.id("algo1").addEventListener('change', function(e) {
        engine.algorithm = e.target.value;
        return false;
    }, false);
    engine.id("algo2").addEventListener('change', function(e) {
        engine.algorithm =  e.target.value;
        return false;
    }, false);
    engine.id("algo3").addEventListener('change', function(e) {
        engine.algorithm =  e.target.value;
        return false;
    }, false);*/
}

engine.log = function(err) {
  engine.id('console').textContent = err;
}

engine.pause = function(e) {
    if(e.srcElement.value == "stop") {
        engine.animate = false;
        e.srcElement.value = "start";
        e.srcElement.textContent = "Start";
    } else {
        engine.animate = true;
        e.srcElement.value = "stop";
        e.srcElement.textContent = "Stop";
        if(engine.orbitTimer == null) {
            engine.perform(false);
        }
    }
}

engine.addBody = function(e) {
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
    orbit_data.addToTable(body);
    engine.id('new_name').value = '';
    engine.id('new_pos').value = '';
    //engine.id('new_radius').value = '';
    engine.id('new_mass').value = '';
    engine.id('new_vel').value = '';
    engine.id('new_color').value = '';
    engine.reset();
}

engine.mouseZoom = function(e) {
    if(!e) {
        e = window.event;
    }
    e.preventDefault();
    // note sign reversal on e.detail
    var delta = (e.wheelDelta)?e.wheelDelta:-e.detail;
    var m = (delta > 0)?1.1:.9;
    engine.zoom *= m;
    //adjust the origin point, so that the view stays centred
    engine.xorig = (engine.xorig-engine.xctr)*m + engine.xctr;
    engine.yorig = (engine.yorig-engine.yctr)*m + engine.yctr;
    engine.perform(true);
}

engine.mouseMotion = function(e) {
    engine.perform(true);
}

engine.updateObjects = function(array, dt) {
    for(var i = 0; i<array.length; i++) {
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

engine.calcAccel = function(pa, pos, array) {
    var accel = new Cart3();
    for(var i = 0; i<array.length; i++) {
        var pb = array[i];
        //don't compute self-gravitation
        if(pa != undefined && pb != undefined && pa != pb) {
            //1. vel += dt * radius * -G * mass * radius.abs()^(-3/2)
            //2. pos += dt * vel
            //G is normalized to 1, so removed here
            var radius = pos.sub(pb.pos);
            accel.addTo(radius.mult( (-1 * pb.mass * radius.invSumCube())));
        }
    }
    return accel;
}

engine.updateOrbitHistory = function(pa) {
    if(pa.history.length >= 1000) {
        pa.history.shift();
    }
    pa.history.push(new Cart3(pa.pos));
}
engine.updateOrbit = function(pa, dt) {

    pa.vel.addTo(pa.accl.mult(dt));
    pa.pos.addTo(pa.vel.mult(dt));
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
    this.renderPos = new Cart3();
    this.reset = function() {
        this.pos = new Cart3(this.startpos);
        this.vel = new Cart3(this.startvel);
        this.history = [new Cart3(this.startpos)];
        this.oldPos = undefined;
    }
}



function createForm() {
    var masses = document.getElementById('new_mass');
    for(var i = 0; i<orbit_data.planetMasses.length; i++) {
        var option = document.createElement('option');
        option.text=orbit_data.planetMasses[i].name;
        option.value=orbit_data.planetMasses[i].mass;
        masses.add(option);
    }
    var orbits = document.getElementById('new_pos');
    for(var i = 0; i<orbit_data.planetOrbits.length; i++) {
        var option = document.createElement('option');
        option.text=orbit_data.planetOrbits[i].name;
        option.value=orbit_data.planetOrbits[i].pos;
        orbits.add(option);
    }
    var vels = document.getElementById('new_vel');
    for(var i = 0; i<orbit_data.planetVelocity.length; i++) {
        var option = document.createElement('option');
        option.text=orbit_data.planetVelocity[i].name;
        option.value=orbit_data.planetVelocity[i].vel;
        vels.add(option);
    }
    /*var radiuses = document.getElementById('new_radius');
    for(var i = 0; i<orbit_data.planetRadius.length; i++) {
        var option = document.createElement('option');
        option.text=orbit_data.planetRadius[i].name;
        option.value=orbit_data.planetRadius[i].rad;
        radiuses.add(option);
    }*/
    var colors = document.getElementById('new_color');
    for(var i = 0; i<orbit_data.planetColors.length; i++) {
        var option = document.createElement('option');
        option.text=orbit_data.planetColors[i];
        option.value=orbit_data.planetColors[i];
        colors.add(option);
    }
}


