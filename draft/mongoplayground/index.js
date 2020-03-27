var mongo = require('mongodb');
var url = "mongodb://localhost:27017";
var dbNameString = "migrationtest";
var songsCollectionString = "songs";
var userPlaylistCollectionString = "userPlaylists";
var mydb = null;

const songsCol = async (songs) => {
    try {
        const songCollection = await mydb.collection(songsCollectionString);
        await songCollection.insertMany([...songs], {
            ordered: false
        })
    } catch (error) {}
}

const coreProcess = async () => {
    console.log("reaches here...")
    const userPlaylistCollection = await mydb.collection(userPlaylistCollectionString);
    let playlistData = await (await userPlaylistCollection.find({})).toArray();
    const data = playlistData.map((item, key) => {
        let songs = item.songs;
        console.log(songs)
        songs = songs.filter(sn => sn._id !== undefined);
        songs = songs.map(item => {
            return {
                ...item,
                _id: item.videoId
            }
        })
        try {
            songsCol(songs);
        } catch (error) {}
        songs = songs.map(item => item.videoId);
        return {
            id: item._id,
            songs: songs
        };
    })
    return data;
}

const updateMe = async (doLater) => {
    doLater.map(async (item, key) => {
        console.log("update", key, item.id, item.songs.length)
        const userPlaylistCollection = mydb.collection(userPlaylistCollectionString);
        if (item.songs.length)
            userPlaylistCollection.updateOne({
                _id: item.id
            }, {
                $set: {
                    songs: [...item.songs]
                }
            });
    })
}

const main = async () => {
    try {
        const dba = await mongo.connect(url, {
            useUnifiedTopology: true
        });
        mydb = await dba.db(dbNameString);
        if (mydb) console.log("connected to db! " + url);
        const doLater = await coreProcess();
        await updateMe(doLater);
    } catch (error) {
        console.log(error.message);
    }
}

main();