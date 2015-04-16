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