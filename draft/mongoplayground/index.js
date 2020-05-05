var mongo = require("mongodb");
var url = "mongodb+srv://obs-db:openbeats%40123@obs-db-prijj.mongodb.net";
var dbNameString = "obs-db";
var songsCollectionString = "songs";
let usersCollectionString = "users";
var userPlaylistCollectionString = "userPlaylists";
var userRecentlyPlayed = "users";
var mydb = null;

const songsCol = async songs => {
	try {
		const songCollection = await mydb.collection(songsCollectionString);
		await songCollection.insertMany([...songs], {
			ordered: false,
		});
	} catch (error) {}
};

const coreProcess = async () => {
	console.log("reaches here...");
	const userPlaylistCollection = await mydb.collection(userPlaylistCollectionString);
	let playlistData = await (await userPlaylistCollection.find({})).toArray();
	const data = playlistData.map((item, key) => {
		let songs = item.songs;
		console.log(songs);
		songs = songs.filter(sn => sn._id !== undefined);
		songs = songs.map(item => {
			return {
				...item,
				_id: item.videoId,
			};
		});
		try {
			songsCol(songs);
		} catch (error) {}
		songs = songs.map(item => item.videoId);
		return {
			id: item._id,
			songs: songs,
		};
	});
	return data;
};

const updateAvatar = async () => {
	console.log("reaches here...");
	const userCollection = await mydb.collection(usersCollectionString);
	let playlistData = await (await userCollection.find({})).toArray();
	for (let index = 0; index < playlistData.length; index++) {
		var myquery = { _id: playlistData[index]._id };
		var newvalues = {
			$set: {
				avatar: `https://ui-avatars.com/api/?rounded=true&name=${encodeURIComponent(
					playlistData[index].name.trim()
				)}&bold=true&background=F32C2C&color=C1CCCC`,
			},
		};
		await userCollection.updateOne(myquery, newvalues);
	}
};
const coreProcessv2 = async () => {
	console.log("reaches here...");

	const userPlaylistCollection = await mydb.collection("users");

	let playlistData = await (await userPlaylistCollection.find({})).toArray();
	const data = playlistData.map((item, key) => {
		let songs = item.recentlyPlayedSongs;
		if (songs) {
			songs = songs.filter(sn => sn._id !== undefined);
			songs = songs.map(item => {
				delete item.count;
				return {
					...item,
					_id: item.videoId,
				};
			});
			try {
				songsCol(songs);
			} catch (error) {}
			songs = songs.map(item => item.videoId);
		} else {
			songs = [];
		}
		return {
			id: item._id,
			songs: songs,
		};
	});
	return data;
};

const updateMev2 = async doLater => {
	try {
		doLater.map(async (item, key) => {
			console.log("update", key, item.id, item.songs.length);
			const userPlaylistCollection = mydb.collection(userRecentlyPlayed);
			if (item.songs.length) {
				console.log(item.id);

				await userPlaylistCollection.updateOne(
					{
						_id: item.id,
					},
					{
						$set: {
							recentlyPlayedSongs: [...item.songs],
						},
					}
				);
			}

			//console.log(user);
		});
		console.log("Done");
	} catch (error) {
		console.log(error.message);
	}
};

const updateMe = async doLater => {
	doLater.map(async (item, key) => {
		console.log("update", key, item.id, item.songs.length);
		const userPlaylistCollection = mydb.collection(userPlaylistCollectionString);
		if (item.songs.length)
			userPlaylistCollection.updateOne(
				{
					_id: item.id,
				},
				{
					$set: {
						songs: [...item.songs],
					},
				}
			);
	});
};

const main = async () => {
	try {
		const dba = await mongo.connect(url, {
			useUnifiedTopology: true,
		});
		mydb = dba.db(dbNameString);
		if (mydb) console.log("connected to db! " + url);
		await updateAvatar();
	} catch (error) {
		console.log(error.message);
	}
};

main();
