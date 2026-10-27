const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

async function waitForServer(port, retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${port}/api/db/status`, res => {
          if (res.statusCode === 200) resolve();
          else reject(new Error(`Status ${res.statusCode}`));
        });
        req.on('error', reject);
        req.setTimeout(500, () => {
          req.destroy();
          reject(new Error('timeout'));
        });
      });
      return true;
    } catch (e) {
      await new Promise(r => setTimeout(r, 200));
    }
  }
  throw new Error('Server did not start in time');
}

function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const proc = spawn(process.execPath, [scriptPath], {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    proc.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`Script ${scriptPath} exited with code ${code}`));
    });
  });
}

async function main() {
  const serverPath = path.join(__dirname, '..', 'server.js');
  console.log('Starting CareerConnect server for integration testing...');
  const serverProc = spawn(process.execPath, [serverPath], {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  try {
    await waitForServer(3000);
    console.log('Server is UP! Running test-auth-investigation.js...\n');
    await runScript(path.join(__dirname, 'test-auth-investigation.js'));

    console.log('\nRunning test-complete-system.js...\n');
    await runScript(path.join(__dirname, 'test-complete-system.js'));

    console.log('\nALL INTEGRATION TESTS PASSED SUCCESSFULLY!');
  } finally {
    console.log('Shutting down test server...');
    serverProc.kill('SIGINT');
  }
}

main().catch(err => {
  console.error('Integration run error:', err);
  process.exit(1);
});
