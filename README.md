# task-manager-backend

Basic nodejs task manager with authentication

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have nodejs verion 10 or newer and [mongodb](https://www.mongodb.com/)


### Installing

After pulling from repo run standart command

```
npm i
```

You would need to create config directory with two .env files for "dev.env and "test.env" with the following parameters

```
PORT=<your port goes here>
SENDGRID_API_KEY=<your sendgrid api key goes here>
MONGODB_URL=<url to access your mongo db>
JWT_SECRET=<your encription key goes here>
```

You can create a new user using http post method
```
hostname/users
```
With request body
```
"name": "<username>",
"email": "<email>",
"password": "<password>",
"age": <age> //optional
```


To login, send post request with email and password to
```
hostname/users
```
To run additional requests authToken must be sent in request header.
Authorization type is Bearer Token

### User requests

#### POST requests
To logout of current session and to terminate all sessions
```
hostname/users/logout
hostname/users/logoutAll
```
To upload user avatar
```
hostname/users/me/avatar
```
with body
```
"avatar": <file>
```
#### GET requests
To get user information
```
hostname/users/me
```
#### PATCH requests
```
hostname/users/me
```
With body of updates for user
```
"name": "<new name>",
"password": "<new password>",
"age": <new age>,
"email": "<new email>"
```
Only these updates are allowed

#### DELETE requests

Delete user and all tasks of this user
```
hostname/users/me
```
Delete user avatar
```
hostname/users/me/avatar
```

### Tasks requests
#### POST requests
```
/tasks
```
In the body of this request might be two parameters "description" and "completed", first one is required second by default is false. 

#### GET requests
You can get tasks by id
```
hostname/tasks/:id
```
Additionaly you can get all tasks of the user
```
/tasks
```
With the parameters ```skip=<number>```, ```limit=<number>``` for pagination,
and sorting parameter ```sortBy=```.
```sortBy``` accepts only the following values ```createdAt```, ```updatedAt```, ```description``` and ```completed```. 
With modifyer ```asc``` or ```desc```.
```
hostname/tasks?limit=10&skip=5&sortBy=createdAt:desc
```
#### PATCH requests
```
/tasks/:id
```
To change task properties ```description``` and ```completed```.

#### DELETE requests
Delete single task
```
/tasks/:id
```
## Built with
* [sendgrid](https://sendgrid.com/) - V 6.3.1",
* [bcryptjs](https://www.npmjs.com/package/bcryptjs) - V 2.4.3",
* [express](https://www.npmjs.com/package/express) - V 4.16.4",
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - V 8.4.0",
* [mongodb](https://www.npmjs.com/package/mongodb) - V 3.5.5",
* [mongoose](https://www.npmjs.com/package/mongoose) - V 5.9.6",
* [multer](https://www.npmjs.com/package/multer) - V 1.4.1",
* [sharp](https://www.npmjs.com/package/sharp) - V 0.25.2",
* [validator](https://www.npmjs.com/package/validator) - V 10.9.0

## Dev dependencies used
* [env-cmd](https://www.npmjs.com/package/env-cmd) - V 8.0.2
* [jest](https://www.npmjs.com/package/jest) - V 25.2.6
* [nodemon](https://www.npmjs.com/package/nodemon)  - V 1.18.9
* [supertest](https://www.npmjs.com/package/supertest) - V 3.4.1



