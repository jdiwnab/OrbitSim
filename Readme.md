# Orbit Simulator
[View Simulator](http://jdiwnab.github.io/OrbitSim/Orbit.html)

## Overview
There use to be a nifty orbit simulator for Mac Sytem 6 or so. It let users input an arbitrary system, then it would simulate how the planets and stars would orbit each other. It was all black and white, and was rather limited. But it was always fun to try and create the most complicated but stable system you could. I remember this program fondly, but can't find it anywhere. Nor can I find such an easy to use simulator like it.

This is my attempt to create an orbit simulator that is intuitive, easy to use and fun, while remaining as accurate as possible.

## Features
* Full N-body simulation in Javascript
* Play, pause and reset a simulation
* Record a simulation to an animated GIF
* Accelerate simulation either by calculating more between frames (accurate, but slower), or by skipping more time (less accurate, but fast)
* Save a simulation to your browser's Local Storage
* Save and reload a simulation via JSON files
* Export positional data to CSV for analysis
* Touch accessible
* A number of presets demonstrating capibilities
* Calculate Lagrange points (approximatly)
* Generate random objects to simulate evalution of a system
* Collisions between objects

## Details
This simulator uses a Runge-Kutta algorithm to simulate gravity. This has shown to be the most accurate and fastest algorithm tested. Also implemented, but not used or exposed are Euler and Verlet integration.

The code supports a 3D simulation, but display an input are limited to 2 dimentions at this time.

By default, new objects are created at the distance from the center that was clicked, and given a speed to make a circular orbit, assuming a single star at the center point as the first object. Values can be modified to suite, but this seemed like a good estimate to start.

It is capable of storing the current state into your browser's Local Storage, or exporting to a JSON file. You can then choose to load the state or setup from either the last local store, or a selected JSON file. State loads all the history and places the object at the last location. Setup loads the objects and places them in their initial locations without history. Note that no data is sent for either local storage or file storage to a remote server. All remains local to your browser.

## Science

### Gravitation

This simulation works by iteritivly calculating the forces on objects. Universal Gravitation says that:

![equation](http://www.sciweavers.org/tex2img.php?eq=F%20%3D%20G%20%20%5Cfrac%7BM_%7B1%7D%20%20%2B%20M_%7B2%7D%7D%7B%20r%5E%7B2%7D%20%7D%20&bc=White&fc=Black&im=jpg&fs=12&ff=arev&edit=0)

where G is the gravitational constant, M1 and M2 are masses being attacted, and r is the distance between them. Newton's second law also says:

![equation]([img]http://www.sciweavers.org/tex2img.php?eq=F%3DM_%7B1%7Da&bc=White&fc=Black&im=jpg&fs=12&ff=arev&edit=0)

or

![equation](http://www.sciweavers.org/tex2img.php?eq=a%20%3D%20%20%5Cfrac%7BF%7D%7BM_%7B1%7D%7D%20&bc=White&fc=Black&im=jpg&fs=12&ff=arev&edit=0)

so we know that the force acting on an object changes the acceleration based on the mass of the object. Therefore

![equation](http://www.sciweavers.org/tex2img.php?eq=a%20%3D%20G%20%20%5Cfrac%7BM_%7B2%7D%7D%7B%20r%5E%7B2%7D%20%7D%20&bc=White&fc=Black&im=jpg&fs=12&ff=arev&edit=0)

which means that the acceleration experinced by an object is based on the mass of the other object divided by the square of the distance between them, multiplied by a constant. Do this for every object acting on the current one, and you have the new acceleration. Update the position and velocity based on the time between calculations. 

Additionally, because the gravitational constant G is very very small, and most values in space are very very very big, values here have been scaled by G to reduce the computation needed, and the deal in smaller numbers. They are still really big, so things where scaled again further shrink numbers without loosing accuracy. So don't use these numbers to launch a space ship, or do your homework.

Easy, right?

### Simulation
The trick is the acculated error from large enough time steps. There are three methods considered for this simulator:
* Euler
 * Simple, just do the calculation at every step
* Verlet
 * Estimates a half way value to correct for some error
* Runge-Kutta
 * Estimates, based on differential equations, 4 sub steps, to correct for more error

This simulator uses the third algorithm, as it gave the best accuracy without costing in speed.

### Orbital velocity
When adding a new object, the panel is initialized with a resonable first guess of a circular orbit. This is because the velocity of a circular orbit is approximatly:

![V =  \sqrt{G  \frac{M_{sun}}{r} } ](http://mathurl.com/pmwtd4y)

### Lagrange


