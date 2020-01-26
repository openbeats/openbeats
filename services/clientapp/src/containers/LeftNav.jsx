import React, { Component, Fragment } from "react";
import "../css/leftnav.css";
import { toastActions, playlistManipulatorActions, searchActions } from "../actions";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { store } from "../store";
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
  navclose,
  mainsearch
} from "../images";

class LeftNav extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isCreateNewPlaylistTriggered: false,
      playlistName: '',
    }
  }

  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.props.fetchUserPlaylistMetadata(this.props.userDetails.id);
    }
  }

  render() {
    return (
      <Fragment>
        <div id="nav-hamburger" className="hamburger-holder">
          <img src={hamburger} alt="" srcSet="" />
        </div>
        <nav id="nav">
          <section className="master-logo">
            <img
              className="cursor-pointer"
              onClick={() => {
                window.open("/", "_self");
              }}
              src={masterLogo}
              alt=""
            />
            <div id="nav-close" className="nav-close-holder">
              <img src={navclose} alt="" srcSet="" />
            </div>
          </section>
          <section className="nav-content">
            <section className="main-nav-menus">
              <div className="nav-menu" onClick={() => this.props.push("/")}>
                <div className="nav-menu-icon-holder">
                  <img className="nav-menu-icon-size" src={navhome} alt="" />
                </div>
                <p className="nav-menu-text">Home</p>
              </div>
              <div
                className="nav-menu"
                onClick={() => this.props.featureNotify()}
              >
                <div className="nav-menu-icon-holder">
                  <img className="nav-menu-icon-size" src={navchart} alt="" />
                </div>
                <p className="nav-menu-text">Top Charts</p>
              </div>
              <div
                className="nav-menu"
                onClick={() => this.props.featureNotify()}
              >
                <div className="nav-menu-icon-holder">
                  <img className="nav-menu-icon-size" src={navartist} alt="" />
                </div>
                <p className="nav-menu-text">Artists</p>
              </div>
              <div
                className="nav-menu"
                onClick={() => this.props.featureNotify()}
              >
                <div className="nav-menu-icon-holder">
                  <img className="nav-menu-icon-size" src={navalbum} alt="" />
                </div>
                <p className="nav-menu-text">Albums</p>
              </div>
              <div
                className="nav-menu"
                onClick={() => this.props.push("/search")}
              >
                <div className="nav-menu-icon-holder">
                  <img className="nav-menu-icon-size" src={mainsearch} alt="" />
                </div>
                <p className="nav-menu-text">Search</p>
              </div>
              <div
                className="nav-menu"
                onClick={() => this.props.featureNotify()}
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
                className="nav-menu cursor-pointer"
                title="View All of Your Playlist"
                onClick={() => this.props.push("/yourplaylist")}
              >
                <div className="nav-menu-icon-holder">
                  <img
                    className="nav-menu-icon-size"
                    src={navplaylist}
                    alt=""
                  />
                </div>
                <p className="nav-menu-text">Your Playlists</p>
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
                  >
                    <img src={navplus} alt="" srcSet="" />
                  </div>
                  {this.state.isCreateNewPlaylistTriggered &&
                    <li className="playlist-content-holder-text">
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
                        onClick={() => this.props.push(`/playlist/user/${item.playlistId}`)}
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
                © 2019 OpenBeats, LLC <br />
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
    userDetails: state.authReducer.userDetails
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
