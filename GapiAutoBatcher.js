GapiAutoBatcher = function(config){
  if(this === window){
    return new GapiAutoBatcher(config);
  }

  this.config = {}

  // set defaults
  for (var option in GapiAutoBatcher.defaults){
    if (GapiAutoBatcher.hasOwnProperty(option)){
      this.config[option] = config[option] || GapiAutoBatcher.defaults[option]
    }
  }
}


GapiAutoBatcher.defaults = {
  batchInterval: 50,
  maxWait: 100
}
