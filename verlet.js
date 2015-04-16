engine.verletIntegrate = function(pa, dt, array) {
    // x1 = x0 + v0 * dt + 1/2 A(x0) * dt^2
    // xn1 = 2 * xn - xn-1 + A(xn) * dt^2
    var Xn = new Cart3(pa.pos);
    var Xold = new Cart3(pa.oldPos);
    var accel  = engine.calcAccel(pa, Xn, array);
    var newX;
    if(pa.oldPos === undefined) {
        var vel = new Cart3(pa.vel);
        newX = Xn.add(vel.mult(dt)).add(accel.mult(dt * dt).mult(.5));
        //engine.log("First movement bootstrapping");
        //engine.log('Move: '+Xn+', '+Xold+', '+accel+', '+newX);
        //console.log('Move ('+pa.name+': '+Xn+' + '+vel+'*'+dt+' + 1/2 * '+accel+'*'+dt+'^2 = '+newX);
    } else {
        newX = Xn.mult(2).sub(Xold).add(accel.mult(dt * dt));
        //engine.log("Real Verlet");
        //engine.log('Move: '+Xn+', '+Xold+', '+accel+', '+newX);
        //console.log('Move ('+pa.name+': 2*'+Xn+' - '+Xold+' + '+accel+'*'+dt+'^2 = '+newX);
    }
    pa.oldPos = new Cart3(pa.pos);
    pa.pos = newX;
    
}