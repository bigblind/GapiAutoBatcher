module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai', 'sinon'],
    browsers: ['Chrome'],
    files: [
      '*.js'
    ]
  });
};