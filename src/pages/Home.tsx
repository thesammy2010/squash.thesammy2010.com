import { useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { timedWait } from "../utils";
import Profile from "../components/profile";

import "./Home.css";
import axios from "axios";

const updateHeaders = (token: string) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

const HomePage = () => {
  const [loggedIntoGoogle, setLoggedIntoGoogle] = useState<boolean>(false);
  const [loginToGoogleFailed, setLoginToGoogleFailed] =
    useState<boolean>(false);
  const [loggedIntoBackend, setLoggedIntoBackend] = useState<boolean>(false);
  const [loggedIntoBackendFailed, setLoggedIntoBackendFailed] =
    useState<boolean>(false);
  const [backendLoginError, setBackendLoginError] = useState<string>("");
  const [retryCount, setRetryCount] = useState<number>(0);

  const logOutOfGoogle = () => {
    googleLogout();
    setLoggedIntoGoogle(false);
    setLoggedIntoBackend(false);
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("userData_id");
    localStorage.removeItem("userData_roles");
  };

  const logIntoBackend = () => {
    axios
      .put("/v1/squash/login")
      .then((res) => {
        if (res) {
          setLoggedIntoBackend(true);
          setBackendLoginError("");
          setLoggedIntoBackendFailed(false);
          localStorage.setItem("userData_id", res.data.id);
          localStorage.setItem(
            "userData_roles",
            JSON.stringify(res.data.roles)
          );
        }
      })
      .catch((reason) => {
        setLoggedIntoBackendFailed(true);
        setBackendLoginError(String(reason));
      });
  };

  const logoutGoogleButton = (
    <button onClick={logOutOfGoogle}>Google Logout</button>
  );

  return (
    <div className="page">
      <h1>How2Squash</h1>
      <h4>This page is currently a work in progress</h4>
      {!loggedIntoGoogle ? (
        <div>
          <h6>Continue with Google to proceed</h6>

          <div className="signInButton">
            <GoogleLogin
              text="continue_with"
              onSuccess={(credentialResponse) => {
                if (credentialResponse.credential) {
                  setLoggedIntoGoogle(true);
                  updateHeaders(credentialResponse.credential);
                  logIntoBackend();
                }
              }}
              onError={() => {
                console.log("Login Failed");
                setLoginToGoogleFailed(true);
              }}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
      {loginToGoogleFailed ? (
        <div>
          <h6>
            Something went wrong logging in with Google. Please contact the
            developer
          </h6>
          {logoutGoogleButton}
        </div>
      ) : (
        <></>
      )}
      {loggedIntoBackendFailed ? (
        <div>
          <h6>Error logging into How2Squash backend. Contact the developer</h6>
          <code>{backendLoginError}</code>
          <div>
            <button
              onClick={async () => {
                setRetryCount(retryCount + 1);
                setBackendLoginError("");
                setLoggedIntoBackend(false);
                await timedWait();
                logIntoBackend();
              }}
              disabled={retryCount > 3}
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
      {loggedIntoBackend ? (
        <div>
          <Profile />
          {logoutGoogleButton}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default HomePage;
