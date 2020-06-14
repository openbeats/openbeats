import React, { Component, Fragment } from 'react'
import "../assets/css/playlistdisplay.css";
import { toastActions, coreActions, nowPlayingActions, playerActions, playlistManipulatorActions, searchActions, helmetActions } from "../actions";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { musicDummy, pQueueWhite } from '../assets/images';
import Loader from 'react-loader-spinner';
import queryString from 'query-string';
import { store } from '../store';
import { Song } from ".";

class PlaylistDisplay extends Component {

    constructor(props) {
        super(props);
        this.initialState = {
            playlistId: "",
            playlistItems: [],
            playlistName: "",
            type: "",
            playlistThumbnail: musicDummy,
            downloadProcess: false,
            isLoading: true,
            editedName: "",
            editPlaylistName: false,
            videoId: [],
            isAlbumIsInCollection: false
        }
        this.state = { ...this.initialState };
        this.updateCurrentPlaying = this.updateCurrentPlaying.bind(this);
        this.delteSongFromPlaylist = this.delteSongFromPlaylist.bind(this);
    }

    async componentDidMount() {
        await this.props.setCurrentAction("Playlist");
        await this.playlistFetchHandler();
        helmetActions.updateHelment({
            title: this.state.playlistName + " - OpenBeats",
            thumbnail: this.state.playlistThumbnail
        })
        const queryValues = await queryString.parse(this.props.location.search)
        if (queryValues.autoplay && queryValues.autoplay === "true")
            this.initQueue()

        this.checkAlbumIsInCollection();
    }

    shareCollection = () => {
        const url = `${window.location.origin}/playlist/${this.state.type}/${this.state.playlistId}?autoplay=true`
        if (coreActions.copyToClipboard(url)) {
            this.props.notify("Album's Link copied to your clipboard!");
        } else {
            this.props.notify("Cannot Copy Album's Link to your clipboard Automatically, you can manually copy the link from the url!");
        }
    }

    async playlistFetchHandler() {
        try {
            await this.setState({ ...this.initialState });
            const {
                type,
                id
            } = this.props.match.params;
            let data = null;
            switch (type) {
                case "user":
                    data = await this.props.fetchAlbumPlaylist(id, 'user');
                    break;
                case "topchart":
                    data = await this.props.fetchAlbumPlaylist(id, 'topchart');
                    break;
                case "album":
                    data = await this.props.fetchAlbumPlaylist(id, 'album');
                    break;
                case "recentlyplayed":
                    this.props.setCurrentAction("Recently Played");
                    if (this.props.isAuthenticated)
                        data = await this.props.fetchAlbumPlaylist(id, 'recentlyplayed');
                    else {
                        this.props.notify("Please Login to Use this Feature!")
                        this.props.push("/")
                        return;
                    }
                    break;
                default:
                    throw new Error("Invalid");
            }

            if (data && data.status) {
                await this.setState({
                    type,
                    playlistId: type === "recentlyplayed" ? "recentlyplayed" : id,
                    playlistName: type === "recentlyplayed" ? "Recently Played" : data.data.name,
                    playlistThumbnail: data.data.thumbnail ? data.data.thumbnail : ((type === "recentlyplayed" && data.data.length > 0) ? data.data[0].thumbnail : musicDummy),
                    editedName: type === "recentlyplayed" ? "Recently Played" : data.data.name,
                    playlistItems: type === "recentlyplayed" ? data.data : data.data.songs,
                    isLoading: false,
                })
            } else throw new Error("Invalid Playlist")

        } catch (error) {
            this.props.notify("Invalid Playlist!");
            this.props.push("/");
        }
    }

    initQueue(key = 0) {
        if (this.state.playlistItems.length > 0) {
            const playlistData = { ...this.state, playlistData: [...this.state.playlistItems] };
            this.props.updatePlayerQueue(playlistData, key);
        } else {
            this.props.notify("Your playlist is empty! you can search and add songs to the playlist :-)")
        }
    }

    updateCurrentPlaying(item, key) {
        if (this.props.playlistId === this.state.playlistId) {
            this.props.selectFromPlaylist(key)
        } else {
            this.initQueue(key)
        }
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            await this.playlistFetchHandler()
        }
        helmetActions.updateHelment({
            title: this.state.playlistName + " - OpenBeats",
            thumbnail: this.state.playlistThumbnail
        })
    }

    componentWillUnmount() {
        this.setState({ ...this.initialState });
    }

    async delteSongFromPlaylist(item) {
        await this.props.removeSongFromPlaylist(this.state.playlistId, item._id)
        await this.playlistFetchHandler()
    }

    checkAlbumIsInCollection = () => {
        this.setState({
            isAlbumIsInCollection: this.props.likedPlaylists.indexOf(this.state.playlistId) === -1 ? false : true
        })
    }

    addOrRemoveAlbumFromCollectionHandler = async () => {
        if (this.state.isAlbumIsInCollection) await this.props.addOrRemoveAlbumFromUserCollection(false, this.state.playlistId);
        else await this.props.addOrRemoveAlbumFromUserCollection(true, this.state.playlistId);
        this.checkAlbumIsInCollection();
    }

    render() {
        return (
            this.state.isLoading ?
                <div className="search-preloader width-100 height-100">
                    <Loader
                        type="ThreeDots"
                        color="#F32C2C"
                        height={80}
                        width={80}
                    />
                </div> :
                <div className="playlist-display-wrapper">
                    <Fragment>
                        <div className="playlist-display-left-section-wrapper">
                            <div className="playlist-display-thumbnail-holder" style={{ backgroundImage: `url(${this.state.playlistThumbnail}), url(${musicDummy})` }} >
                            </div>
                            <div className="playlist-display-description-actions-holder">
                                {this.state.type === "user" && this.state.editPlaylistName ?
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        this.setState({ editPlaylistName: false })
                                        this.props.updateTyping(false)
                                        if (await this.props.changeUserPlaylistName(this.state.playlistId, this.state.editedName)) {
                                            await this.playlistFetchHandler();
                                        }
                                    }} className="edit-playlist-name playlist-display-title-holder">
                                        <input autoFocus type="text" value={this.state.editedName} onChange={(e) => this.setState({ editedName: e.target.value })} />
                                        <div className="edit-playlist-button-holder">
                                            <button className="cursor-pointer" type="submit">save</button>
                                            <button className="cursor-pointer" onClick={() => {
                                                this.props.updateTyping(false);
                                                this.setState({ editPlaylistName: false });
                                            }}>cancel</button>
                                        </div>
                                    </form>
                                    : <div className="playlist-display-title-holder">
                                        {this.state.playlistName}
                                        {this.state.type === "user" && <i onClick={() => {
                                            this.props.updateTyping(true);
                                            this.setState({ editPlaylistName: true });
                                        }} className="fas fa-pencil-alt ml-3 cursor-pointer f-s-15"></i>}
                                    </div>
                                }
                                <div className="playlist-display-songs-count-holder">
                                    {`( ${this.state.playlistItems.length} Songs )`}
                                </div>
                                <div className="playlist-display-play-pause-holder">
                                    {
                                        this.props.playlistId !== this.state.playlistId ?
                                            <div onClick={() => { this.initQueue(); }}>
                                                <i className="fas fa-play"></i> Play
                                        </div>
                                            :
                                            this.props.isMusicPlaying ?
                                                <div onClick={() => { this.props.playPauseToggle() }}>
                                                    <i className="fas fa-pause"></i> pause
                                            </div>
                                                :
                                                <div onClick={() => { this.props.playPauseToggle() }}>
                                                    <i className="fas fa-play"></i> play
                                            </div>
                                    }
                                </div>
                                <div className="playlist-display-miscellanious-holder">
                                    {this.state.type === 'user' ?
                                        <Fragment>
                                            <div>
                                                <img onClick={() => this.props.addSongsToQueue(this.state.playlistItems)} className="cursor-pointer" title="Add to Queue" src={pQueueWhite} alt="" srcSet="" />
                                            </div>
                                            <div>
                                                <i className="fas fa-lock cursor-pointer pl-3 pr-3" title="Make Playlist Private" onClick={this.props.featureNotify}></i>
                                            </div>
                                            <div>
                                                <i className="fas fa-trash-alt cursor-pointer" title="Delete Playlist" onClick={() => this.props.deleteUserPlaylist(this.state.playlistId)}></i>
                                            </div>
                                        </Fragment> :
                                        <Fragment>
                                            <div onClick={() => this.props.addSongsToQueue(this.state.playlistItems)} className="cursor-pointer">
                                                <img title="Add to Queue" src={pQueueWhite} alt="" srcSet="" />
                                            </div>
                                            {this.props.isAuthenticated && !['recentlyplayed', 'topchart', 'user'].includes(this.state.type) &&
                                                <div>
                                                    <i className={`fas fa-heart cursor-pointer ${this.state.isAlbumIsInCollection ? "master-color" : ''}`}
                                                        title={this.state.isAlbumIsInCollection ? "Remove from My Collection" : "Add to My Collection"}
                                                        onClick={this.addOrRemoveAlbumFromCollectionHandler}
                                                    ></i>
                                                </div>
                                            }
                                            {
                                                !['recentlyplayed', 'user'].includes(this.state.type) &&
                                                <div onClick={this.shareCollection}>
                                                    <i className="fas fa-share-alt cursor-pointer"></i>
                                                </div>
                                            }
                                        </Fragment>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="playlist-display-right-section-wrapper">
                            {this.state.playlistItems.length ? this.state.playlistItems.map((item, key) => (
                                <Song
                                    key={key}
                                    index={key}
                                    item={item}
                                    updateCurrentPlaying={this.updateCurrentPlaying}
                                    deleteSongFromUserPlaylist={this.state.type === "user" ? this.delteSongFromPlaylist : undefined}
                                />
                            )) :
                                <Fragment>
                                    {this.state.type === "user" &&
                                        <div className="text-align-center mt-4 width-100 height-100 d-flex align-items-center justify-content-center">
                                            Your Playlist is Empty!<br /><br />You can search and add songs to your Playlist!
                                        </div>
                                    }
                                    {this.state.type === "topchart" &&
                                        <div className="text-align-center mt-4 width-100 height-100 d-flex align-items-center justify-content-center">
                                            This Top Chart is Empty!<br /><br />Stay Tuned!!!
                                        </div>
                                    }
                                    {this.state.type === "recentlyplayed" &&
                                        <div className="text-align-center mt-4 width-100 height-100 d-flex align-items-center justify-content-center">
                                            It seems like you haven't listened to any music yet.<br /><br />Start listening today..It's free!!!
                                        </div>
                                    }
                                </Fragment>
                            }
                        </div>
                    </Fragment>
                </div>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        isMusicPlaying: state.playerReducer.isMusicPlaying,
        isAudioBuffering: state.playerReducer.isAudioBuffering,
        playlistId: state.nowPlayingReducer.playlistId,
        currentPlaying: state.nowPlayingReducer.currentPlaying,
        isPlaylist: state.nowPlayingReducer.isPlaylist,
        isAuthenticated: state.authReducer.isAuthenticated,
        likedPlaylists: state.authReducer.likedPlaylists,
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
        setCurrentAction: (action) => {
            dispatch(coreActions.setCurrentAction(action))
        },
        updatePlayerQueue: (playlistData, key) => {
            if (!store.getState().authReducer.isAuthenticated) {
                toastActions.showMessage("Please Login to use this feature!")
                return
            }
            nowPlayingActions.updatePlayerQueue(playlistData, key);
        },
        selectFromPlaylist: (key) => {
            nowPlayingActions.selectFromPlaylist(key);
        },
        playPauseToggle: () => {
            let action = playerActions.playPauseToggle();
            if (action)
                dispatch(action)
        },
        fetchAlbumPlaylist: (playlistId, type = "album") => {
            return playlistManipulatorActions.fetchAlbumPlaylist(playlistId, type);
        },
        changeUserPlaylistName: (playlistId, playlistName) => {
            return playlistManipulatorActions.changeUserPlaylistName(playlistId, playlistName);
        },
        deleteUserPlaylist: async (pId) => {
            await playlistManipulatorActions.deleteUserPlaylist(pId);
            dispatch(push("/myplaylists"))
        },
        updateTyping: (isTyping) => {
            dispatch(searchActions.updateTyping(isTyping));
        },
        removeSongFromPlaylist: async (playlistId, songId) => {
            await playlistManipulatorActions.removeSongFromPlaylist(playlistId, songId);
        },
        addSongsToQueue: async (songs) => {
            if (!store.getState().authReducer.isAuthenticated) {
                toastActions.showMessage("Please Login to use this feature!")
                return
            }
            if (songs.length) {
                nowPlayingActions.addSongsToQueue(songs);
            } else {
                toastActions.showMessage("Playlist you tried to add to the queue.. seems to be empty!")
            }
        },
        downloadSongHandler: async (item) => {
            return await playlistManipulatorActions.downloadSongHandler(item);
        },
        addOrRemoveAlbumFromUserCollection: async (isAdd = true, albumId) => {
            return await playlistManipulatorActions.addOrRemoveAlbumFromUserCollection(albumId, isAdd);
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistDisplay);