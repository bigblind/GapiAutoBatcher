describe('GapiAutoBatcher', function(){
  describe('constructor', function(){

    it('should return a new instance when called without "new".', function(){
      expect(GapiAutoBatcher()).to.deep.equal(new GapiAutoBatcher());
    })

    it("should use the default option when an option is not specified", function(){
      expect(GapiAutoBatcher().config.batchInterval).to.equal(GapiAutoBatcher.defaults.batchinterval)
    })
  })
})