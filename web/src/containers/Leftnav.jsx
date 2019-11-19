import React, { Component, Fragment } from 'react'
import "../css/leftnav.css"
import { toastActions } from "../actions";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import {
    masterLogo,
    navhome,
    navchart,
    navartist,
    navalbum,
    navhistory,
    navplaylist,
    navplus,
    hamburger,
    navclose
} from '../images'

class LeftNav extends Component {
    render() {
        return (
            <Fragment>
                <div id="nav-hamburger" className="hamburger-holder">
                    <img src={hamburger} alt="" srcSet="" />
                </div>
                <nav id="nav">

                    <section className="master-logo">

                        <img className="cursor-pointer" onClick={() => {
                            window.location.reload()
                        }} src={masterLogo} alt="" />
                        <div id="nav-close" className="nav-close-holder">
                            <img src={navclose} alt="" srcSet="" />
                        </div>
                    </section>
                    <section className="nav-content">
                        <section className="main-nav-menus">
                            <div className="nav-menu" onClick={() => this.props.featureNotify()}>
                                <div className="nav-menu-icon-holder" >
                                    <img className="nav-menu-icon-size" src={navhome} alt="" />
                                </div>
                                <p className="nav-menu-text">Home</p>
                            </div>
                            <div className="nav-menu" onClick={() => this.props.featureNotify()}>
                                <div className="nav-menu-icon-holder" >
                                    <img className="nav-menu-icon-size" src={navchart} alt="" />
                                </div>
                                <p className="nav-menu-text">Top Charts</p>
                            </div>
                            <div className="nav-menu" onClick={() => this.props.featureNotify()}>
                                <div className="nav-menu-icon-holder" >
                                    <img className="nav-menu-icon-size" src={navartist} alt="" />
                                </div>
                                <p className="nav-menu-text">Artists</p>
                            </div>
                            <div className="nav-menu" onClick={() => this.props.featureNotify()}>
                                <div className="nav-menu-icon-holder" >
                                    <img className="nav-menu-icon-size" src={navalbum} alt="" />
                                </div>
                                <p className="nav-menu-text">Albums</p>
                            </div>
                            <div className="nav-menu" onClick={() => this.props.featureNotify()}>
                                <div className="nav-menu-icon-holder" >
                                    <img className="nav-menu-icon-size" src={navhistory} alt="" />
                                </div>
                                <p className="nav-menu-text">Recently Played</p>
                            </div>
                        </section>
                        <section className="nav-horizontal-rule"></section>
                        <section className="nav-playlist-holder">
                            <div className="nav-menu bg-none">
                                <div className="nav-menu-icon-holder">
                                    <img className="nav-menu-icon-size" src={navplaylist} alt="" />
                                </div>
                                <p className="nav-menu-text">Your Playlists</p>
                            </div>
                            <ul className="playlist-content-holder">
                                <div className="nav-playlist-plus-icon-holder" onClick={() => this.props.featureNotify()}>
                                    <img src={navplus} alt="" srcSet="" />
                                </div>
                                <li className="playlist-content-holder-text" onClick={() => this.props.featureNotify()}>Houser</li>
                                <li className="playlist-content-holder-text" onClick={() => this.props.featureNotify()}>Travel Melody</li>
                                <li className="playlist-content-holder-text" onClick={() => this.props.featureNotify()}>Rock Collection</li>
                            </ul>
                        </section>
                        <section className="nav-footer-container">
                            <div className="footer-text-holder">
                                <span>About</span>  <span>Copyright</span> <br />
                                <span>Contact us</span>  <span>Advertise</span> <br />
                                <span>Developers</span> <br />
                                <span>Terms Privacy Policy</span> <br />
                                <span>Request New features</span> <br /><br />
                                © 2019 OpenBeats, LLC <br />
                            </div>
                        </section>

                    </section>
                </nav>
            </Fragment>
        )
    }
}


const mapStateToProps = (state) => {
    return {
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftNav);