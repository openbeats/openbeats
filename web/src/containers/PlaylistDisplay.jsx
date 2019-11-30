import React, { Component, Fragment } from 'react'
import "../css/playlistdisplay.css";
import { toastActions, coreActions, nowPlayingActions, playerActions } from "../actions";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { musicDummy, playerdownload } from '../images';
import Loader from 'react-loader-spinner';
import { variables } from '../config';

class PlaylistDisplay extends Component {

    constructor(props) {
        super(props);
        this.state = {
            playlistId: "1243lk34j34",
            playlistItems: [
                {
                    "title": "Ed Sheeran - Shape of You [Official Video]",
                    "thumbnail": "https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBDr2laWVr1FOfo6vsZFHCQVOlH5w",
                    "duration": "4:24",
                    "videoId": "JGwWNGJdvx8",
                    "channelName": "Ed Sheeran",
                    "channelId": "/channel/UC0C-w0YjGpqDXGB8IHb662A",
                    "uploadedOn": "2 years ago4,501,374,526 views",
                    "views": "4,501,374,526 views",
                    "description": "Tickets for the Divide tour here - http://www.edsheeran.com/tourStream or Download Shape Of You: https://atlanti.cr/2singles ..."
                },
                {
                    "title": "blackbear - hot girl bummer",
                    "thumbnail": "https://i.ytimg.com/vi/LVYXA96D31w/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAJO6OoNre6aBXzIFoZUkEYfzp5ZA",
                    "duration": "3:06",
                    "videoId": "LVYXA96D31w",
                    "channelName": "Chill Nation",
                    "channelId": "/user/ChillStepNation",
                    "uploadedOn": "2 months ago3,363,509 views",
                    "views": "3,363,509 views",
                    "description": "❄️ 'blackbear - hot girl bummer' ↪︎ https://open.spotify.com/track/7aiClxsDWFRQ0Kzk5KI5ku?si=...Spotify ..."
                },
                {
                    "title": "Ennavale Adi Ennavale - Kaadhalan - HD",
                    "thumbnail": "https://i.ytimg.com/vi/tvZi0fd_1IY/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBEJcjaVeI5RMlo-OvlLaNvXqbcYg",
                    "duration": "4:34",
                    "videoId": "tvZi0fd_1IY",
                    "channelName": "NthirN",
                    "channelId": "/user/NthirN",
                    "uploadedOn": "8 years ago2,527,987 views",
                    "views": "2,527,987 views",
                    "description": "Cast : Prabhu Deva , Nagma , Girish Karnad , Raghuvaran. Music by : A.R.Rahman. Directed by : S.Shankar."
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
                    "title": "Luis Fonsi - Despacito ft. Daddy Yankee",
                    "thumbnail": "https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLD5H95NqCXojS1Iyc3E7FrijSmvWg",
                    "duration": "4:42",
                    "videoId": "kJQP7kiw5Fk",
                    "channelName": "Luis Fonsi",
                    "channelId": "/channel/UCxoq-PAQeAdk_zyg8YS0JqA",
                    "uploadedOn": "2 years ago6,541,137,473 views",
                    "views": "6,541,137,473 views",
                    "description": "Despacito” disponible ya en todas las plataformas digitales: https://UMLE.lnk.to/DOoUzFp “Imposible” disponible ya en todas las ..."
                },
                {
                    "title": "Kanne Kalaimane Video Song |Moondram Pirai Tamil Movie Songs | Kamal Hassan| Sri Devi| Pyramid Music",
                    "thumbnail": "https://i.ytimg.com/vi/jCjcoNyjM54/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBU1UlntZTKw32Vn_cIKFczJnHwEA",
                    "duration": "3:54",
                    "videoId": "jCjcoNyjM54",
                    "channelName": "Pyramid Music",
                    "channelId": "/channel/UCyyLMu6nnp0w2TaF5_kNBkg",
                    "uploadedOn": "1 year ago140,885 views",
                    "views": "140,885 views",
                    "description": "Song:  Kanne Kalaimane….Singers: K J YesudasMusic:  Ilaiyaraja Director: Balu MahendraProducer: Sathya Jyothi FilmsA ..."
                },
                {
                    "title": "Aluva puzhayude theerathu Full video Song || Premam Movie",
                    "thumbnail": "https://i.ytimg.com/vi/qHnd9Hls12w/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBQ0qMDj3sfnJ8MpRh06zHoQ1APEQ",
                    "duration": "3:40",
                    "videoId": "qHnd9Hls12w",
                    "channelName": "Movies magic",
                    "channelId": "/channel/UCmebJZhRC2rki7LwZi2759g",
                    "uploadedOn": "1 year ago17,332 views",
                    "views": "17,332 views",
                    "description": "Premam Aluva Puzha SongArtists- Nivin Pauly, Anupama parameswaran"
                },
                {
                    "title": "Sagaa Songs | Yaayum Video Song (யாயும்) | Saran, Ayra | Shabir | Murugesh",
                    "thumbnail": "https://i.ytimg.com/vi/UH0haOwkf3Q/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCnjA7sm-kFxz7gvW2SGkilDRKqFA",
                    "duration": "4:57",
                    "videoId": "UH0haOwkf3Q",
                    "channelName": "Think Music India",
                    "channelId": "/user/thinkmusicindia",
                    "uploadedOn": "9 months ago40,307,863 views",
                    "views": "40,307,863 views",
                    "description": "Sagaa Audio Album is written, composed and produced by independent music artist Shabir. Shabir has released 3 independent ..."
                },
                {
                    "title": "Kanmani Anbodu Kadhalan Song கண்மணி அன்போடு காதலன் | Ilayaraja Hits | S.Janaki Melodys | Guna Songs",
                    "thumbnail": "https://i.ytimg.com/vi/bAoWUrTpmF8/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLD_eRsc-rVEYsL-aKu305vPBsvnvg",
                    "duration": "5:47",
                    "videoId": "bAoWUrTpmF8",
                    "channelName": "N - Isai",
                    "channelId": "/channel/UCRQz3FngSGm2gY5RV89Iuiw",
                    "uploadedOn": "1 year ago675,042 views",
                    "views": "675,042 views",
                    "description": "Kanmani Anbodu Kadhalan Song கண்மணி அன்போடு காதலன் | Ilayaraja Hits | S.Janaki Melodys | Guna Songs ..."
                },
                {
                    "title": "Adiye Manam Nilluna Nikkadhadi Song | Neengal kettavai | SPB | Ilaiyaraja | அடியே மனம்",
                    "thumbnail": "https://i.ytimg.com/vi/mnw4fDGwAnI/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDqZvajVd0nWLIDnfYF8rF9io7KEA",
                    "duration": "4:59",
                    "videoId": "mnw4fDGwAnI",
                    "channelName": "Tamil cinema",
                    "channelId": "/channel/UC-Hm8vtPdB9DDVFEOJMwBzg",
                    "uploadedOn": "3 years ago863,308 views",
                    "views": "863,308 views",
                    "description": "Thiyagarajan | Silk smithaSingers - S.P.Balasubramaniam | S.JanakiMusic - Ilaiyaraaja"
                },
            ],
            playlistName: "Beast Collection",
            playlistThumbnail: musicDummy,
            downloadProcess: false,
            videoId: []
        }
        this.videoId = []
    }


    componentDidMount() {
        this.props.setCurrentAction("Playlist");
    }

    initQueue(key = 0) {
        const playlistData = { ...this.state, playlistData: [...this.state.playlistItems] }
        this.props.updatePlayerQueue(playlistData, key)
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
                    <div className="playlist-display-songs-count-holder">
                        {`( ${this.state.playlistItems.length} Songs )`}
                    </div>
                    <div className="playlist-display-play-pause-holder">
                        {this.props.playlistId !== this.state.playlistId ?
                            <div onClick={() => {
                                this.initQueue()
                            }}>
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
                        <i className="fas fa-heart cursor-pointer"></i>
                        <i className="fas fa-bookmark cursor-pointer"></i>
                    </div>
                </div>
                <div className="playlist-display-right-section-wrapper">
                    {this.state.playlistItems.map((item, key) => (
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
                                            this.videoId.push(item.videoId)
                                            this.setState({ videoId: this.videoId })
                                            await fetch(`${variables.baseUrl}/downcc/${item.videoId}`)
                                                .then(res => {
                                                    if (res.status === 200) {
                                                        this.videoId.splice(this.videoId.indexOf(item.videoId), 1)
                                                        this.setState({ videoId: this.videoId })
                                                        window.open(`${variables.baseUrl}/downcc/${item.videoId}`, '_self')
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
                                        className="t-none cursor-pointer" href={`${variables.baseUrl}/downcc/${item.videoId}`}>
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
                                <span>
                                    <div className="playlist-display-songs-title">{item.title}</div>
                                    <div className="playlist-display-songs-duration">{item.duration}</div>
                                </span>
                            </div>
                        </Fragment>
                    ))}
                </div>
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistDisplay);