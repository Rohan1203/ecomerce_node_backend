const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const service = require('./api.service');

// routes
router.post('/auth/register', registerUserSchema, register);
router.post('/auth/login', authenticateUserSchema, authenticate);
router.get('/buyer/list-of-sellers', authorize(), getAllSeller)
router.get('/buyer/seller-catalog/:seller_id', authorize(), getCatalog);
router.post('/buyer/create-order/:seller_id', authorize(), createOrder);
router.post('/seller/create-catalog', authorize(), createCatalog);
router.get('/seller/orders', authorize(), getOrder);
router.get('/', getAll);
// router.get('/current', authorize(), getCurrent);
// router.get('/:id', authorize(), getById);
// router.put('/:id', authorize(), updateSchema, update);
// router.delete('/:id', authorize(), _delete);

module.exports = router;

function authenticateUserSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    service.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function registerUserSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().min(6).required(),
        type: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    service.create(req.body)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
}

function getAllSeller(req, res, next){
    if (req.user.type === 'buyer'){
        service.getAllSeller()
        .then(sellers => res.json(sellers))
        .catch(next);
    } else {
        return res.json({ message:"You're not authorized" });
    }
}

function getCatalog(req, res, next) {
    service.getCatalog(req.params.seller_id)
    .then(catalogs => res.json(catalogs))
    .catch(next)
}

function createOrder(req, res, next){
    service.createOrder(req.params.seller_id, req.body)
    .then(() => res.json({ message: 'Oreder created successfully' }))
    .catch(next)
}

function getOrder(req, res, next) {
    if (req.user.type === 'seller'){
        service.getOrder(req.user.username)
        .then(orders => res.json(orders))
        .catch(next);
    } else {
        return res.json({ message:"You're not authorized" });
    }
}

function createCatalog(req, res, next) {
    if (req.user.type === 'seller'){
        service.createCatalog(req.user.id, req.body)
        .then(() => res.json({ message: 'Catalog created successfully' }))
        .catch(next)
    } else { 
        return res.json({ message:"You're not authorized" });
    }
}

function getAll(req, res, next) {
        service.getAll()
            .then(users => res.json(users))
            .catch(next);
}

// async function getCurrent(req, res, next) {
//     res.json(req.user);
// }

// function getById(req, res, next) {
//     userService.getById(req.params.id)
//         .then(user => res.json(user))
//         .catch(next);
// }

// function updateSchema(req, res, next) {
//     const schema = Joi.object({
//         firstName: Joi.string().empty(''),
//         lastName: Joi.string().empty(''),
//         username: Joi.string().empty(''),
//         password: Joi.string().min(6).empty(''),
//         type: Joi.string().required(),
//     });
//     validateRequest(req, next, schema);
// }

// function update(req, res, next) {
//     userService.update(req.params.id, req.body)
//         .then(user => res.json(user))
//         .catch(next);
// }

// function _delete(req, res, next) {
//     userService.delete(req.params.id)
//         .then(() => res.json({ message: 'User deleted successfully' }))
//         .catch(next);
// }