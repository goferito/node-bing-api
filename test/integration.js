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


describe("Bing Search", function () {

  this.timeout(1000 * 10);

  it('works without options', function (done) {

    Bing.search('monkey vs frog', function (err, res, body) {

      should.not.exist(err);
      should.exist(res);
      should.exist(body);

      body.d.results.should.have.length(50);

      //TODO check it contains the right fields
      done();
    });
  });

  it('finds only 5 results', function (done) {
    Bing.search('monkey vs frog',
                {
                  top: 5,
                  market: 'en-US',
                  adult: 'Strict'
                },
                function (err, res, body) {

      should.not.exist(err);
      should.exist(res);
      should.exist(body);

      body.d.results.should.have.length(5);

      done();
    });
  });

});


describe("Bing Images", function () {

  this.timeout(1000 * 10);

  it('finds images with specific options', function (done) {
    Bing.images('pizza',
                {
                  top: 3,
                  adult: 'Off',
                  imagefilters: {
                    size: 'small',
                    color: 'monochrome'
                  }
                },
                function (err, res, body) {

      should.not.exist(err);
      should.exist(res);
      should.exist(body);

      body.d.results.should.have.length(3);

      done();
    });
  });

});


describe("Bing News", function () {

  this.timeout(1000 * 10);

  it('finds news with specific options', function (done) {

    Bing.news('ps4',
              {
                top: 10,
                skip: 1,
                newsortby: 'Date'
              },
              function (err, res, body) {

      //TODO try unaccepted options like imagefilters

      should.not.exist(err);
      should.exist(res);
      should.exist(body);

      body.d.results.should.have.length(10);

      done();
    });
  });

});


describe("Bing Video", function () {

  this.timeout(1000 * 10);

  it('finds videos with specific options', function (done) {

    Bing.video('monkey vs frog',
               {
                 top: 10,
                 videofilters: {
                   duration: 'short',
                   resolution: 'high'
                 }
               },
               function (err, res, body) {

      should.not.exist(err);
      should.exist(res);
      should.exist(body);

      body.d.results.should.have.length(10);

      //TODO try here unaccepted options like imagefilters

      done();
    });
  });
});

