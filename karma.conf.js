module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai'],
    browsers: ['Chrome'],
    files: [
      '*.js'
    ]
  });
};