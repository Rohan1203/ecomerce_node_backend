const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var userDb = require('_helpers/user.db');
let catalogDb = require('_helpers/catalog.db');



module.exports = {
    authenticate,
    getAllSeller,
    getById,
    create,
    get
};

async function authenticate({ username, password }) {
    const user = await userDb.User.scope('withHash').findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.hash)))
        throw 'Username or password is incorrect';

    // authentication successful
    const token = jwt.sign({ sub: user.id, role: user.type }, config.secret, { expiresIn: '120s' });
    return { ...omitHash(user.get()), token };
}

async function getAllSeller() {
    return await userDb.User.findAll({ where: { type: "seller" } });
}

// async function getAll() {
//     return await db.User.findAll();
// }

async function getById(id) {
    return await getUser(id);
}

async function create(params) {
    // validate
    if (await userDb.User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    // hash password
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // save user
    await userDb.User.create(params);
}

async function get(params){
    await catalogDb.Catalog.create(params);
}

// async function update(id, params) {
//     const user = await getUser(id);

//     // validate
//     const usernameChanged = params.username && user.username !== params.username;
//     if (usernameChanged && await db.User.findOne({ where: { username: params.username } })) {
//         throw 'Username "' + params.username + '" is already taken';
//     }

//     // hash password if it was entered
//     if (params.password) {
//         params.hash = await bcrypt.hash(params.password, 10);
//     }

//     // copy params to user and save
//     Object.assign(user, params);
//     await user.save();

//     return omitHash(user.get());
// }

// async function _delete(id) {
//     const user = await getUser(id);
//     await user.destroy();
// }

// helper functions

// async function getUser(id) {
//     const user = await db.User.findByPk(id);
//     if (!user) throw 'User not found';
//     return user;
// }

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}