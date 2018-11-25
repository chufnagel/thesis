import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { encode } from "punycode";

const handleUploadFile = (event, userId, updateProfilePhoto) => {
  const data = new FormData();
  data.append("file", event.target.files[0]);
  data.append("user_id", userId);
  // '/files' is your node.js route that triggers our middleware
  axios.post("/create", data).then(() => {
    // in the app, need to save response.ETag and Key to the user database
    axios
      .get("/retrieve", {
        params: {
          userId,
        },
      })
      .then(photo => {
        updateProfilePhoto(photo.data[0].image_url);
      });
  });
};

const ProfilePhoto = ({ userId, updateProfilePhoto, profilePhoto }) => {
  // console.log("profile photo", profilePhoto);
  return (
    <div>
      <img src={profilePhoto} alt="img" width="128px" height="128px" />
      <br />
      <input
        type="file"
        id="files"
        className="hidden"
        onChange={e => handleUploadFile(e, userId, updateProfilePhoto)}
      />
    </div>
  );
};

ProfilePhoto.propTypes = {
  // photos: PropTypes.arrayOf(PropTypes.object)
  userId: PropTypes.number.isRequired,
  updateProfilePhoto: PropTypes.func.isRequired,
  profilePhoto: PropTypes.string.isRequired,
};

export default ProfilePhoto;
