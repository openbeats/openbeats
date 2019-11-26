import React, { Component } from 'react'
import "../css/nowplaying.css";
import { toastActions, coreActions } from "../actions";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import Loader from 'react-loader-spinner';

class NowPlaying extends Component {

    componentDidMount() {
        this.props.setCurrentAction("Now Playing");
    }


    render() {
        return (
            <div className="player-queue-display-wrapper">
                <div className="now-playing-wrapper">
                    <div className="now-playing-header">
                        <i className="fas fa-angle-double-right now-playing-head-icon-size"></i>
                        Now Playing
                    </div>
                    <div className="now-playing-body">
                        {this.props.currentPlaying ?
                            <div className="now-playing-item hover-me">
                                <span>
                                    {this.props.isAudioBuffering ?
                                        <Loader
                                            type="Rings"
                                            color="#F32C2C"
                                            height={50}
                                            width={50}
                                        />
                                        :
                                        this.props.isMusicPlaying ?
                                            <i className="fas fa-pause now-playing-icon-size cursor-pointer"></i> :
                                            <i className="fas fa-play now-playing-icon-size cursor-pointer"></i>
                                    }
                                </span>
                                <span className="now-playing-duration">{this.props.currentPlaying.duration}</span>
                                <span className="now-playing-title">{this.props.currentPlaying.title}</span>
                            </div> :
                            <div>Your queue is empty!</div>
                        }
                    </div>
                </div>
                {this.props.isPlaylist && this.props.playerQueue.length > 0 &&
                    <div className="up-next-wrapper">
                        <div className="up-next-header">
                            <i className="fas fa-angle-double-up now-playing-head-icon-size"></i> up Next
                          </div>
                        <div className="up-next-body">
                            {this.props.playerQueue.map((item, key) => (
                                <div className="now-playing-item hover-me" key={key}>
                                    <span>
                                        <i className="fas fa-play now-playing-icon-size cursor-pointer"></i>
                                    </span>
                                    <span className="now-playing-duration">{item.duration}</span>
                                    <span className="now-playing-title">{item.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                }
                {this.props.isPlaylist && this.props.playedSongs.length > 1 &&
                    <div className="up-next-wrapper">
                        <div className="up-next-header">
                            <i className="fas fa-angle-double-down now-playing-head-icon-size"></i> Played Songs
                          </div>
                        <div className="up-next-body">
                            {this.props.playedSongs.map((item, key) => (
                                key + 1 < this.props.playedSongs.length &&
                                <div className="now-playing-item hover-me" key={key}>
                                    <span>
                                        <i className="fas fa-play now-playing-icon-size cursor-pointer"></i>
                                    </span>
                                    <span className="now-playing-duration">{item.duration}</span>
                                    <span className="now-playing-title">{item.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </div>
        )
    }
}



const mapStateToProps = (state) => {
    let map = state.nowPlayingReducer;
    return {
        currentPlaying: map.currentPlaying,
        playerQueue: map.playerQueue,
        playedSongs: map.playedSongs,
        isPlaylist: map.isPlaylist,
        playlistId: map.playlistId,
        isMusicPlaying: state.playerReducer.isMusicPlaying,
        isAudioBuffering: state.playerReducer.isAudioBuffering,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        push: (path) => {
            dispatch(push(path))
        },
        notify: (message) => {
            toastActions.showMessage(message)
        },
        featureNotify: () => {
            toastActions.featureNotify()
        },
        setCurrentAction: (action) => {
            dispatch(coreActions.setCurrentAction(action))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NowPlaying);