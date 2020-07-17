const type = 'development';
// production or development or staging
let baseURL = "http://localhost"
if (type === 'production') baseURL = "https://api.openbeats.live"

const variables = {
  baseUrl: baseURL
}

const deploymentType = type;

module.exports = {
  variables,
  deploymentType
}