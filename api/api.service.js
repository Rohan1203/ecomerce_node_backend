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
    const catalog =  await catalogDb.Catalog.findOne({ where: { sellerId: seller_id }, attributes: ['id'] });
    if (catalog){
        return await productDb.Product.findAll({where: {catalogId: catalog.id}})
    } else {
        throw "Catalog doesn't exists"
    }
}

async function getOrder(seller_id) {
    return await orderDb.Order.findAll({ where: { sellerId: seller_id } });
    // let sql = `SELECT * FROM users`;
    // connection.query(sql, (error, results, fields) => {
    //     if (error) {
    //         return console.error(error.message);
    //     }
    //     console.log(results);
    // });
}

async function createCatalog(seller_id, list_body) {
    const user = await catalogDb.Catalog.findOne({where: { sellerId: seller_id } });
    if (user) throw 'Catalog exists';
    else {
        await catalogDb.Catalog.create({"sellerId":seller_id});
        const catalog =  await catalogDb.Catalog.findOne({ where: { sellerId: seller_id }, attributes: ['id'] });
        for (let i = 0; i < list_body.length; i++) {
            jsonRequest = {"catalogId":catalog.id, "name": list_body[i].name, "price":list_body[i].price}
            await productDb.Product.create(jsonRequest);
        }
    }
}


async function createOrder(seller_id, list_body){
    const user = await catalogDb.Catalog.findOne({where: { sellerId: seller_id } });
    if (user){
        const catalog =  await catalogDb.Catalog.findOne({ where: { sellerId: seller_id }, attributes: ['id'] });
        for (let i = 0; i < list_body.length; i++) {
            jsonRequest = {"productId":list_body[i].order, "catalogId": catalog.id, "sellerId":seller_id}
            await orderDb.Order.create(jsonRequest);
        }
    } else {
        throw "Catalog doesn't exists";
    }
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