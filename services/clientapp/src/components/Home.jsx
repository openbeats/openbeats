import React, { Component } from 'react'
import { toastActions, coreActions, homeActions, playlistManipulatorActions } from "../actions";
import "../assets/css/home.css"
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { HorizontalView, AlbumHolder, ArtistHolder } from '.';
import Loader from 'react-loader-spinner';

class Home extends Component {

    constructor(props) {
        super(props);
        this.initialState = {
            popularArtists: [],
            topChartsCollection: [],
            myCollections: [],
            latestAlbums: [],
            popularAlbums: [],
            surpriseAlbums: [],
            isLoading: true
        };
        this.state = { ...this.initialState };
    }

    componentDidMount() {
        this.props.setCurrentAction("Home");
        this.prepareHomeData();
    }

    // Data Fetch Part
    prepareHomeData = async () => {
        await this.fetchTopCharts();
        await this.fetchLatestAlbums();
        if (this.props.isAuthenticated) await this.fetchMyCollections();
        await this.fetchPopularAlbums();
        await this.fetchPopularArtists();
        this.setState({ isLoading: false })
    }

    fetchTopCharts = async () => {
        const data = await this.props.fetchTopCharts();
        this.setState({ topChartsCollection: data })
    }

    fetchMyCollections = async () => {
        const data = await this.props.fetchMyCollections();
        this.setState({ myCollections: data });
    }

    fetchPopularAlbums = async () => {
        const data = await this.props.fetchPopularAlbums();
        this.setState({ popularAlbums: data });
    }

    fetchLatestAlbums = async () => {
        const data = await this.props.fetchLatestAlbums();
        this.setState({ latestAlbums: data });
    }

    fetchPopularArtists = async () => {
        const data = await this.props.fetchPopularArtists();
        this.setState({ popularArtists: data });
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


    // Utils Part
    addOrRemoveAlbumFromCollectionHandler = async (isAdd = true, albumId) => {
        if (await this.props.addOrRemoveAlbumFromUserCollection(albumId, isAdd)) {
            this.prepareHomeData();
        }
    }

    // DOM Preparing Part
    TopCharts = () => {
        return this.state.topChartsCollection.length > 0 && <div className="home-section">
            <div className="home-section-header">
                <div className="left-section cursor-pointer">
                    <i className="fas fa-chart-line "></i>
                    <span className="">Weekly Top Charts</span>
                    <i className="fas fa-angle-double-right"></i>
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
            <div className="home-section-header cursor-pointer">
                <div className="left-section">
                    <i className="fal fa-album-collection"></i>
                    <span className="">Albums in your Collection</span>
                    <i className="fas fa-angle-double-right"></i>
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
                <div className="left-section">
                    <i className="fad fa-fire"></i>
                    <span className="">Popular Albums</span>
                    {/* <i className="fas fa-angle-double-right"></i> */}
                </div>
            </div>
            <div className="home-section-body">
                <HorizontalView
                    elementList={this.getAlbumsList(this.state.popularAlbums)}
                />
            </div>
        </div>
    }

    LatestAlbums = () => {
        return this.state.latestAlbums.length > 0 && <div className="home-section">
            <div className="home-section-header">
                <div className="left-section">
                    <i className="far fa-sparkles"></i>
                    <span className="">Latest Albums</span>
                    {/* <i className="fas fa-angle-double-right"></i> */}
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
                    <i className="fad fa-user-music"></i>
                    <span className="">Popular Artists</span>
                    <i className="fas fa-angle-double-right"></i>
                </div>
            </div>
            <div className="home-section-body">
                <HorizontalView
                    elementList={this.getArtistsList(this.state.popularArtists)}
                />
            </div>
        </div>
    }

    render() {
        return this.state.isLoading ?
            <div className="width-100 height-100 d-flex align-items-center justify-content-center">
                <Loader type="ThreeDots" color="#F32C2C" height={80} width={80} />
            </div> :
            <div className="home-wrapper">
                <this.LatestAlbums />
                <this.TopCharts />
                <this.PopularArtists />
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
        fetchPopularAlbums: async () => {
            return await homeActions.fetchPopularAlbums();
        },
        fetchPopularArtists: async () => {
            return await homeActions.fetchPopularArtists();
        },
        fetchLatestAlbums: async () => {
            return await homeActions.fetchLatestAlbums();
        },
        addOrRemoveAlbumFromUserCollection: async (albumId, isAdd = true) => {
            return await playlistManipulatorActions.addOrRemoveAlbumFromUserCollection(albumId, isAdd);
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
