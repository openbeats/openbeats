import React, { Component } from 'react';
import "../assets/css/song.css";
import { playerpause, playerplay, playerdownload, pQueueRed, playlistadd } from '../assets/images';
import Loader from 'react-loader-spinner';
import { toastActions } from '../actions';
import { variables } from '../config';
import axios from "axios";

export default class Song extends Component {

    constructor(props) {
        super(props);
        this.state = {
            videoId: null
        }
    }

    async downloadSong(item) {
        if (!this.props.isAuthenticated) {
            toastActions.showMessage("Please Login to use this feature!");
            this.setState({ videoId: null })
            return
        }
        try {
            const response = await axios.get(`${variables.baseUrl}/downcc/${item.videoId}?title=${encodeURI(item.title)}`);
            if (response.status === 200)
                window.open(`${variables.baseUrl}/downcc/${item.videoId}?title=${encodeURI(item.title)}`, "_blank")
            else
                throw new Error("!");
        } catch (error) {
            toastActions.showMessage("Requested content not available right now!, try downloading alternate songs!");
        }
        this.setState({ videoId: null })
    }

    render() {
        return (
            <div className={`result-node ${!this.props.isPlaylist && this.props.currentPlaying && this.props.currentPlaying.videoId === this.props.item.videoId ? "highlight-active-result" : ""}`}>
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
                            {!this.props.isPlaylist && this.props.currentPlaying && this.props.currentPlaying.videoId === this.props.item.videoId ?
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
                                    await this.props.updateCurrentPlaying(this.props.item)
                                }} className="action-image-size play-icon-result cursor-pointer" src={playerplay} alt="" />
                            }


                            <div download
                                onClick={async (e) => {
                                    e.preventDefault();
                                    await this.setState({ videoId: this.props.item.videoId });
                                    this.downloadSong(this.props.item);
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
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
