import React, { Component } from 'react'
import "../css/player.css";
import "../css/common.css";
import { playlist, downloadOrange } from '../images';
import { toast } from 'react-toastify';



export default class Player extends Component {

    render() {
        return (
            <div className="player-wrapper">
                <audio id="music-player"
                    onEnded={async (e) => await this.props.playerEndHandler()}
                    onTimeUpdate={async (e) => await this.props.playerTimeUpdater(e)}
                >
                    <source src="" type="audio/mpeg" id="audio-source" />
                </audio>

                <img className={`music-thumb ${this.props.state.isAudioBuffering ? 'shake-me' : ''}`} src={this.props.state.currentAudioData.thumbnail} alt="" />

                <div className="music-center-core">

                    <div className="music-title">
                        {this.props.state.currentAudioData.title}
                    </div>
                    <div className="player-progress-wrapper">
                        <input
                            onChange={async (e) => { await this.props.seekAudio(e) }}
                            className="progress-bar"
                            min="0"
                            max="100"
                            value={isNaN(this.props.state.currentProgress) ? 0 : this.props.state.currentProgress}
                            step="1"
                            type="range"
                            id="player-progress-bar"
                        />
                    </div>

                    <div className="music-playpause-holder">
                        <span className="cursor-pointer" onClick={async () => {
                            await this.props.playPauseToggle()
                        }}>
                            {this.props.state.isMusicPlaying ?
                                <i className="fas fa-pause play-icon cursor-pointer"></i> :
                                <i className="fas fa-play play-icon cursor-pointer"></i>
                            }
                        </span>
                        <span className="volume-icon cursor-pointer">
                            {this.props.state.isMuted ?
                                <span onClick={async (e) => { await this.props.muteToggle() }}><i className="fas fa-volume-mute"></i></span>
                                :
                                <span onClick={async (e) => { await this.props.muteToggle() }}><i className="fas fa-volume-up"></i></span>
                            }
                            <input onChange={async (e) => {
                                await this.props.updateVolume(e);
                            }} type="range" className="volume-progress" step="0.1" min="0" max="1" value={this.props.state.playerVolume} />
                        </span>
                        <span className="music-duration">
                            <span id="current-time">{this.props.state.currentTimeText}</span>
                            <span className="font-weight-bold text-black">&nbsp;  |  &nbsp;</span>
                            <span >{this.props.state.currentAudioData.duration}</span>
                        </span>
                    </div>

                </div>

                <div className="music-player-tail">

                    <a
                        onClick={
                            (e) => {
                                if (!this.props.state.currentAudioLink) {
                                    toast("Please Search for Music to Download or Play !")
                                }
                            }
                        }
                        href={this.props.state.currentAudioLink} className="music-download cursor-pointer t-none">
                        <img src={downloadOrange} alt="" />
                    </a>

                    <div onClick={
                        () => {
                            this.props.featureNotify()
                        }
                    } className="music-playlist cursor-pointer">
                        <img src={playlist} alt="" />
                    </div>

                </div>
            </div>

        )
    }
}
