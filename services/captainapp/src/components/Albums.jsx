import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import "../assets/styles/albums.css";
import { coreActions } from '../actions';
import { connect } from 'react-redux';
import { albumDummySong } from "../assets/images";
import axios from "axios";

class Albums extends Component {
    componentDidMount() {
        this.props.setCurrentNavItem("albums");

    }
    render() {
        return (
            <div className="albums-wrapper">
                <div className="albums-header">
                    <div className="album-indicator d-flex align-items-center font-weight-bold base-color h5-responsive">
                        <i className="fas fa-angle-right mr-1 right-angel"></i>Albums
                    </div>
                    <div className="album-search-input">
                        <input className="input input-sm red-border" type="text" placeholder="Search Albums, Artists, Languages..." aria-label="Search" />
                        <i className="fas fa-search text-grey cursor-pointer" aria-hidden="true"></i>
                    </div>
                    <Link className="create-album-link font-weight-bold cursor-pointer text-white" to="/albums/dashyard"><i className="far fa-plus mr-1"></i>&nbsp;Create Album</Link>
                </div>
                <div className="albums-container">
                    <div className="album-holder" style={{ backgroundImage: `url(${albumDummySong})` }}>
                        <div className="album-btn-rounded album-edit-button cursor-pointer">
                            <i className="fas fa-pencil-alt"></i>
                        </div>
                        <div className="album-btn-rounded album-delete-button cursor-pointer">
                            <i className="far fa-trash-alt"></i>
                        </div>
                        <div className="album-btn-rounded album-song-count p-events-none">15</div>
                        <div className="album-description">
                            <div className="album-title">This is Yuvan Shankar Raja</div>
                            <div className="album-creation-date">28 March 2020</div>
                            <div className="album-created-by">by Thayalan</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        adminDetails: state.auth.adminDetails,
        currentNavItem: state.core.currentNavItem
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCurrentNavItem: (item) => {
            coreActions.setCurrentNavItem(item);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Albums);