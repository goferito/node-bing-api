# Node Bing API
Node.js lib for the Azure Bing Web Search API

### Installation
````
npm install node-bing-api
````

### Usage
````
var Bing = require('node-bing-api')({ accKey: "your-account-key" });

Bing.search("Android", function(error, res, body){
  console.log(body);
}));
````

### License
MIT
