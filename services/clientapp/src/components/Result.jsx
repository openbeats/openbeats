import React, { Component } from 'react';
import { master } from "../assets/images";
import Loader from 'react-loader-spinner';
import "../assets/css/result.css";
import { connect } from "react-redux";
import { coreActions, nowPlayingActions, playlistManipulatorActions } from '../actions';
import { Song, HorizontalView, ArtistHolder, AlbumHolder, Language, Emotion } from '.';
class Result extends Component {
    componentDidMount() {
        this.props.setCurrentAction("Search Result");
    }

    getAlbumsList() {
        return this.props.albums.length > 0 ? this.props.albums.map((item, key) => (
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
        )) : <></>
    }

    getArtistsList() {
        return this.props.artists.length > 0 ? this.props.artists.map((item, key) => (
            <ArtistHolder
                key={key}
                name={item.name}
                thumbnail={item.thumbnail}
                id={item._id}
            />
        )) : <></>
    }
    getLanguagesList() {
        return this.props.languages.length > 0 ? this.props.languages.map((item, key) => (
            <Language
                key={key}
                name={item.name}
                thumbnail={item.thumbnail}
                id={item._id}
            />
        )) : <></>
    }
    geEmotionsList() {
        return this.props.emotions.length > 0 ? this.props.emotions.map((item, key) => (
            <Emotion
                key={key}
                name={item.name}
                thumbnail={item.thumbnail}
                id={item._id}
            />
        )) : <></>
    }


    Songs = () => {
        return this.props.songs.length > 0 ? <div className="home-section">
            <div className="home-section-header">
                <div className="left-section" >
                    <i className="fad fa-music-alt"></i>
                    <span className="">Songs</span>
                </div>
            </div>
            <div className="song-results-wrapper">
                {this.props.songs.map((item, key) => (
                    <Song
                        key={key}
                        index={key}
                        item={item}
                        updateCurrentPlaying={this.props.updateCurrentPlaying}
                    />
                ))}
            </div>
        </div> : <></>
    }

    Artists = () => {
        return this.props.artists.length > 0 ? <div className="home-section">
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
        </div> : <></>
    }

    Languages = () => {
        return this.props.languages.length > 0 ? <div className="home-section">
            <div className="home-section-header">
                <div className="left-section" >
                    <i className="fad fa-language"></i>
                    <span className="">Languages</span>
                </div>
            </div>
            <div className="home-section-body">
                <HorizontalView
                    elementList={this.getLanguagesList()}
                />
            </div>
        </div> : <></>
    }

    Emotions = () => {
        return this.props.emotions.length > 0 ? <div className="home-section">
            <div className="home-section-header">
                <div className="left-section" >
                    <i className="fad fa-dove"></i>
                    <span className="">Emotions</span>
                </div>
            </div>
            <div className="home-section-body">
                <HorizontalView
                    elementList={this.geEmotionsList()}
                />
            </div>
        </div> : <></>
    }

    Albums = () => {
        return this.props.albums.length > 0 ? <div className="home-section">
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
        </div> : <></>
    }

    render() {
        return (
            !this.props.isSearching ?
                this.props.songs.length > 0 || this.props.albums.length > 0 || this.props.artists.length > 0 ?
                    <div className="search-result-container">
                        <this.Albums />
                        <this.Artists />
                        <this.Emotions />
                        <this.Languages />
                        <this.Songs />
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
        emotions: state.searchReducer.emotions,
        languages: state.searchReducer.languages,
        isSearching: state.searchReducer.isSearching,
        isAuthenticated: state.authReducer.isAuthenticated,
        likedPlaylists: state.authReducer.likedPlaylists,
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        updateCurrentPlaying: (audioData, key = null) => {
            nowPlayingActions.updateCurrentPlaying(audioData)
        },
        setCurrentAction: (action) => {
            dispatch(coreActions.setCurrentAction(action))
        },
        addOrRemoveAlbumFromUserCollection: async (isAdd = true, albumId) => {
            return await playlistManipulatorActions.addOrRemoveAlbumFromUserCollection(albumId, isAdd);
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Result);