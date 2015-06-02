engine.startRecord = function() {
    engine.id('record').textContent = 'Stop Rec';
    engine.recording = true;
    //engine.encoder = new GIFEncoder();
    //engine.encoder.setRepeat(0);
    //engine.encoder.setDelay(26);
    //engine.encoder.start();
  	engine.gifworker = new Worker('lib/jsgif/animWorker.js');
    engine.recordFrame('start');

}

engine.recordFrame = function(status) {
    if(engine.recording) {
        //engine.encoder.addFrame(engine.ctx);
        var frameindex, framelength;
        if(status == 'start') {
            frameindex = 0;
            framelength = 10;
        } else if(status == 'stop') {
            frameindex = 10;
            framelength = 10;
        } else {
            frameindex = 1;
            framelength = 10;
        }
        engine.gifworker.postMessage({"frame_index": frameindex, "delay": 26, "frame_length":framelength, "height":engine.ysize, "width":engine.xsize, "imageData":engine.ctx.getImageData(0,0,engine.xsize,engine.ysize).data});
    }
}

engine.stopRecord = function() {
    engine.id('record').textContent = 'Record';
    //engine.encoder.finish();
    engine.gifworker.onmessage = function(e) {
        var bin_data = e.data['frame_data'];
        var data = 'data:image/gif;base64,'+encode64(bin_data);
        var downloadLink = document.createElement("a");
        downloadLink.download = "OrbitAnimation.gif";
        downloadLink.innerHTML = "Download File";
        if (window.URL != null)
        {
            // Chrome allows the link to be clicked
            // without actually adding it to the DOM.
            downloadLink.href = data;
        }
        else
        {
            // Firefox requires the link to be added to the DOM
            // before it can be clicked.
            downloadLink.href = data;
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
        }
    downloadLink.click();
    }
    engine.recordFrame('stop');
    engine.recording = false;
}