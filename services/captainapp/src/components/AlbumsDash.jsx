import React, { Component } from 'react';
import "../assets/styles/albumsdash.css";
import { ChipsInput } from '.';
import { connect } from 'react-redux';
import { addArtistActions } from '../actions';
import { store } from '../store';
import { push } from 'connected-react-router';
import { CLEAR_LAST_UPDATED_ARTIST } from '../types';

class AlbumsDash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            albumName: '',
            artistChips: [],
            searchChips: [],
        }
    }

    setArtistChips = (chips) => {
        const chipsId = chips.map(item => item._id);
        console.log(chipsId);
        this.setState({ artistChips: chipsId });
    }

    setSearchChips = (chips) => {
        this.setState({ searchChips: chips });
    }

    createNewArtist = (artistStringName) => {
        this.props.toggleAddArtistDialog(artistStringName);
    }

    albumsDashCancelHandler = () => {
        this.props.pushPath("/albums");
    }

    componentWillUnmount() {
        this.setState({ albumName: '', artistChips: [], searchChips: [] })
    }

    render() {
        return (
            <div className="albumsdash-wrapper">
                <div className="albumsdash-header">
                    <div className="albumsdash-indicator d-flex align-items-center font-weight-bold base-color h5-responsive">
                        <i className="fas fa-angle-right mr-1 right-angel"></i>Albums Dash Yard
                    </div>
                    <div className="d-flex">
                        <div className="create-album-link font-weight-bold mr-3 cursor-pointer" >save</div>
                        <div className="create-album-link bg-danger font-weight-bold cursor-pointer" onClick={this.albumsDashCancelHandler} >cancel</div>
                    </div>
                </div>
                <div className="albumdash-container">
                    <div className="albumdash-container-left-pan">
                        <div className="albumdash-album-content-holder p-4">
                            <div className="albumdash-name-holder">
                                <div className="font-weight-bold">
                                    Album Name
                                </div>
                                <div className="mb-1">
                                    (max 30 Characters)
                                </div>
                                <input className="rounded w-100" placeholder="This is Yuvan Shankar Raja" type="text" />
                            </div>
                            <div className="albumdash-artist-tags-holder mt-2">
                                <div className="artist-tags-title font-weight-bold">Artist Tags</div>
                                <div className="artist-tags-title-desc">(Please add only one artist, if you want this album to comes under specific Artist)</div>
                                <ChipsInput
                                    setChipsCallback={this.setArtistChips}
                                    suggestionFetchUrl={'url'}
                                    createNewChipCallback={this.createNewArtist}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="albumdash-container-right-pan">
                        <div className="albumdash-search-holder"></div>
                        <div className="albumdash-song-bucket-holder"></div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {}
}


const mapDispatchToProps = (dispatch) => {
    return {
        pushPath: (path) => {
            store.dispatch(push(path));
        },
        toggleAddArtistDialog: (artistName) => {
            addArtistActions.toggleAddArtistDialog(true, artistName);
        },
        clearLastAddedArtist: () => {
            dispatch({ type: CLEAR_LAST_UPDATED_ARTIST });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AlbumsDash);