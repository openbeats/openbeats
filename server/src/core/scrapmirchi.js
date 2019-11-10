import localdb from "../config/localdb";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import ytdl from "ytdl-core";
import ytcat from "./ytsearchcat";

localdb.defaults({ isfirst: true, opencharts: [], lastmodified: "" }).write();

export default async () => {
  const fetchlist = [
    "punjabi-top-10",
    "tamil-top-20",
    "telugu-top-20",
    "malayalam-top-20",
    "marathi-top-20",
    "kannada-top-20",
    "bangla-top-10",
  ];
  for (let lang of fetchlist) {
    let totalsongs = 0;
    try {
      let playres = await fetch(`https://www.radiomirchi.com/more/${lang}/`);
      playres = await playres.text();
      let language = lang.substring(0, lang.indexOf("-"));
      let DOM = new JSDOM(playres.trim());
      let targetCollection = DOM.window.document.getElementsByClassName(
        "top01",
      );
      let songlist = [];
      for (let i = 0; i < targetCollection.length; i++) {
        let rank = i + 1;
        let title = targetCollection[i].children
          .item(3)
          .getElementsByClassName("header")[0]
          .getElementsByTagName("h2")[0].textContent;
        let thumbnail = targetCollection[i].children
          .item(4)
          .getElementsByClassName("movieImg")[0]
          .getElementsByTagName("img")[0].src;
        let videoId = "";
        if (thumbnail.replace("https://", "").split("/")[4]) {
          videoId = thumbnail.replace("https://", "").split("/")[4];
          console.log(videoId);
        }
        if (ytdl.validateID(videoId)) {
          totalsongs += 1;
          let song = {
            videoId,
            rank,
            title,
            thumbnail,
          };
          songlist.push(song);
        } else {
          try {
            totalsongs += 1;
            let result = await ytcat(
              encodeURIComponent(title + " " + language),
              true,
            );
            let videoId = result[0].videoId;
            let thumbnail = result[0].thumbnail;
            let song = {
              videoId,
              rank,
              title,
              thumbnail,
            };
            songlist.push(song);
          } catch (err) {
            console.error(err);
          }
        }
      }
      if (songlist.length > 0) {
        let playlist = {
          playlistTitle: lang,
          language,
          songlist,
          totalsongs,
        };
        if (localdb.get("isfirst").value()) {
          localdb
            .get("opencharts")
            .push(playlist)
            .write();
        } else {
          localdb
            .get("opencharts")
            .find({ playlistTitle: lang })
            .assign(playlist)
            .write();
        }
      }
    } catch (error) {
      console.error(error.message);
      continue;
    }
  }
  localdb.set("lastmodified", Date.now()).write();
  if (localdb.get("isfirst").value()) {
    localdb.set("isfirst", false).write();
  }
};
