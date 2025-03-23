
const { spawn } = require('child_process');
const path = require('path');

// Path to server.ts file
const serverPath = path.join(__dirname, 'server.ts');

// Run server using ts-node
const server = spawn('npx', ['ts-node', serverPath], {
  stdio: 'inherit',
  shell: true
});

console.log('Server started...');

// Handle server process exit
server.on('close', code => {
  console.log(`Server process exited with code ${code}`);
});
