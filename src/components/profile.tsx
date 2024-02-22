import axios from "axios";
import { useState, useEffect} from "react";
import { EditText, onSaveProps } from "react-edit-text";
import { timedWait, timeout } from "../utils";
// import "./profile.css";

interface ProfileRef {
  id: string;
  name: string;
  profile_picture: string;
  created_at: string;
  updated_at: string;
}

const empty: ProfileRef = {
  id: "",
  name: "",
  profile_picture: "",
  created_at: "",
  updated_at: "",
};

interface EditReq {
    profile_picture?: string
    name?: string
}

interface SaveRef {
    name: string, 
    value: string,
    previousValue: string 
}


const Profile = () => {
  const [userId, setUserId] = useState<string | null>(() => {
    return localStorage.getItem("userData_id");
  });
  const [userProfile, setUserProfile] = useState<ProfileRef>(empty);
  const [userData, setUserData] = useState<any>(() => {
    const saved = localStorage.getItem("userData");
    let initialValue = {};
    if (saved) {
      initialValue = JSON.parse(saved);
    }
    return initialValue;
  });
  const [loadProfileFailed, setLoadProfileFailed] = useState<boolean>(false);
  const [loadProfileError, setLoadProfileError] = useState<string>("");
  const [seed, setSeed] = useState<number>(1);
  const reset = () => {
       setSeed(Math.random());
   }

   const [editedReq, setEditedReq] = useState<EditReq>({name: userProfile.name, profile_picture: userProfile.profile_picture});
   const [reloading, setReloading] = useState<boolean>(false)

  useEffect(() => {
    axios
      .get(`/v1/squash/players/${userId}`, { params: { method: "1" } })
      .then((res) => {
        setUserProfile(res.data.squash_player);
        setLoadProfileFailed(false);
        setLoadProfileError("");
      })
      .catch((err) => {
        setLoadProfileFailed(true);
        setLoadProfileError(String(err));
      });
  }, [userData, seed, userId]);

  const updatePlayer = () => {
    let payload: any = {}
    for (const [key, value] of Object.entries(editedReq)) {
        if (!!value) {
            payload[key] = value
        }
    }
    if (editedReq.name !== userProfile.name || editedReq.profile_picture !== userProfile.profile_picture) {
        axios.patch(`/v1/squash/players/${userId}`,  {...payload }).then(
            (res) => {
                setUserProfile(res.data.squash_player);
                setLoadProfileFailed(false);
                setLoadProfileError("");
            }
        ).catch((err) => {
            setLoadProfileFailed(true);
            setLoadProfileError(String(err));
        })
    }
  }

  const handleSave = (column: string, save: onSaveProps) => {
    console.log(save.name, save.previousValue, save.value,)
    console.log(JSON.stringify(save))
    if (save.value) {
        switch(column) {
            case "name": {
                setEditedReq({...editedReq, "name": save.value})
                break
            }
            case "profile_picture": {
                setEditedReq({...editedReq, "profile_picture": save.value})
                break
            }
        }
    }
  }

  return (
    <div>
      <div>
        <h4>Logged In</h4>
        {userProfile && userProfile.id ? (
          <div>
            <div>
              <img src={userProfile.profile_picture} alt="profile"></img>
            </div>
            <div>
              <p>Tap or click a field value to edit it</p>
            </div>
            <div>
              <table>
                <tr>
                  <th>
                    <strong>
                      <label className="mr-2">
                        Player ID: <small>(read-only)</small>
                      </label>
                    </strong>
                  </th>
                  <th>
                    <EditText
                      className="Row"
                      defaultValue={userProfile.id}
                      readonly
                    />
                  </th>
                </tr>
                <tr>
                  <th>
                    <strong>
                      <label className="mr-2">Player username: </label>
                    </strong>
                  </th>
                  <th>
                    <EditText
                      className="column"
                      defaultValue={userProfile.name}
                      style={{ border: "1px solid #999" }}
                      onSave={(p) => {handleSave("name", p)}}
                    />
                  </th>
                </tr>
                <tr>
                    <th>
                        <strong>
                        <label className="mr-2">Created At: </label>
                        </strong>
                    </th>
                    <th>
                        <EditText
                        className="column"
                        defaultValue={userProfile.created_at}
                        />
                    </th>
                </tr>
                <tr>
                    <th>
                        <strong>
                        <label className="mr-2">Updated At: </label>
                        </strong>
                    </th>
                    <th>
                        <EditText
                        className="column"
                        defaultValue={userProfile.updated_at}
                        />
                    </th>
                </tr>
              </table>
            </div>
            <div>
                <button disabled={reloading} onClick={async (e) => {
                    e.preventDefault()
                    setReloading(true)
                    await timedWait()
                    updatePlayer()
                    setReloading(false)
                }}>Update</button>
                <button disabled={reloading} onClick={async (e) => {
                    e.preventDefault()
                    setReloading(true)
                    setUserProfile(empty)
                    setLoadProfileFailed(false)
                    setLoadProfileError("")
                    await timedWait()
                    reset()
                    setReloading(false)
                    }}>Reload</button>
            </div>
          </div>
        ) : (
          <></>
        )}
        {userProfile && !loadProfileError && !userProfile.id ? (
          <div>
            <h6>UI Error loading profile</h6>
          </div>
        ) : (
          <></>
        )}
        {loadProfileFailed ? (
          <div>
            <br />
            <h3>Failed to load profile</h3>
            <br />
            <code>{loadProfileError}</code>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Profile;
