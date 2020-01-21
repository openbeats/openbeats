import cron from "node-cron";
import updatePlaylist from "./updatePlaylist";
import localdb from "../config/localdb";

export default async () => {
	//cron.schedule("1 00 * * 0", async () => {
	console.log("cron started ...");
	const fetchlist = [
		"bangla-top-10",
		"kannada-top-20",
		"punjabi-top-10",
		"tamil-top-20",
		"telugu-top-20",
		"malayalam-top-20",
		"marathi-top-20",
		"mirchi-top-20",
	];
	for (let i of fetchlist) {
		let language = i.substring(0, i.indexOf("-"));
		language == "mirchi" ? (language = "hindi") : null;
		if (localdb.get("isfirst").value()) {
			localdb
				.get("opencharts")
				.push({
					playlistTitle: i,
					language,
					playlist: [],
					total: 0,
				})
				.value();
		} else {
			localdb
				.get("opencharts")
				.find({
					playlistTitle: i,
				})
				.assign({
					playlist: [],
				})
				.write();
		}
		updatePlaylist(i);
	}

	if (localdb.get("isfirst").value()) {
		localdb.set("isfirst", false).write();
	}

	localdb.set("lastmodified", Date.now().toString()).write();
	// });
};
