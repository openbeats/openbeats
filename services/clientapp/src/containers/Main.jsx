import React, { Component, Fragment } from "react";
import "../css/core.css";
import "../css/mainbody.css";
import { Player, TopNav, PlaylistDisplay, LeftNav, Home } from ".";
import { toastActions, coreActions } from "../actions";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Switch, Route } from "react-router";
import NowPlaying from "./NowPlaying";
import Result from "./Result";

class Main extends Component {
  componentDidMount() {
    this.initiateListeners();
  }
  initiateListeners() {
    const navCloseRef = document.getElementById("nav-close");
    const navHamburgerRef = document.getElementById("nav-hamburger");
    const navRef = document.getElementById("nav");
    const mainRef = document.getElementById("main");
    const playerWrapperRef = document.getElementById("player-wrapper");

    navHamburgerRef.onclick = function(e) {
      navRef.classList.add("nav-show");
      playerWrapperRef.classList.remove("show-player");
    };

    navCloseRef.onclick = function(e) {
      navRef.classList.remove("nav-show");
    };

    mainRef.onclick = function(e) {
      navRef.classList.remove("nav-show");
      playerWrapperRef.classList.remove("show-player");
    };

    playerWrapperRef.onclick = function(e) {
      navRef.classList.remove("nav-show");
    };
  }

  render() {
    return (
      <Fragment>
        <LeftNav />
        <main id="main">
          <TopNav />
          <section className="main-body">
            {/* Main content Loading Region ... any ui content should be loaded here... all overflows has been handled.*/}
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/nowplaying" component={NowPlaying} />
              <Route path="/playlist" component={PlaylistDisplay} />
              <Route path="/search" component={Result} />
            </Switch>
          </section>
        </main>
        <Player />
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    push: path => {
      dispatch(push(path));
    },
    notify: message => {
      toastActions.showMessage(message);
    },
    featureNotify: () => {
      toastActions.featureNotify();
    },
    setCurrentAction: action => {
      dispatch(coreActions.setCurrentAction(action));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
