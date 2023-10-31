const request = require('supertest');
const app = require('../app');
const { mongoose, mongoUrl, User, Message } = require('../db/connection');
const { seed } = require('../db/seed');
const { makeToken } = require('../util/token');
const { getUserDataWithContacts } = require('../models/user-model');

const username = 'bob_test';
const password = 'testpass1';
let user;
let token;
let friendId;
let strangerId;

beforeAll(async () => {
  await mongoose.connect(mongoUrl);
});

beforeEach(async () => {
  await seed();
  user = await getUserDataWithContacts(username);
  token = makeToken(user);
  friendId = user.contacts[0].id.toString();
  strangerId = (await User.find({})).reverse()[0]._id;
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('ALL invalid endpoint', () => {
  it('404: should return an error on invalid endpoint', async () => {
    await request(app).get('/not-an-endpoint').expect(404);
  });
});

describe('GET /status', () => {
  it('200: should respond with OK status', async () => {
    const { text } = await request(app).get('/status').expect(200);
    expect(text).toBe('Server OK');
  });
});

describe('GET /user', () => {
  it('200: provide user data when provided with valid cookie', async () => {
    const { body } = await request(app)
      .get('/user')
      .set('Cookie', `token=${token}`)
      .expect(200);

    expect(body.user_data).toMatchObject({
      id: expect.any(String),
      username: expect.any(String),
      contacts: expect.any(Array),
    });

    for (const contact of body.user_data.contacts) {
      expect(contact).toMatchObject({
        id: expect.any(String),
        username: expect.any(String),
      });
    }
  });

  it('403: should return an error if invalid token provided', async () => {
    const { body } = await request(app)
      .get('/user')
      .set('Cookie', 'token=invalid')
      .expect(403);

    expect(body.msg).toBeDefined();
  });

  it('403: should return an error if no cookie provided', async () => {
    const { body } = await request(app).get('/user').expect(403);
    expect(body.msg).toBeDefined();
  });
});

describe('POST /user (register)', () => {
  it('201: should create the the user account', async () => {
    const { body } = await request(app)
      .post('/user')
      .send({
        username: 'bob',
        password: 'abc123',
      })
      .expect(201);

    expect(body.registered_user).toMatchObject({
      id: expect.any(String),
      username: expect.any(String),
      token: expect.any(String),
    });

    const registeredUser = await User.findOne({
      username: body.registered_user.username,
    });

    expect(registeredUser.username).toBe('bob');
  });

  it('422: should return an error if username already exists', async () => {
    const { body } = await request(app)
      .post('/user')
      .send({ username, password })
      .expect(422);

    expect(body.msg).toBeDefined();
  });

  it('400: should return an error if no user data is provided', async () => {
    const { body } = await request(app).post('/user').expect(400);
    expect(body.msg).toBeDefined();
  });
});

describe('DELETE /user', () => {
  it('204: should delete the user account', async () => {
    let user = await User.findOne({ username });
    expect(user).toBeDefined();

    await request(app)
      .delete('/user')
      .set('Cookie', `token=${token}`)
      .expect(204);

    user = await User.findOne({ username });
    expect(user).toBeNull();
  });

  it('204: should remove the token cookie', async () => {
    const response = await request(app)
      .delete('/user')
      .set('Cookie', `token=${token}`)
      .expect(204);

    expect(response.headers['set-cookie'][0]).toContain('token=;');
  });

  it('404: should return an error if user not found', async () => {
    await request(app)
      .delete('/user')
      .set('Cookie', `token=${token}`)
      .expect(204);

    const { body } = await request(app)
      .delete('/user')
      .set('Cookie', `token=${token}`)
      .expect(404);

    expect(body.msg).toBeDefined();
  });

  it('403: should return an error if no no cookie provided', async () => {
    const { body } = await request(app).delete('/user').expect(403);
    expect(body.msg).toBeDefined();
  });
});

describe('POST /login', () => {
  it('201: should respond with the user details', async () => {
    const { body } = await request(app)
      .post('/login')
      .send({
        username,
        password,
      })
      .expect(201);

    expect(body.found_user).toMatchObject({
      id: expect.any(String),
      username: expect.any(String),
      contacts: expect.any(Array),
      token: expect.any(String),
    });

    for (const contact of body.found_user.contacts) {
      expect(contact).toMatchObject({
        id: expect.any(String),
        username: expect.any(String),
      });
    }
  });

  it('201: should create a token cookie', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        username,
        password,
      })
      .expect(201);

    expect(response.headers['set-cookie'][0]).toContain('token=');
  });

  it('401: should return an error if username is invalid', async () => {
    const { body } = await request(app)
      .post('/login')
      .send({
        username: 'invalid',
        password,
      })
      .expect(401);

    expect(body.msg).toBeDefined();
  });

  it('403: should return an error if password is invalid', async () => {
    const { body } = await request(app)
      .post('/login')
      .send({
        username,
        password: 'invalid',
      })
      .expect(403);

    expect(body.msg).toBeDefined();
  });

  it('400: should return an error if no user data is provided', async () => {
    const { body } = await request(app).post('/login').expect(400);
    expect(body.msg).toBeDefined();
  });
});

describe('POST /logout', () => {
  it('204: should remove the token cookie', async () => {
    const response = await request(app)
      .post('/logout')
      .set('Cookie', `token=${token}`)
      .expect(204);

    expect(response.headers['set-cookie'][0]).toContain('token=;');
  });
});

describe('GET /find/:term', () => {
  it('200: should provide an array of users matching the provided partial string', async () => {
    const { body } = await request(app).get('/find/bob').expect(200);

    expect(Array.isArray(body.found_users)).toBeTruthy();

    for (const user of body.found_users) {
      expect(user).toMatchObject({
        id: expect.any(String),
        username: expect.any(String),
      });
    }

    // names are randomly seeded, only 'bob_test' is a guaranteed username
    expect(body.found_users.map((user) => user.username)).toContain(username);
  });

  it('200: should return an empty array for no matches', async () => {
    const { body } = await request(app).get('/find/no_matches').expect(200);
    expect(body.found_users.length).toBe(0);
  });

  it('200: should return 10 results by default', async () => {
    const { body } = await request(app).get('/find/_test').expect(200);
    expect(body.found_users.length).toBe(10);
  });

  it('200: should return specified number of results', async () => {
    const { body } = await request(app).get('/find/_test?limit=20').expect(200);
    expect(body.found_users.length).toBe(20);
  });
});

describe('POST /contacts/:contact_id', () => {
  it('200: should add the contact to the user data', async () => {
    await request(app)
      .post(`/contacts/${strangerId}`)
      .set('Cookie', `token=${token}`)
      .expect(200);

    user = await getUserDataWithContacts(username);

    expect(
      user.contacts.map((contact) => {
        return contact.id.toString();
      })
    ).toContain(strangerId.toString());
  });

  it('404: should return an error if contact is invalid', async () => {
    const { body } = await request(app)
      .post('/contacts/invalid')
      .set('Cookie', `token=${token}`)
      .expect(404);

    expect(body.msg).toBeDefined();
  });

  it('403: should return an error if no cookie provided', async () => {
    const { body } = await request(app)
      .post(`/contacts/${strangerId}`)
      .expect(403);

    expect(body.msg).toBeDefined();
  });
});

describe('DELETE /contacts/:contact_id', () => {
  it('200: should remove the contact to the user data', async () => {
    await request(app)
      .delete(`/contacts/${friendId}`)
      .set('Cookie', `token=${token}`)
      .expect(200);

    user = await getUserDataWithContacts(username);

    expect(
      user.contacts.map((contact) => {
        return contact.id.toString();
      })
    ).not.toContain(friendId.toString());
  });

  it('404: should return an error if contact is invalid', async () => {
    const { body } = await request(app)
      .delete('/contacts/invalid')
      .set('Cookie', `token=${token}`)
      .expect(404);

    expect(body.msg).toBeDefined();
  });

  it('403: should return an error if no cookie provided', async () => {
    const { body } = await request(app)
      .delete(`/contacts/${strangerId}`)
      .expect(403);

    expect(body.msg).toBeDefined();
  });
});

describe('GET /messages/:contact_id', () => {
  it('200: should return array of messages between user and contact', async () => {
    const { body } = await request(app)
      .get(`/messages/${friendId}`)
      .set('Cookie', `token=${token}`)
      .expect(200);

    expect(Array.isArray(body.messages)).toBeTruthy();

    for (const message of body.messages) {
      expect(message).toMatchObject({
        senderId: expect.any(String),
        recipientId: expect.any(String),
        body: expect.any(String),
        createdAt: expect.any(String),
      });

      expect([message.senderId, message.recipientId]).toContain(
        user._id.toString()
      );
      expect([message.senderId, message.recipientId]).toContain(friendId);
    }
  });

  it('404: should return an error if contact is invalid', async () => {
    const { body } = await request(app)
      .get('/messages/invalid')
      .set('Cookie', `token=${token}`)
      .expect(404);

    expect(body.msg).toBeDefined();
  });

  it('403: should return an error if no cookie provided', async () => {
    const { body } = await request(app)
      .get(`/messages/${friendId}`)
      .expect(403);

    expect(body.msg).toBeDefined();
  });
});

describe('POST /messages/:contact_id', () => {
  it('201: should create the message', async () => {
    const messageBody = 'this is a message';

    await request(app)
      .post(`/messages/${friendId}`)
      .set('Cookie', `token=${token}`)
      .send({ body: messageBody })
      .expect(201);

    const message = await Message.findOne({ body: messageBody });
    expect(message).toBeDefined();
  });

  it('400: should return an error if no message is provided', async () => {
    const { body } = await request(app)
      .post(`/messages/${friendId}`)
      .set('Cookie', `token=${token}`)
      .expect(400);
  });

  it('404: should return an error if contact is invalid', async () => {
    const messageBody = 'this is a message';

    const { body } = await request(app)
      .post('/messages/invalid')
      .set('Cookie', `token=${token}`)
      .send({ body: messageBody })
      .expect(404);

    expect(body.msg).toBeDefined();
  });

  it('403: should return an error if no cookie provided', async () => {
    const messageBody = 'this is a message';

    const { body } = await request(app)
      .post(`/messages/${friendId}`)
      .send({ body: messageBody })
      .expect(403);

    expect(body.msg).toBeDefined();
  });
});
