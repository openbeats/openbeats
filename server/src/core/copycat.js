import fetch from 'node-fetch';
import FormData from 'form-data';
import { emit } from 'cluster';

export class Copycat {
    constructor(vidLink) {
        this.vidLink = vidLink;
        this.link = null;
    }

    async generateAudioLink() {
        const analyzeLink = "https://mate09.y2mate.com/analyze/ajax";
        const convertLink = "https://mate09.y2mate.com/convert";
        let formData = new FormData();
        let testUrl = this.vidLink;
        formData.append("url", testUrl);
        formData.append("ajax", '1');

        await fetch(analyzeLink,
            {
                method: 'post',
                body: formData,
            })
            .then(res => res.json())
            .then(async res => {
                let data = res.result.split(" ");
                let _id = data[data.indexOf("_id:") + 1];
                let v_id = data[data.indexOf("v_id:") + 1];
                _id = _id.replace("'", "")
                _id = _id.replace("'", "")
                _id = _id.replace(",", "")
                v_id = v_id.replace("'", "")
                v_id = v_id.replace("'", "")
                v_id = v_id.replace(",", "")
                let fd = new FormData();

                fd.append("type", 'youtube');
                fd.append("_id", _id);
                fd.append("v_id", v_id);
                fd.append("ajax", '1');
                fd.append("ftype", 'mp3');
                fd.append("fquality", '128');

                await fetch(convertLink,
                    {
                        method: 'post',
                        body: fd,
                    })
                    .then(res => res.json())
                    .then(res => {
                        let temp = res.result;
                        temp = temp.replace("\\r", "");
                        temp = temp.replace("\\n", "");
                        temp = temp.replace("\\", "");
                        temp = temp.split("\"");
                        this.link = temp[temp.indexOf(`>\r\n    <a href=`) + 1]
                    })
            })
            .catch(err => console.log(err))
        return this.link;
    }
}



