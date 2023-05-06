const {
  getAllLuanches,
  abortLaunchById,
  existLanuchWithId,
  scheduleNewLaunch,
} = require('../../models/launches.model');

const { getPagination } = require('../../services/query');

async function httpGetAllLuanches(req, res) {
  //http://localhost:8001/v1/launches?limit=5&page=1
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLuanches(skip, limit);
  return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: 'Missing required launch property',
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'Invalid launch date',
    });
  }

  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = +req.params.id;

  const exist = await existLanuchWithId(launchId);

  if (!exist) {
    return res.status(404).json({
      error: 'no lanuch found with this id',
    });
  }
  const aborted = await abortLaunchById(launchId);
  if (!aborted)
    return res.status(400).json({
      error: 'No abortion happened',
    });
  return res.status(200).json({
    ok: true,
  });
}
module.exports = { httpGetAllLuanches, httpAddNewLaunch, httpAbortLaunch };
