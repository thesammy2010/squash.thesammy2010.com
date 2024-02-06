import React from "react";

interface Props {
    name?: string
    email?: string
    picture?: string
}
interface State {}

// TODO finish
export default class UserProfile extends React.Component<Props, State> {
    render(): React.ReactNode {
        return (
            <div>
                <img src={this.props.picture} alt="user" />
                <h3>User Logged in</h3>
                <p>Name: {this.props.name}</p>
                <p>Email: {this.props.email}</p>
            </div>
        )
    }
}
