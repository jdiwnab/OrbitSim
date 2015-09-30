engine.setupControlEvents = function() {
    /* Form Events */
    engine.setupFancyControls();
    engine.id("stepfast").addEventListener('click', function(e) {
        var step = engine.timestepmulti;
        if(step >= 1000) return false;
        if(Math.floor(Math.log10(step)) == Math.log10(step)) {
            engine.timestepmulti *= 5;
        } else {
            engine.timestepmulti *= 2;
        }
        engine.id("stepvalue").textContent = engine.timestepmulti;
        engine.timeStep = engine.basestep * engine.timestepmulti;
    }, false);
    engine.id("stepslow").addEventListener('click', function(e) {
        var step = engine.timestepmulti;
        if(step <= .00001) return false;
        if(Math.floor(Math.log10(step)) == Math.log10(step)) {
            engine.timestepmulti /= 2;
        } else {
            engine.timestepmulti /= 5;
        }
        engine.id("stepvalue").textContent = engine.timestepmulti;
        engine.timeStep = engine.basestep * engine.timestepmulti;
    }, false);
    engine.id("fastfwd").addEventListener('click', function(e) {
        var step = engine.stepsPerFrame;
        if(step >= 1000) return false;
        if(Math.floor(Math.log10(step)) == Math.log10(step)) {
            engine.stepsPerFrame *= 5;
        } else {
            engine.stepsPerFrame *= 2;
        }
        engine.id("stepcount").textContent = engine.stepsPerFrame;
    }, false);
    engine.id("slowfwd").addEventListener('click', function(e) {
        var step = engine.stepsPerFrame;
        if(step <= 1) return false;
        if(Math.floor(Math.log10(step)) == Math.log10(step)) {
            engine.stepsPerFrame /= 2;
        } else {
            engine.stepsPerFrame /= 5;
        }
        engine.id("stepcount").textContent = engine.stepsPerFrame;
    }, false);
    engine.toggleHistory = function() {
        //fires before checkbox changes
        if( !engine.id("showHistory").checked ) {
            engine.history = true;
            engine.resetScaledHistory();
        } else {
            engine.history = false;
        }
    }
    engine.toggleBarnesHutt = function() {
        //fires before checkbox changes
        if(!engine.id('bhTree').checked) {
            engine.useBhTree = true;
        } else {
            engine.useBhTree = false;
        }
    }
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
      
    //Prevent double-tap-to-zoom on specific elements (like buttons)
    $('.no-zoom').bind('touchend', function(e) {
        e.preventDefault();
    });
    
    engine.id("pullout_menu").addEventListener('click', function(e) {
        $('#accordion').toggleClass('show');
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

engine.loadPreset = function(i) {
    engine.loadObject(engine.orbit_data.presets[parseInt(i)].planetArray, false);
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