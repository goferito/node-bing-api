# Node Bing API
Node.js lib for the Azure Bing Web Search API

### Installation
````
npm install node-bing-api
````

### Usage

Require the library and initialialize it with your account key:

````
var Bing = require('node-bing-api')({ accKey: "your-account-key" });
````

Web Search
````
Bing.search("Pizza",

  // Callback
  function(error, res, body){
    console.log(body);
  },

  // Search options
  {
    top: 10,  // Number of results. Max 50.
    skip: 3   // Skip first 3 results
  });
````

Images Search
````
Bing.images("Ninja Turtles", function(error, res, body){
  console.log(body);
}, {skip: 50});
````

### License
MIT

