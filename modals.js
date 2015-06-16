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

engine.createForm = function() {
    $('#new_mass').noUiSlider({
        start: 1.3275E+011,
        range: {
            'min': [ 1 ],
            '25%': [1e+3],
            '50%': [1e+6],
            '75%': [1e+9],
            'max': [1e+12]
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
            'min': [0],
            'max': [100]
        },
    });
    $('#new_vel').noUiSlider_pips({
        mode: 'positions',
        values: [0, 25, 50, 75, 100],
        density: 4
    });
    $('#new_vel').Link('lower').to($('#hidden_vel'));
    $('#new_pos').noUiSlider({
        start: 0,
        range: {
            'min': [ 0 ],
            '25%': [1e+3],
            '50%': [1e+6],
            '75%': [1e+9],
            'max': [1e+12]
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
    engine.id('delete_object').addEventListener('click', function() {
        if(engine.id('is_edit').value === "true") {
            engine.orbit_data.planet_array.splice(engine.id('edit_index').value, 1);
            engine.reset();
        }
        $.remodal.lookup[$('[data-remodal-id=editmodal]').data('remodal')].close();
    }, false);
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

engine.precalculateDialog = function() {
    var modal = $.remodal.lookup[$('[data-remodal-id=precalcmodal]').data('remodal')];
    modal.open();
}

engine.createPrecalculateForm = function() {
    $(document).on('confirm', '#precalcmodal', function () {
        engine.precalculate(parseInt(engine.id('precalc_timestep').value), parseInt(engine.id('precalc_timespan').value));
    });
}