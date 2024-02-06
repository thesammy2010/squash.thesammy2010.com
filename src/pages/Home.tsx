import { useEffect, useState } from "react";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios'
// import UserProfile from "../components/profile";

const HomePage = () => {
	const [user, setUser] = useState<any>([]);
	const [profile, setProfile] = useState<any>();
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [loginFailed, setLoginFailed] = useState<boolean>(false);
    const [buttonClicked, setButtonClicked] = useState<boolean>(false);

    const logIn = useGoogleLogin({
        onSuccess: codeResponse => {
            console.log("Successfully logged in")
            setUser(codeResponse)
            setLoggedIn(true)
        },
        onError: (error) => {
            console.log('Login Failed:', error)
            setLoginFailed(true)
        },
    })
    
    useEffect(() => {
        if (user.access_token) {
            axios
            .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                headers: {
                    Authorization: `Bearer ${user.access_token}`,
                    Accept: 'application/json'
                }
            })
            .then(res => {
                setProfile(res.data)
            })
            .catch(err => {
                console.log(err)
                setLoginFailed(true)
            });
        }
    }, [user]);

    const logOut = () => {
		googleLogout();
		setProfile(null);
	};

    return (
<div>
			<h1>How2Squash</h1>
            <h6>This page is currently a work in progress</h6>
			<br />
			<br />
			{profile ? (
				<div>
					<img src={profile.picture} alt="user" />
					<h3>User Logged in</h3>
					<p>Name: {profile.name}</p>
					<p>Email Address: {profile.email}</p>
					<br />
					<br />
					<button onClick={logOut}>Log out</button>
				</div>
			) : (
				<button onClick={() => {setButtonClicked(true); logIn()}}>Sign in with Google 🚀 </button>
			)}
		</div>
    )
}

export default HomePage
