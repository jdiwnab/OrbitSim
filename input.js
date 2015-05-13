engine.setupControlEvents = function() {
    /* Mouse Events */
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
    
    /* Touch Events */
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

    /* Form Events */
    engine.setupFancyControls();
    $("#timestep").on({
        slide: function(e) {
            return engine.updateTimestep(e, this);
        },
        set: function(e) {
            return engine.updateTimestep(e, this);
        }   
    });
    $("#framestep").on({
        slide: function(e) {
            return engine.updateFramerate(e, this);
        },
        set: function(e) {
            return engine.updateFramerate(e, this);
        } 
    });
    engine.id("stop").addEventListener('click', function(e) {
        engine.pause(e);
        return false;
    }, false);
    engine.id("reset").addEventListener('click', function(e) {
        engine.reset();
        return false;
    }, false);
    engine.id("saveLocal").addEventListener('click', function(e) {
        engine.removePlanetData();
        localStorage.planetList = engine.getSaveData();
        return false;
    }, false);
    engine.id("export").addEventListener('click', function(e) {
        engine.exportData();
        return false;
    }, false);
    engine.id("loadImport").addEventListener('click', function(e) {
        engine.importData();
        return false;
    }, false);
    engine.id("loadSetup").addEventListener('click', function(e) {
        engine.loadData(localStorage.planetList, false);
        return false;
    }, false);
    engine.id("loadState").addEventListener('click', function(e) {
        engine.loadData(localStorage.planetList, true);
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
    
    engine.orbit_data.createDataSets();
    
}

engine.updateTimestep = function(e, control) {
    engine.timeStep = 360 * control.vGet();
    engine.id("stepvalue").textContent = control.vGet();
    return false;
}
engine.updateFramerate = function(e, control) {
    engine.stepsPerFrame = control.vGet();
    engine.id("stepcount").textContent = control.vGet();
    return false;
}

engine.setupFancyControls = function() {
    $('#timestep').noUiSlider({
        start: 10,
        range: {
            'min': [ 1 ],
            'max': [100]
        },
        //step: 1
    });
    $('#framestep').noUiSlider({
        start: 1,
        range: {
            'min': [ 1 ],
            'max': [500]
        },
        step: 1
    });
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
    engine.isHolding = false;
    engine.holdStart = setTimeout(function() {
        engine.holdStart = null;
        engine.isHolding = true;
        engine.log("Start holding");
    },500);
    //e.preventDefault();
    
    //Each touch shows up as it's own event
    //but each has it's own identifier so we can tell the difference
    var touches = e.changedTouches;
    for(i=0; i<touches.length; i++) {
        var touch = touches[i];
        //engine.log('touch start '+touch.identifier);
        if(engine.taid === undefined) {
            //first touch is for panning
            engine.log('touch start A '+touch.identifier+' ('+touch.clientX+','+touch.clientY+')');
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
            engine.log('touch start B '+touch.identifier+' ('+touch.clientX+','+touch.clientY+')');
            engine.tbx = touch.pageX - engine.canvas.offsetLeft;
            engine.tby = touch.pageY - engine.canvas.offsetTop;
            engine.tbid = touch.identifier;
            engine.oldZoom = engine.zoom;
            //How far apart the two fingers are sets the initial zoom for comparison
            engine.oldMag = Math.sqrt(Math.pow(engine.tbx-engine.tax,2)+Math.pow(engine.tby-engine.tay,2));
        }
    }
}

engine.touchEnd = function(e) {
    //e.preventDefault();
    engine.log("touches ending: "+e.changedTouches[0].identifier+" "+e.changedTouches.length);
    var touches = e.changedTouches;
    for(var i=0; i<touches.length; i++) {
        var touch = touches[i].identifier;
        engine.log("touch end "+touch);
        if(touch === engine.taid) {
            engine.tax = undefined;
            engine.tay = undefined;
            engine.taid =undefined;
        } else if(touch === engine.tbid) {
            engine.tbid = undefined;
            engine.tbx = undefined;
            engine.tby = undefined;
        }
        engine.oldZoom = engine.zoom;
    }
    if(engine.taid === undefined && engine.tbid !== undefined) {
        //shift the second touch to be the first touch if the first one stopped
        engine.tax = engine.tbx;
        engine.tay = engine.tby;
        engine.taid = engine.tbid;
        engine.tbid = undefined;
        engine.tbx = undefined;
        engine.tby = undefined;
    }
}

engine.touchMove = function(e) {
    e.preventDefault();
    engine.isHolding = true;
    try {
        var touches = e.changedTouches;
        for(var i=0; i<touches.length; i++) {
            var touch = touches[i];
            if(touch.identifier === engine.taid) {
                engine.tax = touch.pageX - engine.canvas.offsetLeft;
                engine.tay = touch.pageY - engine.canvas.offsetTop;
            } else if(touch.identifier === engine.tbid) {
                engine.tbx = touch.pageX - engine.canvas.offsetLeft;
                engine.tby = touch.pageY - engine.canvas.offsetTop;
            }
        }

        //if there are two active touches, compute new scale
        if(engine.tbid !== undefined && engine.oldZoom != undefined) {
            engine.touchZoom(engine.tax, engine.tay, engine.tbx, engine.tby);
        }
        else {
            engine.touchDrag(engine.tax, engine.tay);
        }
    } catch(err) {
        engine.log(err);
        console.log(err);
    }
}

engine.touchDrag = function(dax, day) {
    if(!engine.zoomFlag) {
        engine.xorig = engine.initX + (dax - engine.mouseX);
        engine.yorig = engine.initY + (day - engine.mouseY);
        engine.mouseMotion();
        engine.log('moving ('+dax+','+day+'), ('+engine.mouseX+','+engine.mouseY+')');
    }
}

engine.touchZoom = function(dax, day, dbx, dby) {
    var newMag = Math.sqrt(Math.pow(dbx-dax,2)+Math.pow(dby-day,2));
    var r = newMag/engine.oldMag;
    engine.zoom = engine.oldZoom * r;
    //adjust the origin point, so that the view stays centred
    engine.xorig = (engine.initX-engine.xctr)*r + engine.xctr;
    engine.yorig = (engine.initY-engine.yctr)*r + engine.yctr;
    //If zooming, don't pan, or else it will cause weirdness
    engine.zoomFlag = true;
    engine.log('('+dax+','+day+') ('+dbx+','+dby+') zoom: '+r+'x to '+engine.zoom+'x');
    engine.mouseMotion();
}

engine.mouseMotion = function(e) {
    engine.perform(true);
}

engine.newPlanetDialog = function() {
    var dialog = {state0: {
        title: "New Planet",
        html: '<label style="min-width:50px;" for="name">Name:</label> <input style="width:150px;" id="new_name" type="text" name="name" placeholder="Name"/><br/>'+
              '<label style="min-width:50px;" for="pos">Disatance:</label> <input style="width:150px;" id="new_pos" type="text" name="pos" placeholder="Distance"><br/>'+
              '<label style="min-width:50px;" for="pos">Mass:</label> <div class="noUi-extended" style="margin-bottom: 40px" id="new_mass"></div><input type="hidden" name="mass" id="hidden_mass"/>'+
              '<label style="min-width:50px;" for="pos">Velocity:</label> <div class="noUi-extended" style="margin-bottom: 40px" id="new_vel"></div><input type="hidden" name="vel" id="hidden_vel"/>'+
              '<label style="min-width:50px;" for="color">Color:</label> <select style="width:150px;" id="new_color" name="color" placeholder="Color"></select>',
        buttons: { Add: 1, Cancel: -1 },
        submit: function(e, v, m, f) {
            e.preventDefault();
            if(v==-1) $.prompt.close();
            if(v==1) {
                //var new_pos = engine.unscaleCoordinates(engine.mouseX, engine.mouseY);
                engine.addObject(f.name, f.pos, f.mass, f.vel, f.color);
                $.prompt.close();
            }
        },
        
    }};
    var dialogOptions = {
        loaded: function(e) {
            engine.createForm();
            var new_pos, new_vel;
            //Assume first one is sun
            if(engine.orbit_data.planet_array[0] === undefined) {
                new_pos = new Cart3(0,0,0);
                new_vel = new Cart3(0,0,0);
            } else {
                //assume other ones orbit a centered sun at index 0, and assume a circular orbit
                new_pos = engine.unscaleCoordinate(engine.mouseX, engine.mouseY);
                // v = sqrt((G*M_sun)/R)  
                new_vel = new Cart3(0,0,Math.sqrt(engine.orbit_data.planet_array[0].mass/new_pos.abs()));
            }
            if(new_pos.x >= 0) {
                document.getElementById('new_pos').value = new_pos.abs();
                $('#new_vel').val(new_vel.abs());
            } else {
                document.getElementById('new_pos').value = -1 * new_pos.abs();
                $('#new_vel').val(-1 * new_vel.abs());
            }
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
        html: '<label style="min-width:50px;" for="name">Name:</label> <input style="width:150px;" id="new_name" type="text" name="name" placeholder="Name"/><br/>'+
              '<label style="min-width:50px;" for="pos">Disatance:</label> <input style="width:150px;" id="new_pos" type="text" name="pos" placeholder="Distance"><br/>'+
              '<label style="min-width:50px;" for="pos">Mass:</label> <div class="noUi-extended" style="margin-bottom: 40px" id="new_mass"></div><input type="hidden" name="mass" id="hidden_mass"/>'+
              '<label style="min-width:50px;" for="pos">Velocity:</label> <div class="noUi-extended" style="margin-bottom: 40px" id="new_vel"></div><input type="hidden" name="vel" id="hidden_vel"/>'+
              '<label style="min-width:50px;" for="color">Color:</label> <select style="width:150px;" id="new_color" name="color" placeholder="Color"></select>',
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
            document.getElementById('new_name').value=p.name;
            document.getElementById('new_pos').value=p.startpos.x;
            $('#new_mass').val(p.mass);
            $('#new_vel').val(p.startvel.z);
            document.getElementById('new_color').value=p.color;
            setTimeout(function() {
                document.getElementById('new_name').focus();
            }, 300);
        },
        persistent: false
    };
    $.prompt(dialog, dialogOptions);
}

engine.createForm = function() {
    $('#new_mass').noUiSlider({
        start: 1.3275E+011,
        range: {
            'min': [ 0 ],
            '25%': [1e+3],
            '50%': [1e+6],
            '75%': [1e+9],
            'max': [1.4E+011]
        },
    });
    $('#new_mass').noUiSlider_pips({
        mode: 'range',
        density: 3,
        format: {
            to: function(value) {
                return value.toExponential();
            },
            from: function(value) {
                return value.toExponential();
            }
        }
    });
    $('#new_mass').Link('lower').to($('#hidden_mass'));
    $('#new_vel').noUiSlider({
        start: 0,
        range: {
            'min': [ -50 ],
            '50%': [0],
            'max': [50]
        },
    });
    $('#new_vel').noUiSlider_pips({
        mode: 'range',
        density: 3
    });
    $('#new_vel').Link('lower').to($('#hidden_vel'));
    /*var masses = document.getElementById('new_mass');
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
    }*/
    var colors = document.getElementById('new_color');
    for(var i = 0; i<orbit_data.planetColors.length; i++) {
        var option = document.createElement('option');
        option.text=orbit_data.planetColors[i];
        option.value=orbit_data.planetColors[i];
        colors.add(option);
    }
}