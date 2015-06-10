engine.setupInputEvents = function() {
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
}


engine.cancelClick = function() {
    if(engine.isMouseDown) {
        engine.holdStart = null;
        engine.isHolding = true;
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
            //engine.log('touch start A '+touch.identifier+' ('+touch.clientX+','+touch.clientY+')');
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
            //engine.log('touch start B '+touch.identifier+' ('+touch.clientX+','+touch.clientY+')');
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
    //engine.log("touches ending: "+e.changedTouches[0].identifier+" "+e.changedTouches.length);
    var touches = e.changedTouches;
    for(var i=0; i<touches.length; i++) {
        var touch = touches[i].identifier;
        //engine.log("touch end "+touch);
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
        //engine.log('moving ('+dax+','+day+'), ('+engine.mouseX+','+engine.mouseY+')');
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
    //engine.log('('+dax+','+day+') ('+dbx+','+dby+') zoom: '+r+'x to '+engine.zoom+'x');
    engine.resetScaledHistory();
    engine.mouseMotion();
}

engine.mouseMotion = function(e) {
    engine.perform(0, true);
}

