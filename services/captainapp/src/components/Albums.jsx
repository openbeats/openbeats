import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import "../assets/styles/albums.css";
import { coreActions } from '../actions';
import { connect } from 'react-redux';

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
                    <Link className="create-album-link font-weight-bold" to="/albums/dashyard"><i className="far fa-plus mr-1"></i>&nbsp;Create Album</Link>
                </div>
                <div className="albums-container">

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