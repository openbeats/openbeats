import React, { Component } from 'react';
import { master } from "../assets/images";
import Loader from 'react-loader-spinner';
import "../assets/css/result.css";
import { connect } from "react-redux";
import { toastActions, coreActions, nowPlayingActions, playerActions, playlistManipulatorActions } from '../actions';
import { Song, HorizontalView, ArtistHolder, AlbumHolder } from '.';
class Result extends Component {
    componentDidMount() {
        this.props.setCurrentAction("Search Result");
    }

    getSongsList = () => {
        return (
            this.props.songs.map((item, key) => (
                <Song
                    key={key}
                    item={item}
                    isPlaylist={this.props.isPlaylist}
                    currentPlaying={this.props.currentPlaying}
                    isAudioBuffering={this.props.isAudioBuffering}
                    isMusicPlaying={this.props.isMusicPlaying}
                    playPauseToggle={this.props.playPauseToggle}
                    updateCurrentPlaying={this.props.updateCurrentPlaying}
                    downloadSong={this.downloadSong}
                    isAuthenticated={this.props.isAuthenticated}
                    addSongsToQueue={this.props.addSongsToQueue}
                    showAddPlaylistDialog={this.props.showAddPlaylistDialog}
                />
            ))
        )
    }

    getAlbumsList() {
        return this.props.albums.map((item, key) => (
            <AlbumHolder
                key={key}
                albumName={item.name}
                albumThumbnail={item.thumbnail}
                albumTotalSongs={item.totalSongs}
                albumId={item._id}
                albumCreationDate={new Date().toDateString()}
                albumCreatedBy={"OpenBeats"}
                type={'album'}
                addOrRemoveAlbumFromCollectionHandler={this.props.addOrRemoveAlbumFromUserCollection}
                isAuthenticated={this.props.isAuthenticated}
                isAlbumIsInCollection={this.props.likedPlaylists.indexOf(item._id) === -1 ? false : true}
            />
        ))
    }

    getArtistsList() {
        return this.props.artists.map((item, key) => (
            <ArtistHolder
                key={key}
                name={item.name}
                thumbnail={item.thumbnail}
                id={item._id}
            />
        ))
    }


    Songs = () => {
        return this.props.songs.length > 0 && <div className="home-section">
            <div className="home-section-header">
                <div className="left-section" >
                    <i className="fad fa-music-alt"></i>
                    <span className="">Songs</span>
                </div>
            </div>
            <div className="home-section-body">
                <HorizontalView
                    elementList={this.getSongsList()}
                />
            </div>
        </div>
    }

    Artists = () => {
        return this.props.artists.length > 0 && <div className="home-section">
            <div className="home-section-header">
                <div className="left-section" >
                    <i className="fad fa-user-music"></i>
                    <span className="">Artists</span>
                </div>
            </div>
            <div className="home-section-body">
                <HorizontalView
                    elementList={this.getArtistsList()}
                />
            </div>
        </div>
    }

    Albums = () => {
        return this.props.albums.length > 0 && <div className="home-section">
            <div className="home-section-header">
                <div className="left-section" >
                    <i className="fad fa-album"></i>
                    <span className="">Albums</span>
                </div>
            </div>
            <div className="home-section-body">
                <HorizontalView
                    elementList={this.getAlbumsList()}
                />
            </div>
        </div>
    }

    render() {
        return (
            !this.props.isSearching ?
                this.props.songs.length > 0 || this.props.albums.length > 0 || this.props.artists.length > 0 ?
                    <div className="search-result-container">
                        <this.Songs />
                        <this.Albums />
                        <this.Artists />
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
        songs: state.searchReducer.songs,
        artists: state.searchReducer.artists,
        albums: state.searchReducer.albums,
        isSearching: state.searchReducer.isSearching,
        currentPlaying: state.nowPlayingReducer.currentPlaying,
        isPlaylist: state.nowPlayingReducer.isPlaylist,
        isMusicPlaying: state.playerReducer.isMusicPlaying,
        isAudioBuffering: state.playerReducer.isAudioBuffering,
        isAuthenticated: state.authReducer.isAuthenticated,
        likedPlaylists: state.authReducer.likedPlaylists,
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        featureNotify: () => {
            toastActions.featureNotify();
        },
        updateCurrentPlaying: (audioData) => {
            nowPlayingActions.updateCurrentPlaying(audioData)
        },
        notify: (message) => {
            toastActions.showMessage(message)
        },
        setCurrentAction: (action) => {
            dispatch(coreActions.setCurrentAction(action))
        },
        playPauseToggle: () => {
            dispatch(playerActions.playPauseToggle())
        },
        showAddPlaylistDialog: (song) => {
            playlistManipulatorActions.showAddPlaylistDialog(song)
        },
        addSongsToQueue: (song) => {
            nowPlayingActions.addSongsToQueue([song]);
        },
        addOrRemoveAlbumFromUserCollection: async (isAdd = true, albumId) => {
            return await playlistManipulatorActions.addOrRemoveAlbumFromUserCollection(albumId, isAdd);
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Result);