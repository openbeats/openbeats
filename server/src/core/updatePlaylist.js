import fetchRetry from "./refetch";
import cheerio from "cheerio";
import ytcat from "./ytsearchcat";
import localdb from "../config/localdb";
let playlist = null;

export default async lang => {
  let language = lang.substring(0, lang.indexOf("-"));
  try {
    let playres = await fetchRetry(
      `https://www.radiomirchi.com/more/${lang}/`,
      2
    );
    playres = await playres.text();
    const $ = cheerio.load(playres.trim());
    $(".top01").each(async (i, el) => {
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
      let temp = null;
      if (thumbnail.includes("http://img.youtube.com")) {
        videoId = thumbnail.replace("https://", "").split("/")[4];
      }
      if (videoId) {
        temp = {
          videoId,
          rank,
          title,
          thumbnail
        };
        playlist = localdb
          .get("opencharts")
          .find({ playlistTitle: lang })
          .get("playlist")
          .value();
        playlist.push(temp);
        localdb
          .get("opencharts")
          .find({ playlistTitle: lang })
          .assign({ playlist: playlist, total: playlist.length })
          .write();
      } else {
        let n = 0;
        while (true) {
          if (n < 2) {
            if (await coreFallback(title, language, rank, lang)) {
              break
            }
          } else {
            break
          }
          n++;
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
};

async function coreFallback(title, language, rank, lang) {
  let videoId = null;
  let thumbnail = null;
  let temp = null;
  let isSuccess = false;
  await ytcat(encodeURIComponent(title + " " + language), true)
    .then(result => {
      if (result.length != 0) {
        videoId = result[0].videoId;
        thumbnail = result[0].thumbnail;
        temp = {
          videoId,
          rank,
          title,
          thumbnail
        };
        playlist = localdb
          .get("opencharts")
          .find({ playlistTitle: lang })
          .get("playlist")
          .value();
        playlist.push(temp);
        localdb
          .get("opencharts")
          .find({ playlistTitle: lang })
          .assign({ playlist, total: playlist.length })
          .write();
        isSuccess = true;
      } else {
        isSuccess = false;
      }
    })
    .catch(err => {
      console.error(err);
      isSuccess = false
    });

  return isSuccess

}