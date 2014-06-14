"use strict";

// An object to manage visual division
// var Visual = function(selector){
if(typeof(webkitAudioContext)!=="undefined")
	var g_audioctx = new webkitAudioContext();
else if(typeof(AudioContext)!=="undefined")
	var g_audioctx = new AudioContext();

var Chime = {}
  , entertainer = new MyAudio({file: "./audio/entertainer.mp3", analyzer: true})
  , facePercussion = new FacePercussion()
  , connector
  , chime_type = "snare"
  , peer_type = "snare"

  Chime.snare = new MyAudio({file: "./audio/snare.wav"})
  Chime.cymbal = new MyAudio({file: "./audio/cy.mp3"})
  Chime.clap = new MyAudio({file: "./audio/clap.mp3"})
  Chime.dog = new MyAudio({file: "./audio/dog.mp3"})
  Chime.cat = new MyAudio({file: "./audio/cat.mp3"})

entertainer.on("freq", function(data){
  // console.log(data);
});

$("#showoverlay").on('click', function(){
  if($(this)[0].checked) {
    $("#overlay").fadeIn();
  } else {
    $("#overlay").fadeOut();
  }
})

$("#startosc").on("click", function(){
  entertainer.play();
  connector.send({"method": "play-sound"});
  $("#startosc").text("playing...");
})


facePercussion.on("detect", function(obj){
  switch(obj.type){
  case "mouth-open":
    if(Chime[chime_type].canplay){
      Chime[chime_type].play();
      Chime[chime_type].disable();
      connector.send({"method": "mouth-open"});
    }
    break;
  case "mouth-close":
    Chime[chime_type].enable();
    connector.send({"method": "mouth-close"});
    break;
  default:
    break;
  }
});

facePercussion.on("facewidth", function(obj){
  var w = obj.width;
  if(!!Chime[chime_type]) Chime[chime_type].changeGain(( w / 10 ) * 1.2 - 5);
  if(!!entertainer) entertainer.changeGain((w / 10) * 1.2 - 8);
});


navigator.webkitGetUserMedia({video: true, audio: false}, function(stream){
  facePercussion.start(stream);
  connector = new Connector(stream);

  connector.on("receive", function(obj){
    switch(obj.type) {
    case "stream":
      var url = window.URL.createObjectURL(obj.data);
      $("#peer-video").attr("src", url);
      $("#peer-video")[0].play();
      break;
    case "datachannel":
      switch(obj.data.method) {
      case "change-instrument":
        console.log(obj.data);
        peer_type = obj.data.value;
        $("#peer-type").text(peer_type);
        break;
      case "mouth-open":
        Chime[peer_type].changeGain(20);
        Chime[peer_type].play(true);
        $("#peer-video").css("-webkit-filter", "invert()");
        setTimeout(function(ev){
          $("#peer-video").css("-webkit-filter", "brightness(100%)");
        }, 500);

        break;
      case "play-sound":
        entertainer.play();
        $("#startosc").text("playing...");
        break;

      }
      
      break;
    default:
      break;
    }
  });

  connector.on("connected", function(){
    connector.send({"method": "change-instrument", "value": chime_type});
  });
}, function(err){
  alert(err);
})

$("select")
  .on('change.fs', function(ev){
    chime_type = this.value;
    connector.send({"method": "change-instrument", "value": chime_type});
  })
  .fancySelect({forceiOS: true})




