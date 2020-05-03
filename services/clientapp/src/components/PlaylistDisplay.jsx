import React, { Component, Fragment } from 'react'
import "../assets/css/playlistdisplay.css";
import { toastActions, coreActions, nowPlayingActions, playerActions, playlistManipulatorActions, searchActions } from "../actions";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { musicDummy, playerdownload, pQueueWhite } from '../assets/images';
import Loader from 'react-loader-spinner';
import { variables } from '../config';
import queryString from 'query-string';
import { store } from '../store';

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
            videoId: [],
            isLoading: true,
            editedName: "",
            editPlaylistName: false,
        }
        this.state = { ...this.initialState };
        this.videoId = []
    }

    async componentDidMount() {
        await this.props.setCurrentAction("Playlist");
        await this.playlistFetchHandler();
        const queryValues = await queryString.parse(this.props.location.search)
        if (queryValues.autoplay && queryValues.autoplay === "true")
            this.initQueue()
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

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.playlistFetchHandler()
        }
    }

    componentWillUnmount() {
        this.setState({ ...this.initialState });
    }


    render() {
        return (
            this.state &&
            <div className="playlist-display-wrapper">
                {this.state.isLoading ?
                    <div className="search-preloader">
                        <Loader
                            type="ThreeDots"
                            color="#F32C2C"
                            height={80}
                            width={80}
                        />
                    </div> :
                    <Fragment>
                        <div className="playlist-display-left-section-wrapper">
                            <div className="playlist-display-thumbnail-holder">
                                <img src={this.state.playlistThumbnail} alt="" srcSet="" />
                            </div>
                            {this.state.type === "user" && this.state.editPlaylistName ?
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    this.setState({ editPlaylistName: false })
                                    this.props.updateTyping(false)
                                    if (await this.props.changeUserPlaylistName(this.state.playlistId, this.state.editedName)) {
                                        await this.playlistFetchHandler();
                                    }
                                }} className="edit-playlist-name playlist-display-title-holder">
                                    <input type="text" value={this.state.editedName} onChange={(e) => this.setState({ editedName: e.target.value })} />
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
                                        {/* <i className="fas fa-unlock cursor-pointer"></i> */}
                                        {/* <i className="fas fa-globe-americas cursor-pointer" title="Make Playlist Public"></i> */}
                                        <img onClick={() => this.props.addSongsToQueue(this.state.playlistItems)} className="cursor-pointer" title="Add to Queue" src={pQueueWhite} alt="" srcSet="" />
                                        <i className="fas fa-lock cursor-pointer pl-3 pr-3" title="Make Playlist Private"></i>
                                        <i className="fas fa-trash-alt cursor-pointer" title="Delete Playlist" onClick={() => this.props.deleteUserPlaylist(this.state.playlistId)}></i>
                                    </Fragment> :
                                    <Fragment>
                                        <div onClick={() => this.props.addSongsToQueue(this.state.playlistItems)} className="d-flex align-items-center justify-content-center cursor-pointer">
                                            <img title="Add to Queue" src={pQueueWhite} alt="" srcSet="" />
                                            <span className="pl-2 f-s-16">Add to Queue!</span>
                                        </div>
                                        {/* <i className="fas fa-heart cursor-pointer"></i> */}
                                    </Fragment>
                                }
                            </div>
                        </div>
                        <div className="playlist-display-right-section-wrapper">
                            {this.state.playlistItems.length ? this.state.playlistItems.map((item, key) => (
                                <Fragment key={key}>
                                    <div className={`playlist-display-songs-holder ${this.props.isPlaylist && this.props.currentPlaying.videoId === item.videoId ? 'highlight-active' : ''}`} >
                                        <span className="playlist-display-songs-serial-no">
                                            {key + 1}.
                                        </span>
                                        <span
                                            className="cursor-pointer"
                                        >
                                            {this.props.isPlaylist && this.props.currentPlaying.videoId === item.videoId ?
                                                this.props.isAudioBuffering ?
                                                    <Loader
                                                        type="Rings"
                                                        color="#F32C2C"
                                                        height={30}
                                                        width={30}
                                                        className="playlist-display-songs-icon"
                                                    />
                                                    :
                                                    this.props.isMusicPlaying ?
                                                        <i
                                                            onClick={
                                                                () => {
                                                                    this.props.playPauseToggle()
                                                                }
                                                            }
                                                            className="fas fa-pause playlist-display-songs-icon"

                                                        ></i>
                                                        :
                                                        <i
                                                            onClick={
                                                                () => {
                                                                    this.props.playPauseToggle()
                                                                }
                                                            }
                                                            className="fas fa-play playlist-display-songs-icon"

                                                        ></i>
                                                :
                                                <i
                                                    onClick={() => {
                                                        if (this.props.playlistId === this.state.playlistId) {
                                                            this.props.selectFromPlaylist(key)
                                                        } else {
                                                            this.initQueue(key)
                                                        }
                                                    }}
                                                    className="fas fa-play playlist-display-songs-icon"></i>
                                            }
                                        </span>
                                        <span>
                                            <a download
                                                onClick={async (e) => {
                                                    e.preventDefault()
                                                    if (!this.props.isAuthenticated) {
                                                        toastActions.showMessage("Please Login to use this feature!")
                                                        return
                                                    }
                                                    this.videoId.push(item.videoId)
                                                    this.setState({ videoId: this.videoId })
                                                    await fetch(`${variables.baseUrl}/downcc/${item.videoId}?title=${encodeURI(item.title)}`)
                                                        .then(res => {
                                                            if (res.status === 200) {
                                                                this.videoId.splice(this.videoId.indexOf(item.videoId), 1)
                                                                this.setState({ videoId: this.videoId })
                                                                window.open(`${variables.baseUrl}/downcc/${item.videoId}?title=${encodeURI(item.title)}`, '_self')
                                                            } else {
                                                                this.videoId.splice(this.videoId.indexOf(item.videoId), 1)
                                                                this.setState({ videoId: this.videoId })
                                                                this.props.notify("Requested content not available right now!, try downloading alternate songs!");
                                                            }
                                                        }).catch(err => {
                                                            this.videoId.splice(this.videoId.indexOf(item.videoId), 1)
                                                            this.setState({ videoId: this.videoId })
                                                            this.props.notify("Requested content not available right now!, try downloading alternate songs!");
                                                        })
                                                }}
                                                className="t-none cursor-pointer" href={`${variables.baseUrl}/downcc/${item.videoId}?title=${encodeURI(item.title)}`}>
                                                {this.state.videoId.includes(item.videoId) ?
                                                    <Loader
                                                        type="Oval"
                                                        color="#F32C2C"
                                                        height={20}
                                                        width={20}
                                                        className="playlist-display-songs-icon-2"
                                                    />
                                                    :
                                                    <img className="playlist-display-songs-icon-2" src={playerdownload} alt="" />
                                                }
                                            </a>
                                        </span>
                                        {this.state.type === 'user' &&
                                            <span>
                                                <i className="fas fa-trash-alt playlist-display-songs-icon cursor-pointer"
                                                    onClick={async () => {
                                                        await this.props.removeSongFromPlaylist(this.state.playlistId, item._id)
                                                        await this.playlistFetchHandler()
                                                    }}
                                                ></i>
                                            </span>
                                        }
                                        <span>
                                            <div className="playlist-display-songs-title">{item.title}</div>
                                            <div className="playlist-display-songs-duration">{item.duration}</div>
                                        </span>
                                    </div>
                                </Fragment>
                            )) :
                                <Fragment>
                                    {this.state.type === "user" &&
                                        <div className="text-align-center width-100 height-100 d-flex align-items-center justify-content-center">
                                            Your Playlist is Empty!<br /><br />You can search and add songs to your Playlist!
                                        </div>
                                    }
                                    {this.state.type === "topchart" &&
                                        <div className="text-align-center width-100 height-100 d-flex align-items-center justify-content-center">
                                            This Top Chart is Empty!<br /><br />Stay Tuned!!!
                                        </div>
                                    }
                                    {this.state.type === "recentlyplayed" &&
                                        <div className="text-align-center width-100 height-100 d-flex align-items-center justify-content-center">
                                            It seems like you haven't listened to any music yet.<br /><br />Start listening today..It's free!!!
                                        </div>
                                    }
                                </Fragment>
                            }
                        </div>
                    </Fragment>
                }
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
        isAuthenticated: state.authReducer.isAuthenticated
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistDisplay);