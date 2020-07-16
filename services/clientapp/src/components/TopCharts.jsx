import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import { push } from 'connected-react-router';
import { toastActions, coreActions, playlistManipulatorActions, helmetActions } from '../actions';
import { connect } from 'react-redux';
import { AlbumHolder } from ".";
import "../assets/css/topcharts.css";

class TopCharts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            topCharts: [],
        }
    }

    async componentDidMount() {
        this.props.setCurrentAction("Top Charts")
        helmetActions.updateHelment({
            title: "TopCharts - OpenBeats"
        })
        const topChartsData = await this.props.fetchChartsPlaylistMetadata()
        this.setState({
            isLoading: false,
            topCharts: topChartsData
        })
    }


    render() {
        return this.state.isLoading ?
            <div className="search-preloader">
                <Loader
                    type="ThreeDots"
                    color="#F32C2C"
                    height={80}
                    width={80}
                />
            </div> :
            <div className="topcharts-wrapper">
                {this.state.topCharts.map((item, key) => (
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
            </div>
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
        push: path => {
            dispatch(push(path));
        },
        featureNotify: () => {
            toastActions.featureNotify();
        },
        setCurrentAction: (action) => {
            dispatch(coreActions.setCurrentAction(action))
        },
        fetchChartsPlaylistMetadata: () => {
            return playlistManipulatorActions.fetchChartsPlaylistMetadata();
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopCharts);

