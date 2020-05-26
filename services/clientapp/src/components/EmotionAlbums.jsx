import React, { Component } from "react";
import { musicDummy, spaceImage } from "../assets/images";
import { toastActions, coreActions, playlistManipulatorActions } from "../actions";
import "../assets/css/artistalbums.css";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import Loader from "react-loader-spinner";
import { AlbumHolder } from ".";
import axios from "axios";
import { variables } from "../config";

class EmotionAlbums extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.initialState = {
            emotionName: "",
            isLoading: true,
            emotionThumbnail: "",
            emotionId: "",
            emotionAlbums: [],
            next: true,
            previous: false,
            page: 1,
            limit: 3,
            isScrollFetchInProcess: false,
        };
        this.state = { ...this.initialState };
    }

    async componentDidMount() {
        this._isMounted = true;
        await this.emotionInitialFetch();
        this.props.setCurrentAction(this.state.emotionName + " Albums");
        this.fetchEmotionAlbumsHandler();
        this.initiateScrollFetcher();
    }

    initiateScrollFetcher() {
        const mainBodyRef = document.getElementById("main-body");
        mainBodyRef.addEventListener('scroll', this.scrollFetch);
    }

    scrollFetch = (e) => {
        const totalHeight = e.target.scrollHeight - e.target.offsetHeight;
        if (e.target.scrollTop === totalHeight) {
            this.fetchEmotionAlbumsHandler();
        }
    }


    emotionInitialFetch = async () => {
        try {
            const emotionMetaFetchUrl = `${variables.baseUrl}/playlist/emotion/fetch?tagId=${this.props.match.params.id}`;
            const emotionData = (await axios.get(emotionMetaFetchUrl)).data;
            if (emotionData.status) {
                const { name, thumbnail, _id } = emotionData.data;
                await this.setState({ emotionName: name, emotionThumbnail: thumbnail, emotionId: _id });
            } else {
                throw new Error(emotionData.data);
            }
        } catch (error) {
            this.props.notify(error.message.toString());
            this.props.push("/");
        }
    }

    fetchEmotionAlbumsHandler = async () => {
        try {
            if (this.state.next && !this.state.isScrollFetchInProcess) {
                this.setState({ isScrollFetchInProcess: true });
                const emotionAlbumsFetchUrl = `${variables.baseUrl}/playlist/emotion/${this.state.emotionId}/albums?page=${this.state.page}&limit=${this.state.limit}`;
                const data = (await axios.get(emotionAlbumsFetchUrl)).data;
                if (data.status) {
                    this.setState({
                        isLoading: false,
                        emotionAlbums: [...this.state.emotionAlbums, ...data.data.result],
                        page: data.data.next ? this.state.page + 1 : this.state.page,
                        next: data.data.next ? true : false,
                        previous: data.data.previous ? true : false,
                        isScrollFetchInProcess: false
                    });
                } else {
                    throw new Error(data.data);
                }
            }
        } catch (error) {
            this.props.notify(error.message.toString());
            this.props.push("/");
        }
    };


    addOrRemoveAlbumFromCollectionHandler = (isAdd = true, albumId) => {
        this.props.addOrRemoveAlbumFromUserCollection(albumId, isAdd);
    };

    // List Preparing Part
    getAlbumsList(arrayList) {
        return (
            <div className="albums-wrapper">
                {arrayList.map((item, key) => (
                    <AlbumHolder
                        key={key}
                        albumName={item.name}
                        albumThumbnail={item.thumbnail}
                        albumTotalSongs={item.totalSongs}
                        albumId={item._id}
                        albumCreationDate={new Date(item.createdAt).toDateString()}
                        albumCreatedBy={"OpenBeats"}
                        type={"album"}
                        addOrRemoveAlbumFromCollectionHandler={this.addOrRemoveAlbumFromCollectionHandler}
                        isAuthenticated={this.props.isAuthenticated}
                        isAlbumIsInCollection={this.props.likedPlaylists.indexOf(item._id) === -1 ? false : true}
                    />
                ))}
            </div>
        );
    }

    AllAlbums = () => {
        return <div className="home-section">
            <div className="albums-wrapper">
                {this.getAlbumsList(this.state.emotionAlbums)}
            </div>
        </div>
    };

    componentDidUpdate(nProps) {
        if (nProps.match.params.type !== this.props.match.params.type) this.fetchEmotionAlbumsHandler();
    }

    componentWillUnmount() {
        this.setState({ ...this.initialState });
        this._isMounted = false;
        const mainBodyRef = document.getElementById("main-body");
        mainBodyRef.removeEventListener("scroll", this.scrollFetch);
    }

    render() {
        return this.state.isLoading ? (
            <div className="width-100 height-100 d-flex align-items-center justify-content-center">
                <Loader type="ThreeDots" color="#F32C2C" height={80} width={80} />
            </div>
        ) : (
                <div className="artist-albums-wrapper">
                    <div className="artist-albums-header-image-holder" style={{ backgroundImage: `url(${spaceImage})` }}>
                        <div
                            className="artist-albums-header-artist-display-holder"
                            style={{ backgroundImage: `url(${this.state.emotionThumbnail}), url(${musicDummy})` }}></div>
                        <div className="artist-albums-artist-name">{this.state.emotionName}</div>
                    </div>
                    {
                        this.state.emotionAlbums.length > 0 && <this.AllAlbums />
                    }
                    {
                        this.state.emotionAlbums.length === 0 && (
                            <div className="height-200px font-weight-bold d-flex align-items-center justify-content-center text-align-center">
                                No {this.state.emotionName} Albums Found! <br />
                                <br /> Stay Tuned For Updates!
                            </div>
                        )
                    }
                </div >
            );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.authReducer.isAuthenticated,
        likedPlaylists: state.authReducer.likedPlaylists,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        push: path => {
            dispatch(push(path));
        },
        notify: message => {
            toastActions.showMessage(message);
        },
        featureNotify: () => {
            toastActions.featureNotify();
        },
        setCurrentAction: action => {
            dispatch(coreActions.setCurrentAction(action));
        },
        addOrRemoveAlbumFromUserCollection: async (albumId, isAdd = true) => {
            return await playlistManipulatorActions.addOrRemoveAlbumFromUserCollection(albumId, isAdd);
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmotionAlbums);
