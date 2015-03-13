# Node Bing API
Node.js lib for the Azure Bing Web Search API

## Installation
````
npm install node-bing-api
````

## Usage

Require the library and initialialize it with your account key:

```js
var Bing = require('node-bing-api')({ accKey: "your-account-key" });
```

#### Web Search:
```js
Bing.web("Pizza", function(error, res, body){
    console.log(body);
  },
  {
    top: 10,  // Number of results (max 50)
    skip: 3   // Skip first 3 results
  });
```

#### Images Search:
```js
Bing.images("Ninja Turtles", function(error, res, body){
  console.log(body);
}, {skip: 50});
```
Adding filter(s) for the Image Search
```js
Bing.images("Ninja Turtles", function(error, res, body){
  console.log(body);
  }, 
  {
    imagefilters: {
      size: 'small',
      color: 'monochrome' 
    }
  });
```
Accepted filter values:
* Size:\<Small | Medium | Large\>
* Size:Height:\<*Height*\>
* Size:Width:\<*Width*\>
* Aspect:\<Square | Wide | Tall\>
* Color:\<Color | Monochrome\>
* Style:\<Photo | Graphics\>
* Face:\<Face | Portrait | Other\>


#### Specify Market
Getting spanish results:
```js
Bing.images("Ninja Turtles", function(error, res, body){
  console.log(body);
}, {top: 5, market: 'es-ES'});
```
[List of Bing Markets](https://msdn.microsoft.com/en-us/library/dd251064.aspx)


#### Adult Filter
```js
Bing.images('Kim Kardashian', function(error, res, body){
  console.log(body.d.results);
}, { market: 'en-US', adult: 'Strict'});
```
Accepted values: "Off", "Moderate", "Strict".

*Moderate level should not include results with sexually explicit images
or videos, but may include sexually explicit text.*


## License
MIT

