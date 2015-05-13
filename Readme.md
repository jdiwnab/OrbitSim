# Orbit Simulator
[View Simulator](http://jdiwnab.github.io/OrbitSim/Orbit.html)

## Overview
There use to be a nifty orbit simulator for Mac Sytem 6 or so. It let users input an arbitrary system, then it would simulate how the planets and stars would orbit each other. It was all black and white, and was rather limited. But it was always fun to try and create the most complicated but stable system you could. I remember this program fondly, but can't find it anywhere. Nor can I find such an easy to use simulator like it.

This is my attempt to create an orbit simulator that is intuitive, easy to use and fun, while remaining as accurate as possible.

## Details
This simulator uses a Runge-Kutta algorithm to simulate gravity. This has shown to be the most accurate and fastest algorithm tested. Also implemented, but not used or exposed are Euler and Verlet integration.

The code supports a 3D simulation, but display an input are limited to 2 dimentions at this time.

By default, new objects are created at the distance from the center that was clicked, and given a speed to make a circular orbit, assuming a single star at the center point as the first object. Values can be modified to suite, but this seemed like a good estimate to start.

It is capable of storing the current state into your browser's Local Storage, or exporting to a JSON file. You can then choose to load the state or setup from either the last local store, or a selected JSON file. State loads all the history and places the object at the last location. Setup loads the objects and places them in their initial locations without history. Note that no data is sent for either local storage or file storage to a remote server. All remains local to your browser.
