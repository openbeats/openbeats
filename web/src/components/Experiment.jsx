import React, { Component, Fragment } from 'react'
import "../css/experiment.css"
import { masterLogo, navhome, navchart, navartist, navalbum, navhistory, navplaylist, navplus, playerprevious, playerplay, playernext, musicDummy, playervolume, playerdownload, playerqueue, angleright, mainsearch, hamburger, navclose } from '../images'
// import { masterLogo } from '../images'

export default class Experiment extends Component {

    componentDidMount() {
        const navCloseRef = document.getElementById("nav-close");
        const navHamburgerRef = document.getElementById("nav-hamburger");
        const navRef = document.getElementById("nav");
        const mainRef = document.getElementById("main");
        const footerRef = document.getElementById("footer");
        navHamburgerRef.onclick = function (e) {
            navRef.classList.add("nav-show")
        }
        navCloseRef.onclick = function (e) {
            navRef.classList.remove("nav-show")
        }

        mainRef.onclick = function (e) {
            navRef.classList.remove("nav-show")
        }

        footerRef.onclick = function (e) {
            navRef.classList.remove("nav-show")
        }

    }

    render() {
        return (
            <Fragment>
                <div id="nav-hamburger" className="hamburger-holder">
                    <img src={hamburger} alt="" srcSet="" />
                </div>
                <nav id="nav">
                    <div id="nav-close" className="nav-close-holder">
                        <img src={navclose} alt="" srcSet="" />
                    </div>
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
                                <img src={navplus} alt="" srcSet="" />
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
                <main id="main">
                    <section className="main-header">
                        <div className="container-action-notifier">
                            <img src={angleright} alt="" srcSet="" />
                            <span>Home</span>
                        </div>
                        <div className="master-search-bar">
                            <form
                                action=""
                            // onSubmit={async (e) => {
                            //     e.preventDefault();
                            //     let a = await this.state.suggestionText;
                            //     await this.props.fetchResults(a);
                            // }}
                            >
                                <input
                                    type="text"
                                    // onKeyUp={async (e) => {
                                    //     if (e.keyCode === 40) {
                                    //         let current = (this.state.currentTextIndex + 1) % (this.props.state.keywordSuggestions.length + 1);
                                    //         if (current !== 0)
                                    //             await this.setState({ currentTextIndex: current, suggestionText: this.props.state.keywordSuggestions[current - 1][0] })
                                    //         else
                                    //             await this.setState({ currentTextIndex: current, suggestionText: this.state.actualText })
                                    //     } else if (e.keyCode === 38) {
                                    //         let current = Math.abs(this.state.currentTextIndex - 1) % (this.props.state.keywordSuggestions.length + 1);
                                    //         if (current !== 0)
                                    //             await this.setState({ currentTextIndex: current, suggestionText: this.props.state.keywordSuggestions[current - 1][0] })
                                    //         else
                                    //             await this.setState({ currentTextIndex: current, suggestionText: this.state.actualText })
                                    //     }
                                    // }}
                                    // value={this.state.suggestionText}
                                    // onChange={async (e) => {
                                    //     let a = e.target.value
                                    //     await this.setState({ suggestionText: a, actualText: a, currentTextIndex: 0 });
                                    //     await this.props.getKeywordSuggestion(a)
                                    // }}
                                    className="search-input"
                                    placeholder="Search Artists, Albums, Films, Songs...."
                                />
                                <button className="search-icon" type="submit"><img src={mainsearch} alt="" srcSet="" /></button>
                            </form>
                            <div className="suggestion-keyword-holder">
                                {/* {this.props.state.keywordSuggestions.map((item, key) => ( */}
                                <div
                                    // onClick={async (e) => {
                                    //     await this.setState({ suggestionText: item[0] })
                                    //     await this.props.fetchResults(this.state.suggestionText);
                                    // }}
                                    // key={key}
                                    // className={`suggested-keyword 
                                    // ${this.state.currentTextIndex === key + 1 ? 'highlight-current' : ''}`}
                                    className={`suggested-keyword`}
                                >Keyword suggester</div>
                                <div
                                    // onClick={async (e) => {
                                    //     await this.setState({ suggestionText: item[0] })
                                    //     await this.props.fetchResults(this.state.suggestionText);
                                    // }}
                                    // key={key}
                                    // className={`suggested-keyword 
                                    // ${this.state.currentTextIndex === key + 1 ? 'highlight-current' : ''}`}
                                    className={`suggested-keyword`}
                                >Keyword suggester</div>
                                <div
                                    // onClick={async (e) => {
                                    //     await this.setState({ suggestionText: item[0] })
                                    //     await this.props.fetchResults(this.state.suggestionText);
                                    // }}
                                    // key={key}
                                    // className={`suggested-keyword 
                                    // ${this.state.currentTextIndex === key + 1 ? 'highlight-current' : ''}`}
                                    className={`suggested-keyword`}
                                >Keyword suggester</div>
                                {/* ))} */}
                            </div>
                        </div>
                        <div className="main-user-profile-holder">
                            <img src={musicDummy} alt="" srcSet="" />
                        </div>
                    </section>
                </main>
                <footer id="footer">
                    <audio id="music-player"
                    // onEnded={async (e) => await this.props.playerEndHandler()}
                    // onTimeUpdate={async (e) => await this.props.playerTimeUpdater(e)}
                    >
                        <source src="" id="audio-source-1" />
                        <source src="" id="audio-source-2" />
                    </audio>
                    <div className="progress-bar-holder">
                        <input
                            // onChange={async (e) => { await this.props.seekAudio(e) }}
                            className="progress-bar"
                            min="0"
                            max="100"
                            // value={isNaN(this.props.state.currentProgress) ? 0 : this.props.state.currentProgress}
                            step="1"
                            type="range"
                            id="player-progress-bar"
                        />
                    </div>
                    <div className="player-controls-holder">
                        <section className="player-desc">
                            <div className="player-desc-img-holder">
                                <img className="player-desc-img" src={musicDummy} alt="" srcSet="" />
                            </div>
                            <div className="player-desc-content">
                                <div>Justin Russelt Hit It Justin Russelt Hit It</div>
                                <div>3.50 <span>|</span> 4.54</div>
                            </div>
                        </section>
                        <section className="player-control-core">
                            <img src={playerprevious} alt="" srcSet="" />
                            <img src={playerplay} alt="" srcSet="" />
                            <img src={playernext} alt="" srcSet="" />
                        </section>
                        <section className="player-rightmost-control-holder">
                            <div>
                                <img src={playervolume} alt="" srcSet="" />
                                <input
                                    // onChange={async (e) => {
                                    //     await this.props.updateVolume(e);
                                    // }}
                                    type="range"
                                    className={`volume-progress`}
                                    step="0.1" min="0" max="1"
                                // value={this.props.state.playerVolume}
                                />
                            </div>
                            <div>
                                <img src={playerdownload} alt="" srcSet="" />
                            </div>
                            <div>
                                <img src={playerqueue} alt="" srcSet="" />
                            </div>
                        </section>
                    </div>
                </footer>
            </Fragment>

        )
    }
}
