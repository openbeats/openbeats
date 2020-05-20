import React, { Component, Fragment } from "react";
import "../assets/css/leftnav.css";
import { toastActions, playlistManipulatorActions, searchActions } from "../actions";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { store } from "../store";
import {
  masterLogo,
  navchart,
  navartist,
  navhistory,
  navplaylist,
  navplus,
  hamburger,
  navclose,
  mainsearch,
  playerqueue
} from "../assets/images";

class LeftNav extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isCreateNewPlaylistTriggered: false,
      playlistName: '',
      isLeftNavOpened: false
    }
    this.navBarRef = null;
    this.createNewPlaylistBtnRef = null;
    this.createNewPlaylistFormHolderRef = null;
  }

  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.props.fetchUserPlaylistMetadata(this.props.userDetails.id);
    }
  }

  closeLefNavMenu = () => {
    if (!this.state.isLeftNavOpened) {
      this.setState({ isLeftNavOpened: true });
      document.addEventListener("click", this.closeLeftNavMenuHandler);
    } else {
      this.setState({ isLeftNavOpened: false });
      document.removeEventListener("click", this.closeLeftNavMenuHandler);
    }
  }

  closeLeftNavMenuHandler = (e) => {
    if (this.createNewPlaylistBtnRef && this.createNewPlaylistBtnRef.contains(e.target)) {
      return;
    } else if (this.createNewPlaylistFormHolderRef && this.createNewPlaylistFormHolderRef.contains(e.target)) {
      return;
    }
    this.setState({ isLeftNavOpened: false });
    document.removeEventListener("click", this.closeLeftNavMenuHandler);
  }


  render() {
    return (
      <Fragment>
        <div onClick={this.closeLefNavMenu} className="hamburger-holder">
          <img src={hamburger} alt="" srcSet="" />
        </div>
        <nav ref={d => this.navBarRef = d} className={`${this.state.isLeftNavOpened ? 'nav-show' : ''}`}>
          <section className="master-logo">
            <img
              className="cursor-pointer"
              onClick={() => {
                window.open("/", "_self");
              }}
              src={masterLogo}
              alt=""
            />
            <div onClick={this.closeLefNavMenu} className="nav-close-holder">
              <img src={navclose} alt="" srcSet="" />
            </div>
          </section>
          <section className="nav-content">
            <section className="main-nav-menus">
              <div className={`nav-menu ${this.props.activeNavMenu === "Home" ? "nav-menu-highlight" : ""}`} onClick={() => this.props.push("/")}>
                <div className="nav-menu-icon-holder">
                  <i className="fas fa-home master-color nav-menu-icon-size"></i>
                </div>
                <p className="nav-menu-text">Home</p>
              </div>
              <div
                className={`nav-menu ${this.props.activeNavMenu === "Top Charts" ? "nav-menu-highlight" : ""}`}
                onClick={() => this.props.push("/topcharts")}
              >
                <div className="nav-menu-icon-holder">
                  <img className="nav-menu-icon-size" src={navchart} alt="" />
                </div>
                <p className="nav-menu-text">Top Charts</p>
              </div>
              <div
                className={`nav-menu ${this.props.activeNavMenu === "All Albums" || this.props.activeNavMenu === "Latest Albums" || this.props.activeNavMenu === "Popular Albums" ? "nav-menu-highlight" : ""}`}
                onClick={() => this.props.push("/albums")}
              >
                <div className="nav-menu-icon-holder">
                  <i className="master-color fad fa-album-collection nav-menu-icon-size"></i>
                </div>
                <p className="nav-menu-text">Albums</p>
              </div>
              <div
                className={`nav-menu ${this.props.activeNavMenu === "Artists" ? "nav-menu-highlight" : ""}`}
                onClick={() => this.props.push("/artists")}
              >
                <div className="nav-menu-icon-holder">
                  <img className="nav-menu-icon-size" src={navartist} alt="" />
                </div>
                <p className="nav-menu-text">Artists</p>
              </div>
              <div
                className={`nav-menu ${this.props.activeNavMenu === "Languages" ? "nav-menu-highlight" : ""}`}
                onClick={() => this.props.push("/languages")}
              >
                <div className="nav-menu-icon-holder">
                  <i className="master-color fad fa-language nav-menu-icon-size"></i>
                </div>
                <p className="nav-menu-text">Languages</p>
              </div>
              <div
                className={`nav-menu ${this.props.activeNavMenu === "Emotions" ? "nav-menu-highlight" : ""}`}
                onClick={() => this.props.push("/emotions")}
              >
                <div className="nav-menu-icon-holder">
                  <i className="master-color fad fa-dove nav-menu-icon-size"></i>
                </div>
                <p className="nav-menu-text">Emotions</p>
              </div>
              <div
                className={`nav-menu ${this.props.activeNavMenu === "My Collections" ? "nav-menu-highlight" : ""}`}
                onClick={() => this.props.push("/mycollections")}
              >
                <div className="nav-menu-icon-holder">
                  <i className="master-color fas fa-heart-square nav-menu-icon-size"></i>
                </div>
                <p className="nav-menu-text">My Collections</p>
              </div>
              <div
                className={`nav-menu ${this.props.activeNavMenu === "Search Result" ? "nav-menu-highlight" : ""}`}
                onClick={() => this.props.push("/search")}
              >
                <div className="nav-menu-icon-holder">
                  <img className="nav-menu-icon-size" src={mainsearch} alt="" />
                </div>
                <p className="nav-menu-text">Search</p>
              </div>
              <div
                className={`nav-menu ${this.props.activeNavMenu === "Now Playing" ? "nav-menu-highlight" : ""}`}
                onClick={() => this.props.push("/nowplaying")}
              >
                <div className="nav-menu-icon-holder">
                  <img className="nav-menu-icon-size" src={playerqueue} alt="" />
                </div>
                <p className="nav-menu-text">Now Playing</p>
              </div>
              <div
                className={`nav-menu ${this.props.activeNavMenu === "Recently Played" ? "nav-menu-highlight" : ""}`}
                onClick={() => this.props.push("/playlist/recentlyplayed/user")}
              >
                <div className="nav-menu-icon-holder">
                  <img className="nav-menu-icon-size" src={navhistory} alt="" />
                </div>
                <p className="nav-menu-text">Recently Played</p>
              </div>
            </section>
            <section className="nav-horizontal-rule"></section>
            <section className="nav-playlist-holder">
              <div
                className={`nav-menu cursor-pointer ${this.props.activeNavMenu === "My Playlists" ? "nav-menu-highlight" : ""}`}
                title="View All of Your Playlist"
                onClick={() => this.props.push("/myplaylists")}
              >
                <div className="nav-menu-icon-holder">
                  <img
                    className="nav-menu-icon-size"
                    src={navplaylist}
                    alt=""
                  />
                </div>
                <p className="nav-menu-text">My Playlists</p>
              </div>
              {this.props.isAuthenticated ?

                <ul className="playlist-content-holder">

                  <div
                    className="nav-playlist-plus-icon-holder"
                    title="Create New Playlist"
                    onClick={() => {
                      this.props.updateTyping(true)
                      this.setState({ playlistName: '', isCreateNewPlaylistTriggered: true })
                    }}
                    ref={d => this.createNewPlaylistBtnRef = d}
                  >
                    <img src={navplus} alt="" srcSet="" />
                  </div>
                  {this.state.isCreateNewPlaylistTriggered &&
                    <li className="playlist-content-holder-text"
                      ref={d => this.createNewPlaylistFormHolderRef = d}
                    >
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        if (await this.props.createNewPlaylist(this.props.userDetails.id, this.state.playlistName)) {
                          await this.setState({ playlistName: '', isCreateNewPlaylistTriggered: false })
                          this.props.updateTyping(false)
                          await this.props.fetchUserPlaylistMetadata(this.props.userDetails.id);
                        }
                      }} className="playlist-panel-edit-name">
                        <input placeholder="Playlist Name" type="text" value={this.state.playlistName} onChange={(e) => this.setState({ playlistName: e.target.value })} />
                        <div className="playlist-panel-edit-options">
                          <button className="cursor-pointer" type="submit"><i className="fas fa-check"></i></button>
                          <button className="cursor-pointer" onClick={() => {
                            this.props.updateTyping(false)
                            this.setState({ isCreateNewPlaylistTriggered: false, playlistName: '' })
                          }}><i className="fas fa-times"></i></button>
                        </div>
                      </form>
                    </li>
                  }
                  {this.props.userPlaylistMetaData.length > 0 ?
                    this.props.userPlaylistMetaData.map((item, key) => (
                      <li
                        key={key}
                        className="playlist-content-holder-text"
                        onClick={() => this.props.push(`/playlist/user/${item._id}`)}
                      >
                        {item.name}
                      </li>
                    ))
                    :
                    <li className="empty-playlist-leftnav">Your playlist is empty</li>
                  }
                </ul> :
                <div className="playlist-login-notifier cursor-pointer" onClick={() => this.props.push("/auth")}>
                  <div>
                    <i className="fas fa-power-off red-color auth-power-on"></i>
                  </div>
                  <p>please login to <br /> view or create your playlist</p>
                </div>
              }
            </section>
            <section className="nav-footer-container">
              <div className="footer-text-holder">
                <span>About</span> <span>Copyright</span> <br />
                <span>Contact us</span> <span>Advertise</span> <br />
                <span>Developers</span> <br />
                <span>Terms Privacy Policy</span> <br />
                <span>Request New features</span> <br />
                <br />
                © 2020 OpenBeats, LLC <br />
              </div>
            </section>
          </section>
        </nav>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.authReducer.isAuthenticated,
    userPlaylistMetaData: state.playlistManipulatorReducer.userPlaylistMetaData,
    userDetails: state.authReducer.userDetails,
    activeNavMenu: state.coreReducer.currentActionTitle,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    push: path => {
      if (path !== store.getState().router.location.pathname)
        dispatch(push(path));
    },
    notify: message => {
      toastActions.showMessage(message);
    },
    featureNotify: () => {
      toastActions.featureNotify();
    },
    fetchUserPlaylistMetadata: (userId) => {
      playlistManipulatorActions.fetchUserPlaylistMetadata(userId);
    },
    createNewPlaylist: (userId, name) => {
      return playlistManipulatorActions.createNewPlaylist(userId, name);
    },
    updateTyping: (isTyping) => {
      dispatch(searchActions.updateTyping(isTyping));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftNav);
