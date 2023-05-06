const http = require('http');
require('dotenv').config();
const { mongoConnect } = require('./services/mongo');
const app = require('./app');
const { loadPlanetsData } = require('./models/planet.model');
const { loadLaunchData } = require('./models/launches.model');
// const PORT = process.env.PORT || 8000;
const PORT = 8001;

// any middle ware or api will resposnd
const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData();
  server.listen(PORT, () => console.log(`server started on port ${PORT}`));
}

startServer();
