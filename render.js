engine.perform = function(refresh) {
    if(engine.animate || refresh) {
        var t0 = performance.now();
        engine.render(refresh);
        var t1 = performance.now();
        if(t1-t0 == 0) {
            //low percision numbers
            t1 += .1;
        }
        var fps = 1/((t1-t0)/1000);
        engine.frame_count += 1
        if(engine.fps == 0) {
            engine.fps = fps;
        } else {
            engine.fps = engine.fps + (fps - engine.fps)/10;
        }
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
        var hist = engine.scaleHistory(p);
        engine.ctx.strokeStyle = 'gray';
        engine.drawOrbit(hist, cx, cy);
        engine.ctx.fillStyle = p.color;
        engine.drawOval(pp.x, pp.z, cx, cy, ovalSize);
    }
}

engine.scaleOrbitingBody = function (ob) {
    // make a copy, don't modify the original values
    var p = new Cart3(ob.pos).multBy(engine.drawingScale * engine.zoom * engine.xsize /2);
    ob.renderPos = p;
    return p;
}

engine.unscaleCoordinate = function(x, y) {
    var new_x, new_y;
    new_x = x - engine.xorig;
    new_y = y - engine.yorig;
    new_x = new_x/(engine.drawingScale * engine.zoom * engine.xsize/2);
    new_y = new_y/(engine.drawingScale * engine.zoom * engine.xsize/2);
    return new Cart3(new_x, new_y, 0);
}

engine.scaleHistory = function(p) {
    var history = p.history;
    if(p.scaledHistory === undefined) {
        var new_hist = [];
        for(var i=0; i<history.length; i++) {
            var h = new Cart3(history[i]).multBy(engine.drawingScale*engine.zoom*engine.xsize/2);
            new_hist.push(h);
        }
        p.scaledHistory = new_hist;
    } else {
        var h = new Cart3(history[history.length-1]).multBy(engine.drawingScale*engine.zoom*engine.xsize/2);
        p.scaledHistory.push(h);
    }
    return p.scaledHistory;
}

engine.resetScaledHistory = function() {
    for(var i = 0; i < engine.orbit_data.planet_array.length; i++) {
        engine.orbit_data.planet_array[i].resetScaledHistory();
    }
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
        engine.ctx.fillText('fps  ' + engine.formatNum(engine.fps, 2, 8),8, engine.ysize-40);

        
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
