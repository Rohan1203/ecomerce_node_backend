const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userDb = require('_helpers/user.db');
const catalogDb = require('_helpers/catalog.db');
const orderDb = require('_helpers/order.db');
const productDb = require('_helpers/product.db');
const connection = require('_helpers/db.connect');


module.exports = {
    authenticate,
    getAllSeller,
    create,
    getOrder,
    getCatalog,
    createCatalog,
    createProduct,
    createOrder,
    getAll
};

async function authenticate({ username, password }) {
    const user = await userDb.User.scope('withHash').findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.hash)))
        throw 'Username or password is incorrect';

    // authentication successful
    const token = jwt.sign({ sub: user.id, role: user.type }, config.secret, { expiresIn: '1d' });
    return { ...omitHash(user.get()), token };
}

async function getAllSeller() {
    return await userDb.User.findAll({ where: { type: "seller" } });
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

async function getCatalog(seller_id) {
    return await catalogDb.Catalog.findAll({ where: { sellerId: seller_id } });
}

async function getOrder(username) {
    return await orderDb.Order.findAll({ where: { sellerId: username } });
    // let sql = `SELECT * FROM users`;
    // connection.query(sql, (error, results, fields) => {
    //     if (error) {
    //         return console.error(error.message);
    //     }
    //     console.log(results);
    // });
}

async function createCatalog(seller_id) {
    const user = await catalogDb.Catalog.findOne({where: { sellerId: seller_id } });
    if (user) throw 'Catalog Exists';
    else {
        await catalogDb.Catalog.create({"sellerId":seller_id});
        return await catalogDb.Catalog.findOne({ where: { sellerId: seller_id }, attributes: ['id'] });
    }
}

async function createProduct(params) {
        return await productDb.Product.create(params);
        // connection.query('select * from test');    
}

async function createOrder(params){
    orderDb.Order()
}

async function getAll() {
    return await userDb.User.findAll();
}

// async function getById(id) {
//     return await getUser(id);
// }

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