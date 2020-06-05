import React, { Component, Fragment } from "react";
import "../assets/css/player.css";
import Loader from "react-loader-spinner";
import { toastActions, playerActions, nowPlayingActions } from "../actions";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Link } from "react-router-dom";

import {
  playerprevious,
  playerplay,
  playerpause,
  playernext,
  // playerdownload,
  playerqueue,
  musicDummy
} from "../assets/images";
import { store } from "../store";

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listenerStore: null,
      isMobilePlayerOpened: false,
    };
    this.playerWrapperRef = null;
    this.listenerFunction = this.listenerFunction.bind(this);
    this.updatePlayerPlayState = this.updatePlayerPlayState.bind(this);
    this.updatePlayerPauseState = this.updatePlayerPauseState.bind(this);
  }
  componentDidMount() {
    this.initListeners();
    this.checkAndUpdateMobileVolume();
  }

  checkAndUpdateMobileVolume = () => {
    if (this.props.detectMobile()) this.props.setFullVolumeForMobile();
  }

  componentWillUnmount() {
    const playerRef = document.getElementById("music-player");
    document.removeEventListener("keydown", this.listenerFunction);
    playerRef.removeEventListener("play", this.updatePlayerPlayState)
    playerRef.removeEventListener("pause", this.updatePlayerPauseState)
    this.props.resetPlayer()
  }

  initListeners() {
    const playerRef = document.getElementById("music-player");

    playerRef.volume = this.props.playerVolume;

    document.addEventListener("keydown", this.listenerFunction);

    playerRef.addEventListener("play", this.updatePlayerPlayState)
    playerRef.addEventListener("pause", this.updatePlayerPauseState)

    playerRef.onvolumechange = e => {
      localStorage.setItem("playerVolume", e.target.volume);
    };
  }

  updatePlayerPlayState() {
    store.dispatch({
      type: "PLAY_PAUSE_TOGGLE",
      payload: true
    })
  }
  updatePlayerPauseState() {
    store.dispatch({
      type: "PLAY_PAUSE_TOGGLE",
      payload: false
    })
  }

  listenerFunction(e) {
    const volumeRef = document.getElementById("volume-progress-bar");
    const progressRef = document.getElementById("player-progress-bar");
    volumeRef.blur();
    progressRef.blur();
    if (e.keyCode === 32 && !this.props.isTyping && !this.props.showAddPlaylistDialog) {
      this.props.playPauseToggle();
    } else if (e.keyCode === 77 && !this.props.isTyping) {
      this.props.muteToggle();
    } else if (e.keyCode === 39 && !this.props.isTyping) {
      this.props.audioSeekHandler(true);
    } else if (e.keyCode === 37 && !this.props.isTyping) {
      this.props.audioSeekHandler(false);
    } else if (e.keyCode === 38 && !this.props.isTyping) {
      this.props.volumeSeekHandler(true);
    } else if (e.keyCode === 40 && !this.props.isTyping) {
      this.props.volumeSeekHandler(false);
    }
  }

  toggleMobilePlayer = () => {
    if (!this.state.isMobilePlayerOpened) {
      this.setState({ isMobilePlayerOpened: true });
      document.addEventListener("click", this.closeMobilePlayerHandler);
    } else {
      this.setState({ isMobilePlayerOpened: false });
      document.removeEventListener("click", this.closeMobilePlayerHandler);
    }
  }

  closeMobilePlayerHandler = e => {
    if (!this.playerWrapperRef.contains(e.target)) {
      this.setState({ isMobilePlayerOpened: false });
      document.removeEventListener("click", this.closeMobilePlayerHandler);
    }
  }


  render() {
    return (
      <Fragment>
        <div className={`player-wrapper ${this.state.isMobilePlayerOpened ? "show-player" : ''}`} id="player-wrapper" ref={d => this.playerWrapperRef = d}>
          <div className="player-mobile-thumbnail-background" style={{ backgroundImage: `url('${this.props.thumbnail}'), url(${musicDummy})` }}></div>
          <audio
            id="music-player"
            onLoadedMetadata={() => this.props.setTotalDuration()}
            onEnded={e => this.props.musicEndHandler()}
            onTimeUpdate={e => this.props.playerTimeUpdater(e)}
          >
            <source src="" id="audio-source-1" />
            <source src="" id="audio-source-2" />
          </audio>
          <div className="progress-bar-holder">
            <input
              onChange={e => {
                this.props.seekAudio(e.target.value);
              }}
              className="progress-bar"
              min="0"
              max="100"
              value={
                isNaN(this.props.currentProgress)
                  ? 0
                  : this.props.currentProgress
              }
              step="1"
              type="range"
              id="player-progress-bar"
            />
          </div>
          <div className="player-controls-holder">
            <section className="player-desc">
              <div className="player-desc-img-holder">
                <img
                  className="player-desc-img"
                  src={this.props.thumbnail}
                  alt=""
                  srcSet=""
                />
              </div>
              <div className="player-desc-content">
                <div>{this.props.songTitle}</div>
                <div>
                  {this.props.currentTimeText} <span>|</span>{" "}
                  {this.props.durationTimeText}
                </div>
              </div>
            </section>
            <section className="player-control-core">
              <div
                onClick={() => {
                  this.props.playPreviousSong();
                }}
                className={`next-previous ${
                  !this.props.isPreviousAvailable ? "fed-up" : ""
                  }`}
              >
                <img src={playerprevious} alt="" srcSet="" />
              </div>
              <div className="cursor-pointer play-pause-toggle">
                {!this.props.isAudioBuffering ? (
                  this.props.isMusicPlaying ? (
                    <img
                      src={playerpause}
                      onClick={() => {
                        this.props.playPauseToggle();
                      }}
                      alt=""
                      srcSet=""
                    />
                  ) : (
                      <img
                        src={playerplay}
                        onClick={() => {
                          this.props.playPauseToggle();
                        }}
                        alt=""
                        srcSet=""
                      />
                    )
                ) : (
                    <Loader type="Rings" color="#F32C2C" height={50} width={50} />
                  )}
              </div>
              <div
                onClick={() => {
                  this.props.playNextSong();
                }}
                className={`next-previous ${
                  !this.props.isNextAvailable ? "fed-up" : ""
                  }`}
              >
                <img src={playernext} alt="" srcSet="" />
              </div>
              <div className="cursor-pointer player-loop-control" onClick={(e) => {
                this.props.setRepeatMode();
              }}>
                <i className={`${this.props.repeatMode === 1 ? "loop-off" : ''} ${this.props.repeatMode === 2 ? "fal fa-repeat-1" : 'fal fa-repeat'} master-color`} title={this.props.repeatMode === 1 ? "Click to repeat the current song!" : this.props.repeatMode === 2 ? "Click to repeat all the songs in the Queue!" : "Click to off the repeat mode!"}></i>
              </div>
            </section>
            <section className="player-rightmost-control-holder">
              <div>
                {this.props.isMuted ? (
                  <span
                    onClick={e => {
                      this.props.muteToggle();
                    }}
                  >
                    <i className="fas fa-volume-mute volume-icon cursor-pointer"></i>
                  </span>
                ) : (
                    <span
                      onClick={e => {
                        this.props.muteToggle();
                      }}
                    >
                      <i className="fas fa-volume-up volume-icon cursor-pointer"></i>
                    </span>
                  )}
                <input
                  onChange={e => {
                    this.props.updateVolume(e);
                  }}
                  type="range"
                  className={`volume-progress`}
                  step="0.1"
                  min="0"
                  max="1"
                  value={this.props.playerVolume}
                  id="volume-progress-bar"
                />
              </div>
              {/* <div>
                <div
                  onClick={e => {
                    this.props.playerDownloadHandler(e);
                  }}
                  className={`music-download cursor-pointer t-none ${
                    this.props.downloadProcess ? "no-access" : ""
                    }`}
                >
                  {this.props.downloadProcess ? (
                    <Loader
                      type="Oval"
                      color="#F32C2C"
                      height={20}
                      width={20}
                    />
                  ) : (
                      <img src={playerdownload} alt="" srcSet="" />
                    )}
                </div>
              </div> */}
              <div>
                <Link to="/nowplaying">
                  <img
                    src={playerqueue}
                    className="cursor-pointer player-playlist-queue"
                    alt=""
                    srcSet=""
                  />
                </Link>
              </div>
            </section>
            <div
              className="minimize-mobile-toggle"
              onClick={this.toggleMobilePlayer}
            >
              <i className="fas fa-times"></i>
            </div>
          </div>
        </div >
        <div
          onClick={this.toggleMobilePlayer}
          className="mobile-music-notifier"
        >
          {this.props.isMusicPlaying ? (
            <Loader type="Audio" color="#322C2C" height={25} width={25} />
          ) : (
              <i className="fas fa-play"></i>
            )}
        </div>
      </Fragment >
    );
  }
}

const mapStateToProps = state => {
  return {
    isMusicPlaying: state.playerReducer.isMusicPlaying,
    isAudioBuffering: state.playerReducer.isAudioBuffering,
    isMuted: state.playerReducer.isMuted,
    playerVolume: state.playerReducer.playerVolume,
    currentProgress: state.playerReducer.currentProgress,
    currentTimeText: state.playerReducer.currentTimeText,
    durationTimeText: state.playerReducer.durationTimeText,
    isPreviousAvailable: state.nowPlayingReducer.isPreviousAvailable,
    isNextAvailable: state.nowPlayingReducer.isNextAvailable,
    thumbnail: state.playerReducer.thumbnail,
    songTitle: state.playerReducer.songTitle,
    repeatMode: state.playerReducer.repeatMode,
    downloadProcess: state.playerReducer.downloadProcess,
    isTyping: state.searchReducer.isTyping,
    showAddPlaylistDialog: state.playlistManipulatorReducer.showAddPlaylistDialog
  };
};

const mapDispatchToProps = dispatch => {
  return {
    push: path => {
      dispatch(push(path));
    },
    notify: message => {
      toastActions.showMessage(message);
    },
    featureNotify: () => {
      toastActions.featureNotify();
    },
    playPauseToggle: () => {
      let action = playerActions.playPauseToggle();
      if (action) dispatch(action);
    },
    muteToggle: () => {
      let action = playerActions.muteToggle();
      dispatch(action);
    },
    volumeSeekHandler: forward => {
      let action = playerActions.volumeSeekHandler(forward);
      dispatch(action);
    },
    updateVolume: e => {
      let action = playerActions.updateVolume(e);
      dispatch(action);
    },
    setTotalDuration: () => {
      let action = playerActions.setTotalDuration();
      dispatch(action);
    },
    audioSeekHandler: forward => {
      playerActions.audioSeekHandler(forward);
    },
    seekAudio: e => {
      playerActions.seekAudio(e);
    },
    playerTimeUpdater: e => {
      let action = playerActions.playerTimeUpdater(e);
      dispatch(action);
    },
    musicEndHandler: () => {
      playerActions.musicEndHandler();
    },
    playerDownloadHandler: e => {
      playerActions.playerDownloadHandler(e);
    },
    playNextSong: () => {
      nowPlayingActions.playNextSong();
    },
    playPreviousSong: () => {
      nowPlayingActions.playPreviousSong();
    },
    resetPlayer: async () => {
      await dispatch({
        type: "RESET_NOW_PLAYING",
        payload: {
          reset: true
        }
      })
      await dispatch({
        type: "RESET_PLAYER",
        payload: {
          reset: true
        }
      })
      await dispatch({
        type: "RESET_PLAYLIST_MANIPULATOR",
        payload: {
          reset: true
        }
      })
    },
    detectMobile: () => {
      return playerActions.detectMobile();
    },
    setFullVolumeForMobile: () => {
      playerActions.setFullVolumeForMobile();
    },
    setRepeatMode: () => {
      playerActions.setRepeatMode();
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Player);
