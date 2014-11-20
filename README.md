# GapiAutoBatcher

GapiAutoBatcher automatically batches requests to Google's APIs, when they are
made within a short interval

#  Including the script

When you load Google's javascript api, they ask you to provide a callback function:

```html
 <script src="https://apis.google.com/js/client.js?onload=handleClientLoad"></script>
```

This forces you to write one function that is notified when the library is ready
for use. GapiAutoBatcher contains a utility that allows you to treat the google
api loading like a promise. But for that to work, you'll have to load
GapiAutoBatcher before the api client library. If you don't want to use the promise,
you can just load GapiAutoBatch.js at the end of the body element, or wherever in your HTML you'd like.

Here's an example of how you can use this promise:

```html
<script src="GapiAutoBatcher.js"></script> 
<!-- set onload to initGapi -->
<script src="https://apis.google.com/js/client.js?onload=initGapi"></script>
<script>
GapiAutoBatcher.gapi.then(function(){
	// You can now use gapi.load to load the apis you want, and use them. 
});
</script>
```

# Using the GapiAutoBatcher

To start batching requests, you create a new `GapiAutoBatcher` object. You can
do thos by calling `GapiAutoBatcher(config)`. It works both with and without `new`.

### GapiAutoBatcher(config)

constructs a new autobatcher

#### Arguments

 - **config** - configuration options. We currently support 2 options. If an option isn't given, it is taken from `GapiAutoBatcher.defaults`.
   - **batchInterval** - If a request is called within `batchInterval` milliseconds of the previous one, it is included in the batch.
   - **maxWait** - the maximum number of miliseconds any request can wait before it has to be executed.

You can change any of these configuration options by changing properties of `GapiAutoBatcher.config`.

### GapiAutoBatcher().call(request)

Batch the request passed in to be executed

#### arguments

 - **request** - the request to be batched.

## npm commands

 - `npm test` - Starts the karma test runner, watching the directory for changes.
 - `npm serve` - If you have python installed, this command starts a simple web server that serves this project. Google's javascript api's don't work in a html file on the `file://` protocol, so run this to view example.html
 - `npm server` - alias of `npm serve`.
 - `npm uglify` - runs UglifyJs 2 to produce GapiAutoBatcher.min.js