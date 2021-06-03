const nock = require('nock')
const request = require("supertest");
const app = require('../app')

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

describe("Test auth and proxy", () => {
  test("GET on root returns 200", () => {
    const scope = nock('http://localhost:9200')
    .get('/test')
    .reply(200, {});

    return request(app)
    .get("/test")
    .set('Authorization', "super-secret-key")
    .then(response => {
      expect(response.statusCode).toBe(200);
    });
  });
  
});
