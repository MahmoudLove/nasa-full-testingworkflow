const API_URL = `http://localhost:8001/v1`;

async function httpGetPlanets() {
  // TODO: Once API is ready.
  // Load planets and return as JSON.
  const respone = await fetch(`${API_URL}/planets`);
  return await respone.json();
}

async function httpGetLaunches() {
  const fetchedLaunches = await fetch(`${API_URL}/launches`).then((res) =>
    res.json()
  );
  return fetchedLaunches.sort((a, b) => a.flightNumber - b.flightNumber);
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      method: 'POST',
      body: JSON.stringify(launch),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    return { ok: false };
  }
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: 'delete',
    });
  } catch (err) {
    console.log(err);
    return { ok: false };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
