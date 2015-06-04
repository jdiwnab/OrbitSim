engine.startRecord = function() {
    engine.id('record').textContent = 'Stop Rec';
    engine.recording = true;
    engine.recFrame = -1;
    engine.encoder = new GIF({wokers:4, quality: 10, width: engine.xsize, height: engine.ysize, workerScript: 'lib/gifjs/gif.worker.js'});

    engine.encoder.on('finished', function(blob) {
        engine.saveGif(blob);
    });
    engine.encoder.on('progress', function(p) {
        engine.log('encoding ('+Math.ceil(p*100)+'%)');
    });

}

engine.recordFrame = function(status) {
    if(engine.recording) {
        engine.encoder.addFrame(engine.ctx, {copy: true, delay: 13});
    }
}

engine.stopRecord = function() {
    engine.id('record').textContent = 'Record';
    engine.recording = false;
    engine.encoder.render();
}
engine.saveGif = function(bin_data) {
    var downloadLink = document.createElement("a");
    downloadLink.download = "OrbitAnimation.gif";
    downloadLink.innerHTML = "Download File";
    if (window.URL != null)
    {
        downloadLink.href = window.URL.createObjectURL(bin_data);
    }
    else
    {
        downloadLink.href = window.URL.createObjectURL(bin_data);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }
    downloadLink.click();
}