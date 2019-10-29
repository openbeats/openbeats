import React, { Component, Fragment } from 'react'
import "./css/main.css";
import { musicNote, playlist, play, playlistadd, downloadOrange } from './images'

import { variables } from "./config"
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
        thumbnail: "https://img.freepik.com/free-vector/broken-frosted-glass-realistic-icon_1284-12125.jpg?size=338&ext=jpg",
        title: "Search for Music",
        uploadedOn: null,
        videoId: null,
        views: null,
      },
      currentAudioLink: null,
      playerTimerListener: null,
      isMusicPlaying: false
    }
  }

  async componentDidMount() {
  }


  async getKeywordSuggestion(e) {
    this.setState({ searchText: e.target.value })
    const url = `https://clients1.google.com/complete/search?client=youtube&hl=en&gl=in&sugexp=brcmjc%2Cbrueb%3D1%2Cbruesk%3D1%2Cuimd%3D1%2Cbrmlmo%3Dyt%252Fen%253Aus%253Ayt_en_us_loc%252Cyt%252Fja%253A%253Ayt_cjk_loc%252Cyt%252Fko%253A%253Ayt_cjk_loc%252Cyt%252Fzh-TW%253A%253Ayt_cjk_loc%252Cyt%252Fzh-CN%253A%253Ayt_cjk_loc%252Cyt%252Fdefault%253A%253Ayt_i18n_loc%2Ccfro%3D1%2Cbrueb%3D1&gs_rn=64&gs_ri=youtube&tok=rSSsBe5Xjbc6evDhnFq1Ew&ds=yt&cp=2&gs_id=8&q=${e.target.value}&callback=google.sbox.p50&gs_gbg=jGJ7J1BaQuU5YRqac`;
    if (e.target.value.length > 0) {
      await fetch(url)
        .then(res => res.text())
        .then(res => {
          let tmp = res.replace("google.sbox.p50 && google.sbox.p50(", "");
          tmp = tmp.replace(")", "");
          let temp = JSON.parse(tmp)[1]
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
    this.setState({ keywordSuggestions: [] })
    const url = `${variables.baseUrl}/ytcat?q=${this.state.searchText}`
    console.log(url);

    await fetch(url)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.status) {
          this.setState({
            searchResults: res.data
          })
        }
      })
      .catch(err => console.error(err));
  }

  async initPlayer(audioData) {
    const url = `${variables.baseUrl}/opencc/${audioData.videoId.trim()}`

    await fetch(url)
      .then(res => res.json())
      .then(async res => {
        if (res.status) {
          await this.setState({ currentAudioData: audioData, currentAudioLink: res.link });
          await this.startPlayer()
        }
      })
      .catch(err => console.error(err))
  }

  async startPlayer() {
    const player = document.getElementById("music-player");
    if (this.state.playerTimerListener) {
      player.removeEventListener("timeupdate", this.state.playerTimerListener);
      this.setState({ playerTimerListener: null });
    }
    await player.play()
    let listener = player.addEventListener("timeupdate", this.playerTimeUpdater);
    this.setState({ playerTimerListener: listener, isMusicPlaying: true });
  }

  playerTimeUpdater(e) {
    let currentTime = e.target.currentTime;
    let duration = e.target.duration;
    const progressRef = document.getElementById("player-progress-bar");
    progressRef.value = currentTime * (100 / duration)
  }

  async playPauseToggle() {
    const player = document.getElementById("music-player");
    if (this.state.isMusicPlaying) {
      await player.pause()
      await this.setState({ isMusicPlaying: false })
    } else {
      await player.play()
      await this.setState({ isMusicPlaying: true })
    }
  }



  render() {
    return (
      <Fragment >
        <header>
          <div className="logo cursor-pointer"></div>
          <div className="player-wrapper">
            {
              this.state.currentAudioLink &&
              <audio id="music-player">
                <source src={this.state.currentAudioLink} type="audio/mpeg" />
              </audio>
            }
            <img className="music-thumb" src={this.state.currentAudioData.thumbnail} alt="" />
            <div className="music-title">
              {this.state.currentAudioData.title}
            </div>
            <input className="progress-bar" min="0" max="100" step="1" type="range" name="" id="player-progress-bar" />

            <div className="music-playpause-holder">
              <span className="cursor-pointer" onClick={() => {
                this.playPauseToggle()
              }}>
                {this.state.isMusicPlaying ?
                  <i className="fas fa-pause play-icon cursor-pointer"></i> :
                  <i className="fas fa-play play-icon cursor-pointer"></i>
                }
              </span>
              <span className="volume-icon cursor-pointer">
                <i className="fas fa-volume-up"></i>
                <span className="volume-progress">--------</span>
              </span>
              <span className="music-duration">
                <span id="current-time">0:00</span>
                <span className="font-weight-bold text-black">&nbsp;  |  &nbsp;</span>
                <span >{this.state.currentAudioData.duration}</span>
              </span>
            </div>
            <a href={this.state.currentAudioLink} className="music-download cursor-pointer t-none">
              <img src={downloadOrange} alt="" />
            </a>
            <div className="music-playlist cursor-pointer">
              <img src={playlist} alt="" />
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
          {this.state.searchResults.length > 0 ?
            <div className="search-whole-wrapper">

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
                          <img className="action-image-size cursor-pointer" src={downloadOrange} alt="" />
                          <img className="action-image-size cursor-pointer" src={playlistadd} alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            :
            <div className="dummy-music-holder">
              <img className={`music-icon ${this.state.isSearchProcessing ? 'preload-custom-1' : ''}`} src={musicNote} alt="" />
              <p className="music-icon-para">Your Music Appears Here!</p>
            </div>
          }
        </main>
        <footer>
          <div className="copyrights">
            © 2019 OpenBeats.in | All Rights Reserved.
          </div>
          <div className="footer-right">
            <a className="about-us" href="http://localhost:2000/">About Us</a>
            <a href="http://localhost:2000/"><i className="fab fa-android android-color"></i></a>
          </div>

        </footer>
      </Fragment>
    )
  }
}
