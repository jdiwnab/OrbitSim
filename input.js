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
    engine.id("showHistory").addEventListener('change', function(e) {
        if( engine.id("showHistory").checked ) {
            engine.history = true;
            engine.resetScaledHistory();
        } else {
            engine.history = false;
        }
    }, false);
    engine.id("start").addEventListener('click', function(e) {
        $('#start').toggleClass('stop');
        engine.pause(e);
        return false;
    }, false);
    engine.id("reset").addEventListener('click', function(e) {
        engine.reset();
        return false;
    }, false);
    engine.id("clear").addEventListener('click', function(e) {
        engine.orbit_data.planet_array = [];
        engine.reset();
        return false;
    }, false);
    engine.id("record").addEventListener('click', function(e) {
        $('#record').toggleClass('stop');
        if(engine.recording) {
            engine.stopRecord();
        } else {
            engine.startRecord();
        }
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
    engine.id("csvexport").addEventListener('click', function(e) {
        engine.csvexport();
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
    engine.id("loadPreset").addEventListener('click', function(e) {
        engine.loadPreset(e);
        return false;
    }, false);
    engine.id("loadRandom").addEventListener('click', function(e) {
        engine.loadRandomPlanets(500);
        return false;
    }, false);
    engine.id("loadLagrange").addEventListener('click', function(e) {
        engine.loadLagrange();
        return false;
    }, false);
    /*engine.id("precalculate").addEventListener('click', function(e) {
        engine.precalculateDialog();
        return false;
    }, false);*/
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
    
    //engine.orbit_data.createDataSets();
    
    //Draw controls
    engine.id("main-menu").addEventListener('click', function(e) {
        $('#main-controls').toggleClass('show');
        $('#main-menu').toggleClass('show');
    }, false);
    engine.id("preset-menu").addEventListener('click', function(e) {
        $('#preset-controls').toggleClass('show');
        $('#preset-menu').toggleClass('show');
    }, false);
    engine.id("lstorage-menu").addEventListener('click', function(e) {
        $('#lstorage-controls').toggleClass('show');
        $('#lstorage-menu').toggleClass('show');
    }, false);
    engine.id("fstorage-menu").addEventListener('click', function(e) {
        $('#fstorage-controls').toggleClass('show');
        $('#fstorage-menu').toggleClass('show');
    }, false);
    
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
        format: {
            to: function(i) {
                return Math.round(i);
            },
            from: function(i) {
                return Math.round(i);
            }
        },
        step: 1
    });
    $('#framestep').noUiSlider({
        start: 1,
        range: {
            'min': [ 1 ],
            'max': [500]
        },
        format: {
            to: function(i) {
                return Math.round(i);
            },
            from: function(i) {
                return Math.round(i);
            }
        },
        step: 1
    });
    engine.createForm();
    engine.createPrecalculateForm();
}

engine.cancelClick = function() {
    if(engine.isMouseDown) {
        engine.holdStart = null;
        engine.isHolding = true;
        engine.log("Start holding");
    }
}

engine.mouseDown = function(e) {
    e.preventDefault();
    engine.mouseX = e.pageX - engine.canvas.offsetLeft;
    engine.mouseY = e.pageY - engine.canvas.offsetTop;
    engine.initX = engine.xorig;
    engine.initY = engine.yorig;
    engine.isMouseDown=true;
    engine.isHolding = false;
    engine.holdStart = setTimeout(engine.cancelClick,500);

}

engine.mouseDrag = function(e) {
    e.preventDefault();
    if(engine.isMouseDown) {
        engine.cancelClick();
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
    engine.resetScaledHistory();
    engine.perform(0, true);
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
        pos.z += engine.yorig;
        var radius = pa.radius * engine.drawingScale * engine.zoom * 15000;
        var delta = (radius>10)?radius:10; //delta is at least 10, up to radius;
        if( engine.mouseX < pos.x + delta && engine.mouseX > pos.x - delta &&
            engine.mouseY < pos.z + delta && engine.mouseY > pos.z - delta) {
            foundObject = true;
            engine.log("Clicked on "+pa.name);
            engine.editPlanetDialog(i);
        }
    }
    if(!foundObject) {
        engine.newPlanetDialog();
    }
}

engine.touchStart = function(e) {
    engine.isHolding = false;
    engine.holdStart = setTimeout(engine.cancelClick,500);
    
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
    engine.cancelClick();
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
    engine.resetScaledHistory();
    engine.mouseMotion();
}

engine.mouseMotion = function(e) {
    engine.perform(0, true);
}

engine.loadPreset = function(e) {
    engine.loadObject(engine.orbit_data.presets[parseInt(engine.id('presetSelect').value)].planetArray, false);
}

engine.newPlanetDialog = function() {
    engine.id('is_edit').value = false;
    engine.id('modal_head').textContent="New Object";
    if(engine.orbit_data.planet_array[0] === undefined) {
        new_pos = new Cart3(0,0,0);
        new_vel = new Cart3(0,0,0);
    } else {
        //assume other ones orbit a centered sun at index 0, and assume a circular orbit
        new_pos = engine.unscaleCoordinate(engine.mouseX, engine.mouseY);
        // v = sqrt((G*M_sun)/R)  
        new_vel = new Cart3(0,0,Math.sqrt(engine.orbit_data.planet_array[0].mass/new_pos.abs()));
    }
    $('#new_pos').val(new_pos.abs());
    engine.id('pos_angle').value = Math.atan2(new_pos.y, new_pos.x) * 180 / Math.PI;
    var velocity = new_vel.abs();
    $('#new_vel').val(velocity);
    engine.id('vel_angle').value = Math.atan2(new_pos.x, -1 * new_pos.y) * 180 / Math.PI;
    engine.fireEvent(engine.id('pos_angle'), 'change');
    engine.fireEvent(engine.id('vel_angle'), 'change');
    engine.id('new_rad').value=6000;
    engine.id('new_name').value='';
    engine.id('new_fixed').checked = false;
    /*setTimeout(function() {
    //    document.getElementById('new_name').focus();
    }, 300);*/
    
    var modal = $.remodal.lookup[$('[data-remodal-id=editmodal]').data('remodal')];
    modal.open();
}

engine.editPlanetDialog = function(i) {
    engine.id('is_edit').value = true;
    engine.id('edit_index').value = i;
    engine.id('modal_head').textContent="Edit Object";
    
    var p = engine.orbit_data.planet_array[i];
    engine.id('new_name').value=p.name;
    var pos = p.startpos.abs();
    var pos_angle = Math.atan2(p.startpos.z, p.startpos.x) * 180 / Math.PI;
    $('#new_pos').val(pos);
    engine.id('pos_angle').value = pos_angle;
    engine.fireEvent(engine.id('pos_angle'), 'change');
    
    $('#new_mass').val(p.mass);
    
    var vel = p.startvel.abs();
    var vel_angle = Math.atan2(p.startvel.z, p.startvel.x) * 180 / Math.PI;
    $('#new_vel').val(vel);
    engine.id('vel_angle').value = vel_angle;
    engine.fireEvent(engine.id('vel_angle'), 'change');
    
    engine.id('new_rad').value = p.radius;
    engine.id('new_color').value=p.color;
    engine.id('new_fixed').checked = p.fixed;
    /*setTimeout(function() {
        document.getElementById('new_name').focus();
    }, 300);*/

    var modal = $.remodal.lookup[$('[data-remodal-id=editmodal]').data('remodal')];
    modal.open();
}

engine.precalculateDialog = function() {
    var modal = $.remodal.lookup[$('[data-remodal-id=precalcmodal]').data('remodal')];
    modal.open();
}

engine.createPrecalculateForm = function() {
    $(document).on('confirm', '#precalcmodal', function () {
        engine.precalculate(parseInt(engine.id('precalc_timestep').value), parseInt(engine.id('precalc_timespan').value));
    });
}

engine.createForm = function() {
    $('#new_mass').noUiSlider({
        start: 1.3275E+011,
        range: {
            'min': [ 1 ],
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
    $('#new_pos').noUiSlider({
        start: 0,
        range: {
            'min': [ 0 ],
            '33%': [100000000],
            '66%': [1000000000],
            'max': [10000000000]
        },
    });
    $('#new_pos').noUiSlider_pips({
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
    $('#new_pos').Link('lower').to($('#hidden_pos'));
    engine.id("vel_angle").addEventListener('change', function(e) {
        $('#vel_arrow').css('transform', 'rotate('+e.target.value+'deg)')
    }, false);
    engine.id("pos_angle").addEventListener('change', function(e) {
        $('#pos_arrow').css('transform', 'rotate('+e.target.value+'deg)')
    }, false);
    var colors = document.getElementById('new_color');
    for(var i = 0; i<orbit_data.planetColors.length; i++) {
        var option = document.createElement('option');
        option.text=orbit_data.planetColors[i];
        option.value=orbit_data.planetColors[i];
        colors.add(option);
    }
    
    $(document).on('confirm', '#editmodal', function () {
        if(engine.id('is_edit').value === "false") {
            engine.submitNewForm();
        } else {
            engine.submitEditForm();
        }
    });
}

engine.submitNewForm = function() {
    var vel = parseFloat(engine.id('hidden_vel').value);
    var vel_angle = parseFloat(engine.id('vel_angle').value) * Math.PI / 180;
    var vel_x = vel * Math.cos(vel_angle);
    var vel_y = vel * Math.sin(vel_angle);
    var pos = parseFloat(engine.id('hidden_pos').value);
    var pos_angle = parseFloat(engine.id('pos_angle').value) * Math.PI / 180;
    var pos_x = pos * Math.cos(pos_angle);
    var pos_y = pos * Math.sin(pos_angle);
    engine.addPlanet(engine.id('new_name').value, new Cart3(pos_x, 0, pos_y), parseFloat(engine.id('hidden_mass').value), new Cart3(parseFloat(vel_x), 0, parseFloat(vel_y)), engine.id('new_color').value, parseFloat(engine.id('new_rad').value), engine.id('new_fixed').checked);
}

engine.submitEditForm = function() {
    var p = engine.orbit_data.planet_array[engine.id('edit_index').value];
    p.name = engine.id('new_name').value;
    var pos = parseFloat(engine.id('hidden_pos').value);
    var pos_angle = parseFloat(engine.id('pos_angle').value) * Math.PI / 180;
    p.startpos.x = pos * Math.cos(pos_angle);
    p.startpos.z = pos * Math.sin(pos_angle);
    p.mass = parseFloat(engine.id('hidden_mass').value);
    p.startmass = parseFloat(engine.id('hidden_mass').value);
    var angle = parseFloat(engine.id('vel_angle').value) * Math.PI / 180;
    var vel = parseFloat(engine.id('hidden_vel').value);
    p.startvel.x = vel * Math.cos(angle);
    p.startvel.z = vel * Math.sin(angle);
    p.color = engine.id('new_color').value;
    p.radius = parseFloat(engine.id('new_rad').value);
    p.fixed = engine.id('new_fixed').checked;
    engine.reset();
}

engine.fireEvent = function(element, event) {
    if ("createEvent" in document) {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent(event, false, true);
        element.dispatchEvent(evt);
    }
    else {
        element.fireEvent(event);
    }
}