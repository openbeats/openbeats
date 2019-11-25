import React, { Component, Fragment } from 'react'
import "../css/playlistdisplay.css";
import { toastActions, coreActions, nowPlayingActions } from "../actions";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { musicDummy } from '../images';
// import Loader from 'react-loader-spinner';

class PlaylistDisplay extends Component {

    constructor(props) {
        super(props);
        this.state = {
            playlistId: "1243lk34j34",
            playlistData: [
                {
                    "title": "Beauty and the Beast (From \"Beauty and the Beast\"/Official Video)",
                    "thumbnail": "https://i.ytimg.com/vi/axySrE0Kg6k/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAyLaNZDhg1CuQktb2lf7sSxxmi7w",
                    "duration": "4:01",
                    "videoId": "axySrE0Kg6k",
                    "channelName": "DisneyMusicVEVO",
                    "channelId": "/user/DisneyMusicVEVO",
                    "uploadedOn": "2 years ago202,608,778 views",
                    "views": "202,608,778 views",
                    "description": "BeautyandtheBeast is available on Digital, Blu-ray & DVD now: https://movies.disney.com/beauty-and-the-beast-2017 Watch all ..."
                },
                {
                    "title": "Beauty and the Beast (From \"Beauty and the Beast\"/Official Video)",
                    "thumbnail": "https://i.ytimg.com/vi/axySrE0Kg6k/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAyLaNZDhg1CuQktb2lf7sSxxmi7w",
                    "duration": "4:01",
                    "videoId": "axySrE0Kg6k",
                    "channelName": "DisneyMusicVEVO",
                    "channelId": "/user/DisneyMusicVEVO",
                    "uploadedOn": "2 years ago202,608,778 views",
                    "views": "202,608,778 views",
                    "description": "BeautyandtheBeast is available on Digital, Blu-ray & DVD now: https://movies.disney.com/beauty-and-the-beast-2017 Watch all ..."
                },
                {
                    "title": "Beauty and the Beast (From \"Beauty and the Beast\"/Official Video)",
                    "thumbnail": "https://i.ytimg.com/vi/axySrE0Kg6k/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAyLaNZDhg1CuQktb2lf7sSxxmi7w",
                    "duration": "4:01",
                    "videoId": "axySrE0Kg6k",
                    "channelName": "DisneyMusicVEVO",
                    "channelId": "/user/DisneyMusicVEVO",
                    "uploadedOn": "2 years ago202,608,778 views",
                    "views": "202,608,778 views",
                    "description": "BeautyandtheBeast is available on Digital, Blu-ray & DVD now: https://movies.disney.com/beauty-and-the-beast-2017 Watch all ..."
                },
                {
                    "title": "Beauty and the Beast (From \"Beauty and the Beast\"/Official Video)",
                    "thumbnail": "https://i.ytimg.com/vi/axySrE0Kg6k/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAyLaNZDhg1CuQktb2lf7sSxxmi7w",
                    "duration": "4:01",
                    "videoId": "axySrE0Kg6k",
                    "channelName": "DisneyMusicVEVO",
                    "channelId": "/user/DisneyMusicVEVO",
                    "uploadedOn": "2 years ago202,608,778 views",
                    "views": "202,608,778 views",
                    "description": "BeautyandtheBeast is available on Digital, Blu-ray & DVD now: https://movies.disney.com/beauty-and-the-beast-2017 Watch all ..."
                },
                {
                    "title": "Beauty and the Beast (From \"Beauty and the Beast\"/Official Video)",
                    "thumbnail": "https://i.ytimg.com/vi/axySrE0Kg6k/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAyLaNZDhg1CuQktb2lf7sSxxmi7w",
                    "duration": "4:01",
                    "videoId": "axySrE0Kg6k",
                    "channelName": "DisneyMusicVEVO",
                    "channelId": "/user/DisneyMusicVEVO",
                    "uploadedOn": "2 years ago202,608,778 views",
                    "views": "202,608,778 views",
                    "description": "BeautyandtheBeast is available on Digital, Blu-ray & DVD now: https://movies.disney.com/beauty-and-the-beast-2017 Watch all ..."
                },
                {
                    "title": "Beauty and the Beast (From \"Beauty and the Beast\"/Official Video)",
                    "thumbnail": "https://i.ytimg.com/vi/axySrE0Kg6k/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAyLaNZDhg1CuQktb2lf7sSxxmi7w",
                    "duration": "4:01",
                    "videoId": "axySrE0Kg6k",
                    "channelName": "DisneyMusicVEVO",
                    "channelId": "/user/DisneyMusicVEVO",
                    "uploadedOn": "2 years ago202,608,778 views",
                    "views": "202,608,778 views",
                    "description": "BeautyandtheBeast is available on Digital, Blu-ray & DVD now: https://movies.disney.com/beauty-and-the-beast-2017 Watch all ..."
                },
                {
                    "title": "Beauty and the Beast (From \"Beauty and the Beast\"/Official Video)",
                    "thumbnail": "https://i.ytimg.com/vi/axySrE0Kg6k/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAyLaNZDhg1CuQktb2lf7sSxxmi7w",
                    "duration": "4:01",
                    "videoId": "axySrE0Kg6k",
                    "channelName": "DisneyMusicVEVO",
                    "channelId": "/user/DisneyMusicVEVO",
                    "uploadedOn": "2 years ago202,608,778 views",
                    "views": "202,608,778 views",
                    "description": "BeautyandtheBeast is available on Digital, Blu-ray & DVD now: https://movies.disney.com/beauty-and-the-beast-2017 Watch all ..."
                },
                {
                    "title": "Beauty and the Beast (From \"Beauty and the Beast\"/Official Video)",
                    "thumbnail": "https://i.ytimg.com/vi/axySrE0Kg6k/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAyLaNZDhg1CuQktb2lf7sSxxmi7w",
                    "duration": "4:01",
                    "videoId": "axySrE0Kg6k",
                    "channelName": "DisneyMusicVEVO",
                    "channelId": "/user/DisneyMusicVEVO",
                    "uploadedOn": "2 years ago202,608,778 views",
                    "views": "202,608,778 views",
                    "description": "BeautyandtheBeast is available on Digital, Blu-ray & DVD now: https://movies.disney.com/beauty-and-the-beast-2017 Watch all ..."
                },
                {
                    "title": "Beauty and the Beast (From \"Beauty and the Beast\"/Official Video)",
                    "thumbnail": "https://i.ytimg.com/vi/axySrE0Kg6k/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAyLaNZDhg1CuQktb2lf7sSxxmi7w",
                    "duration": "4:01",
                    "videoId": "axySrE0Kg6k",
                    "channelName": "DisneyMusicVEVO",
                    "channelId": "/user/DisneyMusicVEVO",
                    "uploadedOn": "2 years ago202,608,778 views",
                    "views": "202,608,778 views",
                    "description": "BeautyandtheBeast is available on Digital, Blu-ray & DVD now: https://movies.disney.com/beauty-and-the-beast-2017 Watch all ..."
                },
                {
                    "title": "Beauty and the Beast (From \"Beauty and the Beast\"/Official Video)",
                    "thumbnail": "https://i.ytimg.com/vi/axySrE0Kg6k/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAyLaNZDhg1CuQktb2lf7sSxxmi7w",
                    "duration": "4:01",
                    "videoId": "axySrE0Kg6k",
                    "channelName": "DisneyMusicVEVO",
                    "channelId": "/user/DisneyMusicVEVO",
                    "uploadedOn": "2 years ago202,608,778 views",
                    "views": "202,608,778 views",
                    "description": "BeautyandtheBeast is available on Digital, Blu-ray & DVD now: https://movies.disney.com/beauty-and-the-beast-2017 Watch all ..."
                },
                {
                    "title": "Beauty and the Beast (From \"Beauty and the Beast\"/Official Video)",
                    "thumbnail": "https://i.ytimg.com/vi/axySrE0Kg6k/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAyLaNZDhg1CuQktb2lf7sSxxmi7w",
                    "duration": "4:01",
                    "videoId": "axySrE0Kg6k",
                    "channelName": "DisneyMusicVEVO",
                    "channelId": "/user/DisneyMusicVEVO",
                    "uploadedOn": "2 years ago202,608,778 views",
                    "views": "202,608,778 views",
                    "description": "BeautyandtheBeast is available on Digital, Blu-ray & DVD now: https://movies.disney.com/beauty-and-the-beast-2017 Watch all ..."
                },
                {
                    "title": "Beauty and the Beast (From \"Beauty and the Beast\"/Official Video)",
                    "thumbnail": "https://i.ytimg.com/vi/axySrE0Kg6k/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAyLaNZDhg1CuQktb2lf7sSxxmi7w",
                    "duration": "4:01",
                    "videoId": "axySrE0Kg6k",
                    "channelName": "DisneyMusicVEVO",
                    "channelId": "/user/DisneyMusicVEVO",
                    "uploadedOn": "2 years ago202,608,778 views",
                    "views": "202,608,778 views",
                    "description": "BeautyandtheBeast is available on Digital, Blu-ray & DVD now: https://movies.disney.com/beauty-and-the-beast-2017 Watch all ..."
                },
            ],
            playlistName: "Beast Collection",
            playlistThumbnail: musicDummy
        }
    }


    componentDidMount() {
        this.props.setCurrentAction("Playlist");
    }

    render() {
        return (
            <div className="playlist-display-wrapper">
                <div className="playlist-display-left-section-wrapper">
                    <div className="playlist-display-thumbnail-holder">
                        <img src={this.state.playlistThumbnail} alt="" srcSet="" />
                    </div>
                    <div className="playlist-display-title-holder">
                        {this.state.playlistName}
                    </div>
                    <div className="playlist-display-play-pause-holder">
                        <button onClick={() => {
                            this.props.updatePlayerQueue(this.state)
                        }}>
                            {/* <i className="fas fa-pause"></i> pause  */}
                            {/* : */}
                            <i className="fas fa-play"></i> Play
                        </button>
                    </div>
                    <div className="playlist-display-miscellanious-holder">
                        <i className="fas fa-heart cursor-pointer"></i>
                        <i className="fas fa-bookmark cursor-pointer"></i>
                    </div>
                </div>
                <div className="playlist-display-right-section-wrapper">
                    {this.state.playlistData.map((item, key) => (
                        <Fragment key={key}>
                            <div className="playlist-display-songs-holder" >
                                <span className="playlist-display-songs-serial-no">
                                    {key + 1}.
                                </span>
                                <span>
                                    <i className="fas fa-play playlist-display-songs-icon"></i>
                                </span>
                                <span>
                                    <div className="playlist-display-songs-title">{item.title}</div>
                                    <div className="playlist-display-songs-duration">{item.duration}</div>
                                </span>
                            </div>
                            <hr />
                        </Fragment>
                    ))}
                </div>
            </div >
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
        setCurrentAction: (action) => {
            dispatch(coreActions.setCurrentAction(action))
        },
        updatePlayerQueue: (playlistData) => {
            nowPlayingActions.updatePlayerQueue(playlistData);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistDisplay);