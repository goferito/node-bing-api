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
    options: ['DisableLocationDetection', 'EnableHighlighting']
  }, function(error, res, body){

    // body has more useful information, but for this example we are just
    // printing the first two results
    console.log(body.d.results[0]);
    console.log(body.d.results[1]);
  });
```

#### Composite Search:
```js
Bing.composite("xbox", {
    top: 10,  // Number of results (max 15 for news, max 50 if other)
    skip: 3,   // Skip first 3 results
    sources: "web+news", //Choises are web+image+video+news+spell
    newsSortBy: "Date" //Choices are Date, Relevance
  }, function(error, res, body){
    console.log(body);
  });
```

#### News Search:
```js
Bing.news("xbox", {
    top: 10,  // Number of results (max 15)
    skip: 3,   // Skip first 3 results
    newsSortBy: "Date", //Choices are: Date, Relevance
    newsCategory: "rt_Business" // Choices are:
                                //   rt_Business
                                //   rt_Entertainment
                                //   rt_Health
                                //   rt_Politics
                                //   rt_Sports
                                //   rt_US
                                //   rt_World
                                //   rt_ScienceAndTechnology
    newsLocationOverride: "US.WA" // Only for en-US market
  }, function(error, res, body){
    console.log(body);
  });
```

#### Video Search:
```js
Bing.video("monkey vs frog", {
    top: 10,  // Number of results (max 50)
    skip: 3,   // Skip first 3 result
    videoFilters: {
      duration: 'short',
      resolution: 'high'
    },
    videoSortBy: 'Date' // Choices are:
                        //   Date
                        //   Relevance
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
    imageFilters: {
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

#### Related Search:
```js
Bing.relatedSearch('berlin', {market: 'en-US'}, function (err, res, body) {
  var suggestions = body.d.results.map(function(r){ return r.Title; });
  console.log(suggestions.join('\n'));
});
```

#### Spelling Suggestions:
```js
Bing.spelling('awsome spell', function (err, res, body) {
  console.log(body.d.results[0]); //awesome spell
});
```

#### Specify Market
Getting spanish results:
```js
Bing.images("Ninja Turtles"
          , {top: 5, market: 'es-ES'}
          , function(error, res, body){

  console.log(body);
});
```
[List of Bing Markets](https://msdn.microsoft.com/en-us/library/dd251064.aspx)


#### Adult Filter
```js
Bing.images('Kim Kardashian'
          , {market: 'en-US', adult: 'Strict'}
          , function(error, res, body){

  console.log(body.d.results);
});
```
Accepted values: "Off", "Moderate", "Strict".

*Moderate level should not include results with sexually explicit images
or videos, but may include sexually explicit text.*

#### Web Only API Subscriptions
To use this library with a web only subscription, you can require and initialize it with an alternate root url:
```js
var Bing = require('node-bing-api')
            ({ 
              accKey: "your-account-key", 
              rootUri: "https://api.datamarket.azure.com/Bing/SearchWeb/v1/" 
            });
```

## Running Tests
In order to run the tests, the integration tests require to create a `secrets.js` file
from the provided `secrets.js.example` example, and fill it in with a valid access key.

Then just `mocha`.


## License
MIT

