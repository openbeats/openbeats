const type = 'production';
// production or development or staging
let baseURL = "https://staging-api.openbeats.live"
if (type === 'production')
  baseURL = "https://api.openbeats.live"
const variables = {
  baseUrl: baseURL
}
const deploymentType = type;

module.exports = {
  variables,
  deploymentType
}