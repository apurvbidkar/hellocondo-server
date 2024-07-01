const fs = require('fs');
const path = require('path');

const services = ['admin-listing-ms', 'user-ms'];

services.forEach(service => {
  const sourcePath = path.join(__dirname, 'apps', service, 'Dockerfile');
  const destPath = path.join(__dirname, 'dist', 'apps', service, 'Dockerfile');

  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied Dockerfile for ${service} to dist/apps/${service}`);
  } else {
    console.error(`Dockerfile for ${service} not found`);
  }
});