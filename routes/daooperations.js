const express = require('express');
const userModel = require('../models/User');
const auth = require('../middleware/auth');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const router = express.Router();

/**
 *  function to check health
 */
router.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<html> <h2>Welcome to POC !!! </h2></html>');
    res.end();
});

/**
 * function to do user login
 */
router.post('/login', async(request, response) => {
    console.log(`request from  UI ::${JSON.stringify(request.body)}`);
    var query = { name: { $eq: request.body.username }, password: { $eq: request.body.password }, pin: { $eq: request.body.pin } }
    const { error, value } = validateUserLoginRequestPayload(request.body);
    if (error) {
        return response.status(404).send(error.details[0].message);
    } else {
        try {
            userModel.findOne(query, function(err, user) {
                console.log(' response ---', user);

                if (err) {
                    console.log('error during find one', err);
                    throw new Error(err);
                }
                if (!user)
                    response.status(400).send({ 'status': 'e', 'message': 'username or password does not match' });
                else {
                    const token = jwt.sign({ _id: user._id }, process.env.secret || 'privateKey');
                    response.status(200).send({ 'status': 's', 'message': 'logged in successfully !!', 'token': token });
                }

            });

        } catch (err) {
            res.status(500).send(err);
        }

    }

});
/**
 * function to get all products
 */
router.get('/datalist', auth, async(request, response) => {
    userModel.find({}, function(err, users) {
        if (err) {
            console.log('error during find one', err);
            throw new Error(err);
        } else
            response.status(200).send(users);
    });

});
/**
 * function to get product by id
 */
router.get('/dataselect/:id', auth, async(request, response) => {
    console.log(`-- filter product id-- ${request.params.id}`);
    let query = {

        "products.id": {
            $eq: request.params.id

        }


    };
    try {
        userModel.findOne(query, function(err, productDetail) {
            console.log(' response ---', productDetail);

            if (err) {
                console.log('error during find one', err);
                throw new Error(err);
            }
            if (!productDetail)
                response.status(400).send({ 'message': 'no product' });
            else
                response.status(200).send(productDetail);
        });

    } catch (err) {
        res.status(500).send(err);
    }

});
/**
 * function to update product by id
 */
router.put('/dataupdate/:id', auth, async(request, response) => {
    console.log(`-- update product id-- ${request.params.id}`);
    console.log(`-- request object to update ${JSON.stringify(request.body)}`);
    var updateProductQuery = {
        "products.id": {
            $eq: request.params.id

        }
    };

    const { error, value } = validateupdateRequest(request.body);
    if (error) {
        return response.status(404).send(error.details[0].message);
    } else {
        var newvalues = { $set: { "products.name": request.body.name, "products.desc": request.body.desc } };
        try {
            userModel.update(updateProductQuery, newvalues, function(err, res) {
                console.log("-- res--", res);
                if (err) {
                    console.log('error during find one', err);
                    throw new Error(err);
                } else {
                    response.status(200).send({ 'message': 'updated successfully' });
                }
            });
        } catch (err) {
            res.status(500).send(err);
        }
    }

})

function validateUserLoginRequestPayload(requestPayload) {
    const schema = Joi.object({
        username: Joi.string().min(3).max(30).required(),
        password: Joi.string().min(3).max(30).required(),
        pin: Joi.string().min(3).max(5).required()
    });

    return schema.validate(requestPayload);
}

function validateupdateRequest(request) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        desc: Joi.string().min(3).max(40).required()
    });

    return schema.validate(request);

}

module.exports = router;