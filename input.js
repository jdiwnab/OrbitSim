
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



engine.mouseDown = function(e) {
    e.preventDefault();
    engine.mouseX = e.clientX;
    engine.mouseY = e.clientY;
    engine.initX = engine.xorig;
    engine.initY = engine.yorig;
    engine.isMouseDown=true;
}

engine.mouseDrag = function(e) {
    e.preventDefault();
    if(engine.isMouseDown) {
        engine.xorig = engine.initX + (e.clientX - engine.mouseX);
        engine.yorig = engine.initY + (e.clientY - engine.mouseY);
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
}

engine.touchStart = function(e) {
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
}

engine.touchEnd = function(e) {
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
}

engine.touchMove = function(e) {
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
            touchZoom(dax, day, dbx, dby);
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
