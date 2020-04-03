import React, { Component } from 'react';
import "../assets/styles/artistadddialog.css";
import { connect } from 'react-redux';
import { addArtistActions } from '../actions';

class ArtistAddDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            artistName: this.props.addArtistInitName || '',
            artistImageUrl: '',
            fallbackArtistImageUrl: 'https://openbeats.live/static/media/dummy_music_holder.a3d0de2e.jpg',
        }
    }

    saveActionHandler = async () => {
        const addArtistResult = await this.props.addArtistHandler(this.state.artistName, this.state.artistImageUrl);
        if (addArtistResult) {
            this.props.toggleAddArtistDialog(false);
        }
    }

    componentWillUnmount() {
        this.setState({
            artistName: '',
            artistImageUrl: ''
        })
    }


    render() {
        return (
            <div className="artist-add-dialog-container">
                <div className="artist-add-dialog-wrapper">
                    <div className="artist-add-dialog-header">
                        <div className="artist-add-dialog-header-left-items">
                            <i className="fas fa-angle-right mr-1 right-angel mr-2"></i>
                            <span>Add Artist</span>
                        </div>
                        <div className="artist-add-dialog-header-right-items">
                            <div className="d-flex">
                                <div className="create-album-link font-weight-bold mr-3 cursor-pointer" onClick={this.saveActionHandler}>save</div>
                                <div className="create-album-link bg-danger font-weight-bold cursor-pointer" onClick={this.props.toggleAddArtistDialog} >cancel</div>
                            </div>
                        </div>
                    </div>
                    <div className="artist-add-dialog-content-holder">
                        <div className="artist-add-dialog-input-container">
                            <div className="artist-name-input d-flex flex-column align-items-center justify-content-center mb-4">
                                <div className="font-weight-bold mb-2 add-artist-input-title">
                                    Artist Name
                                </div>
                                <input className="input input-sm rounded artist-name-input" required value={this.state.artistName} onChange={(e) => this.setState({ artistName: e.target.value })} placeholder="Anirudh Ravichandar" type="text" />
                            </div>
                            <div className="artist-name-input d-flex flex-column align-items-center justify-content-center mt-4">
                                <div className="font-weight-bold mb-2 add-artist-input-title">
                                    Artist Image Url
                                </div>
                                <input className="input input-sm rounded artist-name-input" required value={this.state.artistImageUrl} onChange={(e) => this.setState({ artistImageUrl: e.target.value })} placeholder="https://imageurl.com/image.jpg" type="text" />
                            </div>
                        </div>
                        <div className="artist-add-dialog-image-display-container">
                            <div className="add-artist-image-display-panel" style={{ backgroundImage: `url(${this.state.artistImageUrl}), url(${this.state.fallbackArtistImageUrl})` }}> </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        addArtistInitName: state.addArtist.artistName
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        toggleAddArtistDialog: () => {
            addArtistActions.toggleAddArtistDialog(false);
        },
        addArtistHandler: (name, url) => {
            return addArtistActions.addArtistHandler(name, url);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtistAddDialog);