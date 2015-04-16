//Remove Planet Data from LocalStorage while preserving anything else stored there
engine.removePlanetData = function(){
    for(i in localStorage){
        if(i.indexOf("planet") == 0){
            localStorage.removeItem(i);
        }
    }
}

//Single save function that handles saving setup and saving state
engine.saveData = function(storage){
    engine.removePlanetData();
    var planetList = [];
    for(i in orbit_data.planet_array){ 
        storage["planet "+i+" name"] = orbit_data.planet_array[i].name;
        storage["planet "+i+" radius"] = orbit_data.planet_array[i].radius;
        storage["planet "+i+" mass"] = orbit_data.planet_array[i].mass;
        storage["planet "+i+" color"] = orbit_data.planet_array[i].color;
        storage["planet "+i+" posx"] = orbit_data.planet_array[i].pos.x;
        storage["planet "+i+" posy"] = orbit_data.planet_array[i].pos.y;
        storage["planet "+i+" posz"] = orbit_data.planet_array[i].pos.z;
        storage["planet "+i+" velx"] = orbit_data.planet_array[i].vel.x;
        storage["planet "+i+" vely"] = orbit_data.planet_array[i].vel.y;
        storage["planet "+i+" velz"] = orbit_data.planet_array[i].vel.z;
        storage["planet "+i+" startpos"] = orbit_data.planet_array[i].startpos.x;
        storage["planet "+i+" startvel"] = orbit_data.planet_array[i].startvel.z;
        planetList.push("planet "+i);
    }
    storage["planetList"] = JSON.stringify(planetList);
    return storage;
}


//Allows for loading of planet data.
//loadingState should be true if loading state and false if loading setup
engine.loadData = function(inputData, loadingState){ 
    engine.id("loadSetup").disabled = true;
    engine.id("loadState").disabled = true;
    engine.id("import").disabled = true;
    if(inputData["planetList"] != undefined){
        var planetList = JSON.parse(inputData["planetList"]);
        for(p in planetList){
            if(loadingState){
                engine.updateFromLoad(
                    inputData[planetList[p]+" name"],
                    inputData[planetList[p]+" radius"],
                    inputData[planetList[p]+" mass"],
                    inputData[planetList[p]+" startpos"],
                    inputData[planetList[p]+" posx"],
                    inputData[planetList[p]+" posy"],
                    inputData[planetList[p]+" posz"], 
                    inputData[planetList[p]+" startvel"],
                    inputData[planetList[p]+" velx"],
                    inputData[planetList[p]+" vely"],
                    inputData[planetList[p]+" velz"],
                    inputData[planetList[p]+" color"]
                );
            } else{
                engine.updateFromLoad(
                    inputData[planetList[p]+" name"],
                    inputData[planetList[p]+" radius"],
                    inputData[planetList[p]+" mass"],
                    inputData[planetList[p]+" startpos"],
                    inputData[planetList[p]+" startpos"], //set posx to startpos
                    0,
                    0, 
                    inputData[planetList[p]+" startvel"],
                    0,
                    0,
                    inputData[planetList[p]+" startvel"], //set velz to startVel
                    inputData[planetList[p]+" color"]
                );
            }
        }
    } else {
        console.log("You have no saved data!")
    }
}


//basically a copy of the engine.addBody function with the unnecessary bits removed and allowing extra arguments
engine.updateFromLoad = function(name, radius, mass, startpos, posx, posy, posz, startvel, velx, vely, velz, color) {
    //The following lines are a way of implementing default arguments
    engine.animate = false;
    var body = new OrbitBody(name, parseFloat(radius), new Cart3(parseFloat(posx),parseFloat(posy),parseFloat(posz)), new Cart3(parseFloat(velx),parseFloat(vely),parseFloat(velz)), parseFloat(mass), color);
    orbit_data.planet_array.push(body);
    orbit_data.addToTable(body);
    engine.reset();
}

//exports the data to a readable file
engine.exportData = function(){
    var textToWrite = JSON.stringify(engine.saveData({}));

    var textFileAsBlob = new Blob([textToWrite], {type:'text/JSON'});
    var filename = engine.id("filename").value;

    var downloadLink = document.createElement("a");
    downloadLink.download = ((!filename.trim()) ? ("OrbitData") : (filename) ) +".json";
    downloadLink.innerHTML = "Download File";
    if (window.URL != null)
    {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    }
    else
    {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }
    downloadLink.click();
}

//imports data from a file
engine.importData = function(){

    var file = engine.id("import").files[0];
    var reader = new FileReader();

    //necessary due to asynchronous race condition stuff
    reader.onload = function(e) {
        var text = JSON.parse(reader.result);
        engine.loadData(text, engine.id("stateOption").checked);
    }
    
    reader.readAsText(file);
}
