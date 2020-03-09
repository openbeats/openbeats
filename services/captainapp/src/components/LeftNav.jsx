import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logo } from "../assets/images";
import "../assets/styles/leftnav.css";

class LeftNav extends Component {
    render() {
        return (
            <div className="leftnav-wrapper">
                <ul className="leftnav-menu">
                    <li className="leftnav-item">
                        <img className="leftnav-logo-img" src={logo} alt="" srcset="" />
                    </li>
                    <li className="leftnav-item">
                        Albums
                    </li>
                    <li className="leftnav-item">
                        Albums
                    </li>
                    <li className="leftnav-item">
                        Albums
                    </li>
                    <li className="leftnav-item">
                        Albums
                    </li>
                </ul>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {

    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftNav);