"use strict";

var MyAudio;

/* assume that g_audioctx has declared */

(function(global){
  MyAudio = function(options) {
    if(!options.file) throw "file must be specified";

    this.options = options;
    this.canplay = true;


    LoadSample(g_audioctx, this.options.file, function(buffer) {
      this.buffer = buffer;
    }.bind(this));
  }

  MyAudio.prototype = new EventEmitter2();

  MyAudio.prototype.play = function(flag){
    if(this.timer) {
      clearInterval(this.timer);
    }

    if(this.canplay || flag) {

      this.src = g_audioctx.createBufferSource();
      this.src.buffer = this.buffer;
      this.gain = g_audioctx.createGain();
      this.gain.gain.value = 15;

      if(this.options.analyzer) {
        this.analyzer = g_audioctx.createAnalyser();

        this.src.connect(this.analyzer);
        this.analyzer.connect(this.gain);
        this.gain.connect(g_audioctx.destination);
      } else {
        this.src.connect(this.gain);
        this.gain.connect(g_audioctx.destination);
      }

      this.src.start(0);

      if(this.options.analyzer) {
        var buffer = new Uint8Array(this.analyzer.frequencyBinCount);
        this.timer = setInterval(function(ev){
          this.analyzer.getByteFrequencyData(buffer);
          this.emit("freq", {"data": buffer});
        }.bind(this), 200);
      }
    }
  }

  MyAudio.prototype.enable = function(){
    this.canplay = true;
  }

  MyAudio.prototype.disable = function(){
    this.canplay = false;
  }

  MyAudio.prototype.checkEnable = function(){
    return this.canplay;
  }

  MyAudio.prototype.changeGain = function(val) {
    if(this.gain) this.gain.gain.value = val;
  }

}(window))
