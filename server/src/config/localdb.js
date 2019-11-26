import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
const fileName = "localdb.json";
const adapter = new FileSync(fileName);
const localdb = lowdb(adapter);
localdb.defaults({ isfirst: true, opencharts: [], lastmodified: "" }).write();
export default localdb;
