import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
const adapter = new FileSync("localdb.json");
const localdb = lowdb(adapter);
export default localdb;
