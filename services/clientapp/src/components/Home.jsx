import React, { Component } from 'react'
import { toastActions, coreActions, homeActions, playlistManipulatorActions } from "../actions";
import "../assets/css/home.css";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { HorizontalView, AlbumHolder, ArtistHolder, Language, Emotion } from '.';
import Loader from 'react-loader-spinner';

class Home extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.initialState = {
            popularArtists: [],
            topChartsCollection: [],
            myCollections: [],
            latestAlbums: [],
            popularAlbums: [],
            surpriseAlbums: [],
            emotions: [],
            languages: [],
            isLoading: true
        };
        this.state = { ...this.initialState };
    }

    componentDidMount() {
        this._isMounted = true;
        this.props.setCurrentAction("Home");
        this.prepareHomeData();
    }

    // Data Fetch Part
    prepareHomeData = async () => {
        this.fetchTopCharts();
        this.fetchLatestAlbums();
        if (this.props.isAuthenticated) this.fetchMyCollections();
        this.fetchPopularAlbums();
        this.fetchEmotions();
        this.fetchLanguages();
        this.fetchPopularArtists();
        this._isMounted && this.setState({ isLoading: false })
    }

    fetchTopCharts = async () => {
        const data = await this.props.fetchTopCharts();
        this._isMounted && this.setState({ topChartsCollection: data, isLoading: false });
    }

    fetchMyCollections = async () => {
        const data = await this.props.fetchMyCollections();
        this._isMounted && this.setState({ myCollections: data, isLoading: false });
    }

    fetchPopularAlbums = async () => {
        const data = await this.props.fetchPopularAlbums();
        this._isMounted && this.setState({ popularAlbums: data, isLoading: false });
    }

    fetchLatestAlbums = async () => {
        const data = await this.props.fetchLatestAlbums();
        this._isMounted && this.setState({ latestAlbums: data, isLoading: false });
    }

    fetchPopularArtists = async () => {
        const data = await this.props.fetchPopularArtists();
        this._isMounted && this.setState({ popularArtists: data, isLoading: false });
    }

    fetchEmotions = async () => {
        const data = await this.props.fetchEmotions();
        this._isMounted && this.setState({ emotions: data, isLoading: false });
    }

    fetchLanguages = async () => {
        const data = await this.props.fetchLanguages();
        this._isMounted && this.setState({ languages: data, isLoading: false });
    }

    // List Preparing Part
    getAlbumsList(arrayList) {
        return arrayList.map((item, key) => (
            <AlbumHolder
                key={key}
                albumName={item.name}
                albumThumbnail={item.thumbnail}
                albumTotalSongs={item.totalSongs}
                albumId={item._id}
                albumCreationDate={new Date().toDateString()}
                albumCreatedBy={"OpenBeats"}
                type={'album'}
                addOrRemoveAlbumFromCollectionHandler={this.addOrRemoveAlbumFromCollectionHandler}
                isAuthenticated={this.props.isAuthenticated}
                isAlbumIsInCollection={this.props.likedPlaylists.indexOf(item._id) === -1 ? false : true}
            />
        ))
    }

    getTopChartsList(arrayList) {
        return arrayList.map((item, key) => (
            <AlbumHolder
                key={key}
                albumName={item.name}
                albumThumbnail={item.thumbnail}
                albumTotalSongs={item.totalSongs}
                albumId={item._id}
                albumCreationDate={new Date(item.createdAt).toDateString()}
                albumCreatedBy={item.createdBy}
                type={'topchart'}
            />
        ))
    }

    getArtistsList(arrayList) {
        return arrayList.map((item, key) => (
            <ArtistHolder
                key={key}
                name={item.name}
                thumbnail={item.thumbnail}
                id={item._id}
            />
        ))
    }
    getLanguagesList(arrayList) {
        return arrayList.map((item, key) => (
            <Language
                key={key}
                name={item.name}
                thumbnail={item.thumbnail}
                id={item._id}
            />
        ))
    }
    getEmotionsList(arrayList) {
        return arrayList.map((item, key) => (
            <Emotion
                key={key}
                name={item.name}
                thumbnail={item.thumbnail}
                id={item._id}
            />
        ))
    }

    // Utils Part
    addOrRemoveAlbumFromCollectionHandler = async (isAdd = true, albumId) => {
        if (await this.props.addOrRemoveAlbumFromUserCollection(albumId, isAdd)) {
            this.fetchMyCollections();
        }
    }

    // DOM Preparing Part
    TopCharts = () => {
        return this.state.topChartsCollection.length > 0 && <div className="home-section">
            <div className="home-section-header">
                <div className="left-section cursor-pointer" onClick={() => this.props.push("/topcharts")}>
                    <i className="master-color fad fa-bolt"></i>
                    <span className="">Weekly Top Charts</span>
                    <i className="master-color fas fa-angle-double-right"></i>
                </div>
            </div>
            <div className="home-section-body">
                <HorizontalView
                    elementList={this.getTopChartsList(this.state.topChartsCollection)}
                />
            </div>
        </div>
    }

    MyCollections = () => {
        return this.state.myCollections.length > 0 && <div className="home-section">
            <div className="home-section-header">
                <div className="left-section cursor-pointer" onClick={() => this.props.push("/mycollections")}>
                    <i className="master-color fad fa-heart-square"></i>
                    <span className="">Albums in your Collection</span>
                    <i className="master-color fas fa-angle-double-right"></i>
                </div>
            </div>
            <div className="home-section-body">
                <HorizontalView
                    elementList={this.getAlbumsList(this.state.myCollections)}
                />
            </div>
        </div>
    }

    PopularAlbums = () => {
        return this.state.popularAlbums.length > 0 && <div className="home-section">
            <div className="home-section-header">
                <div className="left-section cursor-pointer" onClick={() => this.props.push("/albums/popular")}>
                    <i className="master-color fad fa-album-collection"></i>
                    <span className="">Popular Albums</span>
                    <i className="master-color fas fa-angle-double-right"></i>
                </div>
            </div >
            <div className="home-section-body">
                <HorizontalView
                    elementList={this.getAlbumsList(this.state.popularAlbums)}
                />
            </div>
        </div >
    }

    LatestAlbums = () => {
        return this.state.latestAlbums.length > 0 && <div className="home-section">
            <div className="home-section-header">
                <div className="left-section cursor-pointer" onClick={() => this.props.push("/albums/latest")}>
                    <i className="master-color fad fa-star"></i>
                    <span className="">Latest Albums</span>
                    <i className="master-color fas fa-angle-double-right"></i>
                </div>
            </div>
            <div className="home-section-body">
                <HorizontalView
                    elementList={this.getAlbumsList(this.state.latestAlbums)}
                />
            </div>
        </div>
    }

    PopularArtists = () => {
        return this.state.popularArtists.length > 0 && <div className="home-section">
            <div className="home-section-header">
                <div className="left-section cursor-pointer" onClick={() => this.props.push("/artists")}>
                    <i className="master-color fad fa-user-music"></i>
                    <span className="">Popular Artists</span>
                    <i className="master-color fas fa-angle-double-right"></i>
                </div>
            </div>
            <div className="home-section-body">
                <HorizontalView
                    elementList={this.getArtistsList(this.state.popularArtists)}
                />
            </div>
        </div>
    }
    Lanugages = () => {
        return this.state.languages.length > 0 && <div className="home-section">
            <div className="home-section-header">
                <div className="left-section cursor-pointer" onClick={() => this.props.push("/languages")}>
                    <i className="master-color fad fa-language"></i>
                    <span className="">Languages</span>
                    <i className="master-color fas fa-angle-double-right"></i>
                </div>
            </div>
            <div className="home-section-body">
                <HorizontalView
                    elementList={this.getLanguagesList(this.state.languages)}
                />
            </div>
        </div>
    }

    Emotions = () => {
        return this.state.emotions.length > 0 && <div className="home-section">
            <div className="home-section-header">
                <div className="left-section cursor-pointer" onClick={() => this.props.push("/emotions")}>
                    <i className="master-color fad fa-dove"></i>
                    <span className="">Emotions</span>
                    <i className="master-color fas fa-angle-double-right"></i>
                </div>
            </div>
            <div className="home-section-body">
                <HorizontalView
                    elementList={this.getEmotionsList(this.state.emotions)}
                />
            </div>
        </div>
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return this.state.isLoading ?
            <div className="width-100 height-100 d-flex align-items-center justify-content-center">
                <Loader type="ThreeDots" color="#F32C2C" height={80} width={80} />
            </div> :
            <div className="home-wrapper">
                <this.LatestAlbums />
                <this.TopCharts />
                <this.Emotions />
                <this.PopularArtists />
                <this.Lanugages />
                <this.PopularAlbums />
                <this.MyCollections />
            </div>
    }

}

const mapStateToProps = (state) => {
    return {
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
        fetchTopCharts: async () => {
            return await homeActions.fetchTopCharts();
        },
        fetchMyCollections: async () => {
            return await homeActions.fetchMyCollections();
        },
        fetchPopularArtists: async () => {
            return await homeActions.fetchPopularArtists();
        },
        fetchPopularAlbums: async () => {
            return await homeActions.fetchPopularAlbums();
        },
        fetchLatestAlbums: async () => {
            return await homeActions.fetchLatestAlbums();
        },
        fetchLanguages: async () => {
            return await homeActions.fetchLanguages();
        },
        fetchEmotions: async () => {
            return await homeActions.fetchEmotions();
        },
        addOrRemoveAlbumFromUserCollection: async (albumId, isAdd = true) => {
            return await playlistManipulatorActions.addOrRemoveAlbumFromUserCollection(albumId, isAdd);
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
