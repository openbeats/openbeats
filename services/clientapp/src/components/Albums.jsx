import React, { Component } from 'react';
import { toastActions, coreActions, playlistManipulatorActions, homeActions } from "../actions";
import "../assets/css/albums.css";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import Loader from "react-loader-spinner";
import { AlbumHolder } from '.';

class Albums extends Component {
    constructor(props) {
        super(props);
        this.initialState = {
            albums: [],
            type: 'latest',
            isLoading: true
        }
        this.state = { ...this.initialState };
    }

    componentDidMount() {
        this.props.setCurrentAction("Albums");
        this.fetchAlbumsHandler();
    }

    fetchAlbumsHandler = async () => {
        const data = await this.props.fetchLatestAlbums(1, 1000);
        this.setState({ isLoading: false, albums: data })
    }

    addOrRemoveAlbumFromCollectionHandler = (isAdd = true, albumId) => {
        this.props.addOrRemoveAlbumFromUserCollection(albumId, isAdd)
    }

    componentWillUnmount() {
        this.setState({ ...this.initialState });
    }

    render() {
        return this.state.isLoading ?
            <div className="width-100 height-100 d-flex align-items-center justify-content-center">
                <Loader type="ThreeDots" color="#F32C2C" height={80} width={80} />
            </div> :
            <div className="albums-wrapper">
                {this.state.albums.map((item, key) => (
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
                ))}
            </div>
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.authReducer.isAuthenticated,
        likedPlaylists: state.authReducer.likedPlaylists
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
        addOrRemoveAlbumFromUserCollection: async (albumId, isAdd = true) => {
            return await playlistManipulatorActions.addOrRemoveAlbumFromUserCollection(albumId, isAdd);
        },
        fetchPopularAlbums: async (page, limit) => {
            return await homeActions.fetchPopularAlbums(page, limit);
        },
        fetchLatestAlbums: async (page, limit) => {
            return await homeActions.fetchLatestAlbums(page, limit);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Albums);
