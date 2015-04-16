engine.eulerIntegrate = function(pa, dt, array) {
    var Xn = new Cart3(pa.pos);
    var accel = engine.calcAccel(pa, Xn, array);
    pa.vel.addTo(accel.mult(dt));
    pa.pos.addTo(pa.vel.mult(dt));
}