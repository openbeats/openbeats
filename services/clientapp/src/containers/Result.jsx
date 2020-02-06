import React, { Component } from 'react';
import { playerdownload, playerplay, master, playlistadd, playerpause, pQueueRed, } from "../images";
import Loader from 'react-loader-spinner';
import "../css/result.css"
import { variables } from '../config'
import { connect } from "react-redux"
import { toastActions, coreActions, nowPlayingActions, playerActions, playlistManipulatorActions } from '../actions';

class Result extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isPlaying: false,
            videoId: []
        }
        this.playId = null
        this.videoId = []

    }
    componentDidMount() {
        this.props.setCurrentAction("Search Result");
    }

    addSongToQueue(song) {
        this.props.addSongsToQueue([song]);
    }

    render() {
        return (
            !this.props.isSearching ?
                this.props.searchResults.length > 0 ?
                    <div className="search-result-container">
                        {this.props.searchResults.map((item, key) => (

                            <div className={`result-node ${!this.props.isPlaylist && this.props.currentPlaying && this.props.currentPlaying.videoId === item.videoId ? "highlight-active-result" : ""}`} key={key}>
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
                                            {!this.props.isPlaylist && this.props.currentPlaying && this.props.currentPlaying.videoId === item.videoId ?
                                                !this.props.isAudioBuffering ?
                                                    this.props.isMusicPlaying ?
                                                        <img onClick={async (e) => {
                                                            await this.props.playPauseToggle()
                                                        }} className="action-image-size play-icon-result cursor-pointer" src={playerpause} alt="" />
                                                        :
                                                        <img onClick={async (e) => {
                                                            await this.props.playPauseToggle()
                                                        }} className="action-image-size play-icon-result cursor-pointer" src={playerplay} alt="" />
                                                    :
                                                    <Loader
                                                        type="Rings"
                                                        color="#F32C2C"
                                                        height={30}
                                                        width={30}
                                                    />
                                                :
                                                <img onClick={async (e) => {
                                                    await this.props.updateCurrentPlaying(item)
                                                }} className="action-image-size play-icon-result cursor-pointer" src={playerplay} alt="" />
                                            }


                                            <a download
                                                onClick={async (e) => {
                                                    this.videoId.push(item.videoId)
                                                    this.setState({ videoId: this.videoId })
                                                    e.preventDefault()
                                                    await fetch(`${variables.baseUrl}/downcc/${item.videoId}?title=${encodeURI(item.title)}`)
                                                        .then(res => {
                                                            if (res.status === 200) {
                                                                this.videoId.splice(this.videoId.indexOf(item.videoId), 1)
                                                                this.setState({ videoId: this.videoId })
                                                                window.open(`${variables.baseUrl}/downcc/${item.videoId}?title=${encodeURI(item.title)}`, "_self")
                                                            } else {
                                                                this.videoId.splice(this.videoId.indexOf(item.videoId), 1)
                                                                this.setState({ videoId: this.videoId })
                                                                this.props.notify("Requested content not available right now!, try downloading alternate songs!");
                                                            }
                                                        }).catch(err => {
                                                            this.videoId.splice(this.videoId.indexOf(item.videoId), 1)
                                                            this.setState({ videoId: this.videoId })
                                                            this.props.notify("Requested content not available right now!, try downloading alternate songs!");
                                                        })
                                                }}
                                                className="t-none cursor-pointer" href={`${variables.baseUrl}/downcc/${item.videoId}?${encodeURI(item.title)}`}>
                                                {this.state.videoId.includes(item.videoId) ?
                                                    <Loader
                                                        type="Oval"
                                                        color="#F32C2C"
                                                        height={20}
                                                        width={20}
                                                    />
                                                    :
                                                    <img className="action-image-size " src={playerdownload} alt="" />
                                                }
                                            </a>
                                            <img onClick={
                                                () => {
                                                    this.addSongToQueue(item);
                                                }
                                            } className="action-image-size cursor-pointer queue-icon-result" title="Add to Queue" src={pQueueRed} alt="" />
                                            <img onClick={
                                                () => {
                                                    this.props.showAddPlaylistDialog(item)
                                                }
                                            } className="action-image-size cursor-pointer" title="Add to playlist" src={playlistadd} alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    :
                    <div className="dummy-music-holder">
                        <img className={`music-icon`} src={master} alt="" />
                        <p className="music-icon-para">Your Music Appears Here!</p>
                    </div>
                :
                <div className="search-preloader">
                    <Loader
                        type="ThreeDots"
                        color="#F32C2C"
                        height={80}
                        width={80}
                    />
                </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        searchResults: state.searchReducer.searchResults,
        isSearching: state.searchReducer.isSearching,
        currentPlaying: state.nowPlayingReducer.currentPlaying,
        isPlaylist: state.nowPlayingReducer.isPlaylist,
        isMusicPlaying: state.playerReducer.isMusicPlaying,
        isAudioBuffering: state.playerReducer.isAudioBuffering,
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        featureNotify: () => {
            toastActions.featureNotify();
        },
        updateCurrentPlaying: (audioData) => {
            nowPlayingActions.updateCurrentPlaying(audioData)
        },
        notify: (message) => {
            toastActions.showMessage(message)
        },
        setCurrentAction: (action) => {
            dispatch(coreActions.setCurrentAction(action))
        },
        playPauseToggle: () => {
            dispatch(playerActions.playPauseToggle())
        },
        showAddPlaylistDialog: (song) => {
            playlistManipulatorActions.showAddPlaylistDialog(song)
        },
        addSongsToQueue: (song) => {
            nowPlayingActions.addSongsToQueue(song);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Result);