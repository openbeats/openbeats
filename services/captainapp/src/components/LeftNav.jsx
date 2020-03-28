import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { logo } from "../assets/images";
import "../assets/styles/leftnav.css";
import { authActions, coreActions } from '../actions';

class LeftNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemName: "home",
            profileOptionsShow: false
        }
        this.menuRef = null;
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.closeMenu);
    }

    toggleProfielMenu() {
        if (!this.state.profileOptionsShow) {
            this.setState({ profileOptionsShow: true });
            document.addEventListener("click", this.closeMenu)
        } else {
            this.setState({ profileOptionsShow: false });
            document.removeEventListener("click", this.closeMenu)
        }

    }

    closeMenu = e => {
        if (!this.menuRef.contains(e.target)) {
            this.setState({ profileOptionsShow: false });
            document.removeEventListener("click", this.closeMenu)
        }
    }

    render() {
        return (
            <div className="leftnav-wrapper">
                <ul className="leftnav-menu">
                    <a href="/" className="leftnav-item">
                        <img className="leftnav-logo-img" src={logo} alt="" srcSet="" />
                    </a>
                    <Link to="/" onClick={() => this.props.setCurrentNavItem("home")} className={`leftnav-item`} title="Home - view insights and more">
                        <div className={`content ${this.props.currentNavItem === "home" ? "item-active" : ""}`} title="Home" >
                            <i className="far fa-home"></i>
                            <span>Home</span>
                        </div>
                    </Link>
                    <Link to="/albums" onClick={() => this.props.setCurrentNavItem("albums")} className={`leftnav-item`} title="Create, View and Update Albums">
                        <div className={`content ${this.props.currentNavItem === "albums" ? "item-active" : ""}`}>
                            <i className="fas fa-album-collection"></i>
                            <span>Albums</span>
                        </div>
                    </Link>
                    <Link to="/artists" onClick={() => this.props.setCurrentNavItem("artists")} className={`leftnav-item`} title="Add, Update and delete Artists">
                        <div className={`content ${this.props.currentNavItem === "artists" ? "item-active" : ""}`}>
                            <i className="fas fa-user-music"></i>
                            <span>Artists</span>
                        </div>
                    </Link>
                    <Link to="searchtags" onClick={() => this.props.setCurrentNavItem("searchtags")} className={`leftnav-item`} title="Add, Update and Delete Search Tags">
                        <div className={`content ${this.props.currentNavItem === "searchtags" ? "item-active" : ""}`}>
                            <i class="fas fa-tags"></i>
                            <span>Tags</span>
                        </div>
                    </Link>
                    <Link to="languages" onClick={() => this.props.setCurrentNavItem("languages")} className={`leftnav-item`} title="Add, Update and Delete Languages">
                        <div className={`content ${this.props.currentNavItem === "languages" ? "item-active" : ""}`}>
                            <i className="fas fa-language"></i>
                            <span>Tounge</span>
                        </div>
                    </Link>
                    <li className="leftnav-item">
                        <div ref={d => this.menuRef = d} className={`leftnav-item profile-options ${this.state.profileOptionsShow ? 'profile-options-show' : ''}`}>
                            <div className="content" onClick={() => this.props.logoutHandler()}>
                                <i className="fas fa-sign-out-alt"></i>
                                <span>Logout</span>
                            </div>
                        </div>
                        <div className="content"
                            title={this.props.adminDetails.name + " - Profile settings and Logout"}
                            onClick={() => this.toggleProfielMenu()}
                        >
                            <img className="leftnav-profile-img" src={this.props.adminDetails.avatar} alt="" srcSet="" />
                        </div>
                    </li>
                </ul>
            </div >
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
        logoutHandler: () => {
            authActions.logoutHandler();
        },
        setCurrentNavItem: (item) => {
            coreActions.setCurrentNavItem(item);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftNav);