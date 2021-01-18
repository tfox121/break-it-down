const { readFileSync } = require('fs');
const { execSync } = require('child_process');

const rawData = readFileSync('package.json', { encoding: 'utf8' });

const packageData = JSON.parse(rawData);

execSync(`heroku create ${packageData.name} --buildpack mars/create-react-app`, {
  stdio: 'inherit',
});
