const express = require('express');

const { httpGetAllplanets } = require('./planets.controller');

const planetRouter = express.Router();

planetRouter.get('/', httpGetAllplanets);

module.exports = planetRouter;
