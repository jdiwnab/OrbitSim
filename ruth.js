engine.ruth2Integrate = function(pa, dt, array) {
  c = [0.0, 1.0];
  d = [0.5, 0.5];
  engine.ruthIntegrate(pa, dt, array, c, d);
}

engine.ruth3Integrate = function(pa, dt, array) {
  c = [7.0/24.0,  3.0/4.0,  -1.0/24.0 ];
  d = [2.0/3.0,   -2.0/3.0, 1.0       ];
  engine.ruthIntegrate(pa, dt, array, c, d);
}

engine.ruthIntegrate = function(pa, dt, array, c, d) {
  var pos = new Cart3(pa.pos);
  var vel = new Cart3(pa.vel);
  for(var i = 0; i< c.length; i++) {
    var accel = engine.calcAccel(pa, pos, array);
    vel.addTo(accel.multBy(c[i] * dt));
    pos.addTo(vel.multBy(d[i] * dt));
  }
  pa.deltaV = vel.subFrom(pa.vel);
  pa.deltaX = pos.subFrom(pa.pos);
}
