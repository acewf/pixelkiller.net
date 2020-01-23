const { spawnSync } = require('child_process');
const args = ['run', 'export', 'entry', "/blog"];
console.log(args)
const child = spawnSync('npm', args,
  {
    stdio: 'inherit',
    shell: true
  });

// use child.stdout.setEncoding('utf8'); if you want text chunks
/* child.stdout.on('data', (chunk) => {
  console.log(chunk.toString())
  // data from standard output is here as buffers
}); */

console.log(child.error)

/* child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
}); */