engine.rkVars = {
    x1: new Cart3(),
    v1: new Cart3(),
    x2: new Cart3(),
    v2: new Cart3(),
    x3: new Cart3(),
    v3: new Cart3(),
    x4: new Cart3(),
    v4: new Cart3(),
    xf: new Cart3(),
    vf: new Cart3()
};
engine.rkReset = function() {
    engine.rkVars.x1.x=0; engine.rkVars.x1.y=0; engine.rkVars.x1.z=0;
    engine.rkVars.v1.x=0; engine.rkVars.v1.y=0; engine.rkVars.v1.z=0;
    engine.rkVars.x2.x=0; engine.rkVars.x2.y=0; engine.rkVars.x2.z=0;
    engine.rkVars.v2.x=0; engine.rkVars.v2.y=0; engine.rkVars.v2.z=0;
    engine.rkVars.x3.x=0; engine.rkVars.x3.y=0; engine.rkVars.x3.z=0;
    engine.rkVars.v3.x=0; engine.rkVars.v3.y=0; engine.rkVars.v3.z=0;
    engine.rkVars.x4.x=0; engine.rkVars.x4.y=0; engine.rkVars.x4.z=0;
    engine.rkVars.v4.x=0; engine.rkVars.v4.y=0; engine.rkVars.v4.z=0;
    engine.rkVars.xf.x=0; engine.rkVars.xf.y=0; engine.rkVars.xf.z=0;
    engine.rkVars.vf.x=0; engine.rkVars.vf.y=0; engine.rkVars.vf.z=0;
}

engine.rkIntegrate= function(pa, dt, array) {
    engine.rkReset();    
    engine.rkVars.x1.addTo(pa.pos);
    engine.rkVars.v1.addTo(pa.vel);
    var a1 = engine.calcAccel(pa, engine.rkVars.x1, array);
    
    engine.rkVars.x2.addTo(engine.rkVars.v1).multBy(0.5*dt).addTo(pa.pos);
    engine.rkVars.v2.addTo(a1).multBy(0.5*dt).addTo(pa.vel);
    var a2 = engine.calcAccel(pa, engine.rkVars.x2, array);

    engine.rkVars.x3.addTo(engine.rkVars.v2).multBy(0.5*dt).addTo(pa.pos);
    engine.rkVars.v3.addTo(a2).multBy(0.5*dt).addTo(pa.vel);
    var a3 = engine.calcAccel(pa, engine.rkVars.x3, array);
    
    engine.rkVars.x4.addTo(engine.rkVars.v3).multBy(dt).addTo(pa.pos);
    engine.rkVars.v4.addTo(a3).multBy(dt).addTo(pa.vel);
    var a4 = engine.calcAccel(pa, engine.rkVars.x4, array);
    
    engine.rkVars.xf.addTo(engine.rkVars.v2).addTo(engine.rkVars.v3).multBy(2).addTo(engine.rkVars.v1).addTo(engine.rkVars.v4).multBy(dt/6);
    engine.rkVars.vf.addTo(a2).addTo(a3).multBy(2).addTo(a1).addTo(a4).multBy(dt/6);
    
    pa.oldPos = new Cart3(pa.pos); //This is needed to switch to verlet
    pa.pos.addTo(engine.rkVars.xf);
    pa.vel.addTo(engine.rkVars.vf);
}

engine.rkIterate = function(pa, dt, array) {
    engine.rkIntegrate(pa, dt, array);
}