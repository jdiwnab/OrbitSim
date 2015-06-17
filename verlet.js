engine.verletIntegrate = function(pa, dt, array) {
    // x1 = x0 + v0 * dt + 1/2 A(x0) * dt^2
    // xn1 = 2 * xn - xn-1 + A(xn) * dt^2
    var Xn = new Cart3(pa.pos);
    var accel  = engine.calcAccel(pa, Xn, array);
    if(pa.oldPos === undefined) {
        var vel = new Cart3(pa.vel);
        Xn.addTo(vel.multBy(dt)).addTo(accel.multBy(dt * dt).multBy(.5));
    } else {
        Xn.multBy(2).subFrom(pa.oldPos).addTo(accel.multBy(dt * dt));
    }
    pa.vel = new Cart3(Xn).subFrom(pa.pos).divBy(dt); //This is not needed for verlet, but is needed to switch to other algorithms
    pa.oldPos = new Cart3(pa.pos);
    pa.pos = Xn;
    
}