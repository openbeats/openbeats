import React, { Component, Fragment } from 'react'
import "./css/main.css";
import { musicNote, playlist, play, playlistadd, downloadOrange, musicDummy } from './images';
import { variables } from "./config";
import { toast } from 'react-toastify';
import Loader from 'react-loader-spinner'

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

  async fetchResults() {
    await this.setState({ keywordSuggestions: [], isSearching: true })
    const url = `${variables.baseUrl}/ytcat?q=${this.state.searchText}`
    await fetch(url)
      .then(res => res.json())
      .then(async res => {
        if (res.status) {
          await this.setState({
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

      const url = `${variables.baseUrl}/opencc/${audioData.videoId.trim()}`
      await fetch(url)
        .then(res => res.json())
        .then(async res => {
          if (res.status) {

            let heartBeatTimer = setTimeout(async function () {
              if (!(player.currentTime > 0) && !this.state.isMusicPlaying) {
                await this.initPlayer(audioData);
              } else {
                this.beatNotice = 0;
              }
            }.bind(this), 5000);

            await this.setState({ currentAudioData: audioData, currentAudioLink: res.link, heartBeat: heartBeatTimer });
            await this.startPlayer()

          }
        })
        .catch(err => console.error(err))
    } else {
      this.beatNotice = 0;
      await this.playerEndHandler()
      toast("Music You are looking for is not available right now! try alternate music!")
    }
  }

  async startPlayer() {
    const player = document.getElementById("music-player");
    const source = document.getElementById("audio-source");
    source.src = this.state.currentAudioLink
    await player.load();
    await player.play();
    await this.setState({ isMusicPlaying: true });
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
    await this.setState({ currentProgress: currentTime * (100 / duration), currentTimeText: curmins + ":" + cursecs })
  }

  async playPauseToggle() {
    if (this.state.currentAudioLink) {
      const player = document.getElementById("music-player");
      if (this.state.isMusicPlaying) {
        await player.pause()
        await this.setState({ isMusicPlaying: false })
      } else {
        await player.play()
        await this.setState({ isMusicPlaying: true })
      }
    } else {
      this.warnUser()
    }
  }

  async seekAudio(e) {
    if (this.state.currentAudioLink) {
      const playerRef = document.getElementById("music-player");
      playerRef.currentTime = playerRef.duration * (e.target.value / 100)
      await this.setState({ currentProgress: playerRef.duration * (e.target.value / 100) })
    } else {
      this.warnUser()
    }
  }

  async warnUser() {
    toast("Please Search and Add Music \n to your playlist to play !")
  }

  async muteToggle() {
    if (this.state.currentAudioLink) {
      const playerRef = document.getElementById("music-player");
      playerRef.muted = !playerRef.muted
      if (playerRef.muted) {
        await this.setState({ isMuted: true, playerVolume: 0 })
      } else {
        await this.setState({ isMuted: false, playerVolume: playerRef.volume })
      }
    } else {
      if (this.state.isMuted)
        await this.setState({ isMuted: this.state.isMuted ? false : true, playerVolume: 0.5 })
      else
        await this.setState({ isMuted: this.state.isMuted ? false : true, playerVolume: 0 })
    }
  }

  async updateVolume(e) {
    if (this.state.currentAudioLink) {
      const playerRef = document.getElementById("music-player");
      playerRef.volume = e.target.value
    }
    await this.setState({ playerVolume: e.target.value });
  }

  async playerEndHandler() {
    const player = document.getElementById("music-player");
    const source = document.getElementById("audio-source");
    player.pause()
    player.currentTime = 0;
    source.src = ""
    if (this.state.heartBeat) {
      clearTimeout(this.state.heartBeat)
      await this.setState({ heartBeat: null })
    }
    await this.setState({
      currentAudioLink: null,
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
    toast("We Appreciate Your Interest! This Feature is Under Development!");
  }

  render() {
    return (
      <Fragment >
        <header>
          <a className="logo cursor-pointer t-none" href={window.location.href}><span></span></a>

          <div className="player-wrapper">

            <audio id="music-player"
              onEnded={async (e) => await this.playerEndHandler()}
              onTimeUpdate={async (e) => await this.playerTimeUpdater(e)}
            >
              <source src="" type="audio/mpeg" id="audio-source" />
            </audio>

            <img className="music-thumb" src={this.state.currentAudioData.thumbnail} alt="" />

            <div className="music-center-core">

              <div className="music-title">
                {this.state.currentAudioData.title}
              </div>

              <input
                onChange={async (e) => { await this.seekAudio(e) }}
                className="progress-bar"
                min="0"
                max="100"
                value={isNaN(this.state.currentProgress) ? 0 : this.state.currentProgress}
                step="1"
                type="range"
                id="player-progress-bar"
              />

              <div className="music-playpause-holder">
                <span className="cursor-pointer" onClick={async () => {
                  await this.playPauseToggle()
                }}>
                  {this.state.isMusicPlaying ?
                    <i className="fas fa-pause play-icon cursor-pointer"></i> :
                    <i className="fas fa-play play-icon cursor-pointer"></i>
                  }
                </span>
                <span className="volume-icon cursor-pointer">
                  {this.state.isMuted ?
                    <span onClick={async (e) => { await this.muteToggle() }}><i className="fas fa-volume-mute"></i></span>
                    :
                    <span onClick={async (e) => { await this.muteToggle() }}><i className="fas fa-volume-up"></i></span>
                  }
                  <input onChange={async (e) => {
                    await this.updateVolume(e);
                  }} type="range" className="volume-progress" step="0.1" min="0" max="1" value={this.state.playerVolume} />
                </span>
                <span className="music-duration">
                  <span id="current-time">{this.state.currentTimeText}</span>
                  <span className="font-weight-bold text-black">&nbsp;  |  &nbsp;</span>
                  <span >{this.state.currentAudioData.duration}</span>
                </span>
              </div>

            </div>

            <div className="music-player-tail">

              <a
                onClick={
                  (e) => {
                    if (!this.state.currentAudioLink) {
                      toast("Please Search for Music to Download or Play !")
                    }
                  }
                }
                href={this.state.currentAudioLink} className="music-download cursor-pointer t-none">
                <img src={downloadOrange} alt="" />
              </a>

              <div onClick={
                () => {
                  this.featureNotify()
                }
              } className="music-playlist cursor-pointer">
                <img src={playlist} alt="" />
              </div>

            </div>
          </div>
        </header>

        <main>
          <div className="main-search">
            <form action="" onSubmit={(e) => { e.preventDefault(); this.fetchResults(); }}>
              <input type="text" value={this.state.searchText} onChange={(e) => { this.getKeywordSuggestion(e) }} className="search-input" placeholder="Search Your Music Here!" />
              <button className="search-icon" type="submit"><i className="fas fa-search"></i></button>
            </form>
            {this.state.keywordSuggestions.length > 0 &&
              <div className="suggestion-keyword-holder">
                {this.state.keywordSuggestions.map((item, key) => (
                  <div onClick={async (e) => {
                    await this.setState({ searchText: item[0], keywordSuggestions: [] });
                    this.fetchResults();
                  }} key={key} className="suggested-keyword" >{item[0]}</div>
                ))}
              </div>
            }
          </div>
          {
            !this.state.isSearching ?
              this.state.searchResults.length > 0 ?
                <div className="search-result-container">
                  {this.state.searchResults.map((item, key) => (

                    <div className="result-node" key={key}>
                      <div className="result-node-thumb">
                        <img src={item.thumbnail} alt="" />
                      </div>
                      <div className="result-node-desc">
                        <div className="result-node-title">
                          {item.title}
                        </div>
                        <div className="result-node-attributes">
                          <div className="result-node-duration">
                            {item.duration}
                          </div>
                          <div className="result-node-actions">
                            <img onClick={(e) => {
                              this.initPlayer(item)
                            }} className="action-image-size cursor-pointer" src={play} alt="" />
                            <img onClick={
                              () => {
                                this.featureNotify()
                              }
                            } className="action-image-size cursor-pointer" src={downloadOrange} alt="" />
                            <img onClick={
                              () => {
                                this.featureNotify()
                              }
                            } className="action-image-size cursor-pointer" src={playlistadd} alt="" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                :
                <div className="dummy-music-holder">
                  <img className={`music-icon ${this.state.isSearchProcessing ? 'preload-custom-1' : ''}`} src={musicNote} alt="" />
                  <p className="music-icon-para">Your Music Appears Here!</p>
                </div>
              :
              <div className="search-preloader">
                <Loader
                  type="ThreeDots"
                  color="#ff7373"
                  height={80}
                  width={80}
                />
              </div>
          }
        </main>
        <footer>
          <div className="copyrights">
            © 2019 OpenBeats.in | All Rights Reserved.
          </div>
          <div className="footer-right">
            <span onClick={
              () => {
                this.featureNotify()
              }
            } className="about-us cursor-pointer">About Us</span>
            <span onClick={
              () => {
                this.featureNotify()
              }
            }><i className="fab fa-android android-color cursor-pointer"></i></span>
          </div>

        </footer>
      </Fragment>
    )
  }

}
