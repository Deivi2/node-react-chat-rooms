import React, {Fragment, Component} from 'react';
import { Card, Button } from 'semantic-ui-react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux';
import Dashboard from '../hoc/Dashboard'

class ChatFeed extends Component {

    handleRooms = () => (
            <Card.Group>
                {
                    this.props.chat.chatRooms.map((room) => (
                        <Card
                            key={room._id}
                            fluid
                            color='green'
                            header={room.name}
                            onClick={() => this.props.history.push(`/chatRoom/${room._id}`)}
                        />
                    ))
                }
            </Card.Group>
    );

    render() {
        return (
            <Dashboard>
                    {this.handleRooms()}
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


export default withRouter(connect(mapStateToProps)(ChatFeed));
