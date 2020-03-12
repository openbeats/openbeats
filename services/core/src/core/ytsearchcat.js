import fetchRetry from "./refetch"
import cheerio from "cheerio";

export default async (queryString, first = false) => {
	try {
		let searchResults = [];
		const baseQuery = ".yt-lockup-video";
		const removables = [".yt-lockup-channel", ".feed-item-container"];
		let query = decodeURIComponent(queryString);
		const searchLink = `https://www.youtube.com/results?search_query=${query}`;
		const res = (await (await fetchRetry(searchLink, 10)).text()).trim();
		let $ = cheerio.load(res);
		for (let i = 0; i < removables.length; i++) {
			if ($(removables[i]).length > 0) {
				$(removables[i]).remove();
			}
		}
		$(baseQuery).each((i, el) => {
			let srcThumb = $(el)
				.find(".yt-thumb-simple")
				.find("img")
				.attr("src");
			let thumb = $(el)
				.find(".yt-thumb-simple")
				.find("img")
				.attr("data-thumb");
			let duration = $(el)
				.find(".yt-thumb-simple")
				.text()
				.replace("\\\ng", "")
				.trim();
			if (thumb == null) {
				thumb = srcThumb;
			}
			let title = $(el)
				.find(".yt-uix-tile-link")
				.text();
			let videoId = $(el)
				.find(".yt-uix-tile-link")
				.attr("href")
				.replace("/watch?v=", "");

			if (videoId.includes("googleadservices")) return true;
			let channelName = $(el)
				.find(".yt-lockup-byline")
				.find("a")
				.text();
			let channelId = $(el)
				.find(".yt-lockup-byline")
				.find("a")
				.attr("href");
			let uploadedOn = "";
			let views = "";
			if (
				$(el)
				.find(".yt-lockup-meta-info")
				.find("li").length == 2
			) {
				uploadedOn = $(el)
					.find(".yt-lockup-meta-info")
					.find("li")
					.text()
					.trim();
				views = $(el)
					.find(".yt-lockup-meta-info")
					.find("li")
					.eq(1)
					.text()
					.trim();
			} else if (
				$(el)
				.find(".yt-lockup-meta-info")
				.find("li").length == 1
			) {
				let temp = $(el)
					.find(".yt-lockup-meta-info")
					.find("li")
					.text()
					.trim();
				if (temp.includes("views")) {
					views = temp;
				} else {
					uploadedOn = temp;
				}
			}

			if (views.length == 0) return true;

			let description = "";
			if ($(el).find(".yt-lockup-description").length > 0)
				description = $(el)
				.find(".yt-lockup-description")
				.text()
				.trim();

			let temp = {
				title: title,
				thumbnail: thumb,
				duration: duration,
				videoId: videoId,
				channelName: channelName,
				channelId: channelId,
				uploadedOn: uploadedOn,
				views: views,
				description: description,
			};
			searchResults.push(temp);
			if (first && searchResults.length > 0) {
				return false;
			}
		});
	} catch (error) {
		console.error(error.message);
	}
	return searchResults;
};