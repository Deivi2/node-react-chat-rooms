import React ,{Component} from 'react';
import {connect} from 'react-redux';
import {authUser} from "../actions/userAction";


export default function (ComponentClass, reload) {

    class AuthenticationCheck extends Component {

        componentDidMount(){
            if(reload){
                this.props.authUser().then(res => {

                    let user = this.props.user.userData;

                    if(!user.online){
                            this.props.history.push('/')
                    }
                })
            }
        }

        render() {
            return (
                    <ComponentClass {...this.props} user={this.props.user}/>
            );
        }
    }

    function mapStateToProps(state){
        return {
            user: state.user
        }
    }

    return connect(mapStateToProps, {authUser})(AuthenticationCheck)
}