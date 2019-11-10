import localdb from "../config/localdb";
import fetch from "node-fetch";
import cheerio from "cheerio";
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
    let songlist = [];
    let language = lang.substring(0, lang.indexOf("-"));
    try {
      let playres = await fetch(`https://www.radiomirchi.com/more/${lang}/`);
      playres = await playres.text();
      const $ = cheerio.load(playres.trim());
      $(".top01").each(async (i, el) => {
        let song;
        let rank = $(el)
          .find(".pannel01")
          .find(".place")
          .find(".circle")
          .text();
        let title = $(el)
          .children(".pannel02")
          .find(".header")
          .find("h2")
          .text();
        let thumbnail = $(el)
          .children(".pannel03")
          .find(".movieImg")
          .find("img")
          .attr("src");
        let videoId = null;
        if (thumbnail.includes("http://img.youtube.com")) {
          videoId = thumbnail.replace("https://", "").split("/")[4];
        }
        if (videoId) {
          song = {
            videoId,
            rank,
            title,
            thumbnail,
          };
          songlist.push(song);
        } else {
          try {
            const result = await ytcat(
              encodeURIComponent(title + " " + language),
              true,
            );
            videoId = result[0].videoId;
            thumbnail = result[0].thumbnail;
            song = {
              videoId,
              rank,
              title,
              thumbnail,
            };
            songlist.push(song);
          } catch (error) {
            console.error(error);
          }
        }
      });
      let playlist = {
        playlistTitle: lang,
        language,
        songlist,
        totalsongs: songlist.length,
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
    } catch (error) {
      console.error(error);
      continue;
    }
  }
  localdb.set("lastmodified", Date.now()).write();
  if (localdb.get("isfirst").value()) {
    localdb.set("isfirst", false).write();
  }
};
