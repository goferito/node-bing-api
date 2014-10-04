# Node Bing API
Node.js lib for the Azure Bing Web Search API

### Installation
````
npm install node-bing-api
````

### Usage

Require the library and initialialize it with your account key:

```js
var Bing = require('node-bing-api')({ accKey: "your-account-key" });
```

##### Web Search:
```js
Bing.search("Pizza", function(error, res, body){
    console.log(body);
  },
  {
    top: 10,  // Number of results (max 50)
    skip: 3   // Skip first 3 results
  });
```

##### Images Search:
```js
Bing.images("Ninja Turtles", function(error, res, body){
  console.log(body);
}, {skip: 50});
```

### License
MIT

