import React, { Component } from 'react';
import { LeftNav, Albums, Artists, Languages, AlbumsDash } from '.';
import { Switch, Route } from 'react-router';
import Home from './Home';
import "../assets/styles/main.css";

export default class Main extends Component {
    render() {
        return (
            <div className="main-wrapper">
                <LeftNav />
                <div className="main-view">
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/albums" component={Albums} />
                        <Route path="/albums/dashyard" component={AlbumsDash} />
                        <Route path="/artists" component={Artists} />
                        <Route path="/languages" component={Languages} />
                    </Switch>
                </div>
            </div>
        )
    }
}
