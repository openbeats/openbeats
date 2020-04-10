import React, { Component } from 'react';
import "../css/albumholder.css";
import { musicDummy } from '../images';

export default class AlbumHolder extends Component {
    render() {
        return (
            <div className="album-holder-wrapper" onClick={() => this.props.albumSelectCallBack(this.props.albumId)} style={{ backgroundImage: `url(), url(${musicDummy})` }}>
                <div className="album-holder-play-icon-visible-on-hover">
                    <i className="far fa-play-circle"></i>
                </div>
                <div className="album-holder-songs-total-holder">{this.props.totalSongs}</div>
                <div className="album-holder-album-desc">
                    <div className="album-holder-album-title">{this.props.albumName}</div>
                    <div className="album-holder-album-date">{this.props.albumCreationDate}</div>
                    <div className="album-holder-album-by">by {this.props.albumCreatedBy}</div>
                </div>
            </div>
        )
    }
}
