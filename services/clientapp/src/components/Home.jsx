import React, { Component } from 'react'
import { toastActions, coreActions, homeActions } from "../actions";
import "../css/home.css"
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { HorizontalView, AlbumHolder } from '.';
import Loader from 'react-loader-spinner';

class Home extends Component {
    constructor(props) {
        super(props);
        this.initialState = {
            artistCollection: [],
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

    prepareHomeData = async () => {
        await this.topChartsFetchHandler();

        this.setState({ isLoading: false })
    }

    topChartsFetchHandler = async () => {
        const charts = await this.props.fetchTopCharts();
        this.setState({ topChartsCollection: charts })
    }

    getAlbumList(arrayList) {
        return arrayList.map((item, key) => (
            <AlbumHolder key={key} albumCreatedBy={key.toString()} />
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

    }

    TopCharts = () => {
        return this.state.topChartsCollection.length > 0 && <div className="home-section">
            <div className="home-section-header">
                <div className="left-section">
                    <i className="fas fa-chart-line "></i>
                    <span className="">Weekly Top Charts</span>
                </div>
                <div className="right-section cursor-pointer" onClick={() => this.props.push("/topcharts")}>
                    <i className="fas fa-angle-double-right"></i>
                Show More
            </div>
            </div>
            <div className="home-section-body">
                <HorizontalView
                    elementList={this.getTopChartsList(this.state.topChartsCollection)}
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
                <this.TopCharts />
            </div>
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
        fetchTopCharts: async () => {
            return await homeActions.fetchTopCharts();
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
