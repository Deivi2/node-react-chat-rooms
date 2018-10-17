import React, {Component} from "react";
import {Button, Form, Grid, Header, Message, Segment, Container} from 'semantic-ui-react'

import {connect} from 'react-redux'
import {loginUser, authUser} from "../actions/userAction";


class Login extends Component {
    state = {
        email: "",
        password: ""
    };



    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    };

    handleFormSubmit = (ev) => {
        ev.preventDefault();

        this.props.loginUser({email: this.state.email, password: this.state.password})
            .then(res => {
                if(res.payload.success){
                    this.props.history.push('/dashboard');
                }
            })
    };



    render() {

        let {email, password} = this.state;

        return (
            <Container>
                <Grid.Row>
                    <Grid textAlign='center'>
                        <Grid.Column style={{maxWidth: 450}}>
                            <Header as='h2' textAlign='center'>
                                GLAD CHAT
                            </Header>
                            <Form size='large' onSubmit={this.handleFormSubmit}>
                                <Segment stacked>
                                    <Form.Input
                                        fluid icon='user'
                                        iconPosition='left'
                                        placeholder='E-mail address'
                                        name='email'
                                        value={email}
                                        onChange={this.onChange}
                                    />
                                    <Form.Input
                                        fluid
                                        icon='lock'
                                        iconPosition='left'
                                        placeholder='Password'
                                        type='password'
                                        name='password'
                                        value={password}
                                        onChange={this.onChange}
                                    />

                                    <Button color='blue' fluid size='large'>
                                        Login
                                    </Button>
                                </Segment>
                            </Form>
                            <Message>
                                <a href='#'>Sign Up</a>
                            </Message>
                        </Grid.Column>
                    </Grid>
                </Grid.Row>
            </Container>
        )
    }
}



export default connect(null, {loginUser})(Login)
