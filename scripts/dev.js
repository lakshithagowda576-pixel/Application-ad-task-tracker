const { spawn } = require('child_process');

const root = process.cwd();

const backend = spawn('npm.cmd', ['--prefix', 'backend', 'start'], {
  cwd: root,
  stdio: 'inherit',
  shell: true
});

const frontend = spawn('npm.cmd', ['--prefix', 'frontend', 'start'], {
  cwd: root,
  stdio: 'inherit',
  shell: true
});

const shutdown = () => {
  backend.kill('SIGTERM');
  frontend.kill('SIGTERM');
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

backend.on('exit', (code) => {
  if (code !== 0) {
    frontend.kill('SIGTERM');
    process.exit(code ?? 1);
  }
});

frontend.on('exit', (code) => {
  if (code !== 0) {
    backend.kill('SIGTERM');
    process.exit(code ?? 1);
  }
});
