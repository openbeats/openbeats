import React, { Component, Fragment } from 'react'
import "./css/experiment.css";
import { variables } from "./config";
import Loader from 'react-loader-spinner'
import { toast } from 'react-toastify';
// import { Result, Charts } from './components'
import { Result } from './components'
import { masterLogo, navhome, navchart, navartist, navalbum, navhistory, navplaylist, navplus, playerprevious, playerplay, playerpause, playernext, musicDummy, playerdownload, playerqueue, angleright, mainsearch, hamburger, navclose } from './images'

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
        title: "OpenBeats Stream Unlimited Music!",
        uploadedOn: null,
        videoId: null,
        views: null,
      },
      currentAudioLink: null,
      fallBackLink: null,
      isMusicPlaying: false,
      currentProgress: 0,
      currentTimeText: '0:00',
      playerVolume: localStorage.getItem("playerVolume") || 0.5,
      isMuted: false,
      isSearching: false,
      typing: false,
      isAudioBuffering: false,
      currentActionTitle: "Search",
      downloadProcess: false
    }

    this.playerTimeUpdater = this.playerTimeUpdater.bind(this);
    this.seekAudio = this.seekAudio.bind(this);
    this.playerEndHandler = this.playerEndHandler.bind(this);
    this.playPauseToggle = this.playPauseToggle.bind(this);
    this.muteToggle = this.muteToggle.bind(this)
    this.updateVolume = this.updateVolume.bind(this)
    this.getKeywordSuggestion = this.getKeywordSuggestion.bind(this)
    this.fetchResults = this.fetchResults.bind(this);
    this.resetBeatNotice = this.resetBeatNotice.bind(this);
    this.initPlayer = this.initPlayer.bind(this);
  }

  async componentDidMount() {
    this.initiateListeners()
  }

  async initiateListeners() {
    // navigation toggle handler
    const navCloseRef = document.getElementById("nav-close");
    const navHamburgerRef = document.getElementById("nav-hamburger");
    const navRef = document.getElementById("nav");
    const mainRef = document.getElementById("main");
    const footerRef = document.getElementById("footer");
    navHamburgerRef.onclick = function (e) {
      navRef.classList.add("nav-show")
      footerRef.classList.remove("show-footer")
    }
    navCloseRef.onclick = function (e) {
      navRef.classList.remove("nav-show")
    }

    mainRef.onclick = function (e) {
      navRef.classList.remove("nav-show")
      footerRef.classList.remove("show-footer")
    }

    footerRef.onclick = function (e) {
      navRef.classList.remove("nav-show")
    }
    // player controls shortcut key handler
    const playerRef = document.getElementById("music-player");
    playerRef.volume = this.state.playerVolume
    const searchBarRef = document.getElementsByClassName("search-input")[0];
    searchBarRef.addEventListener("focusin", function (e) {
      this.setState({ typing: true })
    }.bind(this))
    searchBarRef.addEventListener("focusout", function (e) {
      this.setState({ typing: false })
    }.bind(this))

    document.addEventListener("keydown", function (e) {
      if (e.keyCode === 32 && !this.state.typing) {
        this.playPauseToggle()
      }
      if (e.keyCode === 77 && !this.state.typing) {
        this.muteToggle()
      }
      if (e.keyCode === 39 && !this.state.typing) {
        this.seekHandler(true)
      }
      if (e.keyCode === 37 && !this.state.typing) {
        this.seekHandler(false)
      }
      if (e.keyCode === 38 && !this.state.typing) {
        this.volumeSeekHandler(true)
      }
      if (e.keyCode === 40 && !this.state.typing) {
        this.volumeSeekHandler(false)
      }
      if (e.keyCode === 27) {
        this.setState({ keywordSuggestions: [] })
      }
    }.bind(this)
    )

    playerRef.onvolumechange = e => {
      if (e.target.volume === 0 && !this.state.isMuted) {
        this.muteToggle()
      }
      localStorage.setItem("playerVolume", e.target.volume)
    }

  }

  async getKeywordSuggestion(e) {
    this.setState({ searchText: e })
    const url = `${variables.baseUrl}/suggester?k=${e}`;
    if (e.length > 0) {
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
    await this.playerEndHandler();
    this.setState({ currentAudioData: audioData, isAudioBuffering: true })
    const mainUrl = `${variables.baseUrl}/opencc/${audioData.videoId.trim()}`
    const fallbackUrl = `${variables.baseUrl}/fallback/${audioData.videoId.trim()}`
    await fetch(mainUrl)
      .then(res => res.json())
      .then(async res => {
        if (res.status) {
          this.setState({ currentAudioData: audioData, currentAudioLink: res.link, fallBackLink: fallbackUrl });
          await this.startPlayer()
        } else {
          await fetch(fallbackUrl)
            .then(async res => {
              if (res.status === 200) {
                this.setState({ currentAudioData: audioData, currentAudioLink: res.link, fallBackLink: fallbackUrl });
                await this.startPlayer()
              } else {
                toast("Requested audio is not availabe right now! try alternate search!")
                await this.playerEndHandler()
              }
            })
            .catch(async err => {
              toast("Requested audio is not availabe right now! try alternate search!")
              await this.playerEndHandler()
            })
        }
      })
      .catch(err => console.error(err))
  }

  async startPlayer() {
    const player = document.getElementById("music-player");
    const source1 = document.getElementById("audio-source-1");
    const source2 = document.getElementById("audio-source-2");
    source1.src = this.state.currentAudioLink
    source2.src = this.state.fallBackLink
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
    const playerRef = document.getElementById("music-player");
    playerRef.muted = !playerRef.muted
    if (playerRef.muted) {
      this.setState({ isMuted: true, playerVolume: 0 })
    } else {
      if (playerRef.volume === 0) {
        playerRef.volume += 0.1
      }
      this.setState({ isMuted: false, playerVolume: playerRef.volume })
    }
  }

  async updateVolume(e) {
    const playerRef = document.getElementById("music-player");
    if (this.state.isMuted && playerRef.muted)
      this.muteToggle()
    playerRef.volume = e.target.value
    this.setState({ playerVolume: e.target.value, isMuted: playerRef.volume === 0 ? true : false });
  }

  async playerEndHandler() {
    const player = document.getElementById("music-player");
    const source1 = document.getElementById("audio-source-1");
    const source2 = document.getElementById("audio-source-2");
    player.pause()
    player.currentTime = 0;
    source1.src = ""
    source2.src = ""
    this.setState({
      currentAudioLink: null,
      fallBackLink: null,
      currentDownloadLink: null,
      currentProgress: 0,
      currentAudioData: {
        channelName: null,
        duration: "0:00",
        thumbnail: musicDummy,
        title: "OpenBeats Stream Unlimited Music!",
        uploadedOn: null,
        videoId: null,
        views: null,
      },
      isMusicPlaying: false,
      currentTimeText: '00:00',
      isAudioBuffering: false,
      currentTextIndex: 0,
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

  async seekHandler(forward = true) {
    if (this.state.currentAudioLink) {
      let audio = document.getElementById('music-player');
      if (forward)
        audio.currentTime += 10
      else
        audio.currentTime -= 10
    }
  }

  async volumeSeekHandler(forward = true) {
    let audio = document.getElementById('music-player');
    if (this.state.isMuted && audio.muted)
      this.muteToggle()
    if (forward) {
      if (audio.volume <= 0.9)
        audio.volume += 0.1
      else
        audio.volume = 1
    }
    else
      if (audio.volume >= 0.1)
        audio.volume -= 0.1
      else
        audio.volume = 0

    this.setState({ playerVolume: audio.volume })
  }

  render() {

    return (
      <Fragment >
        <div id="nav-hamburger" className="hamburger-holder">
          <img src={hamburger} alt="" srcSet="" />
        </div>

        <nav id="nav">

          <section className="master-logo">

            <img className="cursor-pointer" onClick={() => {
              window.location.reload()
            }} src={masterLogo} alt="" />
            <div id="nav-close" className="nav-close-holder">
              <img src={navclose} alt="" srcSet="" />
            </div>
          </section>
          <section className="nav-content">
            <section className="main-nav-menus">
              <div className="nav-menu" onClick={() => this.featureNotify()}>
                <div className="nav-menu-icon-holder" >
                  <img className="nav-menu-icon-size" src={navhome} alt="" />
                </div>
                <p className="nav-menu-text">Home</p>
              </div>
              <div className="nav-menu" onClick={() => this.featureNotify()}>
                <div className="nav-menu-icon-holder" >
                  <img className="nav-menu-icon-size" src={navchart} alt="" />
                </div>
                <p className="nav-menu-text">Top Charts</p>
              </div>
              <div className="nav-menu" onClick={() => this.featureNotify()}>
                <div className="nav-menu-icon-holder" >
                  <img className="nav-menu-icon-size" src={navartist} alt="" />
                </div>
                <p className="nav-menu-text">Artists</p>
              </div>
              <div className="nav-menu" onClick={() => this.featureNotify()}>
                <div className="nav-menu-icon-holder" >
                  <img className="nav-menu-icon-size" src={navalbum} alt="" />
                </div>
                <p className="nav-menu-text">Albums</p>
              </div>
              <div className="nav-menu" onClick={() => this.featureNotify()}>
                <div className="nav-menu-icon-holder" >
                  <img className="nav-menu-icon-size" src={navhistory} alt="" />
                </div>
                <p className="nav-menu-text">Recently Played</p>
              </div>
            </section>
            <section className="nav-horizontal-rule"></section>
            <section className="nav-playlist-holder">
              <div className="nav-menu bg-none">
                <div className="nav-menu-icon-holder">
                  <img className="nav-menu-icon-size" src={navplaylist} alt="" />
                </div>
                <p className="nav-menu-text">Your Playlists</p>
              </div>
              <ul className="playlist-content-holder">
                <div className="nav-playlist-plus-icon-holder" onClick={() => this.featureNotify()}>
                  <img src={navplus} alt="" srcSet="" />
                </div>
                <li className="playlist-content-holder-text" onClick={() => this.featureNotify()}>Houser</li>
                <li className="playlist-content-holder-text" onClick={() => this.featureNotify()}>Travel Melody</li>
                <li className="playlist-content-holder-text" onClick={() => this.featureNotify()}>Rock Collection</li>
              </ul>
            </section>
            <section className="nav-footer-container">
              <div className="footer-text-holder">
                <span>About</span>  <span>Copyright</span> <br />
                <span>Contact us</span>  <span>Advertise</span> <br />
                <span>Developers</span> <br />
                <span>Terms Privacy Policy</span> <br />
                <span>Request New features</span> <br /><br />
                © 2019 OpenBeats, LLC <br />
              </div>
            </section>

          </section>
        </nav>

        <main id="main">
          <section className="main-header">
            <div className="container-action-notifier">
              <img src={angleright} alt="" srcSet="" />
              <span>{this.state.currentActionTitle}</span>
            </div>
            <div className="master-search-bar">
              <form
                action=""
                onSubmit={async (e) => {
                  e.preventDefault();
                  let a = await this.state.suggestionText;
                  await this.fetchResults(a);
                }}
              >
                <input
                  type="text"
                  onKeyUp={async (e) => {
                    if (e.keyCode === 40 && this.state.keywordSuggestions.length) {
                      let current = (this.state.currentTextIndex + 1) % (this.state.keywordSuggestions.length + 1);
                      if (current !== 0)
                        await this.setState({ currentTextIndex: current, suggestionText: this.state.keywordSuggestions[current - 1][0] })
                      else
                        await this.setState({ currentTextIndex: current, suggestionText: this.state.actualText })
                    } else if (e.keyCode === 38 && this.state.keywordSuggestions.length) {
                      let current = Math.abs(this.state.currentTextIndex - 1) % (this.state.keywordSuggestions.length + 1);
                      if (current !== 0)
                        await this.setState({ currentTextIndex: current, suggestionText: this.state.keywordSuggestions[current - 1][0] })
                      else
                        await this.setState({ currentTextIndex: current, suggestionText: this.state.actualText })
                    }
                  }}
                  value={this.state.suggestionText || ''}
                  onChange={async (e) => {
                    let a = e.target.value
                    await this.setState({ suggestionText: a, actualText: a, currentTextIndex: 0 });
                    await this.getKeywordSuggestion(a)
                  }}
                  className="search-input"
                  placeholder="Search Artists, Albums, Films, Songs...."
                />
                <button className="search-icon" type="submit"><img src={mainsearch} alt="" srcSet="" /></button>
              </form>
              <div className="suggestion-keyword-holder">
                {this.state.keywordSuggestions.map((item, key) => (
                  <div
                    onClick={async (e) => {
                      await this.setState({ suggestionText: item[0] })
                      await this.fetchResults(this.state.suggestionText);
                    }}
                    key={key}
                    className={`suggested-keyword ${this.state.currentTextIndex === key + 1 ? 'highlight-current' : ''}`}
                  >
                    {item[0]}
                  </div>
                ))}
              </div>
            </div>
            <div className="main-user-profile-holder">
              <img
                className="cursor-pointer"
                onClick={() => {
                  this.featureNotify()
                }} src={musicDummy}
                alt=""
                srcSet="" />
            </div>
          </section>
          <div className="main-body">
            <Result
              state={this.state}
              resetBeatNotice={this.resetBeatNotice}
              initPlayer={this.initPlayer}
              featureNotify={this.featureNotify}
            />
            {/* <Charts /> */}
          </div>
        </main>

        <footer id="footer">
          <audio id="music-player"
            onEnded={async (e) => await this.playerEndHandler()}
            onTimeUpdate={async (e) => await this.playerTimeUpdater(e)}
          >
            <source src="" id="audio-source-1" />
            <source src="" id="audio-source-2" />
          </audio>
          <div className="progress-bar-holder">
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
          </div>
          <div className="player-controls-holder">
            <section className="player-desc">
              <div className="player-desc-img-holder">
                <img className="player-desc-img" src={this.state.currentAudioData.thumbnail} alt="" srcSet="" />
              </div>
              <div className="player-desc-content">
                <div>{this.state.currentAudioData.title}</div>
                <div>{this.state.currentTimeText} <span>|</span> {this.state.currentAudioData.duration}</div>
              </div>
            </section>
            <section className="player-control-core">
              <div className="next-previous fed-up">
                <img src={playerprevious} alt="" srcSet="" />
              </div>
              <div className="cursor-pointer play-pause-toggle" >{
                !this.state.isAudioBuffering ?
                  this.state.isMusicPlaying ?
                    <img src={playerpause}
                      onClick={async () => {
                        await this.playPauseToggle()
                      }}
                      alt="" srcSet="" />
                    :
                    <img src={playerplay}
                      onClick={async () => {
                        await this.playPauseToggle()
                      }}
                      alt="" srcSet="" />
                  :
                  <Loader
                    type="Rings"
                    color="#F32C2C"
                    height={50}
                    width={50}
                  />
              }
              </div>
              <div className="next-previous fed-up">
                <img src={playernext} alt="" srcSet="" />
              </div>
            </section>
            <section className="player-rightmost-control-holder">
              <div>
                {this.state.isMuted ?
                  <span onClick={async (e) => { await this.muteToggle() }}>
                    <i className="fas fa-volume-mute volume-icon cursor-pointer"></i>
                  </span>
                  :
                  <span onClick={async (e) => { await this.muteToggle() }}>
                    <i className="fas fa-volume-up volume-icon cursor-pointer"></i>
                  </span>
                }
                <input
                  onChange={async (e) => {
                    await this.updateVolume(e);
                  }}
                  type="range"
                  className={`volume-progress`}
                  step="0.1" min="0" max="1"
                  value={this.state.playerVolume}
                />
              </div>
              <div>
                <a
                  download
                  onClick={async (e) => {
                    e.preventDefault()
                    this.setState({ downloadProcess: true })
                    if (!this.state.currentAudioData.videoId) {
                      e.preventDefault()
                      toast("Please Select Music to play or Download!")
                      this.setState({ downloadProcess: false })
                    } else {
                      await fetch(`${variables.baseUrl}/downcc/${this.state.currentAudioData.videoId}`)
                        .then(res => {
                          if (res.status === 200) {
                            this.setState({ downloadProcess: false })
                            window.open(`${variables.baseUrl}/downcc/${this.state.currentAudioData.videoId}`, "_self")
                          } else {
                            this.setState({ downloadProcess: false })
                            toast("Requested content not available right now!, try downloading alternate songs!");
                          }
                        }).catch(err => {
                          this.setState({ downloadProcess: false })
                          toast("Requested content not available right now!, try downloading alternate songs!");
                        })
                    }
                  }}
                  rel="noopener noreferrer"
                  href={`${variables.baseUrl}/downcc/${this.state.currentAudioData.videoId}`}
                  className={`music-download cursor-pointer t-none ${this.state.downloadProcess ? 'no-access' : ''}`}>
                  {this.state.downloadProcess ?
                    <Loader
                      type="Oval"
                      color="#F32C2C"
                      height={20}
                      width={20}
                    />
                    : <img src={playerdownload} alt="" srcSet="" />
                  }
                </a>
              </div>
              <div>
                <img
                  src={playerqueue}
                  className="cursor-pointer"
                  onClick={() => {
                    this.featureNotify()
                  }}
                  alt="" srcSet="" />
              </div>

            </section>
            <div className="minimize-mobile-toggle"
              onClick={() => {
                const footerRef = document.getElementById("footer")
                footerRef.classList.remove("show-footer")
              }}
            >
              <i className="fas fa-times"></i>
            </div>
          </div>
        </footer>

        <div
          onClick={() => {
            const footerRef = document.getElementById("footer");
            footerRef.classList.add("show-footer")
          }}

          className="mobile-music-notifier"
        >
          {this.state.isMusicPlaying ?
            <Loader
              type="Audio"
              color="#322C2C"
              height={25}
              width={25}
            /> :
            <i className="fas fa-play"></i>
          }
        </div>
      </Fragment >
    )
  }

}