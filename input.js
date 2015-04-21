
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
        engine.mouseDown(e);
        return false;
    }, false);
    //Update panning
    engine.canvas.addEventListener('mousemove', function(e) {
        engine.mouseDrag(e);
        return false;
    }, false);
    //Mouse up seems unreliable, so use click instead
    engine.canvas.addEventListener('click', function(e) {
        engine.mouseClick(e);
        return false;
    }, false);
    
    //touch events
    engine.canvas.addEventListener("touchstart", function(e) {
        engine.touchStart(e);
        return false;
    }, false);
    //All of these are ways to end touch events
    engine.canvas.addEventListener("touchend", function(e) {
        engine.touchEnd(e);
        return false;
    }, false);
    engine.canvas.addEventListener("touchcancel", function(e) {
        engine.touchEnd(e);
        return false;
    }, false);
    engine.canvas.addEventListener("touchleave",function(e) {
        engine.touchEnd(e);
        return false;
    }, false);
    //Update pan and zoom
    engine.canvas.addEventListener("touchmove", function(e) {
        engine.touchMove(e)
        return false;
    }, false);

    //form inputs
    engine.id("timestep").addEventListener('input', function(e) {
        engine.timeStep = 360 * e.srcElement.value;
        engine.id("stepvalue").textContent = e.srcElement.value;
        return false;
    }, false);
    engine.id("framestep").addEventListener('input', function(e) {
        engine.stepsPerFrame = e.srcElement.value
        engine.id("stepcount").textContent= e.srcElement.value;
        return false;
    }, false);
    engine.id("stop").addEventListener('click', function(e) {
        engine.pause(e);
        return false;
    }, false);
    /*engine.id("add").addEventListener('click', function(e) {
        engine.addBody(e);
        return false;
    },false);*/
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



engine.mouseDown = function(e) {
    e.preventDefault();
    engine.mouseX = e.pageX - engine.canvas.offsetLeft;
    engine.mouseY = e.pageY - engine.canvas.offsetTop;
    engine.initX = engine.xorig;
    engine.initY = engine.yorig;
    engine.isMouseDown=true;
    engine.isHolding = false;
    engine.holdStart = setTimeout(function() {
        engine.holdStart = null;
        engine.isHolding = true;
    },500)
}

engine.mouseDrag = function(e) {
    e.preventDefault();
    if(engine.isMouseDown) {
        var x = e.pageX - engine.canvas.offsetLeft;
        var y = e.pageY - engine.canvas.offsetTop;
        //engine.isHolding = true;
        engine.xorig = engine.initX + (x - engine.mouseX);
        engine.yorig = engine.initY + (y - engine.mouseY);
        engine.mouseMotion(e);
    }
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

engine.mouseClick = function(e) {
    engine.isMouseDown = false;
    //only handle click when not dragging
    if(engine.isHolding) {
        engine.holdStart = null;
        engine.isHolding = false;
        return;
    }
    var foundObject = false;
    //determine if the user clicked on an object;
    engine.log('click at ('+engine.mouseX+','+engine.mouseY+')');
    for(var i = 0; i<engine.orbit_data.planet_array.length && !foundObject; i++) {
        var pa = engine.orbit_data.planet_array[i];
        var pos = new Cart3(pa.renderPos);
        pos.x += engine.xorig;
        pos.z += engine.yorig
        
        if( engine.mouseX < pos.x + 10 && engine.mouseX > pos.x - 10 &&
            engine.mouseY < pos.z + 10 && engine.mouseY > pos.z - 10) {
            foundObject = true;
            engine.log("Clicked on "+pa.name);
            engine.editPlanetDialog(pa);
        }
    }
    if(!foundObject) {
        engine.newPlanetDialog();
    }
}

engine.touchStart = function(e) {
    /*engine.isHolding = false;
    engine.holdStart = setTimeout(function() {
        engine.holdStart = null;
        engine.isHolding = true;
    },500);
    e.preventDefault();*/
    
    //Each touch shows up as it's own event
    //but each has it's own identifier so we can tell the difference
    var touches = e.changedTouches;
    var touch = touches[0];
    //engine.log('touch start '+touch.identifier);
    if(engine.taid === undefined) {
        //first touch is for panning
        //engine.log('touch start 1 ('+touch.clientX+','+touch.clientY+')');
        engine.zoomFlag = false;
        engine.tax = touch.pageX - engine.canvas.offsetLeft;
        engine.tay = touch.pageY - engine.canvas.offsetTop;
        engine.taid= touch.identifier;
        engine.initX = engine.xorig;
        engine.initY = engine.yorig;
        engine.mouseX = touch.pageX - engine.canvas.offsetLeft;
        engine.mouseY = touch.pageY - engine.canvas.offsetTop;
        
           
    } else if(engine.tbid === undefined) {
        //second touch is for zoom/pan
        //engine.log('touch start 2 ('+touch.clientX+','+touch.clientY+')');
        var tbx = touch.pageX - engine.canvas.offsetLeft;
        var tby = touch.pageY - engine.canvas.offsetTop;
        engine.tbid = touch.identifier;
        engine.oldZoom = engine.zoom;
        //How far apart the two fingers are sets the initial zoom for comparison
        engine.oldMag = Math.sqrt(Math.pow(tbx-engine.tax,2)+Math.pow(tby-engine.tay,2));
    }
}

engine.touchEnd = function(e) {
    //e.preventDefault();
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
}

engine.touchMove = function(e) {
    e.preventDefault();
    engine.isHolding = true;
    try {
        var touches = e.changedTouches;
        var touch = touches[0];
        
        var dax = touch.pageX - engine.canvas.offsetLeft;
        var day = touch.pageY - engine.canvas.offsetTop;
        // if two touches, compute new scale
        if(touches.length >1 && engine.oldZoom != undefined) {
            touch2 = touches[1];
            var dbx = touch2.pageX - engine.canvas.offsetLeft;
            var dby = touch2.pageY - engine.canvas.offsetTop;
            engine.touchZoom(dax, day, dbx, dby);
        }
        else {
            engine.touchDrag(dax, day);
        }
    } catch(err) {
        engine.log(err);
        console.log(err);
    }
}

engine.touchDrag = function(dax, day) {
    if(!engine.zoomFlag) {
        engine.xorig = engine.initX + (dax - engine.tax);
        engine.yorig = engine.initY + (day - engine.tay);
        engine.mouseMotion();
        //engine.log('moving ('+dax+','+day+'), ('+engine.tax+','+engine.tay+')');
    }
}

engine.touchZoom = function(dax, day, dbx, dby) {
    var newMag = Math.sqrt(Math.pow(dbx-dax,2)+Math.pow(dby-day,2));
    var r = newMag/engine.oldMag;
    engine.zoom = engine.oldZoom * r;
    //adjust the origin point, so that the view stays centred
    //engine.xorig = (engine.xorig-engine.xctr)*r + engine.xctr;
    //engine.yorig = (engine.yorig-engine.yctr)*r + engine.yctr;
    //If zooming, don't pan, or else it will cause weirdness
    engine.zoomFlag = true;
    //engine.log('zooming ('+engine.zoom+')');
    engine.mouseMotion();
}

engine.mouseMotion = function(e) {
    engine.perform(true);
}

engine.newPlanetDialog = function() {
    var dialog = {state0: {
        title: "New Planet",
        html: '<label for="name">Name:</label> <input id="new_name" type="text" name="name" placeholder="Name"/><br/>'+
              '<label for="pos">Position:</label> <select id="new_pos" name="pos" placeholder="Position"></select><br/>'+
              '<label for="mass">Mass:</label> <select id="new_mass" name="mass" placeholder="Mass"></select><br/>'+
              '<label for="vel">Velocity:</label> <select id="new_vel" name="vel" placeholder="Velocity"></select><br/>'+
              '<label for="color">Color:</label> <select id="new_color" name="color" placeholder="Color"></select>',
        buttons: { Add: 1, Cancel: -1 },
        submit: function(e, v, m, f) {
            e.preventDefault();
            if(v==-1) $.prompt.close();
            if(v==1) {
                engine.addObject(f.name, f.pos, f.mass, f.vel, f.color);
                $.prompt.close();
            }
        },
        
    }};
    var dialogOptions = {
        loaded: function(e) {
            engine.createForm();
            setTimeout(function() {
                document.getElementById('new_name').focus();
            }, 300);
        },
        persistent: false
    };
    $.prompt(dialog, dialogOptions);
}

engine.editPlanetDialog = function(p) {
    var dialog = {state0: {
        title: "Edit Planet",
        html: '<label for="name">Name:</label> <input id="new_name" type="text" name="name" placeholder="Name"/><br/>'+
              '<label for="pos">Position:</label> <select id="new_pos" name="pos" placeholder="Position"></select><br/>'+
              '<label for="mass">Mass:</label> <select id="new_mass" name="mass" placeholder="Mass"></select><br/>'+
              '<label for="vel">Velocity:</label> <select id="new_vel" name="vel" placeholder="Velocity"></select><br/>'+
              '<label for="color">Color:</label> <select id="new_color" name="color" placeholder="Color"></select>',
        buttons: { Save: 1, Cancel: -1 },
        submit: function(e, v, m, f) {
            e.preventDefault();
            if(v==-1) $.prompt.close();
            if(v==1) {
                p.name = f.name;
                p.startpos.x = parseFloat(f.pos);
                p.mass = parseFloat(f.mass);
                p.startvel.z = parseFloat(f.vel);
                p.color = f.color;
                $.prompt.close();
                engine.reset();
            }
        },
        
    }};
    var dialogOptions = {
        loaded: function(e) {
            engine.createForm();
            document.getElementById('new_name').value=p.name
            document.getElementById('new_pos').value=p.startpos.x
            document.getElementById('new_mass').value=p.mass
            document.getElementById('new_vel').value=p.startvel.z
            document.getElementById('new_color').value=p.color
            setTimeout(function() {
                document.getElementById('new_name').focus();
            }, 300);
        },
        persistent: false
    };
    $.prompt(dialog, dialogOptions);
}

engine.createForm = function() {
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
    var colors = document.getElementById('new_color');
    for(var i = 0; i<orbit_data.planetColors.length; i++) {
        var option = document.createElement('option');
        option.text=orbit_data.planetColors[i];
        option.value=orbit_data.planetColors[i];
        colors.add(option);
    }
}