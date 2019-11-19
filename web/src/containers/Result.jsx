import React, { Component } from 'react';
import { playerdownload, playerplay, master, playlistadd, } from "../images";
import Loader from 'react-loader-spinner'
import "../css/result.css"
import { variables } from '../config'
import { connect } from "react-redux"
import { toastActions, playerActions } from '../actions';

class Result extends Component {

    constructor(props) {
        super(props);
        this.state = {
            downloadProcess: false,
        }
        this.videoId = []
    }

    render() {
        return (
            !this.props.isSearching ?
                this.props.searchResults.length > 0 ?
                    <div className="search-result-container">
                        {this.props.searchResults.map((item, key) => (

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
                                            <img onClick={async (e) => {
                                                await this.props.initPlayer(item)
                                            }} className="action-image-size play-icon-result cursor-pointer" src={playerplay} alt="" />
                                            <a download
                                                onClick={async (e) => {
                                                    this.setState({ downloadProcess: true })
                                                    this.videoId.push(item.videoId)
                                                    e.preventDefault()
                                                    await fetch(`${variables.baseUrl}/downcc/${item.videoId}`)
                                                        .then(res => {
                                                            if (res.status === 200) {
                                                                this.setState({ downloadProcess: false })
                                                                this.videoId.splice(this.videoId.indexOf(item.videoId), 1)
                                                                window.open(`${variables.baseUrl}/downcc/${item.videoId}`, "_self")
                                                            } else {
                                                                this.videoId.splice(this.videoId.indexOf(item.videoId), 1)
                                                                this.setState({ downloadProcess: false })
                                                                this.props.notify("Requested content not available right now!, try downloading alternate songs!");
                                                            }
                                                        }).catch(err => {
                                                            this.videoId.splice(this.videoId.indexOf(item.videoId), 1)
                                                            this.setState({ downloadProcess: false })
                                                            this.props.notify("Requested content not available right now!, try downloading alternate songs!");
                                                        })
                                                }}
                                                className="t-none cursor-pointer" href={`${variables.baseUrl}/downcc/${item.videoId}`}>
                                                {this.state.downloadProcess && this.videoId.includes(item.videoId) ?
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
                                                    this.props.featureNotify()
                                                }
                                            } className="action-image-size cursor-pointer" src={playlistadd} alt="" />
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
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        featureNotify: () => {
            toastActions.featureNotify();
        },
        initPlayer: (audioData) => {
            playerActions.initPlayer(audioData)
        },
        notify: (message) => {
            toastActions.showMessage(message)
        },


    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Result);