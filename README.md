# Node Bing API
Node.js lib for the Azure Bing Web Search API

## Changelog v2
In order to follow JavaScript best practices and allow the library to
be promisified, the callback function is now the last parameter.

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
Bing.web("Pizza", {
    top: 10,  // Number of results (max 50)
    skip: 3,   // Skip first 3 results
  }, function(error, res, body){
    console.log(body);
  });
```

#### Composite Search:
```js
Bing.composite("xbox", {
    top: 10,  // Number of results (max 50)
    skip: 3,   // Skip first 3 results
    sources: "web+news", //Choises are web+image+video+news+spell
    newssortby: "Date" //Choices are Date, Relevance
  }, function(error, res, body){
    console.log(body);
  });
```

#### News Search:
```js
Bing.news("xbox", {
    top: 10,  // Number of results (max 50)
    skip: 3,   // Skip first 3 results
    newssortby: "Date" //Choices are: Date, Relevance
    newscategory: "rt_Business" // Choices are:
                                //   rt_Business
                                //   rt_Entertainment
                                //   rt_Health
                                //   rt_Politics
                                //   rt_Sports
                                //   rt_US
                                //   rt_World
                                //   rt_ScienceAndTechnology
  }, function(error, res, body){
    console.log(body);
  });
```

#### Video Search:
```js
Bing.video("monkey vs frog", {
    top: 10,  // Number of results (max 50)
    skip: 3,   // Skip first 3 result
    videofilters: {
      duration: 'short',
      resolution: 'high'
    }
  }, function(error, res, body){
    console.log(body);
  });
```

#### Images Search:
```js
Bing.images("Ninja Turtles", {skip: 50}, function(error, res, body){
  console.log(body);
});
```
Adding filter(s) for the Image Search
```js
Bing.images("Ninja Turtles", {
    imagefilters: {
      size: 'small',
      color: 'monochrome'
    }
  }, function(error, res, body){
  console.log(body);
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
Bing.images("Ninja Turtles", {top: 5, market: 'es-ES'}, function(error, res, body){
  console.log(body);
});
```
[List of Bing Markets](https://msdn.microsoft.com/en-us/library/dd251064.aspx)


#### Adult Filter
```js
Bing.images('Kim Kardashian', {market: 'en-US', adult: 'Strict'}, function(error, res, body){
  console.log(body.d.results);
});
```
Accepted values: "Off", "Moderate", "Strict".

*Moderate level should not include results with sexually explicit images
or videos, but may include sexually explicit text.*


## License
MIT
