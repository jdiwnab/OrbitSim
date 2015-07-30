engine.eulerIntegrate = function(pa, dt, array) {
    var accel = engine.calcAccel(pa, pa.pos, array);
    
    pa.deltaV = new Cart3(accel.multBy(dt));
    pa.deltaX = new Cart3(accel.addTo(pa.vel).multBy(dt));
}