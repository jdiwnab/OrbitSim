engine.startRecord = function() {
    engine.id('record').textContent = 'Stop Rec';
    engine.recording = true;
    engine.recFrame = 0;
    //engine.encoder = new GIFEncoder();
    //engine.encoder.setRepeat(0);
    //engine.encoder.setDelay(26);
    //engine.encoder.start();
  	engine.gifworker = new Worker('lib/jsgif/animWorker.js');
    engine.recordFrame('start');
    
    engine.gifworker.onmessage = function(e) {
        var frame_index = e.data['frame_index'];
        if(frame_index == 10) {
            engine.saveGif(e.data['frame_data']);
        } else {
            engine.log('recording frame '+frame_index+' of '+engine.recFrame);
            console.log('recording frame '+frame_index+' of '+engine.recFrame);
        }
    };

}

engine.recordFrame = function(status) {
    if(engine.recording) {
        //engine.encoder.addFrame(engine.ctx);
        var frameindex, framelength;
        if(status == 'stop') {
            framelength = engine.recFrame;
        } else {
            framelength = engine.recFrame +1;
        }
        engine.gifworker.postMessage({"frame_index": engine.recFrame, "delay": 26, "frame_length":framelength, "height":engine.ysize, "width":engine.xsize, "imageData":engine.ctx.getImageData(0,0,engine.xsize,engine.ysize).data});
    }
}

engine.stopRecord = function() {
    engine.id('record').textContent = 'Record';
    //engine.encoder.finish();
    engine.recordFrame('stop');
    engine.recording = false;
}
engine.saveGif = function(bin_data) {
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