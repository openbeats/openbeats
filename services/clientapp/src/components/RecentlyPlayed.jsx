import React, { Component, Fragment } from 'react'
import "../css/playlistdisplay.css";
import { toastActions, coreActions, nowPlayingActions, playerActions, playlistManipulatorActions, searchActions } from "../actions";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { musicDummy, playerdownload, pQueueWhite } from '../images';
import Loader from 'react-loader-spinner';
import { variables } from '../config';
import { store } from '../store';


class RecentlyPlayed extends Component {
    constructor(props) {
        super(props);
        this.initialState = {
            playlistId: "",
            playlistItems: [],
            playlistName: "Recently Played",
            playlistThumbnail: musicDummy,
            downloadProcess: false,
            videoId: [],
            isLoading: true,
        }
        this.state = { ...this.initialState };
        this.videoId = []
    }


    async componentDidMount() {
        await this.props.setCurrentAction("Playlist");
        await this.playlistFetchHandler();
    }

    async playlistFetchHandler() {
        this.setState({ ...this.initialState })
        // if (type === "user") {
        //     const data = await this.props.fetchUserPlaylist(id);
        //     if (data && data.status) {
        //         await this.setState({
        //             type,
        //             playlistId: id,
        //             playlistName: data.data.name,
        //             playlistThumbnail: data.data.thumbnail ? data.data.thumbnail : musicDummy,
        //             editedName: data.data.name,
        //             playlistItems: data.data.songs,
        //             isLoading: false,
        //         })
        //     } else {
        //         this.props.notify("Invalid Playlist!");
        //         this.props.push("/");
        //     }

        const data = await this.props.getRecentlyPlayed();
        if (data && data.status) {
            this.setState({
                playlistId: data.id,
                playlistThumbnail: musicDummy,
                playlistItems: data.data,
                isLoading: false,
            })
            console.log(data.data);

        } else {
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
                            <div className="playlist-display-title-holder">
                                {this.state.playlistName}
                            </div>
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
                                <Fragment>
                                    <div onClick={() => this.props.addSongsToQueue()} className="d-flex align-items-center justify-content-center cursor-pointer">
                                        <img title="Add to Queue" src={pQueueWhite} alt="" srcSet="" />
                                        <span className="pl-2 f-s-16">Add to Queue!</span>
                                    </div>
                                </Fragment>
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
                                                        store.dispatch(push("/auth"))
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
                store.dispatch(push("/auth"))
                return
            }
            nowPlayingActions.updatePlayerQueue(playlistData, key);
        },
        selectFromPlaylist: (key) => {
            nowPlayingActions.selectFromPlaylist(key);
        },
        updateTyping: (isTyping) => {
            dispatch(searchActions.updateTyping(isTyping));
        },
        playPauseToggle: () => {
            let action = playerActions.playPauseToggle();
            if (action)
                dispatch(action)
        },
        getRecentlyPlayed: (playlistId) => {
            return playlistManipulatorActions.getRecentlyPlayed();
        },
        addSongsToQueue: async () => {
            if (!store.getState().authReducer.isAuthenticated) {
                toastActions.showMessage("Please Login to use this feature!")
                store.dispatch(push("/auth"))
                return
            }
            let data = { status: false, data: [] }
            data = await playlistManipulatorActions.getRecentlyPlayed();
            if (data && data.status && data.data.length) {
                nowPlayingActions.addSongsToQueue(data.data);
            } else {
                toastActions.showMessage("Playlist you tried to add to the queue.. seems to be empty!")
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecentlyPlayed);