import React, { Component, Fragment } from 'react'
import "./css/main.css";
import "./css/common.css";
import { musicDummy } from './images';
import { variables } from "./config";
import { toast } from 'react-toastify';
import { Player, Header, Search, Result } from "./components"

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      keywordSuggestions: [],
      searchResults: [],
      isSearchProcessing: false,
      listener: null,
      currentAudioData: {
        channelName: null,
        duration: "0:00",
        thumbnail: musicDummy,
        title: "Stream or Download Unlimited Music for Free ! @ OpenBeats",
        uploadedOn: null,
        videoId: null,
        views: null,
      },
      currentAudioLink: null,
      isMusicPlaying: false,
      currentProgress: 0,
      currentTimeText: '00:00',
      playerVolume: 0.5,
      isMuted: false,
      heartBeat: null,
      isSearching: false
    }

    this.playerTimeUpdater = this.playerTimeUpdater.bind(this);
    this.seekAudio = this.seekAudio.bind(this);
    this.playerEndHandler = this.playerEndHandler.bind(this);
    this.playPauseToggle = this.playPauseToggle.bind(this);
    this.beatNotice = 0;
    this.muteToggle = this.muteToggle.bind(this)
    this.updateVolume = this.updateVolume.bind(this)
    this.getKeywordSuggestion = this.getKeywordSuggestion.bind(this)
    this.fetchResults = this.fetchResults.bind(this);
    this.resetBeatNotice = this.resetBeatNotice.bind(this);
    this.initPlayer = this.initPlayer.bind(this);
  }

  async componentDidMount() {
  }

  async getKeywordSuggestion(e) {
    this.setState({ searchText: e.target.value })
    const url = `${variables.baseUrl}/suggester?k=${e.target.value}`;
    if (e.target.value.length > 0) {
      await fetch(url)
        .then(res => res.json())
        .then(res => {
          let temp = res.data
          let listener = document.addEventListener("click", function () {
            if (listener != null) {
              document.removeEventListener(this.state.listenter)
            }
            this.setState({ keywordSuggestions: [], listener: null })
          }.bind(this));
          this.setState({ keywordSuggestions: temp, listener: listener })
        })
        .catch(e => console.error(e))
    }
  }

  async fetchResults(item) {
    this.setState({ searchText: item, keywordSuggestions: [], isSearching: true });
    const url = `${variables.baseUrl}/ytcat?q=${this.state.searchText}`
    await fetch(url)
      .then(res => res.json())
      .then(async res => {
        if (res.status) {
          this.setState({
            searchResults: res.data,
            isSearching: false,
            keywordSuggestions: []
          })
        }
      })
      .catch(err => console.error(err));
  }

  async initPlayer(audioData) {
    if (this.beatNotice < 3) {
      this.beatNotice += 1;
      const player = document.getElementById("music-player");
      await this.playerEndHandler();
      this.setState({ currentAudioData: audioData, isAudioBuffering: true })
      const url = `${variables.baseUrl}/opencc/${audioData.videoId.trim()}`
      await fetch(url)
        .then(res => res.json())
        .then(async res => {
          if (res.status) {
            let heartBeatTimer = setTimeout(async function () {
              if (!(player.currentTime > 0) && !this.state.isMusicPlaying) {
                await this.initPlayer(audioData);
              } else {
                this.setState({ isAudioBuffering: false })
                this.beatNotice = 0;
              }
            }.bind(this), 5000);
            this.setState({ currentAudioData: audioData, currentAudioLink: res.link, heartBeat: heartBeatTimer });
            await this.startPlayer()
          }
        })
        .catch(err => console.error(err))
    } else {
      this.beatNotice = 0;
      await this.playerEndHandler()
      this.setState({ isAudioBuffering: false })
      toast("Music You are looking for is not available right now! try alternate music!")
    }
  }

  async startPlayer() {
    const player = document.getElementById("music-player");
    const source = document.getElementById("audio-source");
    source.src = this.state.currentAudioLink
    await player.load();
    await player.play();
    this.setState({ isMusicPlaying: true, isAudioBuffering: false });
  }

  async playerTimeUpdater(e) {
    let currentTime = e.target.currentTime;
    let duration = e.target.duration;
    var curmins = Math.floor(currentTime / 60);
    var cursecs = Math.floor(currentTime - curmins * 60);
    var durmins = Math.floor(duration / 60);
    var dursecs = Math.floor(duration - durmins * 60);
    if (cursecs < 10) { cursecs = "0" + cursecs; }
    if (dursecs < 10) { dursecs = "0" + dursecs; }
    if (curmins < 10) { curmins = "0" + curmins; }
    if (durmins < 10) { durmins = "0" + durmins; }
    this.setState({ currentProgress: currentTime * (100 / duration), currentTimeText: curmins + ":" + cursecs })
  }

  async playPauseToggle() {
    if (this.state.currentAudioLink) {
      const player = document.getElementById("music-player");
      if (this.state.isMusicPlaying) {
        await player.pause()
        this.setState({ isMusicPlaying: false })
      } else {
        await player.play()
        this.setState({ isMusicPlaying: true })
      }
    } else {
      this.warnUser()
    }
  }

  async seekAudio(e) {
    if (this.state.currentAudioLink) {
      const playerRef = document.getElementById("music-player");
      playerRef.currentTime = playerRef.duration * (e.target.value / 100)
    }
  }

  async muteToggle() {
    if (this.state.currentAudioLink) {
      const playerRef = document.getElementById("music-player");
      playerRef.muted = !playerRef.muted
      if (playerRef.muted) {
        this.setState({ isMuted: true, playerVolume: 0 })
      } else {
        this.setState({ isMuted: false, playerVolume: playerRef.volume })
      }
    } else {
      if (this.state.isMuted)
        this.setState({ isMuted: this.state.isMuted ? false : true, playerVolume: 0.5 })
      else
        this.setState({ isMuted: this.state.isMuted ? false : true, playerVolume: 0 })
    }
  }

  async updateVolume(e) {
    if (this.state.currentAudioLink) {
      const playerRef = document.getElementById("music-player");
      playerRef.volume = e.target.value
    }
    this.setState({ playerVolume: e.target.value });
  }

  async playerEndHandler() {
    const player = document.getElementById("music-player");
    const source = document.getElementById("audio-source");
    player.pause()
    player.currentTime = 0;
    source.src = ""
    if (this.state.heartBeat) {
      clearTimeout(this.state.heartBeat)
      this.setState({ heartBeat: null })
    }
    this.setState({
      currentAudioLink: null,
      currentDownloadLink: null,
      currentProgress: 0,
      currentAudioData: {
        channelName: null,
        duration: "0:00",
        thumbnail: musicDummy,
        title: "Stream or Download Unlimited Music for Free! @ OpenBeats",
        uploadedOn: null,
        videoId: null,
        views: null,
      },
      isMusicPlaying: false,
      currentTimeText: '00:00',
    })
  }

  async featureNotify() {
    toast.dismiss()
    toast("We Appreciate Your Interest! This Feature is Under Development!");
  }

  async warnUser() {
    toast.dismiss()
    toast("Please Search and Add Music \n to your playlist to play !")
  }

  async resetBeatNotice() {
    this.beatNotice = 0
  }

  render() {
    return (
      <Fragment >
        <Player
          state={this.state}
          seekAudio={this.seekAudio}
          featureNotify={this.featureNotify}
          playerEndHandler={this.playerEndHandler}
          updateVolume={this.updateVolume}
          muteToggle={this.muteToggle}
          warnUser={this.warnUser}
          playPauseToggle={this.playPauseToggle}
          initPlayer={this.initPlayer}
          playerTimeUpdater={this.playerTimeUpdater}
        />

        <Header
          state={this.state}
          featureNotify={this.featureNotify}
        />


        <Search
          state={this.state}
          fetchResults={this.fetchResults}
          getKeywordSuggestion={this.getKeywordSuggestion}
        />

        <Result
          state={this.state}
          resetBeatNotice={this.resetBeatNotice}
          featureNotify={this.featureNotify}
          initPlayer={this.initPlayer}
        />

        <div className="copyrights">
          © 2019 OpenBeats.in | All Rights Reserved.
        </div>

      </Fragment>
    )
  }

}