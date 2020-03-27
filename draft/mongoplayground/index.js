var mongo = require('mongodb');
var url = "mongodb://159.65.151.109:31080";
var dbNameString = "obs-db";
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
    const userPlaylistCollection = await mydb.collection(userPlaylistCollectionString);
    let playlistData = await (await userPlaylistCollection.find({})).toArray();
    const data = playlistData.map((item, key) => {
        let songs = item.songs;
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
        console.log(songs)
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
        mydb = dba.db(dbNameString);
        if (mydb) console.log("connected to db! " + url);
        const doLater = await coreProcess();
        await updateMe(doLater);
    } catch (error) {
        console.log(error.message);
    }
}

main();