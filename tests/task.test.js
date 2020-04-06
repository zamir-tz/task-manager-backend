const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    setUpDatabase,
    taskOne,
    taskTwo,
    taskThree
} = require('./fixtures/db')

beforeEach(setUpDatabase);

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201);
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toBe(false);
});

test('Should get all tasks for user one', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200);
    expect(response.body.length).toBe(2);
});

test('Should not delete task of wrong user', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .expect(404);
    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
});

test('Should not create task with invalid description', async () => {
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: true,
            description: ''
        })
        .expect(400);
});

test('Should not update task with invalid completed', async () => {
    await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        completed: 'tram',
        description: 'description'
    })
    .expect(400);
});

test('Should delete user task', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `${userOne.tokens[0].token}`)
        .expect(200);
    const task = await Task.findById(taskOne._id);
    expect(task).toBeNull();
});

test('Should not delete task if unauthenticated', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .expect(401);
    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
});

test('Should not update other users task', async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            description: 'none',
            completed: true
        })
        .expect(404);
});

test('Should fetch user task by id', async () => {
    const response = await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200);
    const task = await Task.findById(taskOne._id);
    expect(response.body.description).toMatch(task.description);
});

test('Should not fetch user task by id if unauthenticated', async () => {
    await request(app)
        .get(`/tasks/${taskOne._id}`)
        .expect(401);
});

test('Should not fetch other users task by id', async () => {
    await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .expect(404);
});

test('Should fetch only completed tasks', async () => {
    const response = await request(app)
        .get('/tasks?completed=true')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200);
    const gotTasks = response.body.every((task) => task.completed === true);
    expect(gotTasks).toBe(true);
});



test('Should fetch only incomplete tasks', async () => {
    const response = await request(app)
        .get('/tasks?completed=false')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200);
    const gotTasks = !response.body.every((task) => task.completed === false);
    expect(gotTasks).toBe(false);
});

test('Should sort tasks by description', async () => {
    const response = await request(app)
        .get('/tasks?sortBy=description:asc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200);
    const check = response.body[0].description < response.body[1].description;
    expect(check).toBe(true);
});

test('Should sort tasks by completed', async () => {
    const response = await request(app)
        .get('/tasks?sortBy=completed:asc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200);
    const check = response.body[0].completed < response.body[1].completed;
    expect(check).toBe(true);
});

test('Should sort tasks by createdAt', async () => {
    const response = await request(app)
        .get('/tasks?sortBy=createdAt:asc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)
    const check = response.body[0].createdAt < response.body[1].createdAt;
    expect(check).toBe(true);
});

test('Should sort tasks by updatedAt', async () => {
    const response = await request(app)
        .get('/tasks?sortBy=updatedAt:asc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)
    const check = response.body[0].createdAt < response.body[1].createdAt;
    expect(check).toBe(true);
});

test('Should fetch page of tasks one task', async () => {
    const response = await request(app)
        .get('/tasks?limit=1')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200);
    expect(response.body.length).toBe(1);

})