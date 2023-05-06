const axios = require('axios');

const launchesDataBase = require('./launches.mongo');
const planets = require('./planets.mongo');
const launches = new Map();

const launch = {
  mission: 'new mission here', //name
  rocket: 'new rocket here', //rocket.name
  target: 'Kepler-1652 b',
  launchDate: new Date('27 decemter , 2030'), //date_local
  flightNumber: 100, //flight_number
  customers: ['NASA', 'ZTM'], // payload.customers
  upcoming: true, //upcoming
  success: true, //success
};

const DEFAULT_FLIGHT_NUMBER = 100;

async function findLaunch(filter) {
  return await launchesDataBase.findOne(filter);
}

async function existLanuchWithId(launchId) {
  // return launches.has(launchId);
  return await findLaunch({
    flightNumber: launchId,
  });
}
async function getLatestFlightNumber() {
  const latestLaunch = await launchesDataBase.findOne().sort('-flightNumber');
  if (!latestLaunch) return DEFAULT_FLIGHT_NUMBER;
  return latestLaunch.flightNumber;
}
// let latestFlightNumber = 100;

// launches.set(launch.flightNumber, launch);
saveLaunch(launch);

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function poulateLaunches() {
  console.log('loading launch data ......');
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,

      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        {
          path: 'payloads',
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log('error loading launch data');
    throw new Error('loading intia lunch data failed');
  }

  const launchDocs = response.data.docs;
  for (let launchDoc of launchDocs) {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload) => {
      return payload['customers'];
    });

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers,
    };

    console.log(launch.mission, ':', launch.flightNumber);
    await saveLaunch(launch);
  }
}

async function loadLaunchData() {
  const firstlaunchData = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });
  if (firstlaunchData) {
    console.log('intial lunch data alread loaded');
  } else await poulateLaunches();
}

async function saveLaunch(launch) {
  await launchesDataBase.updateOne(
    { flightNumber: launch.flightNumber },
    launch,
    { upsert: true }
  );
}

async function getAllLuanches(skip, limit) {
  // return Array.from(launches.values());
  return await launchesDataBase
    .find({}, { __v: 0, _id: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error('No matching planet found');
  }

  const newFlightNumber = Number(await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['Zero to Mastery', 'NASA'],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

// function addNewLaunch(launch) {
//   latestFlightNumber++;
//   launches.set(
//     latestFlightNumber,
//     Object.assign(launch, {
//       flightNumber: latestFlightNumber,
//       customers: ['NASA', 'ZTM'],
//       upcoming: true,
//       success: true,
//     })
//   );
// }

async function abortLaunchById(launchId) {
  //give some meta data  about the update
  const aborted = await launchesDataBase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  return aborted.modifiedCount === 1 && aborted.acknowledged === true;
  //   const aborted = launches.get(launchId);
  //   aborted.upcoming = false;
  //   aborted.success = false;
  //   return aborted;
}

module.exports = {
  existLanuchWithId,
  getAllLuanches,
  abortLaunchById,
  scheduleNewLaunch,
  loadLaunchData,
};
