import React, { Component } from 'react';
import "../assets/css/albumholder.css";
import { musicDummy } from '../assets/images';
import { push } from 'connected-react-router';
import { toastActions, playlistManipulatorActions, nowPlayingActions, coreActions } from '../actions';
import { connect } from 'react-redux';

class AlbumHolder extends Component {

    constructor(props) {
        super(props);
        this.heartRef = null;
        this.playRef = null;
        this.shareRef = null;
        this.addToQueueRef = null;
    }

    addOrRemoveAlbumFromCollectionHandler = () => {
        if (this.props.addOrRemoveAlbumFromCollectionHandler) {
            if (this.props.isAlbumIsInCollection) this.props.addOrRemoveAlbumFromCollectionHandler(false, this.props.albumId)
            else this.props.addOrRemoveAlbumFromCollectionHandler(true, this.props.albumId)
        }
    }

    shareCollection = () => {
        if (this.shareRef) {
            const url = `${window.location.origin}/playlist/${this.props.type}/${this.props.albumId}?autoplay=true`
            if (coreActions.copyToClipboard(url)) {
                this.shareRef.classList.add("copied-to-clipboard");
                setTimeout(() => {
                    if (this.shareRef) this.shareRef.classList.remove("copied-to-clipboard");
                }, 3000)
                this.props.notify("Album's Link copied to your clipboard!");
            } else {
                this.props.notify("Cannot Copy Album's Link to your clipboard Automatically, you can manually copy the link from the url!");
            }
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


    Main = () => {
        return <div className="album-holder-wrapper" onClick={(e) => {
            if (this.heartRef && this.heartRef.contains(e.target))
                return;
            if (this.shareRef && this.shareRef.contains(e.target))
                return
            this.albumViewCallBack(this.props.albumId);
        }} style={{ backgroundImage: `url(${this.props.albumThumbnail}), url(${musicDummy})` }}>
            {/* share icon placement */}
            <div className="album-holer-share-icon-wrapper cursor-pointer">
                <i className="fas fa-share-alt master-color"
                    ref={d => this.shareRef = d}
                    title="Click to copy this album's link to your clipboard!"
                    onClick={this.shareCollection}
                ></i>
            </div>
            {this.props.addOrRemoveAlbumFromCollectionHandler &&
                this.props.isAuthenticated &&
                <i className={`fas fa-heart album-add-to-collection-icon ${this.props.isAlbumIsInCollection ? "master-color" : ''}`}
                    title={this.props.isAlbumIsInCollection ? "Remove from My Collection" : "Add to My Collection"}
                    onClick={this.addOrRemoveAlbumFromCollectionHandler}
                    ref={d => this.heartRef = d}
                ></i>
            }
            <div className="album-holder-play-icon-visible-on-hover">
                <i className="far fa-eye" title="View this Album" onClick={() => this.albumViewCallBack(this.props.albumId)}></i>
                <i className="fas fa-play" title="Reset Current Queue and Play this Album" ref={d => this.playRef = d} onClick={() => this.albumPlayCallBack(this.props.albumId)}></i>
                <i className="fas fa-plus-square" title="Add to The current Queue" onClick={() => this.albumAddToCurrentQueueCallBack(this.props.albumId)}></i>
            </div>
            <div className="album-holder-songs-total-holder">{this.props.albumTotalSongs}</div>
            <div className="album-holder-album-desc">
                <div className="album-holder-album-title">{this.props.albumName}</div>
                <div className="album-holder-album-date">{this.props.albumCreationDate}</div>
                <div className="album-holder-album-by">by {this.props.albumCreatedBy}</div>
            </div>
        </div>
    }

    ExploreMore = () => {
        return <div className="album-holder-wrapper album-explore-more cursor-pointer" onClick={() => this.props.push(this.props.exploreMoreUrl)}>
            <div className="explore-more-icon-holer">
                <i className="fas fa-compass"></i>
            </div>
            <div className="explore-more-text-holer">
                Explore More
            </div>
        </div>
    }

    render() {
        return !this.props.exploreMore ? <this.Main /> : <this.ExploreMore />;
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
            const data = await playlistManipulatorActions.fetchAlbumPlaylist(pId, type);
            if (data && data.status && data.data.songs.length) {
                nowPlayingActions.addSongsToQueue(data.data.songs);
            } else {
                toastActions.showMessage("Playlist you tried to add to the queue.. seems to be empty!")
            }
        },
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AlbumHolder);
