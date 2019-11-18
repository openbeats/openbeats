import React, { Component, Fragment } from 'react'
import "../css/core.css";
import "../css/leftnav.css";
import "../css/mainheader.css";
import "../css/mainbody.css";
import { variables } from "../config";
import { Result } from '../components'
import { Player } from '../containers'
import { toastActions, playerActions } from "../actions";
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
    musicDummy,
    angleright,
    mainsearch,
    hamburger,
    navclose
} from '../images'

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: "",
            keywordSuggestions: [],
            searchResults: [],
            isSearchProcessing: false,
            listener: null,
            isSearching: false,
            typing: false,
            currentActionTitle: "Search",
        }

        this.getKeywordSuggestion = this.getKeywordSuggestion.bind(this)
        this.fetchResults = this.fetchResults.bind(this);
    }

    componentDidMount() {
        this.initiateListeners()
    }

    initiateListeners() {
        const navCloseRef = document.getElementById("nav-close");
        const navHamburgerRef = document.getElementById("nav-hamburger");
        const navRef = document.getElementById("nav");
        const mainRef = document.getElementById("main");
        const playerWrapperRef = document.getElementById("player-wrapper");

        navHamburgerRef.onclick = function (e) {
            navRef.classList.add("nav-show")
            playerWrapperRef.classList.remove("show-player")
        }

        navCloseRef.onclick = function (e) {
            navRef.classList.remove("nav-show")
        }

        mainRef.onclick = function (e) {
            navRef.classList.remove("nav-show")
            playerWrapperRef.classList.remove("show-player")
        }

        playerWrapperRef.onclick = function (e) {
            navRef.classList.remove("nav-show")
        }

        const searchBarRef = document.getElementsByClassName("search-input")[0];
        searchBarRef.addEventListener("focusin", function (e) {
            this.setState({ typing: true })
        }.bind(this))
        searchBarRef.addEventListener("focusout", function (e) {
            this.setState({ typing: false })
        }.bind(this))

        document.addEventListener("keydown", function (e) {
            if (e.keyCode === 27) {
                this.setState({ keywordSuggestions: [] })
            }
        }.bind(this))

    }

    async getKeywordSuggestion(e) {
        this.setState({ searchText: e })
        const url = `${variables.baseUrl}/suggester?k=${e}`;
        if (e.length > 0) {
            await fetch(url)
                .then(res => res.json())
                .then(res => {
                    let temp = res.data
                    let listener = document.addEventListener("click", function () {
                        if (listener != null) {
                            document.removeEventListener(this.state.listenter)
                        }
                        this.setState({ keywordSuggestions: [], listener: null })
                    }.bind(this));
                    this.setState({ keywordSuggestions: temp, listener: listener })
                })
                .catch(e => console.error(e))
        }
    }

    async fetchResults(item) {
        this.setState({ searchText: item, keywordSuggestions: [], isSearching: true });
        const url = `${variables.baseUrl}/ytcat?q=${this.state.searchText}`
        await fetch(url)
            .then(res => res.json())
            .then(async res => {
                if (res.status) {
                    this.setState({
                        searchResults: res.data,
                        isSearching: false,
                        keywordSuggestions: []
                    })
                }
            })
            .catch(err => console.error(err));
    }

    render() {

        return (
            <Fragment >
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

                <main id="main">
                    <section className="main-header">
                        <div className="container-action-notifier">
                            <img src={angleright} alt="" srcSet="" />
                            <span>{this.state.currentActionTitle}</span>
                        </div>
                        <div className="master-search-bar">
                            <form
                                action=""
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    let a = await this.state.suggestionText;
                                    await this.fetchResults(a);
                                }}
                            >
                                <input
                                    type="text"
                                    onKeyUp={async (e) => {
                                        if (e.keyCode === 40 && this.state.keywordSuggestions.length) {
                                            let current = (this.state.currentTextIndex + 1) % (this.state.keywordSuggestions.length + 1);
                                            if (current !== 0)
                                                await this.setState({ currentTextIndex: current, suggestionText: this.state.keywordSuggestions[current - 1][0] })
                                            else
                                                await this.setState({ currentTextIndex: current, suggestionText: this.state.actualText })
                                        } else if (e.keyCode === 38 && this.state.keywordSuggestions.length) {
                                            let current = Math.abs(this.state.currentTextIndex - 1) % (this.state.keywordSuggestions.length + 1);
                                            if (current !== 0)
                                                await this.setState({ currentTextIndex: current, suggestionText: this.state.keywordSuggestions[current - 1][0] })
                                            else
                                                await this.setState({ currentTextIndex: current, suggestionText: this.state.actualText })
                                        }
                                    }}
                                    value={this.state.suggestionText || ''}
                                    onChange={async (e) => {
                                        let a = e.target.value
                                        await this.setState({ suggestionText: a, actualText: a, currentTextIndex: 0 });
                                        await this.getKeywordSuggestion(a)
                                    }}
                                    className="search-input"
                                    placeholder="Search Artists, Albums, Films, Songs...."
                                />
                                <button className="search-icon" type="submit"><img src={mainsearch} alt="" srcSet="" /></button>
                            </form>
                            <div className="suggestion-keyword-holder">
                                {this.state.keywordSuggestions.map((item, key) => (
                                    <div
                                        onClick={async (e) => {
                                            await this.setState({ suggestionText: item[0] })
                                            await this.fetchResults(this.state.suggestionText);
                                        }}
                                        key={key}
                                        className={`suggested-keyword ${this.state.currentTextIndex === key + 1 ? 'highlight-current' : ''}`}
                                    >
                                        {item[0]}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="main-user-profile-holder">
                            <img
                                className="cursor-pointer"
                                onClick={() => {
                                    this.props.featureNotify()
                                }} src={musicDummy}
                                alt=""
                                srcSet="" />
                        </div>
                    </section>
                    <div className="main-body">
                        <Result
                            state={this.state}
                            initPlayer={this.props.initPlayer}
                            featureNotify={this.props.featureNotify}
                        />
                    </div>
                </main>

                <Player
                    state={this.state}
                />
            </Fragment >
        )
    }

}

const mapStateToProps = (state) => {
    return {
        message: state.message
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
        },
        initPlayer: (audioData) => {
            playerActions.initPlayer(audioData)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);