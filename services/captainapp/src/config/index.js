const type = 'development';
// production or development or staging
let baseURL = "https://staging-api.openbeats.live"
if (type === 'production')
    baseURL = "https://api.openbeats.live"
const variables = {
    baseUrl: baseURL
}
export {
    variables
}