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
  test("GET on root returns 200", () => {
    return request(app)
    .get("/")
    .then(response => {
      expect(response.statusCode).toBe(200);
    });
  });

  test("GET on root returns hello world", () => {
    return request(app)
    .get("/")
    .then(response => {
      expect(response.text).toBe("Hello World!");
    });
  });
});

describe("Test the probe path", () => {
  test("GET on root returns 200", () => {
    return request(app)
    .get("/probe")
    .then(response => {
      expect(response.statusCode).toBe(200);
    });
  });

  test("GET on probe returns hello world", () => {
    return request(app)
    .get("/probe")
    .then(response => {
      expect(response.text).toBe("Hello World!");
    });
  });
});
