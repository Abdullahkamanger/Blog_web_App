async function test() {
  try {
    // Register
    const name = 'Admin Test ' + Date.now();
    const email = `admin${Date.now()}@test.com`;
    console.log('Registering...');
    await fetch('http://localhost:8000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: 'password', role: 'ADMIN' })
    });
    
    // Login
    console.log('Logging in...');
    const loginRes = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Token:', token);
    
    // Fetch Admin Stats
    console.log('Fetching stats...');
    const statsRes = await fetch('http://localhost:8000/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const statsData = await statsRes.json();
    console.log('Stats status:', statsRes.status);
    console.log('Stats:', statsData);
  } catch (err) {
    console.error('Test Failed:', err.message);
  }
}

test();
