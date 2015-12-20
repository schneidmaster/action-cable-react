module.exports = 
  module:
    loaders: [
      {
        test: /\.coffee$/
        loaders: ['coffee']
      }
    ]
  resolve:
    extensions: ['', '.js', '.json', '.coffee'] 
