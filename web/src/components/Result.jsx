import React, { Component } from 'react';
import { musicNote, play, playlistadd, downloadOrange, } from "../images";
import Loader from 'react-loader-spinner'
import "../css/result.css"


export default class Result extends Component {
    render() {
        return (
            !this.props.state.isSearching ?
                this.props.state.searchResults.length > 0 ?
                    <div className="search-result-container">
                        {this.props.state.searchResults.map((item, key) => (

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
                                                this.props.resetBeatNotice()
                                                await this.props.initPlayer(item)
                                            }} className="action-image-size cursor-pointer" src={play} alt="" />
                                            <img onClick={
                                                () => {
                                                    this.props.featureNotify()
                                                }
                                            } className="action-image-size cursor-pointer" src={downloadOrange} alt="" />
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
                        <img className={`music-icon ${this.props.state.isSearchProcessing ? 'preload-custom-1' : ''}`} src={musicNote} alt="" />
                        <p className="music-icon-para">Your Music Appears Here!</p>
                    </div>
                :
                <div className="search-preloader">
                    <Loader
                        type="ThreeDots"
                        color="#ff7373"
                        height={80}
                        width={80}
                    />
                </div>
        )
    }
}
