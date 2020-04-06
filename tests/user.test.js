const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const {userOneId, userOne, setUpDatabase} = require('./fixtures/db')

beforeEach(setUpDatabase);

test("should create new user", async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: "Andrew",
            email: "andrew@example.com",
            password: "Mypass777!"
        })
        .expect(201);
    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();
    // assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Andrew',
            email: 'andrew@example.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('Mypass777!');
});

test("should login existing user", async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200);
    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test("should not login nonexistent user", async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: 'name',
            password: 'password'
        })
        .expect(400);
});

test('should get user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
})

test('should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
})

test('should delete user profile of loged in user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});

test('should not delete profile of unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
});

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200);
    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));    
})

test('Should update valid user fields', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'bobot'
        })
        .expect(200);
    const user = await User.findById(userOneId);
    expect(user).toMatchObject({
                name: 'bobot'        
    })
});

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Aachen'
        })
        .expect(400);
});

test('Should not signup user with invalid name', async () => {
    await request(app)
        .post('/users')
        .send({
            name: '',
            password: 'superstrongpassword1234',
            email: 'test@testing.com'
        })
        .expect(400);
    const user = await User.findOne({email: 'test@testing.com'});
    expect(user).toBeNull();
})
test('Should not signup user with invalid email', async() =>{
    await request(app)
        .post('/users')
        .send({
            name: 'Tester',
            password: 'superstrongpassword1234',
            email: 'testtesting.com'
        })
        .expect(400);
    const user = await User.findOne({name: 'Tester'});
    expect(user).toBeNull();
})
test('Should not signup user with invalid password', async () => {
    await request(app)
        .post('/users')
        .send({
            name: 'Tester',
            password: 'password',
            email: 'test@testing.com'
        })
        .expect(400);
    const user = await User.findOne({email: 'test@testing.com'});
    expect(user).toBeNull();
})