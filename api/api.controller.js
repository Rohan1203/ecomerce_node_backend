const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const userService = require('./api.service');

// routes
router.post('/auth/register', registerSchema, register);
router.post('/auth/login', authenticateSchema, authenticate);
router.get('/buyer/list-of-sellers', authorize(), getAllSeller)
router.get('/buyer/create-order', getId);
// router.get('/', authorize(), getAll);
// router.get('/current', authorize(), getCurrent);
// router.get('/:id', authorize(), getById);
// router.put('/:id', authorize(), updateSchema, update);
// router.delete('/:id', authorize(), _delete);

module.exports = router;

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function registerSchema(req, res, next) {
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
    userService.create(req.body)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
}

function getAllSeller(req, res, next){
    if (req.user.type === 'buyer'){
        userService.getAllSeller()
        .then(sellers => res.json(sellers))
        .catch(next);
    } else {
        return res.json({ message:"You're not authorized" })
    }
}

function getId(req, res, next){
    userService.get(req.body)
    .then(() => res.json({ message: 'Catalog created successfully' }))
    .catch(next)
}

// function getAll(req, res, next) {
//     // console.log(authorize.user);
//     // if (authorize.User.dataValues.type === 'buyer'){
//         userService.getAll()
//             .then(users => res.json(users))
//             .catch(next);
//     // } else {
//     //     console.log("You're not authorized");
//     // }
// }

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