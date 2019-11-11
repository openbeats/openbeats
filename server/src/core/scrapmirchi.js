import fetchRetry from "./refetch";
import cheerio from "cheerio";
import ytcat from "./ytsearchcat";

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
  let response = [];
  for (let lang of fetchlist) {
    let playlist = {};
    let totalsongs;
    let songlist = [];
    let language = lang.substring(0, lang.indexOf("-"));
    try {
      let playres = await fetchRetry(
        `https://www.radiomirchi.com/more/${lang}/`,
        2,
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
        if (thumbnail.includes("http://img.youtube.com")) {
          videoId = thumbnail.replace("https://", "").split("/")[4];
        }
        if (videoId) {
          totalsongs += 1;
          song = {
            videoId,
            rank,
            title,
            thumbnail,
          };
          songlist.push(song);
        } else {
          if (language === "kannada" || language === "bangla") {
            console.log(title + " " + language);
          }
          song = await ytcat(encodeURIComponent(title + " " + language), true)
            .then(result => {
              totalsongs += 1;
              console.log(title + " " + language);
              videoId = result[0].videoId;
              console.log(videoId);
              thumbnail = result[0].thumbnail;
              let temp = {
                videoId,
                rank,
                title,
                thumbnail,
              };
              return temp;
            })
            .catch(err => {
              console.log(err);
            });
          songlist.push(song);
        }
      });
      playlist.playlistTitle = lang;
      playlist.language = language;
      playlist.songlist = songlist;
      playlist.totalsongs = totalsongs;
      response.push(playlist);
    } catch (error) {
      console.error(error);
      continue;
    }
  }
  return response;
};
