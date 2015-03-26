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
// Mass: Kg
// Distance: Meters
// time: Seconds

engine.id = function(s) { return document.getElementById(s); }

//saves the planet array to local storage.
engine.save = function(){ 
    localStorage.clear();
    planetList = [];
    for(i in orbit_data.planet_array){ 
        localStorage["planet "+i+" name"] = orbit_data.planet_array[i].name;
        localStorage["planet "+i+" radius"] = orbit_data.planet_array[i].radius;
        localStorage["planet "+i+" pos"] = orbit_data.planet_array[i].pos;
        localStorage["planet "+i+" vel"] = orbit_data.planet_array[i].vel.z;
        localStorage["planet "+i+" mass"] = orbit_data.planet_array[i].mass;
        localStorage["planet "+i+" color"] = orbit_data.planet_array[i].color;
        planetList.push("planet "+i);
    }
    localStorage["planetList"] = JSON.stringify(planetList);
}

//Allows for loading of planet data.
engine.load = function(inputData){ 
    var planetList = JSON.parse(inputData["planetList"]);
    console.log(planetList);
    for(p in planetList){
        engine.updateFromLoad(
            inputData[planetList[p]+" name"],
            inputData[planetList[p]+" radius"],
            inputData[planetList[p]+" pos"],
            inputData[planetList[p]+" vel"],
            inputData[planetList[p]+" mass"],
            inputData[planetList[p]+" color"]           
        );
    }
}
//basically a copy of the engine.addBody function with the unnecessary bits removed
engine.updateFromLoad = function(name, radius, pos, vel, mass, color) {
    engine.animate = false;
    var body = new OrbitBody(name, parseFloat(radius), new Cart3(parseFloat(pos),0,0), new Cart3(0,0,parseFloat(vel)), parseFloat(mass), color);
    orbit_data.planet_array.push(body);
    orbit_data.addToTable(body);
    engine.reset();
}

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
    engine.rk = "true";
    
    engine.legend = true;
    
    engine.id("timestep").value=10;
    engine.id("framestep").value=1;
    if(engine.id("stop").value==="stop") {
        engine.id("stop").click();
    }
    engine.id("algo2").checked = true;
    
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
        engine.log('touch start '+touch.identifier);
        if(engine.taid === undefined) {
            //first touch is for panning
            engine.log('touch start 1 ('+touch.clientX+','+touch.clientY+')');
            engine.zoomFlag = false;
            engine.tax = touch.clientX;
            engine.tay = touch.clientY;
            engine.taid= touch.identifier;
            engine.initX = engine.xorig;
            engine.initY = engine.yorig;
               
        } else if(engine.tbid === undefined) {
            //second touch is for zoom/pan
            engine.log('touch start 2 ('+touch.clientX+','+touch.clientY+')');
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
        engine.log("touch end "+touch);
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
        engine.log("touch end "+touch);
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
        engine.log("touch end "+touch);
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
                engine.log('zooming ('+engine.zoom+')');
            }
            else {
                if(!engine.zoomFlag) {
                    engine.xorig = engine.initX + (dax - engine.tax);
                    engine.yorig = engine.initY + (day - engine.tay);
                    engine.mouseMotion();
                    engine.log('moving ('+dax+','+day+'), ('+engine.tax+','+engine.tay+')');
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
    engine.id("save").addEventListener('click', function(e) {
        engine.save();
        return false;
    }, false);
    engine.id("load").addEventListener('click', function(e) {
        engine.load(localStorage);
        return false;
    }, false);
    engine.id("algo1").addEventListener('change', function(e) {
        engine.rk = e.target.value;
        return false;
    }, false);
    engine.id("algo2").addEventListener('change', function(e) {
        engine.rk =  e.target.value;
        return false;
    }, false);
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
    var radius = engine.id('new_radius').value;
    var mass = engine.id('new_mass').value;
    var vel = engine.id('new_vel').value;
    var color = engine.id('new_color').value;
    var body = new OrbitBody(name, parseFloat(radius), new Cart3(parseFloat(pos),0,0), new Cart3(0,0,parseFloat(vel)), parseFloat(mass), color);
    orbit_data.planet_array.push(body);
    orbit_data.addToTable(body);
    engine.id('new_name').value = '';
    engine.id('new_pos').value = '';
    engine.id('new_radius').value = '';
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

engine.perform = function(refresh) {
    if(engine.animate || refresh) {
        engine.render(refresh);
        engine.frame_count += 1
    }
    if(!refresh) {
        engine.orbitTimer = setTimeout(engine.perform,engine.frame_delay_ms, false);
    }

}

engine.render = function(refresh) {
    engine.ctx.globalCompositeOperation = "source-over";
    engine.ctx.fillStyle = "black";
    engine.ctx.fillRect(0,0,engine.xsize, engine.ysize);
    engine.ctx.globalCompositeOperation = "lighter";
    engine.ctx.font = "10pt monospace";
    
    var ovalSize = engine.xsize / 280;
    ovalSize = (ovalSize < 2) ? 2 : ovalSize
    engine.drawSubset(refresh,engine.timeStep, engine.xorig, engine.yorig, ovalSize,engine.orbit_data.planet_array);
    engine.drawLabels();
}

engine.drawSubset = function(refresh, timeStep, cx, cy, ovalSize, array) {
    if(!refresh) {
        for(var n = 0; n < engine.stepsPerFrame; n++) {
            engine.updateObjects(array,engine.timeStep);
        }
    }
    for(var i = 0; i < array.length; i++) {
        var p = array[i]
        engine.updateOrbitHistory(p);
        var pp = engine.scaleOrbitingBody(p);
        var hist = engine.scaleHistory(p.history);
        engine.ctx.strokeStyle = 'gray';
        engine.drawOrbit(hist, cx, cy);
        engine.ctx.fillStyle = p.color;
        engine.drawOval(pp.x, pp.z, cx, cy, ovalSize);
    }
}

engine.scaleOrbitingBody = function (ob) {
    // make a copy, don't modify the original values
    var p = ob.pos.mult(engine.drawingScale * engine.zoom * engine.xsize /2);
    ob.renderPos = new Cart3(p);
    return p;
}

engine.scaleHistory = function(history) {
    var new_hist = [];
    for(var i=0; i<history.length; i++) {
        new_hist.push(history[i].mult(engine.drawingScale*engine.zoom*engine.xsize/2));
    }
    return new_hist;
}

engine.formatNum = function(x, dp, sz) {
    var s = "              " + x.toFixed(dp);
    return s.substr(s.length-sz);
}

engine.drawLabels = function() {
    if(engine.legend) {
        engine.ctx.fillStyle = '#c0c0c0';
        var time = 0;
        var timeUnit = "";
        if(engine.elapsedTime < 24*60*60) {
            time = engine.elapsedTime/60/60;
            timeUnit = "h";
        } else if(engine.elapsedTime < 365.25*24*60*60) {
            time = engine.elapsedTime/60/60/24;
            timeUnit = "d";
        } else {
            time = engine.elapsedTime/60/60/24/365.25;
            timeUnit = "y";
        }
        engine.ctx.fillText('Time ' + engine.formatNum(time,2,8) + timeUnit,8, engine.ysize-24);
        engine.ctx.fillText('Zoom ' + engine.formatNum(engine.zoom,2,8) + 'x',8, engine.ysize-8);

        
    }
}

engine.drawOval = function(x, y, cx, cy, ovalSize) {
    try {
        var os = ovalSize;
        engine.ctx.beginPath();
        engine.ctx.arc(x + cx, y + cy, os, 0, 2 * Math.PI, false);
        engine.ctx.fill();
    } catch(e) {
            console.log(e);
    }
}

engine.drawOrbit = function(history, cx, cy) {
    try {
        engine.ctx.moveTo(history[1].x + cx, history[1].y + cy);
        engine.ctx.beginPath();
        for(var i = 2; i<history.length; i++) {
            engine.ctx.lineTo(history[i].x + cx, history[i].z + cy);
        }
        engine.ctx.stroke();
    } catch (e) {
        console.log(e);
    }
}

engine.updateObjects = function(array, dt) {
    for(var i = 0; i<array.length; i++) {
        if(engine.rk==="true") {
            engine.rkIterate(array[i],dt,array);
        } else {
            //array[i].accl = new Cart3();
            //for(var j = 0; j<array.length; j++) {
            //    engine.updateAccel(array[i], array[j]);
            //}
            //engine.updateOrbit(array[i], dt);

            engine.verletIntegrate(array[i], dt, array);
        }
    }
    engine.elapsedTime += dt;
}

engine.calcAccel = function(pa, pos, array) {
    var accel = new Cart3();
    for(var i = 0; i<array.length; i++) {
        var pb = array[i];
        if(pa != undefined && pb != undefined && pa != pb) {
            var radius = pos.sub(pb.pos);
            accel.addTo(radius.mult( (-1 * pb.mass * radius.invSumCube())));
        }
    }
    return accel;
}

engine.rkEval = function(pa, dt, d, array) {
    var initPos = new Cart3(pa.pos);
    var initVel = new Cart3(pa.vel);
    var newPos = new Cart3(initPos.addTo(d.dx.mult(dt)));
    var newVel = new Cart3(initVel.addTo(d.dv.mult(dt)));
    var newAccl= engine.calcAccel(pa, newPos, array);
    var output = new Derivitive(newVel, newAccl);
    return output;
}

engine.rkIntegrate= function(pa, dt, array) {

    
    var x1 = new Cart3(pa.pos);
    var v1 = new Cart3(pa.vel);
    var a1 = engine.calcAccel(pa, x1, array);
    
    var x2 = new Cart3(v1.mult(0.5*dt).add(pa.pos));
    var v2 = new Cart3(a1.mult(0.5*dt).add(pa.vel));
    var a2 = engine.calcAccel(pa, x2, array);

    var x3 = new Cart3(v2.mult(0.5*dt).add(pa.pos));
    var v3 = new Cart3(a2.mult(0.5*dt).add(pa.vel));
    var a3 = engine.calcAccel(pa, x3, array);
    
    var x4 = new Cart3(v3.mult(dt).add(pa.pos));
    var v4 = new Cart3(a3.mult(dt).add(pa.vel));
    var a4 = engine.calcAccel(pa, x4, array);
    
    var xf = v2.add(v3).mult(2).add(v1).add(v4).mult(dt/6);
    var vf = a2.add(a3).mult(2).add(a1).add(a4).mult(dt/6);
    
    pa.pos.addTo(xf);
    pa.vel.addTo(vf);
}

engine.rkIterate = function(pa, dt, array) {

    engine.rkIntegrate(pa, dt, array);
    
}

engine.updateAccel = function(pa, pb){
    //don't compute self-gravitation
    if(pa != undefined && pb != undefined && pa != pb) {
        //1. vel += dt * radius * -G * mass * radius.abs()^(-3/2)
        //2. pos += dt * vel
        //G is normalized to 1, so removed here
        var radius = pa.pos.sub(pb.pos);
        pa.accl.addTo(radius.mult( (-1 * pb.mass * radius.invSumCube())));
    }
}

engine.verletIntegrate = function(pa, dt, array) {
    // x1 = x0 + v0 * dt + 1/2 A(x0) * dt^2
    // xn1 = 2 * xn - xn-1 + A(xn) * dt^2
    var Xn = new Cart3(pa.pos);
    var Xold = new Cart3(pa.history[pa.history.length-2]);
    var accel  = engine.calcAccel(pa, Xn, array).mult(dt^2);
    var newX;
    if(pa.history.length === 2) {
        var vel = new Cart3(pa.vel).mult(dt);
        newX = Xn.add(vel).add(accel.mult(.5));
        engine.log('Move: '+Xn+', '+Xold+', '+accel+', '+newX);
        console.log('Move ('+pa.name+': '+Xn+' + '+pa.vel+'*'+dt+' + 1/2 * '+accel+' = '+newX);
    } else {
        newX = Xn.mult(2).sub(Xold).add(accel);
        engine.log('Move: '+Xn+', '+Xold+', '+accel+', '+newX);
        console.log('Move ('+pa.name+': 2*'+Xn+' - '+Xold+' + '+accel+' = '+newX);
    }
    pa.pos = newX;
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
        //this.renderPos = new Cart3();
    }
}

function Cart3(x,y,z) {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    if(x instanceof Cart3) {
        this.x = x.x;
        this.y = x.y;
        this.z = x.z;
    } else {
        if(x != undefined) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }
    
    this.sub = function(a) {
        return new Cart3(this.x - a.x, this.y-a.y, this.z - a.z);
    }
    
    this.mult=function(m) {
        return new Cart3(this.x * m, this.y*m, this.z*m);
    }
    this.add = function(a) {
        return new Cart3(this.x + a.x, this.y+a.y, this.z+a.z);
    }
    this.addTo = function(a) {
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
        return this;
    }
    
    this.invSumCube = function() {
        return Math.pow(this.x*this.x + this.y*this.y + this.z*this.z, -1.5);
    }
    
    this.abs = function() {
        return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    }
    
    this.toString = function() {
        return this.x + "," + this.y + "," + this.z;
    }
}

function OrbitData() {
  this.planetColors = ["white", "yellow", "orange", "cyan", "red", "green", "magenta", "blue"];
  /*this.planetMasses = [ {"name": "Sun", "mass": 1.989E+030 },
                        {"name": "Mercury", "mass": 3.33E+023 },
                        {"name": "Earth", "mass": 5.976E+024 },
                        {"name": "Moon", "mass": 7.3477E+22 },
                        {"name": "Jupiter", "mass": 1.9E+027 },
                        {"name": "Pluto", "mass": 1.27E+022 }];
  this.planetOrbits = [ {"name": "Sun", "pos": 0 },
                        {"name": "Mercury", "pos": 57900000000 },
                        {"name": "Earth", "pos": 150000000000 },
                        {"name": "Moon", "pos":  150385000000 },
                        {"name": "Jupiter", "pos": 778330000000 },
                        {"name": "Pluto", "pos": 5913520000000 },
                        {"name": "-Sun", "pos": 0 },
                        {"name": "-Mercury", "pos": -57900000000 },
                        {"name": "-Earth", "pos": -150000000000 },
                        {"name": "-Jupiter", "pos": -778330000000 },
                        {"name": "Pluto", "pos": -5913520000000 }];
  this.planetVelocity=[ {"name": "Sun", "vel": 0 },
                        {"name": "Mercury", "vel": 47900 },
                        {"name": "Earth", "vel": 29800 },
                        {"name": "Moon", "vel": 30822},
                        {"name": "Jupiter", "vel": 13100 },
                        {"name": "Pluto", "vel": 4740 },
                        {"name": "-Sun", "vel": 0 },
                        {"name": "-Mercury", "vel": -47900 },
                        {"name": "-Earth", "vel": -29800 },
                        {"name": "-Jupiter", "vel": -13100 },
                        {"name": "-Pluto", "vel": -4740 }];
  this.planetRadius = [ {"name": "Sun", "rad": 695000000 },
                        {"name": "Mercury", "rad": 2440000 },
                        {"name": "Earth", "rad": 6378140 },
                        {"name": "Moon", "rad": 1738140 },
                        {"name": "Jupiter", "rad": 71492000 },
                        {"name": "Pluto", "rad": 1137000 }]; */
  //Masses adjusted for normalized G, (/11 orders, * 6.6742)
  //scaled lengths by 3 orders
  //scaled mass by 9 orders

  this.planetMasses = [ {"name": "Sun", "mass": 1.3275E+011 },
                        {"name": "Mercury", "mass": 2.2225E+04 },
                        {"name": "Earth", "mass": 3.9885E+05 },
                        {"name": "Moon", "mass": 4.904E+03 },
                        {"name": "Jupiter", "mass": 1.268E+08 },
                        {"name": "Pluto", "mass": 8.4762E+03 }];
  this.planetOrbits = [ {"name": "Sun", "pos": 0 },
                        {"name": "Mercury", "pos": 57900000 },
                        {"name": "Earth", "pos": 150000000 },
                        {"name": "Moon", "pos":  150385000 },
                        {"name": "Jupiter", "pos": 778330000 },
                        {"name": "Pluto", "pos": 5913520000 },
                        {"name": "-Sun", "pos": 0 },
                        {"name": "-Mercury", "pos": -57900000 },
                        {"name": "-Earth", "pos": -150000000 },
                        {"name": "-Jupiter", "pos": -778330000 },
                        {"name": "-Pluto", "pos": -5913520000 }];
  this.planetVelocity=[ {"name": "Sun", "vel": 0 },
                        {"name": "Mercury", "vel": 47.9 },
                        {"name": "Earth", "vel": 29.8 },
                        {"name": "Moon", "vel": 30.822},
                        {"name": "Jupiter", "vel": 13.1 },
                        {"name": "Pluto", "vel": 4.74 },
                        {"name": "-Sun", "vel": 0 },
                        {"name": "-Mercury", "vel": -47.9 },
                        {"name": "-Earth", "vel": -29.8 },
                        {"name": "-Jupiter", "vel": -13.1 },
                        {"name": "-Pluto", "vel": -4.74 }];
  this.planetRadius = [ {"name": "Sun", "rad": 695000000 },
                        {"name": "Mercury", "rad": 2440000 },
                        {"name": "Earth", "rad": 6378140 },
                        {"name": "Moon", "rad": 1738140 },
                        {"name": "Jupiter", "rad": 71492000 },
                        {"name": "Pluto", "rad": 1137000 }];                    
  this.planet_array = [];
  /*this.genPlanets = function() {
    // name,distance from sun,mass,orbital velocity
    var raw_data =
    "Name,OrbitRad,BodyRad,Mass,OrbitVel\n"
    + "Sun,0,695000000,1.989E+030,0\n";
    + "Mercury,57900000000,2440000,3.33E+023,47900\n"
    + "Venus,108000000000,6050000,4.869E+024,35000\n"
    + "Earth,150000000000,6378140,5.976E+024,29800\n"
    + "Mars,227940000000,3397200,6.421E+023,24100\n"
    + "Jupiter,778330000000,71492000,1.9E+027,13100\n"
    + "Saturn,1429400000000,60268000,5.688E+026,9640\n"
    + "Uranus,2870990000000,25559000,8.686E+025,6810\n"
    + "Neptune,4504300000000,24746000,1.024E+026,5430\n"
    // I guess Pluto isn't really a planet any more, but...
    + "Pluto,5913520000000,1137000,1.27E+022,4740";
    
    this.planet_array = new Array();
    var sdat = raw_data.split("\n");
    var vals = new Array();
    var len = sdat.length;
    for(var i = 1; i < len; i++) {
        var fields = sdat[i].split(",");
        if(fields[0].length>0) {
            for(var j = 1;j<fields.length;j++) {
                vals[j-1] = parseFloat(fields[j]);
            }
        }
        var pos = new Cart3(-vals[0],0,0);
        var vel = new Cart3(0,0,vals[3]);
        var color = this.planetColors[i%this.planetColors.length];
        var body = new OrbitBody(fields[0], vals[1], pos, vel, vals[2], color);
        this.planet_array.push(body);
    }
    engine.sun = this.planet_array[0];
    
  }*/
  this.resetPlanets = function() {
    for(var i = 0; i<this.planet_array.length; i++) {
        this.planet_array[i].reset();
    }
   }

  /* this.showOrbits = function() {
    var table = document.getElementById('objects_table');
    for(var i = 0; i<orbit_data.planet_array.length; i++) {
        var row = table.insertRow(-1);
        var nameCell = row.insertCell(-1); nameCell.textContent = orbit_data.planet_array[i].name;
        var positionCell = row.insertCell(-1); positionCell.textContent = orbit_data.planet_array[i].pos.x;
        var radiusCell = row.insertCell(-1); radiusCell.textContent = orbit_data.planet_array[i].radius;
        var massCell = row.insertCell(-1); massCell.textContent = orbit_data.planet_array[i].mass;
        var velocityCell = row.insertCell(-1); velocityCell.textContent = orbit_data.planet_array[i].vel.z;
        var colorCell = row.insertCell(-1); colorCell.textContent = orbit_data.planet_array[i].color;
        var fixedCell = row.insertCell(-1); fixedCell.textContent = 'false';
   }*/

   this.addToTable = function(body) {
    var table = document.getElementById('objects_table');
    var row = table.insertRow(-1);
    var nameCell = row.insertCell(-1); nameCell.textContent = body.name;
    var positionCell = row.insertCell(-1); positionCell.textContent = body.pos.x;
    var radiusCell = row.insertCell(-1); radiusCell.textContent = body.radius;
    var massCell = row.insertCell(-1); massCell.textContent = body.mass;
    var velocityCell = row.insertCell(-1); velocityCell.textContent = body.vel.z;
    var colorCell = row.insertCell(-1); colorCell.textContent = body.color;
    var fixedCell = row.insertCell(-1); fixedCell.textContent = 'false';
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
    var radiuses = document.getElementById('new_radius');
    for(var i = 0; i<orbit_data.planetRadius.length; i++) {
        var option = document.createElement('option');
        option.text=orbit_data.planetRadius[i].name;
        option.value=orbit_data.planetRadius[i].rad;
        radiuses.add(option);
    }
    var colors = document.getElementById('new_color');
    for(var i = 0; i<orbit_data.planetColors.length; i++) {
        var option = document.createElement('option');
        option.text=orbit_data.planetColors[i];
        option.value=orbit_data.planetColors[i];
        colors.add(option);
    }
}
function getOrbits() {
    var table = document.getElementById('objects_table');
    for(var i = 0; i<orbit_data.planet_array.length; i++) {
        var row = table.insertRow(-1);
        var nameCell = row.insertCell(-1); nameCell.textContent = orbit_data.planet_array[i].name;
        var positionCell = row.insertCell(-1); positionCell.textContent = orbit_data.planet_array[i].pos.x;
        var radiusCell = row.insertCell(-1); radiusCell.textContent = orbit_data.planet_array[i].radius;
        var massCell = row.insertCell(-1); massCell.textContent = orbit_data.planet_array[i].mass;
        var velocityCell = row.insertCell(-1); velocityCell.textContent = orbit_data.planet_array[i].vel.z;
        var colorCell = row.insertCell(-1); colorCell.textContent = orbit_data.planet_array[i].color;
        var fixedCell = row.insertCell(-1); fixedCell.textContent = 'false';
    }
}

addEvent(window,'load',engine.reset);
addEvent(window,'load',engine.setupControlEvents);
addEvent(window,'load',createForm);