import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import fs from "fs";
const fileName = "localdb.json";
fs.open(fileName, 'r', function (err, fd) {
    if (err) {
        fs.writeFile(fileName, '', function (err) {
            if (err) {
                console.log(err);
            } else {
            }
        });
    }
});
const adapter = new FileSync(fileName);
const localdb = lowdb(adapter);
localdb.defaults({ isfirst: true, opencharts: [], lastmodified: "" }).write();
export default localdb;
