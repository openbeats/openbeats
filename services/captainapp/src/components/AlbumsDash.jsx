import React, { Component } from 'react';
import "../assets/styles/albumsdash.css";

export default class AlbumsDash extends Component {
    render() {
        return (
            <div className="albumsdash-wrapper">
                <div className="albumsdash-header">
                    <div className="albumsdash-indicator d-flex align-items-center font-weight-bold base-color h5-responsive">
                        <i className="fas fa-angle-right mr-1 right-angel"></i>Albums Dash Yard
                    </div>
                    <div className="d-flex">
                        <div className="create-album-link font-weight-bold mr-3 cursor-pointer" >save</div>
                        <div className="create-album-link bg-danger font-weight-bold cursor-pointer" >cancel</div>
                    </div>
                </div>
            </div>
        )
    }
}
