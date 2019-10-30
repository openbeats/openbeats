import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

export default async (queryString) => {
    let searchResults = [];
    const baseQuery = "yt-lockup-video";
    const removables = [
        "yt-lockup-channel",
        "feed-item-container"
    ]
    let query = queryString.trim().replace(/ /g, "+");
    const searchLink = `https://www.youtube.com/results?search_query=${query}`
    console.log(searchLink)
    await fetch(searchLink)
        .then(async res => await res.text())
        .then(res => {

            let response = res.trim()
            let dom = new JSDOM(response);

            for (let i = 0; i < removables.length; i++) {
                if (dom.window.document.getElementsByClassName(removables[i]).length > 0) {
                    dom.window.document.getElementsByClassName(removables[i])[0].remove()
                }
            }

            let targetNodes = dom.window.document.getElementsByClassName(baseQuery);


            for (let i = 0; i < targetNodes.length; i++) {
                let srcThumb = targetNodes[i].getElementsByClassName("yt-thumb-simple")[0].getElementsByTagName("img")[0].src;
                let thumb = targetNodes[i].getElementsByClassName("yt-thumb-simple")[0].getElementsByTagName("img")[0].getAttribute("data-thumb");
                let duration = targetNodes[i].getElementsByClassName("yt-thumb-simple")[0].textContent.replace("\\\n\g", "").trim()
                if (thumb == null) {
                    thumb = srcThumb
                }
                let title = targetNodes[i].getElementsByClassName("yt-uix-tile-link")[0].textContent;
                let videoId = targetNodes[i].getElementsByClassName("yt-uix-tile-link")[0].href.replace("/watch?v=", "");
                let channelName = targetNodes[i].getElementsByClassName("yt-lockup-byline")[0].getElementsByTagName("a")[0].textContent;
                let channelId = targetNodes[i].getElementsByClassName("yt-lockup-byline")[0].getElementsByTagName("a")[0].href;
                let uploadedOn = ""
                let views = "";
                if (targetNodes[i].getElementsByClassName("yt-lockup-meta-info")[0].getElementsByTagName("li").length == 2) {
                    uploadedOn = targetNodes[i].getElementsByClassName("yt-lockup-meta-info")[0].getElementsByTagName("li")[0].textContent.trim();
                    views = targetNodes[i].getElementsByClassName("yt-lockup-meta-info")[0].getElementsByTagName("li")[1].textContent.trim();
                } else if (targetNodes[i].getElementsByClassName("yt-lockup-meta-info")[0].getElementsByTagName("li").length == 1) {
                    let temp = targetNodes[i].getElementsByClassName("yt-lockup-meta-info")[0].getElementsByTagName("li")[0].textContent.trim();
                    if (temp.includes("views")) {
                        views = temp;
                    } else {
                        uploadedOn = temp;
                    }
                }
                let description = ""
                if (targetNodes[i].getElementsByClassName("yt-lockup-description").length > 0)
                    description = targetNodes[i].getElementsByClassName("yt-lockup-description")[0].textContent.trim();

                let temp = {
                    "title": title,
                    "thumbnail": thumb,
                    "duration": duration,
                    "videoId": videoId,
                    "channelName": channelName,
                    "channelId": channelId,
                    "uploadedOn": uploadedOn,
                    "views": views,
                    "description": description
                };
                searchResults.push(temp)
            }

        })
        .catch(err => console.error(err))

    return searchResults
}