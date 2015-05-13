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
    var jsonString = JSON.stringify(engine.orbit_data.planet_array);
    console.log("Storing: "+jsonString);
    storage["planetList"] = jsonString;
    return storage;
}


//Allows for loading of planet data.
//loadingState should be true if loading state and false if loading setup
engine.loadData = function(inputData, loadingState){ 
    //engine.id("loadSetup").disabled = true;
    //engine.id("loadState").disabled = true;
    //engine.id("import").disabled = true;
    if(inputData["planetList"] != undefined){
        console.log("Loading: "+inputData["planetList"]);
        var planetList = JSON.parse(inputData["planetList"]);
        for(i in planetList){
            var p = planetList[i];
            var pos = new Cart3(p.pos.x, p.pos.y, p.pos.z);
            var vel = new Cart3(p.vel.x, p.vel.y, p.vel.z);
            var startpos = new Cart3(p.startpos.x, p.startpos.y, p.startpos.z);
            var startvel = new Cart3(p.startvel.x, p.startvel.y, p.startvel.z);
            var history = [];
            for(j in p.history) {
                var entry = p.history[j];
                history.push(new Cart3(entry.x, entry.y, entry.z));
            }
            var planet = new OrbitBody(p.name, p.radius, pos, vel, p.mass, p.color);
            planet.startpos = startpos;
            planet.startvel = startvel;
            planet.history = history;
            engine.orbit_data.planet_array.push(planet);
        }
    } else {
        engine.log("You have no saved data!")
    }
    if(loadingState) {
        engine.perform(true);
    } else {
        engine.reset();
    }
}

//exports the data to a readable file
engine.exportData = function(){
    var textToWrite = JSON.stringify(engine.saveData({}));

    var textFileAsBlob = new Blob([textToWrite], {type:'text/JSON'});
    var filename = engine.id("filename").value;

    var downloadLink = document.createElement("a");
    downloadLink.download = "OrbitData.json";
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
