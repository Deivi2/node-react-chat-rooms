import React, {Component} from 'react';
import Dashboard from '../hoc/Dashboard'
import {connect} from 'react-redux'
import {clearChatInfo, getChatInfo, setRoomUserList} from "../actions/chatAction";
import {authUser} from "../actions/userAction";
import {Button, Container, Grid, Input,Loader} from 'semantic-ui-react'
import {socketIo} from '../utils/socket';

const chatBox = {
    backgroundColor: '#ffffff',
    height: '600px',
    borderRadius: '12px',
    overflow: 'auto',
    overflowX: 'hidden'
};

const chatTextInput = {position: 'absolute', bottom: '0px'};

class ChatRoom extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: '',
            message: '',
            users: []
        };
    }

    componentDidMount() {
        const chatId = this.props.match.params.id;
        this.props.getChatInfo(chatId);

        socketIo.socketConnect();

        this.props.authUser()
            .then(res => {
                socketIo.join({'name': res.payload.name, 'room': chatId, 'userId': res.payload.id})
            });

        socketIo.newMessage((message) => {
            this.setState({messages: [...this.state.messages, message] })
        });


        socketIo.updateUsrList((users)=>{
            const rooms = this.props.chat.chatRooms;
            this.props.setRoomUserList(users, rooms)
        });

        socketIo.disconnect();
    }


    componentWillUnmount() {
        this.props.clearChatInfo();
    }


    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    };

    handleOnClick = () => {
        if(this.state.message.trim().length)
        socketIo.createMessage(this.state.message);
        this.setState({message: ''})
    };

    handleMessages = () => (
        this.state.messages ? this.state.messages.map((msg,i)=>(
            <li key={i}>{msg.date} {msg.name}: {msg.text}</li>
        )) :  <Loader size='big' active />

    );

    handleGoBack = () => {
        socketIo.discon();
        this.props.history.push(`/dashboard`);
    };

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if(this.state.message.trim().length)
            socketIo.createMessage(this.state.message);
            this.setState({message: ''})
        }

    };


    render() {
        const {message, messages} = this.state;
        const {name} = this.props.chat.chatRoomInfo;

        return (
            <Dashboard room={this.props.match.params.id} userData={this.props.user.userData}>
                <Container style={{height: `${window.innerHeight}px`}}>
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column width={3}>
                                <Button onClick={() => this.handleGoBack()} color='green' size='large' icon={'arrow left'}  />
                            </Grid.Column>
                            <Grid.Column width={12}>
                                <h2 style={{textAlign: 'center', marginRight: '75px'}}>{name}</h2>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row style={chatBox}>
                            <ul style={{listStyleType: 'none'}}>
                                {
                                  this.handleMessages()
                                }
                            </ul>
                        </Grid.Row>
                        <Grid.Row style={chatTextInput} columns={2}>
                            <Grid.Column width={12}>
                                <Input
                                    fluid
                                    placeholder=' Text message'
                                    name='message'
                                    value={message}
                                    onChange={this.onChange}
                                    onKeyPress={this.handleKeyPress}
                                />
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Button onClick={this.handleOnClick} color='green' fluid size='large'>
                                    Submit
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Dashboard>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        chat: state.chat,
        user: state.user
    }
};


export default connect(mapStateToProps, {getChatInfo, clearChatInfo, authUser,setRoomUserList})(ChatRoom);
