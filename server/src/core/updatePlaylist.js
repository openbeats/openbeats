import fetchRetry from "./refetch";
import cheerio from "cheerio";
import ytcat from "./ytsearchcat";
import localdb from "../config/localdb";

export default async lang => {
  let playlist = null;
  let language = lang.substring(0, lang.indexOf("-"));
  try {
    let playres = await fetchRetry(
      `https://www.radiomirchi.com/more/${lang}/`,
      2
    );
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
          .assign({ playlist })
          .write();
      } else {
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
                .assign({ playlist })
                .write();
            } else {
              console.error(result);
              console.error(title + language);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  } catch (error) {
    console.error(error);
  }
};
