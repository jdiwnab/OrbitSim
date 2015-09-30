engine.rk4= function(pa, dt, array) {
    var x1 = new Cart3(pa.pos);
    var v1 = new Cart3(pa.vel);
    var a1 = engine.calcAccel(pa, x1, array);

    var x2 = new Cart3(v1).multBy(0.5*dt).addTo(pa.pos);
    var v2 = new Cart3(a1).multBy(0.5*dt).addTo(pa.vel);
    var a2 = engine.calcAccel(pa, x2, array);

    var x3 = new Cart3(v2).multBy(0.5*dt).addTo(pa.pos);
    var v3 = new Cart3(a2).multBy(0.5*dt).addTo(pa.vel);
    var a3 = engine.calcAccel(pa, x3, array);

    var x4 = new Cart3(v3).multBy(dt).addTo(pa.pos);
    var v4 = new Cart3(a3).multBy(dt).addTo(pa.vel);
    var a4 = engine.calcAccel(pa, x4, array);
    
    var xf = new Cart3(v2).addTo(v3).multBy(2).addTo(v1).addTo(v4).multBy(dt/6);
    var vf = new Cart3(a2).addTo(a3).multBy(2).addTo(a1).addTo(a4).multBy(dt/6);
    
    pa.deltaX = new Cart3(xf);
    pa.deltaV = new Cart3(vf);

}

engine.rkIterate = function(pa, dt, array) {
    engine.rk4(pa, dt, array);
}

