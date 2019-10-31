import React, { Component } from 'react'
import "../css/header.css";

export default class Header extends Component {
    render() {
        return (
            <header>
                <div className="header-left">
                    <a className="logo cursor-pointer t-none" href={window.location.href}><span></span></a>
                </div>
                <div className="header-right">
                    <div onClick={
                        () => {
                            this.props.featureNotify()
                        }
                    }>
                        <i className="far fa-user-circle text-base-color user-icon cursor-pointer"></i>
                    </div>
                    <div onClick={
                        () => {
                            this.props.featureNotify()
                        }
                    }>
                        <i className="fab fa-android android-color cursor-pointer"></i>
                    </div>
                </div>
            </header>
        )
    }
}
