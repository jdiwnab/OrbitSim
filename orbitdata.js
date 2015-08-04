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
                "mass":132750000192.00,
                "pos":{"x":0,"y":0,"z":0},
                "vel":{"x":0,"y":0,"z":0},
                "color":"yellow",
                "startpos":{"x":0,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z":0},
            },
            {
                "name":"Mercury",
                "radius":2440,
                "mass":22225,
                "pos":{"x":57900000,"y":0,"z":0},
                "vel":{"x":0,"y":0,"z":47.9},
                "color":"orange",
                "startpos":{"x":57900000,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z":47.9},
            },
            {
                "name":"Venus",
                "radius":6050,
                "mass":324900,
                "pos":{"x":108000000,"y":0,"z":0},
                "vel":{"x":0,"y":0,"z":35},
                "color":"yellow",
                "startpos":{"x":108000000,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z":35},
            },
            {
                "name":"Earth",
                "radius":6378,
                "mass":398850,
                "pos":{"x":150000000,"y":0,"z":0},
                "vel":{"x":0,"y":0,"z":29.8},
                "color":"blue",
                "startpos":{"x":150000000,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z":29.8},
            },
            {
                "name":"Moon",
                "radius":1738,
                "mass":4904,
                "pos":{"x":150385000,"y":0,"z":0},
                "vel":{"x":0,"y":0,"z":30.822},
                "color":"white",
                "startpos":{"x":150385000,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z":30.822},
            },
            {
                "name":"Mars",
                "radius":3389,
                "mass":42830,
                "pos":{"x":227900000,"y":0,"z":0},
                "vel":{"x":0,"y":0,"z":24.077},
                "color":"red",
                "startpos":{"x":227900000,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z":24.077},
            },
            {
                "name":"Jupiter",
                "radius":71492,
                "mass":126800000,
                "pos":{"x":778330000,"y":0,"z":0},
                "vel":{"x":0,"y":0,"z": 13.1},
                "color":"orange",
                "startpos":{"x":778330000,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z": 13.1},
            },
            {
                "name":"Saturn",
                "radius":60268,
                "mass":37960000,
                "pos":{"x":1429400000,"y":0,"z":0},
                "vel":{"x":0,"y":0,"z": 9.64},
                "color":"yellow",
                "startpos":{"x":1429400000,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z": 9.64},
            },
            {
                "name":"Uranus",
                "radius":25559,
                "mass":5797000,
                "pos":{"x":2870990000,"y":0,"z":0},
                "vel":{"x":0,"y":0,"z": 6.81},
                "color":"cyan",
                "startpos":{"x":2870990000,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z": 6.81},
            },
            {
                "name":"Neptune",
                "radius":24746,
                "mass":6954000,
                "pos":{"x":4504300000,"y":0,"z":0},
                "vel":{"x":0,"y":0,"z": 5.43},
                "color":"blue",
                "startpos":{"x":4504300000,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z": 5.43},
            },
            {
                "name":"Pluto",
                "radius":1137,
                "mass":8476.2,
                "pos":{"x":5913520000,"y":0,"z":0},
                "vel":{"x":0,"y":0,"z": 4.74},
                "color":"white",
                "startpos":{"x":5913520000,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z": 4.74},
            }
        ]}
    );
    //binary system
    this.presets.push({ planetArray:
        [
            {
                "name":"Sun",
                "radius":695000,
                "mass":132750000192.00,
                "pos":{"x":57900000,"y":0,"z":23.94},
                "vel":{"x":0,"y":0,"z":0},
                "color":"yellow",
                "startpos":{"x":57900000,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z":23.94},
            },
            {
                "name":"Sun 2",
                "radius":695000,
                "mass":132750000192.00,
                "pos":{"x":-57900000,"y":0,"z":-23.94},
                "vel":{"x":0,"y":0,"z":0},
                "color":"orange",
                "startpos":{"x":-57900000,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z":-23.94},
            },
            {
                "name":"Earth",
                "radius":6378,
                "mass":926902.44,
                "pos":{"x":536182804.55,"y":0,"z":0},
                "vel":{"x":0,"y":0,"z":22.13},
                "color":"cyan",
                "startpos":{"x":536182804.55,"y":0,"z":0},
                "startvel":{"x":0,"y":0,"z":22.13},
            }
        ]}
    );
    //Fixed stars
    this.presets.push({ planetArray: 
        [
            {
                "name":"Sun1",
                "radius":600000,
                "mass":132750000192,
                "pos":{"x":0,"y":0,"z":0,"timestamp":0},
                "vel":{"x":0,"y":0,"z":0,"timestamp":0},
                "color":"yellow",
                "startpos":{"x":0,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":0,"y":0,"z":0,"timestamp":0},
                "fixed":true,
            },
            {
                "name":"Sun2",
                "radius":600000,
                "mass":132750000192,
                "pos":{"x":254166667.27,"y":0,"z":0,"timestamp":0},
                "vel":{"x":0,"y":0,"z":0,"timestamp":0},
                "color":"orange",
                "startpos":{"x":254166667.27,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":0,"y":0,"z":0,"timestamp":0},
                "fixed":true,
            },
            {
                "name":"Earth",
                "radius":6000,
                "mass":782981.08,
                "pos":{"x":-162583444.55,"y":0,"z":0,"timestamp":0},
                "vel":{"x":0,"y":0,"z":-30.5,"timestamp":0},
                "color":"blue",
                "startpos":{"x":-162583444.55,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":0,"y":0,"z":-24.105,"timestamp":0},
                "fixed":false,
            }
        ]
    });
   
    this.presets.push( { planetArray:
        [
            {
                "name":"Sun",
                "radius":60000,
                "mass":132750000000,
                "pos":{"x":0,"y":0,"z":0,"timestamp":0},
                "vel":{"x":0,"y":0,"z":0,"timestamp":0},
                "color":"yellow",
                "startpos":{"x":0,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":0,"y":0,"z":0,"timestamp":0},
                "startmass":132750000000,
                "startrad":60000,
                "history":[{"x":0,"y":0,"z":0,"timestamp":0}],
                "fixed":false
            },
            {
                "name":"Earth",
                "radius":6000,
                "mass":500000,
                "pos":{"x":200000000,"y":0,"z":0,"timestamp":0},
                "vel":{"x":0,"y":0,"z":25.763346055976502,"timestamp":0},
                "color":"blue",
                "startpos":{"x":200000000,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":0,"y":0,"z":25.763346055976502,"timestamp":0},
                "startmass":500000,
                "startrad":6000,
                "history":[{"x":200000000,"y":0,"z":0,"timestamp":0}],
                "fixed":false
            },{
                "name":"L1",
                "radius":6000,
                "mass":1,
                "pos":{"x":197851543.09103182,"y":0,"z":0,"timestamp":0},
                "vel":{"x":0,"y":0,"z":25.486636859113293,"timestamp":0},
                "color":"red",
                "startpos":{"x":197851543.09103182,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":0,"y":0,"z":25.486636859113293,"timestamp":0},
                "startmass":1,
                "startrad":6000,
                "history":[{"x":197851543.09103182,"y":0,"z":0,"timestamp":0}],
                "fixed":false
            },{
                "name":"L2",
                "radius":6000,
                "mass":1,
                "pos":{"x":202166652.23797315,"y":0,"z":0,"timestamp":0},
                "vel":{"x":0,"y":0,"z":26.042496157036133,"timestamp":0},
                "color":"green",
                "startpos":{"x":202166652.23797315,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":0,"y":0,"z":26.042496157036133,"timestamp":0},
                "startmass":1,
                "startrad":6000,
                "history":[{"x":202166652.23797315,"y":0,"z":0,"timestamp":0}],
                "fixed":false
            },{
                "name":"L3",
                "radius":6000,
                "mass":1,
                "pos":{"x":-199999560.5791816,"y":0,"z":0,"timestamp":0},
                "vel":{"x":0,"y":0,"z":-25.76333796961365,"timestamp":0},
                "color":"orange",
                "startpos":{"x":-199999560.5791816,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":0,"y":0,"z":-25.76333796961365,"timestamp":0},
                "startmass":1,
                "startrad":6000,
                "history":[{"x":-199999560.5791816,"y":0,"z":0,"timestamp":0}],
                "fixed":false
            },{
                "name":"L4",
                "radius":6000,
                "mass":1,
                "pos":{"x":100000000.00000001,"y":0,"z":-173205080.75688773,"timestamp":0},
                "vel":{"x":22.311712170965276,"y":0,"z":12.88167302798825,"timestamp":0},
                "color":"magenta",
                "startpos":{"x":100000000.00000001,"y":0,"z":-173205080.75688773,"timestamp":0},
                "startvel":{"x":22.311712170965276,"y":0,"z":12.88167302798825,"timestamp":0},
                "startmass":1,
                "startrad":6000,
                "history":[{"x":100000000.00000001,"y":0,"z":-173205080.75688773,"timestamp":0}],
                "fixed":false
            },{
                "name":"L5",
                "radius":6000,
                "mass":1,
                "pos":{"x":100000000.00000001,"y":0,"z":173205080.75688773,"timestamp":0},
                "vel":{"x":-22.311712170965276,"y":0,"z":12.88167302798825,"timestamp":0},
                "color":"cyan",
                "startpos":{"x":100000000.00000001,"y":0,"z":173205080.75688773,"timestamp":0},
                "startvel":{"x":-22.311712170965276,"y":0,"z":12.88167302798825,"timestamp":0},
                "startmass":1,
                "startrad":6000,
                "history":[{"x":100000000.00000001,"y":0,"z":173205080.75688773,"timestamp":0}],
                "fixed":false
            }
        ]
    });
    
    //3 body figure 8
    this.presets.push( { planetArray:
        [
            {
                "name":"Star 1",
                "radius":300000,
                "mass":10000000000,
                "pos":{"x":97004360,"y":0,"z":-24308753,"timestamp":0},
                "vel":{"x":4.66203685,"y":0,"z":4.3236573,"timestamp":0},
                "color":"blue",
                "startpos":{"x":97004360,"y":0,"z":-24308753,"timestamp":0},
                "startvel":{"x":4.66203685,"y":0,"z":4.3236573,"timestamp":0},
                "fixed":false
            },
            {
                "name":"Star 2",
                "radius":300000,
                "mass":10000000000,
                "pos":{"x":-97004360,"y":0,"z":24308753,"timestamp":0},
                "vel":{"x":4.66203685,"y":0,"z":4.3236573,"timestamp":0},
                "color":"green",
                "startpos":{"x":-97004360,"y":0,"z":24308753,"timestamp":0},
                "startvel":{"x":4.66203685,"y":0,"z":4.3236573,"timestamp":0},
                "fixed":false
            },
            {
                "name":"Star 3",
                "radius":300000,
                "mass":10000000000,
                "pos":{"x":0,"y":0,"z":0,"timestamp":0},
                "vel":{"x":-9.32407370,"y":0,"z":-8.6473146,"timestamp":0},
                "color":"red",
                "startpos":{"x":0,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":-9.32407370,"y":0,"z":-8.6473146,"timestamp":0},
                "fixed":false
            }
        ]
    });
    //butterfly I
    this.presets.push( { planetArray:
        [
            {
                "name":"Star 1",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":-10000000,"y":0,"z":0,"timestamp":0},
                "vel":{"x":0.30689,"y":0,"z":0.12551,"timestamp":0},
                "color":"blue",
                "startpos":{"x":-10000000,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":0.30689,"y":0,"z":0.12551,"timestamp":0},
                "fixed":false
            },
            {
                "name":"Star 2",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":10000000,"y":0,"z":0,"timestamp":0},
                "vel":{"x":0.30689,"y":0,"z":0.12551,"timestamp":0},
                "color":"green",
                "startpos":{"x":10000000,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":0.30689,"y":0,"z":0.12551,"timestamp":0},
                "fixed":false
            },
            {
                "name":"Star 3",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":0,"y":0,"z":0,"timestamp":0},
                "vel":{"x":-0.61378,"y":0,"z":-0.25102,"timestamp":0},
                "color":"red",
                "startpos":{"x":0,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":-0.61378,"y":0,"z":-0.25102,"timestamp":0},
                "fixed":false
            }
        ]
    });
    //butterfly II
    this.presets.push( { planetArray:
        [
            {
                "name":"Star 1",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":-10000000,"y":0,"z":0,"timestamp":0},
                "vel":{"x":0.39295,"y":0,"z":0.09758,"timestamp":0},
                "color":"blue",
                "startpos":{"x":-10000000,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":0.39295,"y":0,"z":0.09758,"timestamp":0},
                "fixed":false
            },
            {
                "name":"Star 2",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":10000000,"y":0,"z":0,"timestamp":0},
                "vel":{"x":0.39295,"y":0,"z":0.09758,"timestamp":0},
                "color":"green",
                "startpos":{"x":10000000,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":0.39295,"y":0,"z":0.09758,"timestamp":0},
                "fixed":false
            },
            {
                "name":"Star 3",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":0,"y":0,"z":0,"timestamp":0},
                "vel":{"x":-0.78590,"y":0,"z":-0.19516,"timestamp":0},
                "color":"red",
                "startpos":{"x":0,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":-0.78590,"y":0,"z":-0.19516,"timestamp":0},
                "fixed":false
            }
        ]
    });
    //bumblebee
    this.presets.push( { planetArray:
        [
            {
                "name":"Star 1",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":-10000000,"y":0,"z":0,"timestamp":0},
                "vel":{"x":0.18428,"y":0,"z":0.58719,"timestamp":0},
                "color":"blue",
                "startpos":{"x":-10000000,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":0.18428,"y":0,"z":0.58719,"timestamp":0},
                "fixed":false
            },
            {
                "name":"Star 2",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":10000000,"y":0,"z":0,"timestamp":0},
                "vel":{"x":0.18428,"y":0,"z":0.58719,"timestamp":0},
                "color":"green",
                "startpos":{"x":10000000,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":0.18428,"y":0,"z":0.58719,"timestamp":0},
                "fixed":false
            },
            {
                "name":"Star 3",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":0,"y":0,"z":0,"timestamp":0},
                "vel":{"x":-0.36856,"y":0,"z":-1.17438,"timestamp":0},
                "color":"red",
                "startpos":{"x":0,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":-0.36856,"y":0,"z":-1.17438,"timestamp":0},
                "fixed":false
            }
        ]
    });
    //Moth I
    this.presets.push( { planetArray:
        [
            {
                "name":"Star 1",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":-10000000,"y":0,"z":0,"timestamp":0},
                "vel":{"x":0.46444,"y":0,"z":0.39606,"timestamp":0},
                "color":"blue",
                "startpos":{"x":-10000000,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":0.46444,"y":0,"z":0.39606,"timestamp":0},
                "fixed":false
            },
            {
                "name":"Star 2",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":10000000,"y":0,"z":0,"timestamp":0},
                "vel":{"x":0.46444,"y":0,"z":0.39606,"timestamp":0},
                "color":"green",
                "startpos":{"x":10000000,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":0.46444,"y":0,"z":0.39606,"timestamp":0},
                "fixed":false
            },
            {
                "name":"Star 3",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":0,"y":0,"z":0,"timestamp":0},
                "vel":{"x":-0.92888,"y":0,"z":-0.79212,"timestamp":0},
                "color":"red",
                "startpos":{"x":0,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":-0.92888,"y":0,"z":-0.79212,"timestamp":0},
                "fixed":false
            }
        ]
    });
    //Moth II
    this.presets.push( { planetArray:
        [
            {
                "name":"Star 1",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":-10000000,"y":0,"z":0,"timestamp":0},
                "vel":{"x":0.43917,"y":0,"z":0.45297,"timestamp":0},
                "color":"blue",
                "startpos":{"x":-10000000,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":0.43917,"y":0,"z":0.45297,"timestamp":0},
                "fixed":false
            },
            {
                "name":"Star 2",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":10000000,"y":0,"z":0,"timestamp":0},
                "vel":{"x":0.43917,"y":0,"z":0.45297,"timestamp":0},
                "color":"green",
                "startpos":{"x":10000000,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":0.43917,"y":0,"z":0.45297,"timestamp":0},
                "fixed":false
            },
            {
                "name":"Star 3",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":0,"y":0,"z":0,"timestamp":0},
                "vel":{"x":-0.87834,"y":0,"z":-0.90594,"timestamp":0},
                "color":"red",
                "startpos":{"x":0,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":-0.87834,"y":0,"z":-0.90594,"timestamp":0},
                "fixed":false
            }
        ]
    });
    //Butterfly III
    this.presets.push( { planetArray:
        [
            {
                "name":"Star 1",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":-10000000,"y":0,"z":0,"timestamp":0},
                "vel":{"x":0.40592,"y":0,"z":0.23016,"timestamp":0},
                "color":"blue",
                "startpos":{"x":-10000000,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":0.40592,"y":0,"z":0.23016,"timestamp":0},
                "fixed":false
            },
            {
                "name":"Star 2",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":10000000,"y":0,"z":0,"timestamp":0},
                "vel":{"x":0.40592,"y":0,"z":0.23016,"timestamp":0},
                "color":"green",
                "startpos":{"x":10000000,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":0.40592,"y":0,"z":0.23016,"timestamp":0},
                "fixed":false
            },
            {
                "name":"Star 3",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":0,"y":0,"z":0,"timestamp":0},
                "vel":{"x":-0.81184,"y":0,"z":-0.46032,"timestamp":0},
                "color":"red",
                "startpos":{"x":0,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":-0.81184,"y":0,"z":-0.46032,"timestamp":0},
                "fixed":false
            }
        ]
    });
    //Moth III
    this.presets.push( { planetArray:
        [
            {
                "name":"Star 1",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":-10000000,"y":0,"z":0,"timestamp":0},
                "vel":{"x":0.38344,"y":0,"z":0.37736,"timestamp":0},
                "color":"blue",
                "startpos":{"x":-10000000,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":0.38344,"y":0,"z":0.37736,"timestamp":0},
                "fixed":false
            },
            {
                "name":"Star 2",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":10000000,"y":0,"z":0,"timestamp":0},
                "vel":{"x":0.38344,"y":0,"z":0.37736,"timestamp":0},
                "color":"green",
                "startpos":{"x":10000000,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":0.38344,"y":0,"z":0.37736,"timestamp":0},
                "fixed":false
            },
            {
                "name":"Star 3",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":0,"y":0,"z":0,"timestamp":0},
                "vel":{"x":-0.76688,"y":0,"z":-0.75472,"timestamp":0},
                "color":"red",
                "startpos":{"x":0,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":-0.76688,"y":0,"z":-0.75472,"timestamp":0},
                "fixed":false
            }
        ]    
    });
    //Goggles
    this.presets.push( { planetArray:
        [
            {
                "name":"Star 1",
                "radius":300000,
                "mass":1000000000000,
                "pos":{"x":-100000000,"y":0,"z":0,"timestamp":0},
                "vel":{"x":8.330,"y":0,"z":12.789,"timestamp":0},
                "color":"blue",
                "startpos":{"x":-100000000,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":8.330,"y":0,"z":12.789,"timestamp":0},
                "fixed":false
            },
            {
                "name":"Star 2",
                "radius":300000,
                "mass":1000000000000,
                "pos":{"x":100000000,"y":0,"z":0,"timestamp":0},
                "vel":{"x":8.330,"y":0,"z":12.789,"timestamp":0},
                "color":"green",
                "startpos":{"x":100000000,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":8.330,"y":0,"z":12.789,"timestamp":0},
                "fixed":false
            },
            {
                "name":"Star 3",
                "radius":300000,
                "mass":1000000000000,
                "pos":{"x":0,"y":0,"z":0,"timestamp":0},
                "vel":{"x":-16.660,"y":0,"z":-25.578,"timestamp":0},
                "color":"red",
                "startpos":{"x":0,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":-16.660,"y":0,"z":-25.578,"timestamp":0},
                "fixed":false
            }
        ]
    });
    // dragonfly
    this.presets.push( { planetArray:
        [
            {
                "name":"Star 1",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":-10000000,"y":0,"z":0,"timestamp":0},
                "vel":{"x":0.08058,"y":0,"z":0.58884,"timestamp":0},
                "color":"blue",
                "startpos":{"x":-10000000,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":0.08058,"y":0,"z":0.58884,"timestamp":0},
                "fixed":false
            },
            {
                "name":"Star 2",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":10000000,"y":0,"z":0,"timestamp":0},
                "vel":{"x":0.08058,"y":0,"z":0.58884,"timestamp":0},
                "color":"green",
                "startpos":{"x":10000000,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":0.08058,"y":0,"z":0.58884,"timestamp":0},
                "fixed":false
            },
            {
                "name":"Star 3",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":0,"y":0,"z":0,"timestamp":0},
                "vel":{"x":-0.16116,"y":0,"z":-1.17768,"timestamp":0},
                "color":"red",
                "startpos":{"x":0,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":-0.16116,"y":0,"z":-1.17768,"timestamp":0},
                "fixed":false
            }
        ]    
    });
    //yarn
    this.presets.push( { planetArray:
        [
            {
                "name":"Star 1",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":-10000000,"y":0,"z":0,"timestamp":0},
                "vel":{"x":0.55906,"y":0,"z":0.34919,"timestamp":0},
                "color":"blue",
                "startpos":{"x":-10000000,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":0.55906,"y":0,"z":0.34919,"timestamp":0},
                "fixed":false
            },
            {
                "name":"Star 2",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":10000000,"y":0,"z":0,"timestamp":0},
                "vel":{"x":0.55906,"y":0,"z":0.34919,"timestamp":0},
                "color":"green",
                "startpos":{"x":10000000,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":0.55906,"y":0,"z":0.34919,"timestamp":0},
                "fixed":false
            },
            {
                "name":"Star 3",
                "radius":10000,
                "mass":10000000,
                "pos":{"x":0,"y":0,"z":0,"timestamp":0},
                "vel":{"x":-1.11812,"y":0,"z":-0.69838,"timestamp":0},
                "color":"red",
                "startpos":{"x":0,"y":0,"z":0,"timestamp":0},
                "startvel":{"x":-1.11812,"y":0,"z":-0.69838,"timestamp":0},
                "fixed":false
            }
        ]
    });
}
