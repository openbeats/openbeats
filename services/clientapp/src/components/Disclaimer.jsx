import React, { Component } from 'react';
import "../assets/css/disclaimer.css";

export default class Disclaimer extends Component {
    render() {
        return (
            <div className="disclaimer-wrapper">
                <div className="disclaimer-title">Disclaimer for OpenBeats</div>
                <div className="disclaimer-head">
                    <b>This application is built for educational purposes only to explore new technologies (check bottom of this document to know more). We do not claim any copyrights for any of the content available here.</b><br />
                    If you require any more information or have any questions about our site's disclaimer, please feel free to contact us by email at openbeatsyag@gmail.com
                </div>
                <div className="disclaimer-body">
                    <section>
                        <div className="disclaimer-section-head">Disclaimers</div>
                        <div className="disclaimer-section-body">
                            All media on this website - www.openebats.live - is published in good faith and for general entertainment purpose only. OpenBeats does not make any warranties about the completeness, reliability, accuracy and the infringement of any media. Any action you take upon the contents you find on this website (OpenBeats), is strictly at your own risk. OpenBeats will not be liable for any losses and/or damages in connection with the use of our website.
                            <br />
                            <br />
                            From our website, you can visit other websites by following hyperlinks to such external sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites. These links to other websites do not imply a recommendation for all the content found on these sites. Site owners and content may change without notice and may occur before we have the opportunity to remove a link which may have gone 'bad'.
                            <br />
                            <br />
                            Please be also aware that when you leave our website, other sites may have different privacy policies and terms which are beyond our control. Please be sure to check the Privacy Policies of these sites as well as their "Terms of Service" before engaging in any business or uploading any information.
                        </div>
                    </section>
                    <section>
                        <div className="disclaimer-section-head">Consent</div>
                        <div className="disclaimer-section-body">By using our website, you hereby consent to our disclaimer and agree to its terms.</div>
                    </section>
                    <section>
                        <div className="disclaimer-section-head">Update</div>
                        <div className="disclaimer-section-body">Should we update, amend or make any changes to this document, those changes will be prominently posted here.I</div>
                    </section>
                    <section>
                        <div className="disclaimer-section-head">Technology Stack</div>
                        <div className="disclaimer-section-body">
                            <ul>
                                <li>Kubernetes - Microservices Architecture</li>
                                <li>Database - MongoDB</li>
                                <li>Serverless function</li>
                                <li>Nodejs, Express, ffmpeg</li>
                                <li>React, Redux</li>
                                <li>Flutter</li>
                                <li>Docker, Github Actions</li>
                                <li>Redis, Block storage</li>
                                <li>PWA</li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}
