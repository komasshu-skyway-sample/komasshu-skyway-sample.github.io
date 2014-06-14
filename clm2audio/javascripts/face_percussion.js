"use strict";

var FacePercussion;

(function(global){
	var  vid = document.getElementById('analyze')
		, canvas = document.querySelector("canvas#overlay")
		, ctx = canvas.getContext('2d')
	
  FacePercussion = function(){
    this.ctrack = new clm.tracker({useWebGL: true});
    this.ctrack.init(pModel);
    this.fw;
    this.mh;
    this.invert = false;
  }

  FacePercussion.prototype = new EventEmitter2();

  FacePercussion.prototype.start = function(stream){
    var url = window.URL.createObjectURL(stream);
    vid.src = url;
    vid.play();

    setTimeout(function(ev){
      this.ctrack.start(vid);
      this.drawLoop();
    }.bind(this), 500);
  }

	FacePercussion.prototype.drawLoop = function() {
    var loop_ = function(){
		  requestAnimationFrame(loop_);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.ctrack.draw(canvas);

      var pos = this.ctrack.getCurrentPosition();

      if(!!pos) {
        this.fw = Math.floor(pos[14][0] - pos[0][0])
        this.mh = Math.floor(pos[57][1] - pos[60][1])
        if(this.mh > 10) {
          this.emit('detect', {"type": "mouth-open"});

          this.invert = true;

          setTimeout(function(){
            this.invert = false;
          }.bind(this), 300)
        }

        if(this.mh < 5) {
          this.emit('detect', {"type": "mouth-close"});
        }
      }


      if(!!pos){
        this.emit('facewidth', {"width": this.fw});

        if(!!this.invert === false) {
          $("#analyze").css("-webkit-filter", "brightness("+(this.fw*1.5)+"%)")
        } else {
          $("#analyze").css("-webkit-filter", "invert()")
        }

      }
    }.bind(this);
    loop_();
	}


}(window));
