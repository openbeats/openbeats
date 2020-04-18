import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import { push } from 'connected-react-router';
import { toastActions, coreActions, playlistManipulatorActions, nowPlayingActions } from '../actions';
import { connect } from 'react-redux';
import { AlbumHolder } from ".";

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

    albumAddToCurrentQueueCallBack = async (id) => {
        this.props.addSongsToQueue(id)
    }
    albumViewCallBack = async (id) => {
        this.props.push(`/playlist/charts/${id}`);
    }
    albumPlayCallBack = async (id) => {
        this.props.push(`/playlist/charts/${id}?autoplay=true`);
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
            <div className="my-playlists-wrapper">
                {this.state.topCharts.map((item, key) => (
                    <AlbumHolder
                        key={key}
                        albumName={item.name}
                        albumThumbnail={item.thumbnail}
                        albumTotalSongs={item.totalSongs}
                        albumId={item._id}
                        albumCreationDate={new Date(item.createdAt).toDateString()}
                        albumCreatedBy={item.createdBy}
                        albumAddToCurrentQueueCallBack={this.albumAddToCurrentQueueCallBack}
                        albumViewCallBack={this.albumViewCallBack}
                        albumPlayCallBack={this.albumPlayCallBack}
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
        addSongsToQueue: async (pId) => {
            const data = await playlistManipulatorActions.fetchChartsPlaylist(pId);
            if (data && data.status && data.data.songs.length) {
                nowPlayingActions.addSongsToQueue(data.data.songs);
            } else {
                toastActions.showMessage("Playlist you tried to add to the queue.. seems to be empty!")
            }
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopCharts);

