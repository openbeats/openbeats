import React, { Component } from 'react';
import "../css/albumholder.css";
import { musicDummy } from '../images';

export default class AlbumHolder extends Component {
    checkIfAlbumIsInCollectionHandler = () => {

    }

    addOrRemoveAlbumFromCollectionHandler = () => {
        if (this.props.addOrRemoveAlbumFromCollectionHandler) {
            if (this.props.isAlbumIsInCollection) this.props.addOrRemoveAlbumFromCollectionHandler(false, this.props.albumId)
            else this.props.addOrRemoveAlbumFromCollectionHandler(true, this.props.albumId)
        }
    }

    render() {
        return (
            <div className="album-holder-wrapper" style={{ backgroundImage: `url(${this.props.albumThumbnail}), url(${musicDummy})` }}>
                {this.props.addOrRemoveAlbumFromCollectionHandler && this.props.isAuthenticated && <i className={`fas fa-heart album-add-to-collection-icon ${this.props.isAlbumIsInCollection ? "master-color" : ''}`} title={"Add to My Collection"} onClick={this.addOrRemoveAlbumFromCollectionHandler}></i>}
                <div className="album-holder-play-icon-visible-on-hover">
                    <i className="far fa-eye" title="View this Album" onClick={() => this.props.albumViewCallBack(this.props.albumId)}></i>
                    <i className="fas fa-play" title="Reset Current Queue and Play this Album" onClick={() => this.props.albumPlayCallBack(this.props.albumId)}></i>
                    <i className="fas fa-plus-square" title="Add to The current Queue" onClick={() => this.props.albumAddToCurrentQueueCallBack(this.props.albumId)}></i>
                </div>
                <div className="album-holder-songs-total-holder">{this.props.albumTotalSongs}</div>
                <div className="album-holder-album-desc">
                    <div className="album-holder-album-title">{this.props.albumName}</div>
                    <div className="album-holder-album-date">{this.props.albumCreationDate}</div>
                    <div className="album-holder-album-by">by {this.props.albumCreatedBy}</div>
                </div>
            </div>
        )
    }
}
