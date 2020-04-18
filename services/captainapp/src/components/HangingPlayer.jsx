import React, { Component } from 'react';
import "../assets/styles/hangingplayer.css";
import { connect } from 'react-redux';
import { hangingPlayerActions } from "../actions";
import axios from 'axios';
import { variables } from '../config';

class HangingPlayer extends Component {

    constructor(props) {
        super(props);
        this.audioPlayer = null;
        this.playerContainer = null;
    }

    componentDidMount() {
        this.props.setHangingPlayerInitCallback(this.initHangingPlayer);
    }

    initHangingPlayer = async () => {
        const songData = (await axios.get(`${variables.baseUrl}/opencc/${this.props.hangingPlayer.songData.videoId}`)).data;
        if (songData.status) {
            this.audioPlayer.src = songData.link;
            this.audioPlayer.load();
            this.audioPlayer.play();
        }
    }

    resetPlayer = () => {
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
        this.audioPlayer.src = "";
        this.props.resetHangingPlayer();
    }

    render() {
        return (
            <div
                className={`hanging-music-player-container ${this.props.hangingPlayer.showHangingPlayer ? "show-hanging-player" : ""}`}
                ref={d => this.playerContainer = d}
                style={{
                    backgroundImage: `url(${this.props.hangingPlayer.songData.thumbnail}), url(https://openbeats.live/static/media/dummy_music_holder.a3d0de2e.jpg)`
                }}
            >
                <div className="hanging-player-reset-button">
                    <i className="fas fa-stop cursor-pointer" title="Stop and Reset the Player" onClick={() => this.resetPlayer()}></i>
                </div>
                <div className="hanginig-player-close-button">
                    <i className="far fa-minus-circle cursor-pointer" title="Minimize the Player" onClick={() => this.props.toggleHangingPlayer(false)}></i>
                </div>
                <div className="hanging-music-player-song-title">{this.props.hangingPlayer.songData.title || "Now Playing Nothing"}</div>
                <audio ref={d => this.audioPlayer = d} controlsList="nodownload" controls></audio>
            </div>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        hangingPlayer: state.hangingPlayer
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        toggleHangingPlayer: (bool) => {
            hangingPlayerActions.toggleHangingplayer(bool);
        },
        setHangingPlayerInitCallback: (callback) => {
            hangingPlayerActions.setHangingPlayerInitCallback(callback);
        },
        resetHangingPlayer: () => {
            hangingPlayerActions.resetHangingPlayer();
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HangingPlayer);