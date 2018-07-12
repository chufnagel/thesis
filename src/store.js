import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import rootReducer from "./reducers";
// import CountriesAll from "./components/LocationProfile/CountriesAll";
// import photos from "../example data/pictures-of-japan";
import { HOME } from "./constants";

/*eslint-disable */
const composeEnhancers = process.env.NODE_ENV !== 'production' && typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose
/* eslint-enable */

const store = createStore(
  rootReducer,
  {
    // currentText: "Initializing...",
    headerSetting: HOME,
    // countries: CountriesAll,
    location: "",
    friends: [],
    blogs: [
      {
        blogId: 1,
        title: "WELCOME TO NIHON",
        content: "I went to sky stree",
        timestamp: "2018-06-30 19:46:49",
        userId: 1
      },
      {
        blogId: 2,
        title: "I just came back from Germany",
        author: "BROICHI",
        content: "I went to see the soccer game",
        timestamp: "2018-06-30 19:46:49",
        userId: 1
      }
    ],
    // photos,
    friendInfo: [
      {
        bio: "I am a former data scientist",
        email: "charlie@gmail.com",
        etag: null,
        image_key: null,
        name: "Sakafunagel",
        password: "hydrate",
        user_id: 2,
        username: "DoctorC",
        version_id: null
      }
    ],
    userInfo: [
      {
        bio: "I am a placeholder bio",
        email: "s.koichi@gmail.com",
        etag: null,
        image_key: null,
        name: "Broichi Slope-Roll",
        password: "gangbusters",
        user_id: 1,
        username: "BROICHI",
        version_id: null
      }
    ],
    pointsOfInterest: [],
    attractions: [],
    locationBasicInfo: {
      languages: [{ name: "" }],
      currencies: [{ name: "" }]
    },
    userId: 1,
    profilePhoto: "",
    albumPhotos: [],
    faveDestinations: [],
    visitedDestinations: [],
    photoOne: null,
    faveCount: 0,
    visitedCount: 0,
    friendsId: [2, 3, 4] // placeholder for photo component to render properly
  },
  composeEnhancers(applyMiddleware(thunk, logger))
);

export default store;
