require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify({ email: 'test_err3@example.com', password: 'Password123!' }) 
  }).then(r => r.json());
  
  const token = loginRes.accessToken;
  
  const dashboardRes = await fetch('http://localhost:5000/api/v1/dashboard/summary', { 
    method: 'GET', 
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer ' + token,
      'x-timezone': 'Asia/Calcutta'
    } 
  }).then(r => r.json());
  
  console.log('DASHBOARD (Asia/Calcutta):', dashboardRes.data.todayHabits);

  const dashboardResUTC = await fetch('http://localhost:5000/api/v1/dashboard/summary', { 
    method: 'GET', 
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer ' + token,
      'x-timezone': 'America/New_York'
    } 
  }).then(r => r.json());
  
  console.log('DASHBOARD (America/New_York):', dashboardResUTC.data.todayHabits);

  process.exit(0);
}

run().catch(console.error);
