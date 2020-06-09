const request = require('supertest')
const http = require('http');
require("dotenv").config();

let httpServer;
let token=process.env.TOKEN;

/**
 * Setup HTTP servers
 */
beforeAll((done) => {
  httpServer = http.createServer().listen(8000);
  done();
});

/**
 *  Cleanup HTTP servers
 */
afterAll((done) => {
  httpServer.close();
  done();
});

describe('Test post Endpoints', () => {
  it('should fail because of authorization', async () => {
    const res = await request(httpServer)
      .post('/chatroom')
      .send({
        name: 'cs300'
      })
    expect(res.statusCode).toEqual(401)
    expect(res.body.message).toBe('Not authorized user')
  })
})
 
describe('Test get Endpoints', () => {
  it('should pass and get all chatrooms', async () => {
    request(httpServer)
      .get('/chatroom')
      .set('Authorization', `Bearer ${token}`)
      .then((res) =>{
        expect(res.saatusCode).toEqual(200)
        expect(res.body.message).toBeTruthy()
      })
  })
})