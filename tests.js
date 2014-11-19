MockGapi = function(){
  var functions = [];
  this.add = function(f){
    functions.push(f)
  }
  this.execute = function(){
    for (var i=0; i<functions.length; i++){
      functions[i]();
    }
  }
}

setupGapi = function(){
  gapi = {};
  gapi.client = {};
  gapi.client.newBatch = sinon.spy(function(){
    return new MockGapi()
  });
  initGapi();
}

describe('GapiAutoBatcher', function(){
  describe('constructor', function(){

    it('should return a new instance when called without "new".', function(){
      expect(GapiAutoBatcher()).to.be.instanceof(GapiAutoBatcher);
    });

    it("should use the default option when an option is not specified", function(){
      expect(GapiAutoBatcher().config.batchInterval).to.equal(GapiAutoBatcher.defaults.batchInterval)
    });

    it("should use the options provided to the constructor.", function(){
      var batchInterval = 42;
      expect(GapiAutoBatcher({batchInterval: batchInterval}).config.batchInterval)
          .to.equal(batchInterval);
    });

  });

  describe("call", function(){
    it("should execute a request passed to call() after config.batchInterval, if " +
        "no other request is passed in within  that time.", function(){
      setupGapi();
      var interval = 30;
      var batcher = new GapiAutoBatcher({batchInterval: interval});
      var clock = sinon.useFakeTimers();
      var request = sinon.spy();

      batcher.call(request);
      clock.tick(interval);

      expect(request.callCount).to.equal(1);

      clock.restore();
    });

    it("should not execute a request passed in to call() before the necessary time has elapsed", function(){
      setupGapi();
      var interval = 30;
      var batcher = new GapiAutoBatcher({batchInterval: interval});
      var clock = sinon.useFakeTimers();

      var request = sinon.spy();

      clock.restore();
      expect(request.callCount).to.equal(0);
    });

    it("should extend the interval by batchInterval if a new request is added.", function(){
      setupGapi();
      var interval = 30;
      var batcher = new GapiAutoBatcher({batchInterval: interval});
      var clock = sinon.useFakeTimers();
      var request1 = sinon.spy();
      var request2 = sinon.spy();

      batcher.call(request1);
      clock.tick(29);
      batcher.call(request2);
      clock.tick(31);

      expect(request1.callCount).to.equal(1);
      expect(request2.callCount).to.equal(1);
      clock.restore();
    });

    it("should not execute the batch before the extended timer has run out", function(){
      setupGapi();
      var interval = 30;
      var batcher = new GapiAutoBatcher({batchInterval: interval});
      var clock = sinon.useFakeTimers();
      var request1 = sinon.spy();
      var request2 = sinon.spy();

      batcher.call(request1);
      clock.tick(29);
      batcher.call(request2);
      clock.tick(5);

      expect(request1.callCount).to.equal(0);
      expect(request2.callCount).to.equal(0);
      clock.restore();
    });

    it("should only extend the timeout upto confix.maxWait", function(){
      setupGapi();
      var interval = 30, maxWait = 50;
      var batcher = new GapiAutoBatcher({batchInterval: interval, maxWait: maxWait});
      var clock = sinon.useFakeTimers();
      var request1 = sinon.spy();
      var request2 = sinon.spy();

      batcher.call(request1);
      clock.tick(29);
      batcher.call(request2);
      clock.tick(21);

      expect(request1.callCount).to.equal(1);
      expect(request2.callCount).to.equal(1);
      clock.restore();
    })

    it("should start a new batch after the previous batch has been executed", function(){
      setupGapi();
      var interval = 30, maxWait = 50;
      var batcher = new GapiAutoBatcher({batchInterval: interval, maxWait: maxWait});
      var clock = sinon.useFakeTimers();
      var request1 = sinon.spy();
      var request2 = sinon.spy();

      batcher.call(request1);
      clock.tick(31);
      batcher.call(request2);
      clock.tick(31);

      expect(request1.callCount).to.equal(1);
      expect(request2.callCount).to.equal(1);
      clock.restore();
    })

  });

  describe("gapi", function(){
    before(function(){
      GapiAutoBatcher.gapi.listeners = [];
      GapiAutoBatcher.gapi.resolved = false;
    });

    it("should resolve GapiAutoBatcher.gapi when initGapi is called.", function(){
      var callback = sinon.spy();
      GapiAutoBatcher.gapi.then(callback);
      expect(callback.callCount).to.equal(0);
      setupGapi();
      expect(callback.callCount).to.equal(1);
    });

    it("should call the function passed to 'then' immediately when gapi is already loaded.", function(){
      setupGapi();
      var callback = sinon.spy();
      GapiAutoBatcher.gapi.then(callback);
      expect(callback.callCount).to.equal(1);
    });
  })
})

