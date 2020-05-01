const type = "development";
// production or development or staging
let clientURL = "https://staging.openbeats.live";
let baseURL = "http://staging-api.openbeats.live";
if (type === "production") {
	baseURL = "https://api.openbeats.live";
	clientURL = "https://openbeats.live";
}
const variables = {
	baseUrl: baseURL,
	clientUrl: clientURL,
};
const isDev = type === "development" ? true : false;
export { variables, isDev };
