import React, { Component, Fragment } from 'react'
import "../css/playlistdisplay.css";
import { toastActions, coreActions, nowPlayingActions, playerActions, playlistManipulatorActions, searchActions } from "../actions";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { musicDummy, playerdownload, pQueueWhite } from '../images';
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
        await this.setState({ ...this.initialState })
        const {
            type,
            id
        } = this.props.match.params
        if (type === "user") {
            const data = await this.props.fetchUserPlaylist(id);
            if (data && data.status) {
                await this.setState({
                    type,
                    playlistId: id,
                    playlistName: data.data.name,
                    playlistThumbnail: data.data.thumbnail ? data.data.thumbnail : musicDummy,
                    editedName: data.data.name,
                    playlistItems: data.data.songs,
                    isLoading: false,
                })
            } else {
                this.props.notify("Invalid Playlist!");
                this.props.push("/");
            }
        } else if (type === "charts") {
            const data = await this.props.fetchChartsPlaylist(id);
            if (data && data.status) {
                await this.setState({
                    type,
                    playlistId: id,
                    playlistName: data.data.name,
                    playlistThumbnail: data.data.thumbnail ? data.data.thumbnail : musicDummy,
                    playlistItems: data.data.songs,
                    isLoading: false,
                })
            } else {
                this.props.notify("Invalid Playlist!");
                this.props.push("/");
            }
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
                                        <img onClick={() => this.props.addSongsToQueue(this.state.type, this.state.playlistId)} className="cursor-pointer" title="Add to Queue" src={pQueueWhite} alt="" srcSet="" />
                                        <i className="fas fa-lock cursor-pointer pl-3 pr-3" title="Make Playlist Private"></i>
                                        <i className="fas fa-trash-alt cursor-pointer" title="Delete Playlist" onClick={() => this.props.deleteUserPlaylist(this.state.playlistId)}></i>
                                    </Fragment> :
                                    <Fragment>
                                        <div onClick={() => this.props.addSongsToQueue(this.state.type, this.state.playlistId)} className="d-flex align-items-center justify-content-center cursor-pointer">
                                            <img title="Add to Queue" src={pQueueWhite} alt="" srcSet="" />
                                            <span className="pl-2 f-s-16">Add to Queue!</span>
                                        </div>

                                        {/* <i className="fas fa-heart cursor-pointer"></i>
                                        <i className="fas fa-bookmark cursor-pointer"></i> */}
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
                                                        if (this.props.playlistId) {
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
                                                        // store.dispatch(push("/auth"))
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
                                            Your Playlist is Empty!
                                            <br />
                                            <br />
                                            You can search and add songs to your Playlist!
                                        </div>}
                                    {this.state.type === "charts" && <div className="text-align-center width-100 height-100 d-flex align-items-center justify-content-center">
                                        This Top Chart is Empty!
                                        <br />
                                        <br />
                                        Stay Tuned!!!
                                        </div>}
                                </Fragment>
                            }
                        </div>
                    </Fragment>
                }
            </div >
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
                // store.dispatch(push("/auth"))
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
        fetchUserPlaylist: (playlistId) => {
            return playlistManipulatorActions.fetchUserPlaylist(playlistId);
        },
        fetchChartsPlaylist: (playlistId) => {
            return playlistManipulatorActions.fetchChartsPlaylist(playlistId);
        },
        changeUserPlaylistName: (playlistId, playlistName) => {
            return playlistManipulatorActions.changeUserPlaylistName(playlistId, playlistName);
        },
        deleteUserPlaylist: async (pId) => {
            await playlistManipulatorActions.deleteUserPlaylist(pId);
            dispatch(push("/yourplaylist"))
        },
        updateTyping: (isTyping) => {
            dispatch(searchActions.updateTyping(isTyping));
        },
        removeSongFromPlaylist: async (playlistId, songId) => {
            await playlistManipulatorActions.removeSongFromPlaylist(playlistId, songId);
        },
        addSongsToQueue: async (type, pId) => {
            if (!store.getState().authReducer.isAuthenticated) {
                toastActions.showMessage("Please Login to use this feature!")
                // store.dispatch(push("/auth"))
                return
            }

            let data = { status: false, data: {} }
            if (type === "user") {
                data = await playlistManipulatorActions.fetchUserPlaylist(pId);
            } else if (type === "charts") {
                data = await playlistManipulatorActions.fetchChartsPlaylist(pId);
            }
            if (data && data.status && data.data.songs.length) {
                nowPlayingActions.addSongsToQueue(data.data.songs);
            } else {
                toastActions.showMessage("Playlist you tried to add to the queue.. seems to be empty!")
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistDisplay);