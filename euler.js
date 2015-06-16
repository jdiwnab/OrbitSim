engine.eulerIntegrate = function(pa, dt, array) {
    var accel = engine.calcAccel(pa, pa.pos, array);
    pa.vel.addTo(accel.multBy(dt));
    pa.oldPos = new Cart3(pa.pos); // This is needed to switch to verlet
    pa.pos.addTo(pa.vel.mult(dt));
}