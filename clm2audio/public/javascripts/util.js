"use strict";

function LoadSample(ctx, url, cb /* callback */) {
  var req = new XMLHttpRequest();

  req.open("GET", url, true);
  req.responseType = "arraybuffer";

  req.onload = function() {
    if(req.response) {
      ctx.decodeAudioData(req.response,function(buffer){
        cb(buffer);
      },function(){});
    } else {
      var buffer = ctx.createBuffer(VBArray(req.responseBody).toArray(), false);
      cb(buffer);
    }
  }

  req.send();
}

