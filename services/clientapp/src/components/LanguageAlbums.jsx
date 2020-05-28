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

class LanguageAlbums extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.initialState = {
            languageName: "",
            isLoading: true,
            languageThumbnail: "",
            languageId: "",
            languageAlbums: [],
            next: true,
            previous: false,
            page: 1,
            limit: 20,
            isScrollFetchInProcess: false,
        };
        this.observer = null;
        this.intersectElement = null;
        this.state = { ...this.initialState };
    }

    async componentDidMount() {
        this._isMounted = true;
        await this.languageInitialFetch();
        this.props.setCurrentAction(this.state.languageName + " Albums");
        this.fetchLanguageAlbumsHandler();
        this.initiateScrollFetcher();
    }

    initiateScrollFetcher() {
        let options = {
            root: document.getElementById("main-body"),
            rootMargin: '0px',
            threshold: 1
        }

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.intersectionRatio >= 0.95) {
                        this.fetchLanguageAlbumsHandler();
                    }
                }
            });
        }, options);

        if (this.intersectElement)
            this.observer.observe(this.intersectElement);

    }

    languageInitialFetch = async () => {
        try {
            const languageMetaFetchUrl = `${variables.baseUrl}/playlist/language/fetch?tagId=${this.props.match.params.id}`;
            const languageData = (await axios.get(languageMetaFetchUrl)).data;
            if (languageData.status) {
                const { name, thumbnail, _id } = languageData.data;
                await this.setState({ languageName: name, languageThumbnail: thumbnail, languageId: _id });
            } else {
                throw new Error(languageData.data);
            }
        } catch (error) {
            this.props.notify(error.message.toString());
            this.props.push("/");
        }
    }

    fetchLanguageAlbumsHandler = async () => {
        try {
            if (this.state.next && !this.state.isScrollFetchInProcess) {
                this.setState({ isScrollFetchInProcess: true })
                const languageAlbumsFetchUrl = `${variables.baseUrl}/playlist/language/${this.state.languageId}/albums?page=${this.state.page}&limit=${this.state.limit}`;
                const data = (await axios.get(languageAlbumsFetchUrl)).data;
                if (data.status) {
                    this.setState({
                        isLoading: false,
                        languageAlbums: [...this.state.languageAlbums, ...data.data.result],
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
            arrayList.map((item, key) => (
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
            ))
        );
    }

    AllAlbums = () => {
        return <div className="home-section">
            <div className="albums-wrapper">
                {this.getAlbumsList(this.state.languageAlbums)}
                <div ref={d => this.intersectElement = d} className="intersection-holder"></div>
            </div>
        </div>
    };

    componentDidUpdate(nProps) {
        if (nProps.match.params.type !== this.props.match.params.type) this.fetchLanguageAlbumsHandler();
    }

    componentWillUnmount() {
        this.setState({ ...this.initialState });
        this._isMounted = false;
        if (this.observer) this.observer.disconnect();
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
                            style={{ backgroundImage: `url(${this.state.languageThumbnail}), url(${musicDummy})` }}></div>
                        <div className="artist-albums-artist-name">{this.state.languageName}</div>
                    </div>
                    {
                        this.state.languageAlbums.length > 0 && <this.AllAlbums />
                    }
                    {
                        this.state.languageAlbums.length === 0 && (
                            <div className="height-200px font-weight-bold d-flex align-items-center justify-content-center text-align-center">
                                No {this.state.languageName} Albums Found! <br />
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

export default connect(mapStateToProps, mapDispatchToProps)(LanguageAlbums);
