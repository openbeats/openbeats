import React, { Component } from 'react'
import { toastActions, coreActions, homeActions, playlistManipulatorActions, helmetActions, playerActions } from "../actions";
import "../assets/css/home.css";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { HorizontalView, AlbumHolder, ArtistHolder, Language, Emotion } from '.';
import Loader from 'react-loader-spinner';
import { deploymentType } from '../config';

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
            languageAlbums: [
                {
                    languageID: deploymentType === "production" ? '5ec8a093228af439111afa10' : '5ebc250ded9e0a3d78610453',
                    albums: [],
                    name: 'Tamil'
                },
                {
                    languageID: deploymentType === "production" ? '5ec8a049228af416c11afa0f' : '5ec22077fac6c3093c11e7d6',
                    albums: [],
                    name: 'English'
                },
                {
                    languageID: deploymentType === "production" ? '5ec8a0d1228af496b51afa11' : '5ebc2c971827de15bc6800fd',
                    albums: [],
                    name: 'Malayalam'
                },
            ],
            isLoading: true,
        };
        this.state = { ...this.initialState };
    }

    async componentDidMount() {
        this._isMounted = true;
        helmetActions.updateHelment({
            title: "Home - OpenBeats"
        })
        this.props.checkAndAddSongToTheQueue(this.props.location.search)
        this.props.setCurrentAction("Home");
        this.prepareHomeData();
    }

    // Data Fetch Part
    prepareHomeData = async () => {
        await this.fetchTopCharts();
        await this.fetchLatestAlbums();
        if (this.props.isAuthenticated) await this.fetchMyCollections();
        await this.fetchPopularAlbums();
        await this.fetchLanguageAlbums();
        await this.fetchEmotions();
        await this.fetchLanguages();
        await this.fetchPopularArtists();
        this._isMounted && await this.setState({ isLoading: false })
    }

    fetchLanguageAlbums = async () => {
        let languages = [...this.state.languageAlbums];
        for (let index = 0; index < languages.length; index++) {
            const data = await this.props.fetchLanguageAlbums(languages[index].languageID, 'latest');
            languages[index]['albums'] = [...data];
        }
        this._isMounted && this.setState({ languageAlbums: languages, isLoading: false });
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
    getAlbumsList(arrayList, exploreMore = { enabled: false, url: '' }) {
        return (<>
            {arrayList.map((item, key) => (
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
                />))}
            {exploreMore.enabled &&
                <AlbumHolder
                    exploreMore={true}
                    exploreMoreUrl={exploreMore.url}
                />}
        </>)
    }

    getTopChartsList(arrayList, exploreMore = { enabled: false, url: '' }) {
        return <>
            {arrayList.map((item, key) => (
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
            ))}
            {exploreMore.enabled &&
                <AlbumHolder
                    exploreMore={true}
                    exploreMoreUrl={exploreMore.url}
                />}
        </>
    }

    getArtistsList(arrayList, exploreMore = { enabled: false, url: '' }) {
        return <>
            {arrayList.map((item, key) => (
                <ArtistHolder
                    key={key}
                    name={item.name}
                    thumbnail={item.thumbnail}
                    id={item._id}
                />
            ))}
            {exploreMore.enabled &&
                <ArtistHolder
                    exploreMore={true}
                    exploreMoreUrl={exploreMore.url}
                />}
        </>
    }
    getLanguagesList(arrayList, exploreMore = { enabled: false, url: '' }) {
        return <>
            {arrayList.map((item, key) => (
                <Language
                    key={key}
                    name={item.name}
                    thumbnail={item.thumbnail}
                    id={item._id}
                />
            ))}
            {exploreMore.enabled &&
                <Language
                    exploreMore={true}
                    exploreMoreUrl={exploreMore.url}
                />}
        </>
    }
    getEmotionsList(arrayList, exploreMore = { enabled: false, url: '' }) {
        return <>
            {arrayList.map((item, key) => (
                <Emotion
                    key={key}
                    name={item.name}
                    thumbnail={item.thumbnail}
                    id={item._id}
                />
            ))}
            {exploreMore.enabled &&
                <Emotion
                    exploreMore={true}
                    exploreMoreUrl={exploreMore.url}
                />}
        </>
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
                    elementList={this.getTopChartsList(this.state.topChartsCollection, { enabled: true, url: "/topcharts" })}
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
                    elementList={this.getAlbumsList(this.state.myCollections, { enabled: true, url: "/mycollections" })}
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
                    elementList={this.getAlbumsList(this.state.popularAlbums, { enabled: true, url: "/albums/popular" })}
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
                    elementList={this.getAlbumsList(this.state.latestAlbums, { enabled: true, url: "/albums/latest" })}
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
                    elementList={this.getArtistsList(this.state.popularArtists, { enabled: true, url: "/artists" })}
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
                    elementList={this.getLanguagesList(this.state.languages, { enabled: true, url: "/languages" })}
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
                    elementList={this.getEmotionsList(this.state.emotions, { enabled: true, url: "/emotions" })}
                />
            </div>
        </div>
    }

    LanguageAlbums = () => {
        return this.state.languageAlbums.length > 0 && this.state.languageAlbums.map((language, key) =>
            language.albums.length > 0 &&
            <div className="home-section" key={key}>
                <div className="home-section-header">
                    <div className="left-section cursor-pointer" onClick={() => this.props.push(`/languages/${language.languageID}`)}>
                        <i className="master-color fad fa-star"></i>
                        <span className="">Albums in {language.name}</span>
                        <i className="master-color fas fa-angle-double-right"></i>
                    </div>
                </div>
                <div className="home-section-body">
                    <HorizontalView
                        elementList={this.getAlbumsList(language.albums, { enabled: true, url: `/languages/${language.languageID}` })}
                    />
                </div>
            </div>)
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
                <this.LanguageAlbums />
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
        fetchLanguageAlbums: async (languageId, type = "latest") => {
            return await homeActions.fetchLanguageAlbums(languageId, type);
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
        checkAndAddSongToTheQueue: async (urlLocation) => {
            playerActions.checkAndAddSongToTheQueue(urlLocation);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
