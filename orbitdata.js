function OrbitData() {
  this.planetColors = ["white", "yellow", "orange", "cyan", "red", "green", "magenta", "blue"];

  //Round numbers to test how things scale
  this.planetMasses = [ {"name": "1x (pluto)", "mass": 1e+4 },
                        {"name": "5x", "mass": 5e+4 },
                        {"name": "10x", "mass": 1e+5 },
                        {"name": "50x (earth)", "mass": 5e+5 },
                        {"name": "100x", "mass": 1e+6 },
                        {"name": "500x", "mass": 5e+6 },
                        {"name": "1000x", "mass": 1e+7 },
                        {"name": "5000x", "mass": 5e+7 },
                        {"name": "10000x (jupiter)", "mass": 1e+8 },
                        {"name": "50000x", "mass": 5e+8 },
                        {"name": "100000x", "mass": 1e+9 },
                        {"name": "500000x", "mass": 5e+9 },
                        {"name": "1000000x", "mass": 1e+10 },
                        {"name": "5000000x", "mass": 5e+10 },
                        {"name": "10000000x (sun)", "mass": 1e+11 },
                        {"name": "50000000x", "mass": 5e+11 }];
  this.planetOrbits = [ {"name": "0x (sun)", "pos": 0 },
                        {"name": "1x", "pos": 1e+4 },
                        {"name": "5x", "pos": 5e+4 },
                        {"name": "10x", "pos": 1e+5 },
                        {"name": "50x", "pos": 5e+5 },
                        {"name": "100x", "pos": 1e+6 },
                        {"name": "500x", "pos": 5e+6 },
                        {"name": "1000x", "pos": 1e+7 },
                        {"name": "5000x (mercury)", "pos": 5e+7 },
                        {"name": "10000x (earth)", "pos": 1e+8 },
                        {"name": "50000x", "pos": 5e+8 },
                        {"name": "100000x (jupiter)", "pos": 1e+9 },
                        {"name": "500000x (pluto)", "pos": 5e+9 },
                        {"name": "1000000x", "pos": 1e+10 },
                        {"name": "5000000x", "pos": 5e+10 },
                        {"name": "10000000x", "pos": 1e+11 },
                        {"name": "50000000x", "pos": 5e+11 },
                        {"name": "-1x", "pos": -1e+4 },
                        {"name": "-5x", "pos": -5e+4 },
                        {"name": "-10x", "pos": -1e+5 },
                        {"name": "-50x", "pos": -5e+5 },
                        {"name": "-100x", "pos": -1e+6 },
                        {"name": "-500x", "pos": -5e+6 },
                        {"name": "-1000x", "pos": -1e+7 },
                        {"name": "-5000x (mercury)", "pos": -5e+7 },
                        {"name": "-10000x (earth)", "pos": -1e+8 },
                        {"name": "-50000x", "pos": -5e+8 },
                        {"name": "-100000x (jupiter)", "pos": -1e+9 },
                        {"name": "-500000x (pluto)", "pos": -5e+9 },
                        {"name": "-1000000x", "pos": -1e+10 },
                        {"name": "-5000000x", "pos": -5e+10 },
                        {"name": "-10000000x", "pos": -1e+11 },
                        {"name": "-50000000x", "pos": -5e+11 }];
  this.planetVelocity=[ {"name": "0x (sun)", "vel": 0 },
                        {"name": "1x", "vel": 1 },
                        {"name": "5x (pluto)", "vel": 5 },
                        {"name": "10x", "vel": 10 },
                        {"name": "50x (mercury)", "vel": 50 },
                        {"name": "100x", "vel": 1e+2 },
                        {"name": "500x", "vel": 5e+2 },
                        {"name": "1000x", "vel": 1e+3 },
                        {"name": "5000x", "vel": 5e+3 },
                        {"name": "10000x", "vel": 1e+4 },
                        {"name": "50000x", "vel": 5e+4 },
                        {"name": "100000x", "vel": 1e+5 },
                        {"name": "500000x", "vel": 5e+5 },
                        {"name": "1000000x", "vel": 1e+6 },
                        {"name": "5000000x", "vel": 5e+6 },
                        {"name": "10000000x", "vel": 1e+7 },
                        {"name": "50000000x", "vel": 5e+7 },
                        {"name": "-1x", "vel": -1 },
                        {"name": "-5x (pluto)", "vel": -5 },
                        {"name": "-10x", "vel": -10 },
                        {"name": "-50x (mercury)", "vel": -50 },
                        {"name": "-100x", "vel": -1e+2 },
                        {"name": "-500x", "vel": -5e+2 },
                        {"name": "-1000x", "vel": -1e+3 },
                        {"name": "-5000x", "vel": -5e+3 },
                        {"name": "-10000x", "vel": -1e+4 },
                        {"name": "-50000x", "vel": -5e+4 },
                        {"name": "-100000x", "vel": -1e+5 },
                        {"name": "-500000x", "vel": -5e+5 },
                        {"name": "-1000000x", "vel": -1e+6 },
                        {"name": "-5000000x", "vel": -5e+6 },
                        {"name": "-10000000x", "vel": -1e+7 },
                        {"name": "-50000000x", "vel": -5e+7 }];
  /*this.planetRadius = [ {"name": "1x", "rad": 1e+1 },
                        {"name": "5x", "rad": 5e+1 },
                        {"name": "10x", "rad": 1e+2 },
                        {"name": "50x", "rad": 5e+2 },
                        {"name": "100x", "rad": 1e+3 },
                        {"name": "500x", "rad": 5e+3 },
                        {"name": "1000x", "rad": 1e+4 },
                        {"name": "5000x", "rad": 5e+4 },
                        {"name": "10000x", "rad": 1e+5 },
                        {"name": "50000x", "rad": 5e+5 },
                        {"name": "100000x (pluto)", "rad": 1e+6 },
                        {"name": "500000x (earth)", "rad": 5e+6 },
                        {"name": "1000000x", "rad": 1e+7 },
                        {"name": "5000000x", "rad": 5e+7 },
                        {"name": "10000000x", "rad": 1e+8 },
                        {"name": "50000000x (sun)", "rad": 5e+8 }];*/
  //Reduced list, scaled and normalized
  /*
  //Masses adjusted for normalized G, (/11 orders, * 6.6742)
  //scaled lengths by 3 orders
  //scaled mass by 9 orders
  this.planetMasses = [ {"name": "Sun", "mass": 1.3275E+011 },
                        {"name": "Mercury", "mass": 2.2225E+04 },
                        {"name": "Earth", "mass": 3.9885E+05 },
                        {"name": "Moon", "mass": 4.904E+03 },
                        {"name": "Jupiter", "mass": 1.268E+08 },
                        {"name": "Pluto", "mass": 8.4762E+03 }];
  this.planetOrbits = [ {"name": "Sun", "pos": 0 },
                        {"name": "Mercury", "pos": 57900000 },
                        {"name": "Earth", "pos": 150000000 },
                        {"name": "Moon", "pos":  150385000 },
                        {"name": "Jupiter", "pos": 778330000 },
                        {"name": "Pluto", "pos": 5913520000 },
                        {"name": "-Sun", "pos": 0 },
                        {"name": "-Mercury", "pos": -57900000 },
                        {"name": "-Earth", "pos": -150000000 },
                        {"name": "-Jupiter", "pos": -778330000 },
                        {"name": "-Pluto", "pos": -5913520000 }];
  this.planetVelocity=[ {"name": "Sun", "vel": 0 },
                        {"name": "Mercury", "vel": 47.9 },
                        {"name": "Earth", "vel": 29.8 },
                        {"name": "Moon", "vel": 30.822},
                        {"name": "Jupiter", "vel": 13.1 },
                        {"name": "Pluto", "vel": 4.74 },
                        {"name": "-Sun", "vel": 0 },
                        {"name": "-Mercury", "vel": -47.9 },
                        {"name": "-Earth", "vel": -29.8 },
                        {"name": "-Jupiter", "vel": -13.1 },
                        {"name": "-Pluto", "vel": -4.74 }];
  this.planetRadius = [ {"name": "Sun", "rad": 695000000 },
                        {"name": "Mercury", "rad": 2440000 },
                        {"name": "Earth", "rad": 6378140 },
                        {"name": "Moon", "rad": 1738140 },
                        {"name": "Jupiter", "rad": 71492000 },
                        {"name": "Pluto", "rad": 1137000 }];
  */                        
  this.planet_array = [];
  
  // Full list of planets at full scale, for reference
  /*this.planetMasses = [ {"name": "Sun", "mass": 1.989E+030 },
                        {"name": "Mercury", "mass": 3.33E+023 },
                        {"name": "Venus", "mass": 4.869E+024 },
                        {"name": "Earth", "mass": 5.976E+024 },
                        {"name": "Moon", "mass": 7.3477E+22 },
                        {"name": "Jupiter", "mass": 1.9E+027 },
                        {"name": "Saturn", "mass": 5.688E+026 },
                        {"name": "Uranus", "mass": 8.686E+025 },
                        {"name": "Neptune", "mass": 1.024E+026 },
                        {"name": "Pluto", "mass": 1.27E+022 }];
  this.planetOrbits = [ {"name": "Sun", "pos": 0 },
                        {"name": "Mercury", "pos": 57900000000 },
                        {"name": "Venus", "pos": 108000000000 },
                        {"name": "Earth", "pos": 150000000000 },
                        {"name": "Moon", "pos":  150385000000 },
                        {"name": "Jupiter", "pos": 778330000000 },
                        {"name": "Saturn", "pos": 1429400000000 },
                        {"name": "Uranus", "pos": 2870990000000 },
                        {"name": "Neptune", "pos": 4504300000000 },
                        {"name": "Pluto", "pos": 5913520000000 },
                        {"name": "-Sun", "pos": 0 },
                        {"name": "-Mercury", "pos": -57900000000 },
                        {"name": "-Earth", "pos": -150000000000 },
                        {"name": "-Venus", "pos": -108000000000 },
                        {"name": "-Jupiter", "pos": -778330000000 },
                        {"name": "-Saturn", "pos": -1429400000000 },
                        {"name": "-Uranus", "pos": -2870990000000 },
                        {"name": "-Neptune", "pos": -4504300000000 },
                        {"name": "-Pluto", "pos": -5913520000000 }];
  this.planetVelocity=[ {"name": "Sun", "vel": 0 },
                        {"name": "Mercury", "vel": 47900 },
                        {"name": "Venus", "vel": 35000 },
                        {"name": "Earth", "vel": 29800 },
                        {"name": "Moon", "vel": 30822},
                        {"name": "Jupiter", "vel": 13100 },
                        {"name": "Saturn", "vel": 9640 },
                        {"name": "Uranus", "vel": 6810 },
                        {"name": "Neptune", "vel": 5430 },
                        {"name": "Pluto", "vel": 4740 },
                        {"name": "-Sun", "vel": 0 },
                        {"name": "-Mercury", "vel": -47900 },
                        {"name": "-Earth", "vel": -29800 },
                        {"name": "-Venus", "vel": -35000 },
                        {"name": "-Jupiter", "vel": -13100 },
                        {"name": "-Saturn", "vel": -9640 },
                        {"name": "-Uranus", "vel": -6810 },
                        {"name": "-Neptune", "vel": -5430 },
                        {"name": "-Pluto", "vel": -4740 }];
  this.planetRadius = [ {"name": "Sun", "rad": 695000000 },
                        {"name": "Mercury", "rad": 2440000 },
                        {"name": "Venus", "rad": 6050000 },
                        {"name": "Earth", "rad": 6378140 },
                        {"name": "Moon", "rad": 1738140 },
                        {"name": "Jupiter", "rad": 71492000 },
                        {"name": "Saturn", "rad": 60268000 },
                        {"name": "Uranus", "rad": 25559000 },
                        {"name": "Neptune", "rad": 24746000 },
                        {"name": "Pluto", "rad": 1137000 }]; */

  this.resetPlanets = function() {
    for(var i = 0; i<this.planet_array.length; i++) {
        this.planet_array[i].reset();
    }
   }



   this.addToTable = function(body) {
    var table = document.getElementById('objects_table');
    var row = table.insertRow(-1);
    var nameCell = row.insertCell(-1); nameCell.textContent = body.name;
    var positionCell = row.insertCell(-1); positionCell.textContent = body.pos.x;
    //var radiusCell = row.insertCell(-1); radiusCell.textContent = body.radius;
    var massCell = row.insertCell(-1); massCell.textContent = body.mass;
    var velocityCell = row.insertCell(-1); velocityCell.textContent = body.vel.z;
    var colorCell = row.insertCell(-1); colorCell.textContent = body.color;
    //var fixedCell = row.insertCell(-1); fixedCell.textContent = 'false';
   }
}