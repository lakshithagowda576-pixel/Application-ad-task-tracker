const net = require('net');
const path = require('path');
const { spawn } = require('child_process');

function getFreePort(startPort = 4200) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        resolve(getFreePort(startPort + 1));
      } else {
        reject(error);
      }
    });
    server.once('listening', () => {
      const address = server.address();
      server.close(() => resolve(address.port));
    });
    server.listen(startPort, '127.0.0.1');
  });
}

async function main() {
  const port = await getFreePort(4200);
  const frontendRoot = path.resolve(__dirname, '..');
  const ngBin = path.join(frontendRoot, 'node_modules', '@angular', 'cli', 'bin', 'ng.js');
  const child = spawn(process.execPath, [ngBin, 'serve', '--host', '0.0.0.0', '--port', String(port)], {
    cwd: frontendRoot,
    stdio: 'inherit',
    env: { ...process.env, PORT: String(port) }
  });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error('Failed to start Angular dev server:', error);
  process.exit(1);
});
