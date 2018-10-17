import React, {Component} from 'react';
import {Button, Grid} from 'semantic-ui-react'
import {connect} from 'react-redux'
import {importChatRooms} from "../actions/chatAction";
import {authUser} from "../actions/userAction";
import {peerjs} from '../utils/peerjs';



class Dashboard extends Component {

    state = {
        users: [],
        files: [],
        openShareFileInput: false
    };


    componentDidMount() {
        this.props.importChatRooms();

        this.props.authUser().then(res => {
            this.props.userData ?
                peerjs.exec(this.props.userData.id, (err, file) => {
                    this.addFile(file);
                }) : ''
        })
    }

    addFile = (file) => {
        const fileDetal = {name: file.name, url: file.url};
        this.setState({files: [...this.state.files, fileDetal]})
    };

    handleUserCall = (callingId) => {
        peerjs.makeCall(callingId)
    };

    handleConnectToFileShare = (id) => {
        peerjs.connect(id);
        this.setState({openShareFileInput: true})
    };


    handleAccessToVideo = () => {
        peerjs.openCamera()
    };


    handleEndCall = () => {
        peerjs.endCall();
    };

    sendFile = (event) => {
        var file = event.target.files[0];
        var blob = new Blob(event.target.files, {type: file.type});

        peerjs.sendFile({
            file: blob,
            filename: file.name,
            filetype: file.type
        });
    };


    render() {

        const {room, children} = this.props;
        const {openShareFileInput, files} = this.state;

        return (
            <Grid style={{height: `${window.innerHeight}px`}}>
                <Grid.Row style={{backgroundColor: '#e9ebee'}}>
                    <Grid.Column width={4} style={{textAlign: 'center'}}>
                        {room ? this.handleOnlineUserList() : ''}
                    </Grid.Column>
                    <Grid.Column width={8}>
                        {children}
                    </Grid.Column>
                    <Grid.Column width={4}>
                        {room ?
                            <Button icon='video camera' color='green' onClick={() => this.handleAccessToVideo()}/> : ''}
                        {room ? <Button icon='video camera' color='red' onClick={() => this.handleEndCall()}/> : ''}
                        {room ? this.handleVideoChat() : ''}
                        <div>
                            {openShareFileInput ? <div>
                                <input style={fileInput} type="file" name="file" id="file" className="mui--hide"
                                       onChange={this.sendFile}/>
                                <Button htmlFor="file" size='big' icon='plus' circular color='green'/>
                            </div> : null}
                            {files.length ? this.renderFile() : ''}
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }


    renderFile = () => (
        <div style={filesBox}>
            <h3>Received Files</h3>
            {
                this.state.files.map((file,i) => (
                    <div key={i}>
                        <a href={file.url} download={file.name}>{file.name}</a>
                    </div>
                ))
            }
        </div>
    );

    handleVideoChat = () => (
        <div>
            <div id="video-container">
                <video id="my-video" muted autoPlay style={{height: '200px'}}/>
                <video id="their-video" autoPlay style={{height: '200px'}}/>
            </div>
            <div>
                <div id="step2">
                    {/*<p>Your id: <span id="my-id">...</span></p>*/}
                </div>

                <div id="step3">
                    {/*<p>Currently in call with <span id="their-id">...</span></p>*/}
                </div>
            </div>
        </div>
    );


    handleOnlineUserList = () => (
        <div>
            <h2>Online</h2>
            <div style={usersBox}>{
                this.props.chat.roomUserList ?
                    this.props.chat.roomUserList.map((user, i) => {
                        if (user.room == this.props.room) {
                            return <span key={i}>{user.name}{' '}
                                <Button size='mini' icon='call' color='green'
                                        onClick={() => this.handleUserCall(user.userId)}/>
                                    <Button size='mini' icon='file alternate' color='green'
                                            onClick={() => this.handleConnectToFileShare(user.userId)}/><br/>
                                  </span>
                        }
                    })
                    : null
            }
            </div>
        </div>
    );

}

const mapStateToProps = (state) => {
    return {
        chat: state.chat
    }
};


const usersBox = {
    backgroundColor: '#ffffff', borderRadius: '12px', margin: '25px 0 0  15px', minHeight: '100px', padding: '20px'
};
const filesBox = {backgroundColor: '#ffffff', borderRadius: '12px',textAlign: 'center'};
const fileInput = {opacity: 0, position: 'absolute', height: '50px', width: '50px'};



export default connect(mapStateToProps, {importChatRooms, authUser})(Dashboard);
