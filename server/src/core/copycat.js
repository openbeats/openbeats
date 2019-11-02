import fetch from 'node-fetch';
import FormData from 'form-data';
import { JSDOM } from 'jsdom';


export default async (id, quality) => {
    let link = `https://www.youtube.com/watch?v=${id}`
    let outputLink = null;
    const analyzeLink = "https://www.youtubeconverter.io/convert-mp3";
    const convertLink = "https://www.youtubeconverter.io/convert/index";
    let formData = new FormData();
    formData.append("url", link);
    await fetch(analyzeLink,
        {
            method: 'post',
            body: formData,
        })
        .then(res => res.text())
        .then(async res => {
            let data = res.split("_id:'");
            let _id = data[1].substr(0, 24);
            let v_id = id;
            let fd = new FormData();
            fd.append("type", 'youtube');
            fd.append("_id", _id);
            fd.append("v_id", v_id);
            fd.append("ajax", '1');
            fd.append("ftype", 'mp3');
            fd.append("fquality", quality);
            await fetch(convertLink,
                {
                    method: 'post',
                    body: fd,
                })
                .then(res => res.json())
                .then(res => {
                    let dom = new JSDOM(res.result.trim());
                    let targetNode = dom.window.document.getElementsByClassName("btn-file");
                    if (targetNode.length > 0) {
                        outputLink = targetNode[0].getAttribute("href");
                    }
                })
        })
        .catch(err => console.log(err))
    return outputLink;
}



