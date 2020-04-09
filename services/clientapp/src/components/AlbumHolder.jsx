import React, { Component } from 'react';
import "../css/albumholder.css";
import { musicDummy } from '../images';

export default class AlbumHolder extends Component {
    render() {
        return (
            <div className="album-holder-wrapper" style={{ backgroundImage: `url(), url(${musicDummy})` }}>
                <div className="album-holder-play-icon-visible-on-hover">
                    <i class="far fa-play-circle"></i>
                </div>
                <div className="album-holder-songs-total-holder">12</div>
                <div className="album-holder-album-desc">
                    <div className="album-holder-album-title">This is Rahman</div>
                    <div className="album-holder-album-date">20 May 2020</div>
                    <div className="album-holder-album-by">by OpenBeats</div>
                </div>
            </div>
        )
    }
}
