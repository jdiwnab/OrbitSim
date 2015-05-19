function OrbitData() {
  this.planetColors = ["white", "yellow", "orange", "cyan", "red", "green", "magenta", "blue"];
  this.planet_array = [];
  
  // Full list of planets at full scale, for reference
  /*//For scale:
  //Masses adjusted for normalized G, (/11 orders, * 6.6742)
  //scaled lengths by 3 orders
  //scaled mass by 9 orders
  this.planetMasses = [ {"name": "Sun", "mass": 1.989E+030 },   //1.327E+11
                        {"name": "Mercury", "mass": 3.33E+023 },  //2.222E+4
                        {"name": "Venus", "mass": 4.869E+024 },   //3.249E+5
                        {"name": "Earth", "mass": 5.976E+024 },   //3.988E+5
                        {"name": "Moon", "mass": 7.3477E+22 },    //4.904E+3
                        {"name": "Mars", "mass": 6.4185E+23 },    //4.283E+4
                        {"name": "Jupiter", "mass": 1.9E+027 },   //1.268E+8
                        {"name": "Saturn", "mass": 5.688E+026 },  //3.796E+7
                        {"name": "Uranus", "mass": 8.686E+025 },  //5.797E+6
                        {"name": "Neptune", "mass": 1.024E+026 }, //6.954E+6
                        {"name": "Pluto", "mass": 1.27E+022 }];   //8.476E+3
  this.planetOrbits = [ {"name": "Sun", "pos": 0 },
                        {"name": "Mercury", "pos": 57900000000 },   //57900000
                        {"name": "Venus", "pos": 108000000000 },    //108000000
                        {"name": "Earth", "pos": 150000000000 },    //150000000
                        {"name": "Moon", "pos":  150385000000 },    //150385000
                        {"name": "Mars", "pos":  227900000000 },    //227900000
                        {"name": "Jupiter", "pos": 778330000000 },  //778330000
                        {"name": "Saturn", "pos": 1429400000000 },  //1429400000
                        {"name": "Uranus", "pos": 2870990000000 },  //2870990000
                        {"name": "Neptune", "pos": 4504300000000 }, //4504300000
                        {"name": "Pluto", "pos": 5913520000000 },]; //5913520000
  this.planetVelocity=[ {"name": "Sun", "vel": 0 },             //0
                        {"name": "Mercury", "vel": 47900 },     //47.90
                        {"name": "Venus", "vel": 35000 },       //35
                        {"name": "Earth", "vel": 29800 },       //29.8
                        {"name": "Moon", "vel": 30822},         //30.822
                        {"name": "Mars", "vel": 24077 },        //24.077
                        {"name": "Jupiter", "vel": 13100 },     //13.1
                        {"name": "Saturn", "vel": 9640 },       //9.64
                        {"name": "Uranus", "vel": 6810 },       //6.81
                        {"name": "Neptune", "vel": 5430 },      //5.43
                        {"name": "Pluto", "vel": 4740 },}];     //4.74
  this.planetRadius = [ {"name": "Sun", "rad": 695000000 },     //695000
                        {"name": "Mercury", "rad": 2440000 },   //2440
                        {"name": "Venus", "rad": 6050000 },     //6050
                        {"name": "Earth", "rad": 6378140 },     //6378.14
                        {"name": "Moon", "rad": 1738140 },      //1738.14
                        {"name": "Mars", "rad": 3389500 },      //3389.5
                        {"name": "Jupiter", "rad": 71492000 },  //71492
                        {"name": "Saturn", "rad": 60268000 },   //60268
                        {"name": "Uranus", "rad": 25559000 },   //25559
                        {"name": "Neptune", "rad": 24746000 },  //24746
                        {"name": "Pluto", "rad": 1137000 }];    //1137
                        */

  this.resetPlanets = function() {
    for(var i = 0; i<this.planet_array.length; i++) {
        this.planet_array[i].reset();
    }
   }
   
    this.presets = [];
    //Solar System
    this.presets.push({ planetArray:
        [
            {
                "name":"Sun",
                "radius":695000,
                "mass":"132750000192.00",
                "pos":{"x":0,"y":0,"z":0},
                "vel":{"x":0,"y":0,"z":0},
                "color":"yellow",
                "startpos":{"x":0,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z":0},
                "history":[],
                "renderPos":{"x":0,"y":0,"z":0}
            },
            {
                "name":"Mercury",
                "radius":2440,
                "mass":"22225",
                "pos":{"x":57900000,"y":0,"z":0},
                "vel":{"x":0,"y":0,"z":47.9},
                "color":"orange",
                "startpos":{"x":57900000,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z":47.9},
                "history":[],
                "renderPos":{"x":57900000,"y":0,"z":0}
            },
            {
                "name":"Venus",
                "radius":6050,
                "mass":"324900",
                "pos":{"x":108000000,"y":0,"z":0},
                "vel":{"x":0,"y":0,"z":35},
                "color":"yellow",
                "startpos":{"x":108000000,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z":35},
                "history":[],
                "renderPos":{"x":108000000,"y":0,"z":0}
            },
            {
                "name":"Earth",
                "radius":6378,
                "mass":"398850",
                "pos":{"x":150000000,"y":0,"z":0},
                "vel":{"x":0,"y":0,"z":29.8},
                "color":"blue",
                "startpos":{"x":150000000,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z":29.8},
                "history":[],
                "renderPos":{"x":150000000,"y":0,"z":0}
            },
            {
                "name":"Moon",
                "radius":1738,
                "mass":"4904",
                "pos":{"x":150385000,"y":0,"z":0},
                "vel":{"x":0,"y":0,"z":30.822},
                "color":"white",
                "startpos":{"x":150385000,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z":30.822},
                "history":[],
                "renderPos":{"x":150385000,"y":0,"z":0}
            },
            {
                "name":"Mars",
                "radius":3389,
                "mass":"42830",
                "pos":{"x":227900000,"y":0,"z":0},
                "vel":{"x":0,"y":0,"z":24.077},
                "color":"red",
                "startpos":{"x":227900000,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z":24.077},
                "history":[],
                "renderPos":{"x":227900000,"y":0,"z":0}
            },
            {
                "name":"Jupiter",
                "radius":71492,
                "mass":"126800000",
                "pos":{"x":778330000,"y":0,"z":0},
                "vel":{"x":0,"y":0,"z": 13.1},
                "color":"orange",
                "startpos":{"x":778330000,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z": 13.1},
                "history":[],
                "renderPos":{"x":778330000,"y":0,"z":0}
            },
            {
                "name":"Saturn",
                "radius":60268,
                "mass":"37960000",
                "pos":{"x":1429400000,"y":0,"z":0},
                "vel":{"x":0,"y":0,"z": 9.64},
                "color":"yellow",
                "startpos":{"x":1429400000,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z": 9.64},
                "history":[],
                "renderPos":{"x":1429400000,"y":0,"z":0}
            },
            {
                "name":"Uranus",
                "radius":25559
                "mass":"5797000",
                "pos":{"x":2870990000,"y":0,"z":0},
                "vel":{"x":0,"y":0,"z": 6.81},
                "color":"cyan",
                "startpos":{"x":2870990000,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z": 6.81},
                "history":[],
                "renderPos":{"x":2870990000,"y":0,"z":0}
            },
            {
                "name":"Neptune",
                "radius":24746,
                "mass":"6954000",
                "pos":{"x":4504300000,"y":0,"z":0},
                "vel":{"x":0,"y":0,"z": 5.43},
                "color":"blue",
                "startpos":{"x":4504300000,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z": 5.43},
                "history":[],
                "renderPos":{"x":4504300000,"y":0,"z":0}
            },
            {
                "name":"Pluto",
                "radius":1137,
                "mass":"8476.2",
                "pos":{"x":5913520000,"y":0,"z":0},
                "vel":{"x":0,"y":0,"z": 4.74},
                "color":"white",
                "startpos":{"x":5913520000,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z": 4.74},
                "history":[],
                "renderPos":{"x":5913520000,"y":0,"z":0}
            }
        ]}
    );
    //binary system
    this.presets.push({ planetArray:
        [
            {
                "name":"Sun",
                "radius":10,
                "mass":"132750000192.00",
                "pos":{"x":57900000,"y":0,"z":23.94},
                "vel":{"x":0,"y":0,"z":0},
                "color":"yellow",
                "startpos":{"x":57900000,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z":23.94},
                "history":[],
                "renderPos":{"x":57900000,"y":0,"z":0}
            },
            {
                "name":"Sun 2",
                "radius":10,
                "mass":"132750000192.00",
                "pos":{"x":-57900000,"y":0,"z":-23.94},
                "vel":{"x":0,"y":0,"z":0},
                "color":"orange",
                "startpos":{"x":-57900000,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z":-23.94},
                "history":[],
                "renderPos":{"x":-57900000,"y":0,"z":0}
            },
            {
                "name":"Earth",
                "radius":10,
                "mass":926902.44,
                "pos":{"x":535999999.99999994,"y":0,"z":-13999999.999999998},
                "vel":{"x":0.5778253187427369,"y":0,"z":22.122455060436213},
                "color":"cyan",
                "startpos":{"x":535999999.99999994,"y":0,"z":-13999999.999999998},
                "startvel":{"x":0.5778253187427369,"y":0,"z":22.122455060436213},
                "history":[],
                "renderPos":{"x":268,"y":0,"z":-7}
            }
        ]}
    );
}