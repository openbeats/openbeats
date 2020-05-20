import React, { Component } from 'react';
import "../assets/css/song.css";
import { playerpause, playerplay, playerdownload, pQueueRed, playlistadd } from '../assets/images';
import Loader from 'react-loader-spinner';
import { toastActions, playlistManipulatorActions, nowPlayingActions, playerActions } from '../actions';
import { connect } from 'react-redux';

class Song extends Component {

    constructor(props) {
        super(props);
        this.state = {
            videoId: null
        }
    }

    render() {
        return (
            <div className={`result-node ${this.props.currentPlaying && this.props.currentPlaying.videoId === this.props.item.videoId ? "highlight-active-result" : ""}`}>
                <div className="result-node-thumb">
                    <img src={this.props.item.thumbnail} alt="" />
                </div>
                <div className="result-node-desc">
                    <div className="result-node-title">
                        {this.props.item.title}
                    </div>
                    <div className="result-node-attributes">
                        <div className="result-node-duration">
                            {this.props.item.duration}
                        </div>
                        <div className="result-node-actions">
                            {this.props.currentPlaying && this.props.currentPlaying.videoId === this.props.item.videoId ?
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
                                    await this.props.updateCurrentPlaying(this.props.item, this.props.index)
                                }} className="action-image-size play-icon-result cursor-pointer" src={playerplay} alt="" />
                            }


                            <div download
                                onClick={async (e) => {
                                    e.preventDefault();
                                    await this.setState({ videoId: this.props.item.videoId });
                                    if (await this.props.downloadSongHandler(this.props.item)) {
                                        this.setState({ videoId: null })
                                    }
                                }}
                                className="t-none cursor-pointer" >
                                {this.state.videoId === this.props.item.videoId ?
                                    <Loader
                                        type="Oval"
                                        color="#F32C2C"
                                        height={20}
                                        width={20}
                                    />
                                    :
                                    <img className="action-image-size " src={playerdownload} alt="" />
                                }
                            </div>
                            <img onClick={
                                () => {
                                    this.props.addSongsToQueue(this.props.item);
                                }
                            } className="action-image-size cursor-pointer queue-icon-result" title="Add to Queue" src={pQueueRed} alt="" />
                            <img onClick={
                                () => {
                                    this.props.showAddPlaylistDialog(this.props.item)
                                }
                            } className="action-image-size cursor-pointer" title="Add to playlist" src={playlistadd} alt="" />
                            {this.props.deleteSongFromUserPlaylist &&
                                <i
                                    title="Delete this song from this playlist!"
                                    className="action-image-size cursor-pointer fas fa-trash-alt playlist-display-songs-icon"
                                    onClick={() => this.props.deleteSongFromUserPlaylist(this.props.item)}></i>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.authReducer.isAuthenticated,
        userPlaylistMetaData: state.playlistManipulatorReducer.userPlaylistMetaData,
        userDetails: state.authReducer.userDetails,
        activeNavMenu: state.coreReducer.currentActionTitle,
        isAudioBuffering: state.playerReducer.isAudioBuffering,
        currentPlaying: state.nowPlayingReducer.currentPlaying,
        isPlaylist: state.nowPlayingReducer.isPlaylist,
        isMusicPlaying: state.playerReducer.isMusicPlaying,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        notify: message => {
            toastActions.showMessage(message);
        },
        featureNotify: () => {
            toastActions.featureNotify();
        },
        downloadSongHandler: async (item) => {
            return await playlistManipulatorActions.downloadSongHandler(item);
        },
        showAddPlaylistDialog: (song) => {
            playlistManipulatorActions.showAddPlaylistDialog(song)
        },
        addSongsToQueue: (song) => {
            nowPlayingActions.addSongsToQueue([song]);
        },
        playPauseToggle: () => {
            dispatch(playerActions.playPauseToggle())
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Song);
