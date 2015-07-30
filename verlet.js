engine.verletIntegrate = function(pa, dt, array) {
    // x1 = x0 + v0 * dt + 1/2 A(x0) * dt^2
    // xn1 = 2 * xn - xn-1 + A(xn) * dt^2 = xn + xn - xn-1 + A(xn) * dt^2
    //var Xn = new Cart3(pa.pos);
    var Xn = new Cart3();
    var accel  = engine.calcAccel(pa, pa.pos, array);
    if(pa.oldPos === undefined) {
        var vel = new Cart3(pa.vel);
        Xn.addTo(vel.multBy(dt)).addTo(accel.multBy(dt * dt).multBy(.5));
    } else {
        Xn.addTo(pa.pos).subFrom(pa.oldPos).addTo(accel.multBy(dt * dt));
    }
    pa.deltaX = new Cart3(Xn);
    pa.deltaV = new Cart3(Xn).divBy(dt).subFrom(pa.vel);
    
}