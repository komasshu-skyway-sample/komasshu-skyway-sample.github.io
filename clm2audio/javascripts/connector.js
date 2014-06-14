"use strict";

var Connector;

(function(global) {
  Connector = function(stream){
    var id_ = Math.random() * 10000 | 0;
    this.stream = stream;

    this.peer = new Peer(id_, {"key": "737ae99a-5d87-11e3-9c76-1506fbcc2da2"});

    this.peer.on('open', function(id){
      this.myid = id;

      var h_ = location.hash;
      if(h_ === "" || h_ === "#") {
        location.hash = "#"+id;
      } else {
        this.dial(h_.slice(1));
        this.openDataChannel(h_.slice(1));
      }
    }.bind(this));

    this.peer.on('call', function(call){
      this.call = call;
      this.call.answer(this.stream);
      this.setStream();
    }.bind(this));

    this.peer.on('connection', function(conn){
      this.conn = conn;
      this.setDC();
    }.bind(this));
  }

  Connector.prototype = new EventEmitter2();

  Connector.prototype.dial = function(peerid){
    this.call = this.peer.call(peerid, this.stream);
    this.setStream();
  }

  Connector.prototype.setStream = function(){
    this.call.on('stream', function(stream){
      this.emit('receive', {"type": "stream", "data": stream});
    }.bind(this));
  }

  Connector.prototype.openDataChannel = function(peerid){
    this.conn = this.peer.connect(peerid);
    this.conn.on('open', function() {
      this.setDC();
    }.bind(this));
  }

  Connector.prototype.setDC = function(){
    this.emit('connected');

    this.conn.on('data', function(data){
      this.emit("receive", {"type": "datachannel", "data": data});
    }.bind(this));
  }
  Connector.prototype.send = function(data){
    if(this.conn) this.conn.send(data);
  }
}(window));
