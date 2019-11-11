import React, { Component, Fragment } from 'react'
import "../css/experiment.css"
import { masterLogo, navhome, navchart, navartist, navalbum, navhistory, navplaylist, navplus } from '../images'
// import { masterLogo } from '../images'

export default class Experiment extends Component {
    render() {
        return (
            <Fragment>
                <nav>
                    <section className="master-logo">
                        <img src={masterLogo} alt="" />
                    </section>
                    <section className="main-nav-menus">
                        <div className="nav-menu">
                            <div className="nav-menu-icon-holder">
                                <img className="nav-menu-icon-size" src={navhome} alt="" />
                            </div>
                            <p className="nav-menu-text">Home</p>
                        </div>
                        <div className="nav-menu">
                            <div className="nav-menu-icon-holder">
                                <img className="nav-menu-icon-size" src={navchart} alt="" />
                            </div>
                            <p className="nav-menu-text">Top Charts</p>
                        </div>
                        <div className="nav-menu">
                            <div className="nav-menu-icon-holder">
                                <img className="nav-menu-icon-size" src={navartist} alt="" />
                            </div>
                            <p className="nav-menu-text">Artists</p>
                        </div>
                        <div className="nav-menu">
                            <div className="nav-menu-icon-holder">
                                <img className="nav-menu-icon-size" src={navalbum} alt="" />
                            </div>
                            <p className="nav-menu-text">Albums</p>
                        </div>
                        <div className="nav-menu">
                            <div className="nav-menu-icon-holder">
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
                            <div className="nav-playlist-plus-icon-holder">
                                <img src={navplus} alt="" srcset="" />
                            </div>
                            <li className="playlist-content-holder-text">Houser</li>
                            <li className="playlist-content-holder-text">Travel Melody</li>
                            <li className="playlist-content-holder-text">Rock Collection</li>
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
                </nav>
                <main>
                    main
                </main>
                <footer>
                    footer
                </footer>
            </Fragment>

        )
    }
}
