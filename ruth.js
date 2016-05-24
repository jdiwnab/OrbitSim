// Sympletic integration based on Ruth http://zwe.web.cern.ch/zwe/CAS/biblio/ruth-forest.pdf
engine.ruth2Integrate = function(pa, dt, array) {
  var c = [0.0, 1.0];
  var d = [0.5, 0.5];
  engine.ruthIntegrate(pa, dt, array, c, d);
}

engine.ruth3Integrate = function(pa, dt, array) {
  var c = [7.0/24.0,  3.0/4.0,  -1.0/24.0 ];
  var d = [2.0/3.0,   -2.0/3.0, 1.0       ];
  engine.ruthIntegrate(pa, dt, array, c, d);
}

engine.ruth4Integrate = function(pa, dt, array) {
  // x = 1/6 * (2^(1/3) + 2^(-1/3) -1)
  var x = 0.1756035959798;
  var c = [x+0.5, -x, -x, x+0.5];
  var d = [2*x + 1.0, -4*x -1.0, 2*x + 1.0, 0.0];
  engine.ruthIntegrate(pa, dt, array, c, d)
}

engine.ruthIntegrate = function(pa, dt, array, c, d) {
  var pos = new Cart3(pa.pos);
  var vel = new Cart3(pa.vel);
  for(var i = 0; i< c.length; i++) {
    var accel = engine.calcAccel(pa, pos, array);
    vel.addTo(accel.multBy(c[i] * dt));
    pos.addTo(vel.mult(d[i] * dt));
  }
  pa.deltaV = vel.subFrom(pa.vel);
  pa.deltaX = pos.subFrom(pa.pos);
}
