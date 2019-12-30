import React, { Component, Fragment } from "react";
import "../css/player.css";
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
  playerdownload,
  playerqueue
} from "../images";

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listenerStore: null
    };
    this.listenerFunction = this.listenerFunction.bind(this);
  }
  componentDidMount() {
    this.initListeners();
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.listenerFunction);
  }

  initListeners() {
    const playerRef = document.getElementById("music-player");

    playerRef.volume = this.props.playerVolume;

    document.addEventListener("keydown", this.listenerFunction);

    playerRef.onvolumechange = e => {
      localStorage.setItem("playerVolume", e.target.volume);
    };
  }

  listenerFunction(e) {
    const volumeRef = document.getElementById("volume-progress-bar");
    const progressRef = document.getElementById("player-progress-bar");
    volumeRef.blur();
    progressRef.blur();
    if (e.keyCode === 32 && !this.props.isTyping) {
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

  render() {
    return (
      <Fragment>
        <div className="player-wrapper " id="player-wrapper">
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
              <div>
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
              </div>
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
              onClick={() => {
                const playerWrapperRef = document.getElementById(
                  "player-wrapper"
                );
                playerWrapperRef.classList.remove("show-player");
              }}
            >
              <i className="fas fa-times"></i>
            </div>
          </div>
        </div>
        <div
          onClick={() => {
            const playerWrapperRef = document.getElementById("player-wrapper");
            playerWrapperRef.classList.add("show-player");
          }}
          className="mobile-music-notifier"
        >
          {this.props.isMusicPlaying ? (
            <Loader type="Audio" color="#322C2C" height={25} width={25} />
          ) : (
            <i className="fas fa-play"></i>
          )}
        </div>
      </Fragment>
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
    downloadProcess: state.playerReducer.downloadProcess,
    isTyping: state.searchReducer.isTyping
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
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Player);
