import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { logo } from "../assets/images";
import "../assets/styles/leftnav.css";

class LeftNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemName: "home"
        }
    }
    render() {
        return (
            <div className="leftnav-wrapper">
                <ul className="leftnav-menu">
                    <a href="/" className="leftnav-item">
                        <img className="leftnav-logo-img" src={logo} alt="" srcSet="" />
                    </a>
                    <Link to="/" onClick={() => this.setState({ itemName: "home" })} className={`leftnav-item ${this.state.itemName === "home" ? "item-active" : ""}`} title="Home - view insights and more">
                        <i className="far fa-home"></i>
                        <span>Home</span>
                    </Link>
                    <Link to="/albums" onClick={() => this.setState({ itemName: "albums" })} className={`leftnav-item ${this.state.itemName === "albums" ? "item-active" : ""}`} title="Create, View and Update Albums">
                        <i className="fas fa-album-collection"></i>
                        <span>Albums</span>
                    </Link>
                    <Link to="/artists" onClick={() => this.setState({ itemName: "artists" })} className={`leftnav-item ${this.state.itemName === "artists" ? "item-active" : ""}`} title="Add, Update and delete Artists">
                        <i className="fas fa-user-music"></i>
                        <span>Artists</span>
                    </Link>
                    <Link to="languages" onClick={() => this.setState({ itemName: "languages" })} className={`leftnav-item ${this.state.itemName === "languages" ? "item-active" : ""}`} title="Add, Update and Delete Languages">
                        <i className="fas fa-language"></i>
                        <span>Tounge</span>
                    </Link>
                    <li className="leftnav-item" title="ThayalanGR - Profile settings and Logout">
                        <img className="leftnav-profile-img" src={"https://lh3.googleusercontent.com/-OTO38IoJfKM/AAAAAAAAAAI/AAAAAAAAAAA/AKF05nA74VsD5AoXBma8QTjD06srMgrI1A/photo.jpg?sz=46"} alt="" srcSet="" />
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