var expect  = require("chai").expect;
var request = require("request");

var eth_utils = require('ethereumjs-util');
var cryptopunk_icons = require("../app/cryptopunk-icons");

describe("Cryptopunk Icons API", function() {


  describe("Connects to root", function() {

    var url = "http://localhost:3000/";


    it("returns status 200", function() {
          request(url, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
          });
        });



  });


  describe("Connects to web3", function() {

    var url = "http://localhost:3000/blockchain";


    it("returns status 200", function() {
          request(url, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
          });
        });

        it("returns web3", function() {
          request(url, function(error, response, body) {
            console.log('web3 body is ')
              console.log(body)
            expect(body).to.equal("fffgggfff"); //succeeds?
            done();
          });
        });



  });


  describe("Validates a signed sample cryptographic challeng", function() {

    var test_eth_private_key = "2c6036ab2f51cb1bfa17a3ffb57abf93a183d9d3887bc9e73cd28d9be57e4d56";
    var test_eth_address = "0xacbFBdc72626c2264a72a352733ae58244ee3BEf";


      it("validates priv key", function() {

        private_key_buffer =  Buffer.from(test_eth_private_key,'hex')

        var is_valid_private = eth_utils.isValidPrivate(private_key_buffer)

        expect(is_valid_private).to.equal(true);

      });

        it("generates a challenge", function() {

          var challenge_digest = cryptopunk_icons.generateEllipticCurveChallengeDigest('test')

          var challenge_digest_hex = challenge_digest.toString('hex')

          expect(challenge_digest_hex).to.equal('4a5c5d454721bbbb25540c3317521e71c373ae36458f960d2ad46ef088110e95');

        });

        it("signs a challenge", function() {

          var challenge_digest = cryptopunk_icons.generateEllipticCurveChallengeDigest('test')

          var sig_hex = cryptopunk_icons.signEllipticCurveChallenge(test_eth_private_key,challenge_digest)


          expect(sig_hex).to.equal('0x041a261a9988d60cc59347c217ac32268b4491fd90b7d367b5392d7b20dd63fc1d10c56dae8666e9a860719d6d4772af6f5ead8ce1f9150a461b5b618a3e5ea300');


        });

        it("finds pub key from signature", function() {

          var challenge_digest = cryptopunk_icons.generateEllipticCurveChallengeDigest('test')

          var sig_hex = cryptopunk_icons.signEllipticCurveChallenge(test_eth_private_key,challenge_digest)

          var pub_key_from_sig = cryptopunk_icons.getPublicKeyFromEllipticCurveSignature(challenge_digest,sig_hex)

          var pub_key_from_sig_hex = pub_key_from_sig.toString('hex')

          expect(pub_key_from_sig_hex).to.equal('6d997bb8b96f69c216d15037fd7d2f7890df5c70c5dc9bced6e3deeacd435954d8d1911cad86df60cfda23573329af383bc81e37cff8133d815e2922a0a30706');

        });


        it("verifies that pub key matches pub addr", function() {

          var challenge_digest = cryptopunk_icons.generateEllipticCurveChallengeDigest('test')

          var sig_hex = cryptopunk_icons.signEllipticCurveChallenge(test_eth_private_key,challenge_digest)

          var pub_key_from_sig = cryptopunk_icons.getPublicKeyFromEllipticCurveSignature(challenge_digest,sig_hex)


          var verified_address_match = cryptopunk_icons.verifyPublicAddressMatchesPublicKey(test_eth_address,pub_key_from_sig)

          expect(verified_address_match).to.equal(true);

        });



  });

  describe("Generates a cryptographic challenge", function() {

    var url = "http://localhost:3000/challenge?red=255&green=255&blue=255";



    it("returns status 200", function() {
          request(url, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
          });
        });

        it("returns a random challenge", function() {
          request(url, function(error, response, body) {
            expect(body).to.equal("ffffff");
            done();
          });
        });



  });


  /*describe("Hex to RGB conversion", function() {

    it("returns status 200", function() {});

    it("returns the color in RGB", function() {});

  });
*/

});
