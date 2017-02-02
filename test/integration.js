// Try to get an access key to run all this test.
// If the file doesn't exist or it doesn't contain an access key, it
// should still run the basic tests; thus throwing an exception must
// be avoided.
try {
  var accKey = require('./secrets').accKey;
} catch (e) {
  console.log(e);
}

if (!accKey) {
  return console.error("Need to include an access key in your secrets.js");
}


var Bing = require('../')({ accKey: accKey })
  , should = require('should')


describe("Bing Web", function () {

  this.timeout(1000 * 10);

  it('works without options', function (done) {

    Bing.web('pizza', function (err, res, body) {

      should.not.exist(err);
      should.exist(res);
      should.exist(body);
      body.webPages.value.length.should.be.above(0);

      //TODO check it contains the right fields
      done();
    });
  });

  it('finds only 5 results with old "top" option', function (done) {
    Bing.web('monkey vs frog',
                {
                  top: 5,
                  market: 'en-US',
                  adult: 'Strict'
                },
                function (err, res, body) {

      should.not.exist(err);
      should.exist(res);
      should.exist(body);

      body.webPages.value.should.have.length(5);

      done();
    });
  });

  it('finds russian results', function(done){
    Bing.web('"Sony Xperia Z3" смартфон',
                {
                  count: 5,
                  skip: 0,
                  market: 'ru-RU'
                },
                function (err, res, body) {

      should.not.exist(err);
      should.exist(res);
      should.exist(body);

      body.webPages.value.should.have.length(5);

      done();
    });

  })

});


describe("Bing Images", function () {

  this.timeout(1000 * 10);

  it('finds images with specific options', function (done) {
    Bing.images('pizza',
                {
                  top: 3,
                  adult: 'Off'
                },
                function (err, res, body) {

      should.not.exist(err);
      should.exist(res);
      should.exist(body);
      body.value.should.have.length(3);

      done();
    });
  });

});


describe("Bing News", function () {

  this.timeout(1000 * 10);

  it('finds news with specific options', function (done) {

    Bing.news('microsoft',
              {
                top: 5
              },
              function (err, res, body) {

      //TODO try unaccepted options like imageFilters

      should.not.exist(err);
      should.exist(res);
      should.exist(body);

      body.value.should.be.instanceof(Array);

      done();
    });
  });

});


describe("Bing Composite", function () {

  this.timeout(1000 * 10);

  it('finds composite search', function (done) {

    Bing.composite('animal',
              {
                top: 1,
              },
              function (err, res, body) {

      //TODO try unaccepted options like imageFilters

      should.not.exist(err);
      should.exist(res);
      should.exist(body);

      body.webPages.value.should.have.length(1);

      done();
    });
  });

});


describe("Bing Video", function () {

  this.timeout(1000 * 10);

  it('finds videos with specific options', function (done) {

    Bing.video('monkey vs frog',
               {
                 top: 10
               },
               function (err, res, body) {

      should.not.exist(err);
      should.exist(res);
      should.exist(body);

      body.value.should.have.length(10);

      //TODO try here unaccepted options like imageFilters

      done();
    });
  });
});


describe("Bing Related Search", function () {

  this.timeout(1000 * 10);

  it('finds related search suggestions', function (done) {

    Bing.relatedSearch('berlin',
                {
                  top: 5,
                  market: 'en-US'
                },
               function (err, res, body) {

      should.not.exist(err);
      should.exist(res);
      should.exist(body);

      body.webPages.value.should.have.length(5);

      done();
    });
  });
});

