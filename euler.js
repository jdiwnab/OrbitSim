engine.eulerIntegrate = function(pa, dt, array) {
    var accel = engine.calcAccel(pa, pa.pos, array);
    pa.vel.addTo(accel.multBy(dt));
    pa.pos.addTo(pa.vel.mult(dt));
}