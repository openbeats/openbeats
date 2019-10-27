import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

export default async (queryString) => {
    let searchResults = [];
    const domGrab1 = "yt-lockup-video";
    let query = queryString.trim().replace(/ /g, "+");
    const searchLink = `https://www.youtube.com/results?search_query=${query}`
    console.log(searchLink)
    await fetch(searchLink)
        .then(async res => await res.text())
        .then(res => {
            let response = res.trim()
            let dom = new JSDOM(response);
            let targetNodes = dom.window.document.getElementsByClassName(domGrab1);
            for (let i = 0; i < targetNodes.length; i++) {
                let srcThumb = targetNodes[i].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].getAttribute("src");
                let thumb = targetNodes[i].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].getAttribute("data-thumb");
                if (thumb == null) {
                    thumb = srcThumb
                }
                let temp = {
                    "title": targetNodes[i].childNodes[0].childNodes[1].childNodes[0].childNodes[0].textContent,
                    "thumbnail": thumb,
                    "duration": targetNodes[i].childNodes[0].childNodes[0].childNodes[0].textContent.replace("\\\n\g", "").trim(),
                    "videoId": targetNodes[i].childNodes[0].childNodes[1].childNodes[0].childNodes[0].getAttribute("href").replace("/watch?v=", ""),
                    "channelName": targetNodes[i].childNodes[0].childNodes[1].childNodes[1].childNodes[0].textContent,
                    "uploadedOn": targetNodes[i].childNodes[0].childNodes[1].childNodes[2].childNodes[0].childNodes[0].textContent,
                    "views": targetNodes[i].childNodes[0].childNodes[1].childNodes[2].childNodes[0].childNodes[1].textContent
                };
                searchResults.push(temp)
            }

        })
        .catch(err => console.error(err))

    return searchResults
}