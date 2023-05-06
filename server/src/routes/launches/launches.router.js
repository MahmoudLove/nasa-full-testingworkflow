const express = require('express');

const {
  httpGetAllLuanches,
  httpAddNewLaunch,
  httpAbortLaunch
} = require('./launches.controllers');

const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllLuanches);
launchesRouter.post('/', httpAddNewLaunch);
launchesRouter.delete('/:id', httpAbortLaunch);

module.exports = launchesRouter;
