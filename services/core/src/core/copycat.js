import fetch from "node-fetch";
import FormData from "form-data";
import cheerio from "cheerio";

export default async (id, quality = "128", force = false) => {
  let outputLink = null;
  let link = `https://www.youtube.com/watch?v=${id}`;
  const analyzeLink = "https://www.youtubeconverter.io/convert-mp3";
  let formData = new FormData();
  formData.append("url", link);
  await fetch(analyzeLink, {
    method: "post",
    body: formData,
  })
    .then(res => res.text())
    .then(async res => {
      let $ = cheerio.load(res.trim());
      outputLink = $(".btn-file").attr("href");
    })
    .catch(err => console.error(err));
  return outputLink;
};