const { getAllplanets } = require('../../models/planet.model');

async function httpGetAllplanets(req, res) {
  console.log('hi');
  res.status(200).json(await getAllplanets());
}
module.exports = { httpGetAllplanets };
