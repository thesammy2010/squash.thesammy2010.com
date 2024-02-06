import { useEffect, useRef, useState } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import axios from 'axios';
import {decodeJwt} from 'jose';
import UserProfile from "../components/profile";

import './Home.css'

const decodeUserDate = (data: string | undefined): any => {
    if (data) {
        const resp: any = decodeJwt(data)
        if (resp) {
            return resp
        }
    }
    return {}
}

const HomePage = () => {
	const [profile, setProfile] = useState<any>();
	const [loggedIn, setLoggedIn] = useState<boolean>(false);
	const [loginFailed, setLoginFailed] = useState<boolean>(false);
	const [buttonClicked, setButtonClicked] = useState<boolean>(false);

	const logOut = () => {
		googleLogout();
		setProfile(null);
	};

	return (
        <div id="login" className="header">
            <h1>How2Squash</h1>
            <h4>This page is currently a work in progress</h4>
			<br />
			<br />
            <GoogleLogin
                logo_alignment="center"
                text="continue_with"
                onSuccess={credentialResponse => {
                    setButtonClicked(true)
                    setLoggedIn(true)
                    setProfile(decodeUserDate(credentialResponse.credential))
                }}
                onError={() => {
                    console.log('Login Failed');
                    setButtonClicked(true)
                    setLoginFailed(true)
                }}
            />
            <br />
            {
                profile ? (
                    <div>
                        <UserProfile name={profile.name} email={profile.email} picture={profile.picture}/>
                        <button onClick={logOut}>Log out</button>
                    </div>
                ) : (
                    <div>
                        <h3>User is not currently logged in</h3>
                    </div>
                )
            }
            {
                loginFailed ? (
                    <div>
                        <h3>Something went wrong logging the user in. Please contact the developer</h3>
                    </div>
                ) : <></>
            }
            <br />
        </div>

	);
};

export default HomePage;

