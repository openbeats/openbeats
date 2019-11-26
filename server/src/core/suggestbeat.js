import fetch from "node-fetch";

export default async keyword => {
  let suggestions = [];

  const url = `https://clients1.google.com/complete/search?client=youtube&hl=en&gl=in&sugexp=brcmjc%2Cbrueb%3D1%2Cbruesk%3D1%2Cuimd%3D1%2Cbrmlmo%3Dyt%252Fen%253Aus%253Ayt_en_us_loc%252Cyt%252Fja%253A%253Ayt_cjk_loc%252Cyt%252Fko%253A%253Ayt_cjk_loc%252Cyt%252Fzh-TW%253A%253Ayt_cjk_loc%252Cyt%252Fzh-CN%253A%253Ayt_cjk_loc%252Cyt%252Fdefault%253A%253Ayt_i18n_loc%2Ccfro%3D1%2Cbrueb%3D1&gs_rn=64&gs_ri=youtube&tok=rSSsBe5Xjbc6evDhnFq1Ew&ds=yt&cp=2&gs_id=8&q=${encodeURI(
    keyword,
  )}&callback=google.sbox.p50&gs_gbg=jGJ7J1BaQuU5YRqac`;

  await fetch(url)
    .then(res => res.text())
    .then(res => {
      let tmp = res.replace("google.sbox.p50 && google.sbox.p50(", "");
      tmp = tmp.replace(")", "");
      let temp = JSON.parse(tmp)[1];
      suggestions = temp;
    })
    .catch(err => console.error(err));
  return suggestions;
};
