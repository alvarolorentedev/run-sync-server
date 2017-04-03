# run-sync-server
Server for run-sync.com

### Development Setup / Usage ###

* Have a local mongodb instance running
* Node.js >= 6.9.x
* NPM 3.10.8 or greater.
* Clone this repository.
* Run `npm i`
* Run `npm start`
* Tests with `npm test` using `mocha`

### Testing ###

* All tests sit along side their corresponding code. For instance `api.js` has `api.spec.js` within the same folder.
* Route and public API tests user supertest to test endpoint behaviour
* Private code / service / other tests use standard testing styles (chai expect, sinon etc)