const type = 'production';
// production or development or staging

let baseURL = "https://api.openbeats.live"
if (type === 'staging')
    baseURL = "https://staging-api.openbeats.live"

const variables = {
    baseUrl: baseURL
}

export {
    variables
}