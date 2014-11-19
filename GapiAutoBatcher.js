GapiAutoBatcher = function(config){


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

  var batch = null;
  var timeout = null;
  var started = null;
  var callBatch = function(){
    batch.execute();
    batch = null;
  }

  this.call = function(request){
    if (batch == null){
      started = Date.now()
      batch = gapi.client.newBatch();
    }

    batch.add(request);

    if (timeout){
      clearTimeout(timeout);
    }
    var delay = this.config.batchInterval;
    var elapsed = Date.now() - started;
    console.log("elapsed: " + elapsed);
    if (elapsed + delay > this.config.maxWait){
      console.log("delay too long: " + elapsed + " + " + delay + " > " + this.config.maxWait);
      delay = this.config.maxWait - elapsed;
      console.log("new delay " + delay);
    }
    timeout = setTimeout(callBatch, delay);
  }

}


GapiAutoBatcher.defaults = {
  batchInterval: 50,
  maxWait: 100
};
