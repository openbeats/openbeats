import React, { Component } from 'react';
import "../assets/styles/songsbucket.css";

export default class SongsBucket extends Component {

    removeASongFromBucket = (index) => {
        this.props.removeSongFromBucketCallBack(index);
    }

    emptyTheBucket = () => {
        this.props.emptyTheBucketCallBack();
    }

    onDragStart = (e, index) => {
        this.draggedItem = this.props.songsBucket[index];
        e.dataTransfer.effectAllowed = "copyMove";
        e.dataTransfer.setData("text/html", e.target.parentNode);
        e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
    };

    onDragOver = index => {
        const draggedOverItem = this.props.songsBucket[index];
        // if the item is dragged over itself, ignore
        if (this.draggedItem.videoId === draggedOverItem.videoId) {
            return;
        }
        // filter out the currently dragged item
        let items = this.props.songsBucket.filter(item => item.videoId !== this.draggedItem.videoId);
        // add the dragged item after the dragged over item
        items.splice(index, 0, this.draggedItem);
        this.props.arrangeSongsCallBack(items);
    };

    onDragEnd = () => {
        this.draggedIdx = null;
    };

    playSongTrial = (index) => {
        this.props.songTrialTrigger(this.props.songsBucket[index]);
    }

    render() {
        return (
            <div className="songsbucket-wrapper">
                <div className="songsbucket-header">
                    <div className="songsbucket-total-song-count-holer">
                        <div className="songsbucket-totalsongs">{this.props.songsBucket.length}</div>
                    </div>
                    <div className="songsbucket-title-holer font-weight-bold display-flex align-items-center justify-content-center">
                        <i className="fab fa-bitbucket mr-2 base-color "></i><span className="text-white">Songs in The Bucket</span>
                    </div>
                    <div className="songsbucket-empty-action">
                        {this.props.songsBucket.length && <i className="fas fa-trash-restore-alt text-danger cursor-pointer" title="Empty the Bucket" onClick={this.emptyTheBucket}></i>}
                    </div>
                </div>
                <div className="songsbucket-body">
                    {this.props.songsBucket.length === 0 && <div className="songsbucket-empty-result-message font-weight-bold">Bucket is Empty!</div>}
                    {this.props.songsBucket.length !== 0 && <div className="songsbucket-songs-holder">
                        {this.props.songsBucket.map((item, key) => (
                            <div className="songsbucket-search-result-node" id={"mykey" + key.toString()} key={key} onDragOver={() => this.onDragOver(key)}>
                                <div className="songsbucket-song-drag-handle-holder"
                                    draggable
                                    onDragStart={e => this.onDragStart(e, key)}
                                    onDragEnd={this.onDragEnd}
                                >
                                    <i className="fas fa-grip-vertical grab-pointer" title="Drag up and down to Arrange the songs"></i>
                                </div>
                                <div className="songsbucket-song-current-position-indicator">
                                    <div>{key + 1}</div>
                                </div>
                                <div className="songsbucket-song-thumbnail-holder">
                                    <div className="songsbucket-song-thumbnail" style={{ backgroundImage: `url(${item.thumbnail})` }}></div>
                                </div>
                                <div className="songsbucket-actions ml-3">
                                    <i className="fas fa-play-circle shadow cursor-pointer ml-1" onClick={() => this.playSongTrial(key)}></i>
                                    <i className="fas fa-trash-alt shadow cursor-pointer ml-4" onClick={() => this.removeASongFromBucket(key)}></i>
                                </div>
                                <div className="font-weight-bold ml-4" >{item.title}</div>
                            </div>
                        ))}
                    </div>}
                </div>
            </div>
        )
    }

}
