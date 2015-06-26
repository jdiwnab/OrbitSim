function bhNodePrototype() {
    this.addObject = function(index, p, currDepth){
    
        //not storing yet, so just put it here
        if(this.index === undefined) {
            //console.log('adding new object');
            this.index = [index];
            this.com.x = p.pos.x;
            this.com.y = p.pos.y;
            this.com.z = p.pos.z;
            this.com.mass = p.mass;
        }
        // add to existing quad
        else if(!this.isLeaf) {
            var quad = this.getQuad(p);
            if(this.quads[quad] === undefined) {
                var newSize = this.getQuadSize(quad);
                this.quads[quad] = new bhNode(newSize[0], newSize[1], newSize[2], newSize[3], newSize[4], newSize[5], newSize[6], newSize[7]);
            }
            //console.log('object belongs in quad '+quad);
            this.quads[quad].addObject(index, p, currDepth + 1);
            var newMass = this.com.mass + p.mass;
            this.com.x = (this.com.mass * this.com.x + p.mass * p.pos.x)/newMass;
            this.com.y = (this.com.mass * this.com.y + p.mass * p.pos.y)/newMass;
            this.com.z = (this.com.mass * this.com.z + p.mass * p.pos.z)/newMass;
            this.com.mass = newMass;
        }
        // convert from leaf to parent
        else {
            if(currDepth >= this.maxDepth) {
                //make this an array type node
                
                this.index.push(index);
            } else {
                //first, the existing one
                var existingObject = {
                    pos: {
                        x: this.com.x,
                        y: this.com.y,
                        z: this.com.z
                    },
                    mass: this.com.mass
                };
                var quad = this.getQuad(existingObject);
                var newSize = this.getQuadSize(quad);
                this.quads[quad] = new bhNode(newSize[0], newSize[1], newSize[2], newSize[3], newSize[4], newSize[5], newSize[6], newSize[7]);
                //console.log('converting object to quad '+quad);
                this.quads[quad].addObject(this.index[0],existingObject, currDepth + 1);
                this.isLeaf = false;
                
                //now the new one
                var quad = this.getQuad(p);
                if(this.quads[quad] === undefined) {
                    var newSize = this.getQuadSize(quad);
                    this.quads[quad] = new bhNode(newSize[0], newSize[1], newSize[2], newSize[3], newSize[4], newSize[5], newSize[6], newSize[7]);
                }
                //console.log('adding object to quad '+quad);
                this.quads[quad].addObject(index, p, currDepth + 1);
            }
            var newMass = this.com.mass + p.mass;
            this.com.x = (this.com.mass * this.com.x + p.mass * p.pos.x)/newMass;
            this.com.y = (this.com.mass * this.com.y + p.mass * p.pos.y)/newMass;
            this.com.z = (this.com.mass * this.com.z + p.mass * p.pos.z)/newMass;
            this.com.mass = newMass;
        }
    };
    this.getQuad = function(p) {
        var mx = (this.size.x2 + this.size.x1)/2;
        var my = (this.size.y2 + this.size.y1)/2;
        var mz = (this.size.z2 + this.size.z1)/2;
        var quad  = 0;
        if(p.pos.z <= mz) { quad += 4; }
        if(p.pos.y <= my) { quad += 2; }
        if(p.pos.x >  mx) { quad += 1; }
        return quad;
    }
    this.getQuadSize = function(quad) {
        var mx = (this.size.x2 + this.size.x1)/2;
        var my = (this.size.y2 + this.size.y1)/2;
        var mz = (this.size.z2 + this.size.z1)/2;
        var x1, x2, y1, y2, z1, z2 = undefined;
        if(quad == 0 || quad == 1 || quad == 2 || quad == 3) {
            z1 = mz;
            z2 = this.size.z2;
        } else {
            z1 = this.size.z1;
            z2 = mz;  
        }
        
        if(quad == 0 || quad == 1 || quad == 4 || quad == 5) {
            y1 = this.size.y1;
            y2 = my
        } else {
            y1 = my
            y2 = this.size.y2;
        }
        
        if(quad == 0 || quad == 2 || quad == 4 || quad == 6) {
            x1 = this.size.x1;
            x2 = mx
        } else {
            x1 = mx
            x2 = this.size.x2;
        }
        return [x1, x2, y1, y2, z1, z2];
    };
    this.getRatio = function(p) {
        //calculates the size/distance ratio. if s/d < theta, then use COM, else, recurse into the tree until individual element
        var s = Math.max(this.size.x2-this.size.x1, this.size.y2-this.size.y1, this.size.z2-this.size.z1);
        var pos = new Cart3(this.com.x, this.com.y, this.com.z);
        var d = pos.subFrom(p.pos).abs();
        return s/d;
    };
    this.calcAccel = function(pa, pos, array) {
        var accel = new Cart3();
        var radius = new Cart3();
        if(pa != undefined) {
            if(this.isLeaf) {
                //whatever the ratio, if it's a leaf, calc directly
                for(var i = 0; i < this.index.length; i++) {
                    var pb = array[this.index[i]];
                    //console.log('Calculating for '+pa.name+' with '+pb.name);
                    //skip self calculation, or if destroyed
                    if(pb != undefined && pa != pb && !pb.destroyed) {
                        radius.addTo(pos).subFrom(pb.pos);
                        accel.addTo(radius.multBy( (-1 * pb.mass * radius.invSumCube())));
                    }
                }
            } else {
                //if this node is far enough away from object, calc with COM
                if(this.getRatio({pos: pos})< engine.bhTheta) {
                    //console.log('Calculating for '+pa.name+' with quadrant');
                    radius.addTo(pos).subFrom(new Cart3(this.com.x, this.com.y, this.com.z));
                    accel.addTo(radius.multBy( (-1 * this.com.mass * radius.invSumCube())));
                } else {
                    // otherwise, recurse down the tree
                    //console.log('Calculating for '+pa.name+' with recuse');
                    for(var i = 0; i< this.quads.length; i++) {
                        if(this.quads[i] !== undefined) {
                            accel.addTo(this.quads[i].calcAccel(pa, pos, array));
                        }
                    }
                }
            }
        }
        return accel;
    }
}
function bhNode(x1, x2, y1, y2, z1, z2) {
    this.com =  {
        x: undefined,
        y: undefined,
        z: undefined,
        mass: undefined,
    };
    this.isLeaf = true;
    //           NW         NE         SW         SE         DNW        DNE        DSW        DSE
    this.quads= [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
    this.size= {
        x1: x1,
        x2: x2,
        y1: y1,
        y2: y2,
        z1: z1,
        z2: z2,
    };
    //this.index = undefined;
    this.index = undefined;
    this.maxDepth = 50;
};
bhNode.prototype = new bhNodePrototype();

bhTreePrototype = function() {
    //this.initTree =function(){
    //    this.root = new bhNode(-1* engine.maxDistance, engine.maxDistance, -1*engine.maxDistance, engine.maxDistance, -1*engine.maxDistance, engine.maxDistance);
    //};
    this.addObject = function(index, p) {
        this.root.addObject(index, p, 0)
    };
    this.calcAccel = function(pa, pos, array) {
        return this.root.calcAccel(pa, pos, array);
    };
    this.addArray = function(array) {
        var dist = 0;
        for(var i = 0; i<array.length; i++) {
            dist = Math.max(array[i].pos.abs(),dist);
        }
        this.root = new bhNode(-1* dist, dist, -1*dist, dist, -1*dist, dist);
        for(var i = 0; i<array.length; i++) {
            if(!array[i].destroyed){
                //console.log('adding object '+array[i].name);
                this.addObject(i, array[i]);
            }
        }
    };
}
bhTree = function() {
    //this.initTree();    
}
bhTree.prototype = new bhTreePrototype();