import {
	toastActions,
	nowPlayingActions,
	// playerActions
} from ".";
import {
	store
} from "../store";
import {
	variables
} from "../config";
import {
	musicDummy
} from "../assets/images";
// import {
//     push
// } from "connected-react-router";
import {
	Base64
} from "js-base64";
import axios from "axios";

export function playPauseToggle() {
	const playerRef = document.getElementById("music-player");
	const state = store.getState().playerReducer;
	if (state.masterUrl) {
		let payload = false;
		if (state.isMusicPlaying) {
			playerRef.pause();
			payload = false;
		} else {
			playerRef.play();
			payload = true;
		}
		return {
			type: "PLAY_PAUSE_TOGGLE",
			payload,
		};
	} else {
		toastActions.showMessage(
			"Please Search and Add Music \n to your playlist to play !",
		);
		return null;
	}
}

export function muteToggle() {
	let payload = {};
	const playerRef = document.getElementById("music-player");
	playerRef.muted = !playerRef.muted;
	if (playerRef.muted) {
		payload = {
			isMuted: true,
			playerVolume: 0,
		};
	} else {
		if (playerRef.volume === 0) {
			playerRef.volume += 0.1;
		}
		payload = {
			isMuted: false,
			playerVolume: playerRef.volume,
		};
	}
	return {
		type: "MUTE_TOGGLE",
		payload,
	};
}

export function volumeSeekHandler(forward = true) {
	let payload = {};
	const playerRef = document.getElementById("music-player");
	if (forward) {
		playerRef.muted = false;
		if (playerRef.volume <= 0.9) playerRef.volume += 0.1;
		else playerRef.volume = 1;

		payload = {
			isMuted: false,
			playerVolume: playerRef.volume,
		};
	} else {
		if (playerRef.volume <= 0.2) {
			playerRef.volume = 0;
			playerRef.muted = true;
			payload = {
				playerVolume: 0,
				isMuted: true,
			};
		} else {
			playerRef.muted = false;
			playerRef.volume -= 0.1;
			payload = {
				playerVolume: playerRef.volume,
				isMuted: false,
			};
		}
	}

	return {
		type: "SEEK_VOLUME",
		payload,
	};
}

export function updateVolume(e) {
	let payload = {};
	const playerRef = document.getElementById("music-player");

	playerRef.volume = e.target.value;
	if (playerRef.volume > 0) {
		playerRef.muted = false;
		payload = {
			isMuted: false,
			playerVolume: playerRef.volume,
		};
	} else {
		playerRef.muted = true;
		payload = {
			isMuted: true,
			playerVolume: playerRef.volume,
		};
	}
	return {
		type: "UPDATE_VOLUME",
		payload,
	};
}

export function setFullVolumeForMobile() {
	let payload = {};
	const playerRef = document.getElementById("music-player");

	playerRef.volume = 1.0;
	playerRef.muted = false;
	payload = {
		isMuted: false,
		playerVolume: playerRef.volume,
	};
	store.dispatch({
		type: "UPDATE_VOLUME",
		payload
	});
}

export function setTotalDuration() {
	const playerRef = document.getElementById("music-player");
	var durmins = Math.floor(playerRef.duration / 60);
	var dursecs = Math.floor(playerRef.duration - durmins * 60);
	return {
		type: "SET_TOTAL_DURATION",
		payload: {
			durationTimeText: durmins.toString() + ":" + dursecs.toString(),
		},
	};
}

export function audioSeekHandler(forward) {
	const state = store.getState().playerReducer;
	if (state.masterUrl) {
		const audio = document.getElementById("music-player");
		if (forward) audio.currentTime += 5;
		else audio.currentTime -= 5;
	}
	return true;
}

export function playerTimeUpdater(e) {
	let payload = {};
	let currentTime = e.target.currentTime;
	let duration = e.target.duration;
	let curmins = Math.floor(currentTime / 60);
	let cursecs = Math.floor(currentTime - curmins * 60);
	let durmins = Math.floor(duration / 60);
	let dursecs = Math.floor(duration - durmins * 60);
	if (cursecs < 10) {
		cursecs = "0" + cursecs;
	}
	if (dursecs < 10) {
		dursecs = "0" + dursecs;
	}
	if (curmins < 10) {
		curmins = "0" + curmins;
	}
	if (durmins < 10) {
		durmins = "0" + durmins;
	}
	payload = {
		currentProgress: currentTime * (100 / duration),
		currentTimeText: curmins + ":" + cursecs,
	};
	return {
		type: "AUDIO_PROGRESS_UPDATE",
		payload,
	};
}

export function seekAudio(e) {
	const playerRef = document.getElementById("music-player");
	const state = store.getState().playerReducer;
	if (state.masterUrl) {
		playerRef.currentTime = playerRef.duration * (e / 100);
	}
	return true;
}

export function musicEndHandler() {
	let state = store.getState().nowPlayingReducer;
	if (state.isPlaylist)
		if (state.isPlaylist && state.playerQueue.length === state.currentIndex + 1)
			nowPlayingActions.reQueue();
		else nowPlayingActions.playNextSong();
	else nowPlayingActions.updateCurrentPlaying(state.currentPlaying, false);
}

export async function resetPlayer() {
	let payload = {};
	const player = document.getElementById("music-player");
	const source1 = document.getElementById("audio-source-1");
	const source2 = document.getElementById("audio-source-2");
	if (player) {
		await player.pause();
		player.currentTime = 0;
		source1.src = "";
		source2.src = "";
	}
	payload = {
		masterUrl: null,
		fallBackUrl: null,
		isMusicPlaying: false,
		currentProgress: 0,
		currentTimeText: "00:00",
		durationTimeText: "00:00",
		thumbnail: musicDummy,
		songTitle: "OpenBeats Stream Unlimited Music!",
		id: null,
		isAudioBuffering: false,
	};

	return {
		type: "MUSIC_END_HANDLER",
		payload,
	};
}

export async function initPlayer(audioData, playMusic = true) {
	await store.dispatch(await resetPlayer());
	await store.dispatch({
		type: "LOAD_AUDIO_DATA",
		payload: {
			songTitle: audioData.title,
			thumbnail: audioData.thumbnail,
			id: audioData.videoId,
			isAudioBuffering: true,
		},
	});

	const audioDataB64 = Base64.encode(JSON.stringify(audioData));
	const masterUrl = `${variables.baseUrl}/opencc/${audioData.videoId.trim()}?info=${audioDataB64}`;
	const fallBackUrl = `${variables.baseUrl}/fallback/${audioData.videoId.trim()}`;

	try {
		const {
			data
		} = await axios.get(masterUrl);
		const res = data;
		if (res.status) {
			if (store.getState().nowPlayingReducer.currentPlaying.videoId === audioData.videoId) {
				await store.dispatch({
					type: "LOAD_AUDIO_DATA",
					payload: {
						masterUrl: res.link,
						fallBackUrl,
					},
				});
				await startPlayer(playMusic);
			}
		} else {
			const dat = await axios.get(fallBackUrl);
			const resData = dat.data;
			if (resData.status === 200) {
				if ((await store.getState().nowPlayingReducer.currentPlaying.videoId) === audioData.videoId) {
					await store.dispatch({
						type: "LOAD_AUDIO_DATA",
						payload: {
							masterUrl: resData.link,
							fallBackUrl,
						},
					});
					await startPlayer(playMusic);
				}
			} else
				throw new Error("Not Available")
		}
	} catch (error) {
		toastActions.showMessage("Requested audio is not availabe right now! " + error.message.toString());
		await store.dispatch(await resetPlayer());
		nowPlayingActions.clearQueue();
	}

	return true;
}

export async function startPlayer(shallIPlay = true) {
	let state = store.getState().playerReducer;
	const player = document.getElementById("music-player");
	const source1 = document.getElementById("audio-source-1");
	const source2 = document.getElementById("audio-source-2");
	source1.src = state.masterUrl;
	source2.src = state.fallBackUrl;
	await player.load();
	if (shallIPlay) {
		await player.play();
	}
	await store.dispatch({
		type: "LOAD_AUDIO_DATA",
		payload: {
			isMusicPlaying: shallIPlay,
			isAudioBuffering: false,
		},
	});
	initMediaSession();
	return true;
}

export const initMediaSession = async () => {
	let state = await store.getState();
	if ('mediaSession' in navigator) {
		/* eslint-disable-next-line */
		navigator.mediaSession.metadata = new MediaMetadata({
			title: state.playerReducer.songTitle,
			artwork: [{
					src: state.playerReducer.thumbnail.split("?")[0],
					sizes: '480x360',
					type: 'image/jpg'
				},
				{
					src: `https://i.ytimg.com/vi/${state.playerReducer.id}/maxresdefault.jpg`,
					sizes: '1280x720',
					type: 'image/jpg'
				}
			]
		});

		navigator.mediaSession.setActionHandler('play', () => {
			playPauseToggle();
		});

		navigator.mediaSession.setActionHandler('pause', () => {
			playPauseToggle();
		});

		navigator.mediaSession.setActionHandler("stop", () => {
			resetPlayer();
		});

		navigator.mediaSession.setActionHandler('seekbackward', () => {
			audioSeekHandler(false);
		});

		navigator.mediaSession.setActionHandler('seekforward', () => {
			audioSeekHandler(true);
		});

		if (state.nowPlayingReducer.isPreviousAvailable)
			navigator.mediaSession.setActionHandler('previoustrack', () => {
				nowPlayingActions.playPreviousSong();
			});
		else
			navigator.mediaSession.setActionHandler('previoustrack', null);

		if (state.nowPlayingReducer.isNextAvailable)
			navigator.mediaSession.setActionHandler('nexttrack', () => {
				nowPlayingActions.playNextSong();
			});
		else
			navigator.mediaSession.setActionHandler('nexttrack', null);
	}
}

export async function playerDownloadHandler(e) {
	if (!store.getState().authReducer.isAuthenticated) {
		toastActions.showMessage("Please Login to use this feature!");
		return;
	}
	let state = store.getState().playerReducer;
	store.dispatch({
		type: "PLAYER_DOWNLOAD_HANDLE",
		payload: {
			downloadProcess: true,
		},
	});
	if (!state.id) {
		toastActions.showMessage("Please Select Music to play or Download!");
		store.dispatch({
			type: "PLAYER_DOWNLOAD_HANDLE",
			payload: {
				downloadProcess: false,
			},
		});
	} else {
		try {
			const response = await axios.get(`${variables.baseUrl}/downcc/${state.id}?title=${encodeURI(state.songTitle)}`)
			if (response.status === 200) {
				store.dispatch({
					type: "PLAYER_DOWNLOAD_HANDLE",
					payload: {
						downloadProcess: false,
					},
				});
				window.open(`${variables.baseUrl}/downcc/${state.id}?title=${encodeURI(state.songTitle)}`, "_blank");
			} else
				throw new Error("Not Available");
		} catch (error) {
			store.dispatch({
				type: "PLAYER_DOWNLOAD_HANDLE",
				payload: {
					downloadProcess: false,
				},
			});
			toastActions.showMessage("Requested content not available right now!, try downloading alternate songs!" + error.message.toString());
		}
	}
}

export function detectMobile() {
	const toMatch = [
		/Android/i,
		/webOS/i,
		/iPhone/i,
		/iPad/i,
		/iPod/i,
		/BlackBerry/i,
		/Windows Phone/i
	];

	return toMatch.some((toMatchItem) => {
		return navigator.userAgent.match(toMatchItem);
	});
}