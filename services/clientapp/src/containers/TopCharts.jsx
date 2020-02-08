import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import { playlistSvg, musicDummy, pQueueWhite } from '../images';
import { push } from 'connected-react-router';
import { toastActions, coreActions, playlistManipulatorActions, nowPlayingActions } from '../actions';
import { connect } from 'react-redux';


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
        const topChartsData = await this.props.fetchChartsPlaylistMetadata()
        this.setState({
            isLoading: false,
            topCharts: topChartsData
        })
    }


    render() {
        return (
            this.state.isLoading ? <div className="search-preloader">
                <Loader
                    type="ThreeDots"
                    color="#F32C2C"
                    height={80}
                    width={80}
                />
            </div> : <div className="your-playlist-wrapper">
                    {this.state.topCharts.map((item, key) => (
                        <div className="playlist-panel-wrapper" key={key}>
                            <div className="playlist-panel-image cursor-pointer" title="Play All songs!" onClick={() => this.props.push(`/playlist/charts/${item._id}`)} style={{ backgroundImage: `url(${item.thumbnail ? item.thumbnail : musicDummy})` }}>
                                <div className="playlist-total-songs-display">
                                    <img src={playlistSvg} alt="" srcSet="" />
                                    <p>{item.totalSongs}</p>
                                </div>
                            </div>
                            <div className="playlist-panel-name">
                                <div className="playlist-panel-name">
                                    {item.name}
                                </div>
                            </div>
                            <div className="playlist-panel-options">
                                <div className="p-options">
                                    <div className="p-options-icon-holder">
                                        <i className="fas fa-play cursor-pointer" onClick={() => this.props.push(`/playlist/charts/${item._id}?autoplay=true`)} title="Play"></i>
                                    </div>
                                    <div className="p-options-icon-holder">
                                        <i className="fas fa-random cursor-pointer" onClick={() => this.props.featureNotify()} title="Shuffle Play"></i>
                                    </div>
                                    <div className="p-options-icon-holder">
                                        <img className="cursor-pointer action-image-size" title="Add to Queue" onClick={() => this.props.addSongsToQueue(item._id)} src={pQueueWhite} alt="" srcSet="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
        )
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
        addSongsToQueue: async (pId) => {
            const data = await playlistManipulatorActions.fetchChartsPlaylist(pId);
            if (data && data.status && data.chart.songs.length) {
                nowPlayingActions.addSongsToQueue(data.chart.songs);
            } else {
                toastActions.showMessage("Playlist you tried to add to the queue.. seems to be empty!")
            }
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopCharts);

