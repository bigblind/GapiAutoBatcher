
var GapiAutoBatcher = function(config){


  if(this === window){
    return new GapiAutoBatcher(config);
  }

  config = config || {};
  this.config = {};


  // Make sure all configuration options have a value
  for (var option in GapiAutoBatcher.defaults){
    if (GapiAutoBatcher.defaults.hasOwnProperty(option)){
      this.config[option] = config[option] || GapiAutoBatcher.defaults[option];
    }
  }

  var self = this;

  var batch = null;
  var timeout = null;
  var started = null;
  var createBatch = function(){
    console.log("creating a new batch");
    started = Date.now()
    batch = gapi.client.newBatch();
  }

  var delayBatch = function(){
    if (timeout){
      clearTimeout(timeout);
    }

    var delay = self.config.batchInterval;
    var elapsed = Date.now() - started;
    if (elapsed + delay > self.config.maxWait){
      delay = self.config.maxWait - elapsed;
    }

    timeout = setTimeout(callBatch, delay);
  }

  var callBatch = function(){
    batch.execute();
    batch = null;
    console.log("executed batch");
  }

  this.execute = function(request){
    //Temporary fix for a big in Google's js sdk.
    //TODO(frederikcreemers@gmail.com): remove this as soon as I've had a reply at: https://code.google.com/p/google-api-javascript-client/issues/detail?can=2&start=0&num=100&q=&colspec=ID%20Type%20Status%20Priority%20Milestone%20Owner%20Summary&groupby=&sort=&id=173
    request.then(function(){});

    if (batch == null){
      createBatch();
    }

    batch.add(request);

    delayBatch();

    return request;
  }

}

GapiAutoBatcher.defaults = {
  batchInterval: 50,
  maxWait: 100
};

GapiAutoBatcher.gapi = {
  listeners: [],
  resolved: false,
  then: function(f){
    if(this.resolved){
      f();
      return;
    }
    this.listeners.push(f);
  },
  resolve: function(){
    this.resolved = true;
    for(var i=0; i<this.listeners.length; i++){
      this.listeners[i]();
    }
  }
}

var initGapi = function(){
  GapiAutoBatcher.gapi.resolve();
}

if(window.gapi && gapi.client){
  initGapi();
}

(function(global){
  if(global.module){
    module.exports = GapiAutoBatcher;
  }
})

