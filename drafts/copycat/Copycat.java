package copycat;

/**
 * Copycat
 */

import java.io.IOException;
import java.util.List;

public class Copycat {

    String targetUrl = null;
    String analyzeLink = "https://mate09.y2mate.com/analyze/ajax";
    String audioLink = "https://mate09.y2mate.com/convert";
    String charset = "UTF-8";

    Copycat(String url) {
        this.targetUrl = url;
    }

    private String audio() {
        String outputUrl = null;
        String[] analyzeLink = analyzeLink();
        if (analyzeLink != null) {
            outputUrl = getAudioLink(analyzeLink);
        }
        return outputUrl;
    }

    private String[] analyzeLink() {
        String[] output = new String[2];
        try {
            MultipartUtility multipart = new MultipartUtility(this.analyzeLink, this.charset);

            multipart.addHeaderField("User-Agent", "copycat");

            multipart.addFormField("url", this.targetUrl);
            multipart.addFormField("ajax", "1");

            List<String> response = multipart.finish();

            String tempResponse = null;
            for (String line : response) {
                tempResponse += line;
            }

            output[0] = tempResponse.substring(tempResponse.indexOf(", _id: '") + 8,
                    tempResponse.indexOf(", v_id: '") - 1);
            output[1] = tempResponse.substring(tempResponse.indexOf(", v_id: '") + 9,
                    tempResponse.indexOf("', ajax: 1, token:"));

        } catch (IOException ex) {
            System.err.println(ex);
        }
        return output;
    }

    private String getAudioLink(String[] analyzeIds) {
        String output = null;
        String _id = analyzeIds[0];
        String v_id = analyzeIds[1];
        try {
            MultipartUtility multipart = new MultipartUtility(this.audioLink, this.charset);
            multipart.addHeaderField("User-Agent", "copycat");
            multipart.addFormField("type", "youtube");
            multipart.addFormField("_id", _id);
            multipart.addFormField("v_id", v_id);
            multipart.addFormField("ajax", "1");
            multipart.addFormField("ftype", "mp3");
            multipart.addFormField("fquality", "128");
            List<String> response = multipart.finish();
            String tempResponse = null;
            for (String line : response) {
                tempResponse += line;
            }
            tempResponse = tempResponse.replace("\\r", "");
            tempResponse = tempResponse.replace("\\n", "");
            tempResponse = tempResponse.replace("\\", "");
            output = tempResponse.substring(tempResponse.indexOf("<a href=") + 9,
                    tempResponse.indexOf("\" rel=\"nofollow\""));
        } catch (IOException ex) {
            System.err.println(ex);
        }
        return output;
    }

    public static void main(String[] args) {
        Copycat cc = new Copycat("https://www.youtube.com/watch?v=0D22PcN9Wds");
        System.out.println(cc.audio());
    }

}