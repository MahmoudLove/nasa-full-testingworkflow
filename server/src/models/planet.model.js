const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const planets = require('./planets.mongo');
//on returns the event emitter that it is put in to -- buffer represent collection of bytes
const habitualPlanets = [];
// readable.pipe(writable)
function isHabitualPlant(planet) {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  );
}
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, '..', '..', 'data', `kepler_data.csv`)
    )
      .pipe(
        parse({
          comment: '#',
          columns: true, //return key value paris rather than array of values
        })
      )

      .on('data', async (data) => {
        if (isHabitualPlant(data)) {
          // habitualPlanets.push(data);
          savePlanet(data);
        }
      })
      .on('error', (err) => {
        reject(err);
      })
      .on('end', async () => {
        // console.log(
        //   habitualPlanets.map((planet) => {
        //     return planet['kepler_name'];
        //   })
        // );
        // console.log(`NUMBER OF CAPITUAL PLAENTS${habitualPlanets.length}`);
        const countPlanetsFound = (await getAllplanets()).length;
        console.log(`NUMBER OF CAPITUAL PLAENTS : ${countPlanetsFound}`);
        resolve();
      });
  });
}
async function getAllplanets() {
  // return habitualPlanets;
  return await planets.find(
    {},
    {
      __v: 0,
      _id: 0,
    }
  );
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      { keplerName: planet.kepler_name },
      { upsert: true }
    );
  } catch (error) {
    console.log(`CHOIUD NOT ADD PLANET ${error}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllplanets,
};
