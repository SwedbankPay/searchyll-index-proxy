const nock = require('nock')
const request = require("supertest");
const app = require('../app')

//const scope = nock('https://api.github.com')
//  .get('/repos/atom/atom/license')
//  .reply(200, {
//    license: {
//      key: 'mit',
//      name: 'MIT License',
//      spdx_id: 'MIT',
//      url: 'https://api.github.com/licenses/mit',
//      node_id: 'MDc6TGljZW5zZTEz',
//    },
//  });


describe("Test the root path", () => {
  test("It should response the GET method", () => {
    return request(app)
    .get("/")
    .then(response => {
      expect(response.statusCode).toBe(200);
    });
  });
});
