import React, { Component } from 'react';
import "../assets/css/albumholder.css";
import { musicDummy } from '../assets/images';
import { push } from 'connected-react-router';
import { toastActions, playlistManipulatorActions, nowPlayingActions } from '../actions';
import { connect } from 'react-redux';

class AlbumHolder extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    addOrRemoveAlbumFromCollectionHandler = () => {
        if (this.props.addOrRemoveAlbumFromCollectionHandler) {
            if (this.props.isAlbumIsInCollection) this.props.addOrRemoveAlbumFromCollectionHandler(false, this.props.albumId)
            else this.props.addOrRemoveAlbumFromCollectionHandler(true, this.props.albumId)
        }
    }

    albumViewCallBack = async (id) => {
        this.props.push(`/playlist/${this.props.type}/${id}`);
    }

    albumPlayCallBack = async (id) => {
        this.props.push(`/playlist/${this.props.type}/${id}?autoplay=true`);
    }

    albumAddToCurrentQueueCallBack = async (id) => {
        this.props.addSongsToQueue(id, this.props.type);
    }


    render() {
        return (
            <div className="album-holder-wrapper" onClick={() => this.albumViewCallBack(this.props.albumId)} style={{ backgroundImage: `url(${this.props.albumThumbnail}), url(${musicDummy})` }}>
                {this.props.addOrRemoveAlbumFromCollectionHandler && this.props.isAuthenticated && <i className={`fas fa-heart album-add-to-collection-icon ${this.props.isAlbumIsInCollection ? "master-color" : ''}`} title={this.props.isAlbumIsInCollection ? "Remove from My Collection" : "Add to My Collection"} onClick={this.addOrRemoveAlbumFromCollectionHandler}></i>}
                <div className="album-holder-play-icon-visible-on-hover">
                    <i className="far fa-eye" title="View this Album" onClick={() => this.albumViewCallBack(this.props.albumId)}></i>
                    <i className="fas fa-play" title="Reset Current Queue and Play this Album" onClick={() => this.albumPlayCallBack(this.props.albumId)}></i>
                    <i className="fas fa-plus-square" title="Add to The current Queue" onClick={() => this.albumAddToCurrentQueueCallBack(this.props.albumId)}></i>
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

const mapStateToProps = (state) => {
    return {
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        push: (path) => {
            dispatch(push(path))
        },
        notify: (message) => {
            toastActions.showMessage(message)
        },
        featureNotify: () => {
            toastActions.featureNotify()
        },
        addSongsToQueue: async (pId, type = 'album') => {
            const data = await playlistManipulatorActions.fetchAlbumPlaylist(pId);
            if (data && data.status && data.data.songs.length) {
                nowPlayingActions.addSongsToQueue(data.data.songs);
            } else {
                toastActions.showMessage("Playlist you tried to add to the queue.. seems to be empty!")
            }
        },
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AlbumHolder);
