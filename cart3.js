function Cart3Prototype() {
    /* self modification */
    this.subFrom = function(a) {
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
        return this;
    }

    /* non modifying */
    this.sub = function(a) {
        return new Cart3(this.x - a.x, this.y-a.y, this.z - a.z);
    }
    
    this.mult=function(m) {
        return new Cart3(this.x * m, this.y*m, this.z*m);
    }

    this.multBy = function(m) {
        this.x *= m;
        this.y *= m;
        this.z *= m;
        return this;
    }
    
    this.divBy = function(m) {
        this.x /= m;
        this.y /= m;
        this.z /= m;
        return this;
    }
    
    this.add = function(a) {
        return new Cart3(this.x + a.x, this.y+a.y, this.z+a.z);
    }
    this.addTo = function(a) {
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
        return this;
    }
    
    this.invSumCube = function() {
        return Math.pow(this.x*this.x + this.y*this.y + this.z*this.z, -1.5);
    }
    
    this.abs = function() {
        return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    }
    
    this.toString = function() {
        return this.x + "," + this.y + "," + this.z;
    }
}
function Cart3(x,y,z) {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.timestamp = 0;
    
    if(x instanceof Cart3) {
        this.x = x.x;
        this.y = x.y;
        this.z = x.z;
    } else {
        if(x != undefined) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }
}
Cart3.prototype = new Cart3Prototype();