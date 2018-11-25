const router = require("express").Router();
const axios = require("axios");
// const jwt = require("jsonwebtoken");
const User = require("./Models/user");
const Destinations = require("./Models/destinations");
const { getPointsOfInterest, getAttractions, getLocationBasicInfo } = require("./helperFunctions");
const Media = require("./Models/media");
// const Tag = require("./Models/tag");
const Blog = require("./Models/blog");
// const BlogTag = require("./Models/blogtag");

const ec2path = "http://ec2-52-91-143-214.compute-1.amazonaws.com:3000";

// const {
//   log,
//   chalkSuccess,
//   chalkError,
//   chalkWarning,
//   chalkInfo
// } = require("../chalkpresets");

// LOCATION PROFILE ROUTES ===========================================================================

// call the helper function to query Google Places API for points of interest for given location
router.post("/getPointsOfInterest", (req, res) => {
  getPointsOfInterest(req.body.location, (err, data) => {
    if (err) {
      console.log("error getting points of interest from server", err);
    } else {
      res.send(data);
    }
  });
});

// call the helper function to query Atlas Obscura for attractions for given location
router.post("/getAttractions", (req, res) => {
  getAttractions(req.body.location, data => {
    res.send(data);
  });
});

// call the helper function to query REST Countries API for basic info for given location
router.post("/getLocationBasicInfo", (req, res) => {
  getLocationBasicInfo(req.body.location, data => {
    if (data) res.send(data);
  });
});

// retrieve number of Wanderers who have been to a given country
router.get("/getVisitedCount", (req, res) => {
  Destinations.getVisitedCount(req.query.location, visitedCount => {
    console.log("visitedCount: ", visitedCount);
    res.send(visitedCount.toString());
  });
});

// retrieve number of Wanderers who want to go to a given country
router.get("/getFaveCount", (req, res) => {
  Destinations.getFaveCount(req.query.location, faveCount => {
    console.log("faveCount: ", faveCount);
    res.send(faveCount.toString());
  });
});

// DESTINATIONS ROUTES ===========================================================================

router.get("/favorites", (req, res) => {
  Destinations.retrieveFavByUserId(req.query.userId, countries => {
    // console.log('favorite countries', countries)
    res.status(200).send(countries);
  });
});

router.get("/visited", (req, res) => {
  Destinations.retrieveVisitedByUserId(req.query.userId, countries => {
    // console.log('visited countries', countries)
    res.status(200).send(countries);
  }).catch(err => {
    console.error(err);
    res.status(404).send("Unable to retrieve visited destinations");
  });
});

router.post("/favorites", (req, res) => {
  console.log("2. hit server post route to fav:", req.body.country);
  Destinations.addFavByUserId(req.body.userId, req.body.country);
});

router.post("/visited", (req, res) => {
  console.log("2. hit server post route to visited:", req.body);
  Destinations.addVisitedByUserId(req.body.userId, req.body.country);
});

// FRIENDS ROUTES ===========================================================================

router.get("/friends", (req, res) => {
  // console.log('*******',req.query)
  User.retrieveFriendsByUserId(req.query.userId, friends => {
    // console.log("friends", friends)
    res.status(200).send(friends);
  }).catch(err => console.error(err));
});

// USER ROUTES ===========================================================================

router.get("/userInfo", async (req, res, next) => {
  console.log(req.params);
  try {
    const userInfo = await User.findByUserId(req.query.userId);
    res.status(200).send(userInfo);
  } catch (err) {
    console.error(err);
    res.status(404).send("Unable /#/to retrieve user info");
  }
});

router.get("/retrieve", (req, res) => {
  const userId = req.query.userId;
  User.retrieveProfilePhotoByUserId(userId, userInfo => {
    res.send(userInfo);
  });
});

// user auth placeholder
// expected inputs: authData = { email: whatever, password: whatever, returnSecureToken: true }
router.post("/signup", async (req, res, next) => {
  console.log(req.body);
  try {
    const newUser = await User.addNewUser(req.body);
  } catch (err) {
    console.error(err);
    res.status(404).send("Unable to create new user");
  }
});

// BLOGS ROUTES ===========================================================================

// addBlog
router.post("/blogs", async (req, res, next) => {
  console.log("req blogs", req.body);
  try {
    const newBlog = await Blog.addNewBlog(req.body.title, req.body.contents, req.body.userId);
    res.status(200).send(newBlog);
  } catch (err) {
    console.error(err);
    res.status(404).send("Unable to add new blog");
  }
});

// retrieveAllBlogs
router.get("/blogs", async (req, res, next) => {
  try {
    const blogs = await Blog.retrieveAllBlogs();
    res.status(200).send(blogs);
  } catch (err) {
    console.error(err);
    res.status(404).send("Unable to retrieve blogs");
  }
});

// retrieveBlogsByUserId
router.get("/blogsByLocation", async (req, res, next) => {
  console.log("blogsBylocation req query", req.query);
  try {
    const location_name = req.query.location;
    let country_id = null;

    if (location_name !== undefined) {
      country_id = await Destinations.getCountryIdByName(location_name);
    }

    console.log("country_id", country_id);
    const blogs = await Blog.retrieveBlogsByUserId(req.query.userId, country_id);
    res.status(200).send(blogs);
  } catch (err) {
    console.error(err);
    res.status(404).send("Unable to retrieve user's blogs");
  }
});

// Blog.retrieveBlogByBlogId
// used for looking up blogs and tags
router.get("/blogsByBlogId", async (req, res, next) => {
  try {
    const blog = Blog.retrieveBlogsByBlogId(req.query.blogId);
    res.status(200).send(blog);
  } catch (err) {
    console.error(err);
    res.status(404).send("Unable to retrieve blog");
  }
});

// TAGS ROUTES ===========================================================================

// Tag.addTag - add check for whether tag already exists
router.post("/tags", async (req, res, next) => {
  try {
    const newTag = await Tag.createNewTag(req.body.name);
    res.status(200).send(newTag);
  } catch (err) {
    console.error(err);
    res.status(404).send("Unable to create new tag");
  }
});

// get individual tag
// tag_id not yet implemented on front-end
router.get("/getTag", async (req, res, next) => {
  try {
    const tag = await Tag.findByTagId(req.query.tagId);
    res.status(200).send(tag);
  } catch (err) {
    console.error(err);
    res.status(404).send("Unable to locate tag");
  }
});

router.get("/tags", async (req, res, next) => {
  try {
    const tags = await Tag.retrieveAllTags();
    res.status(200).send(tags);
  } catch (err) {
    console.error(err);
    res.status(404).send("Unable to retrieve tags");
  }
});

// route for posting profile photo
router.post("/create", (req, res) => {
  const file = req.files.file;
  const userId = req.body.user_id;
  axios
    .post(`${ec2path}/create`, {
      file,
    })
    .then(imageinfo => {
      User.addProfilePhotoByUserId(imageinfo.data, userId).then(() => {
        res.sendStatus(200);
      });
    })
    .catch(err => {
      console.error(err);
    });
});

router.get("/mediaByUserId", async (req, res, next) => {
  try {
    const location_name = req.query.location;
    console.log("location_name", location_name);
    let country_id = null;

    if (location_name !== undefined) {
      country_id = await Destinations.getCountryIdByName(location_name);
    }
    const media = await Media.retrieveMediaByUserId(req.query.userId, country_id);
    res.status(200).send(media);
  } catch (err) {
    console.error(err);
    res.status(404).send("Unable to retrieve user's media files");
  }
});

// routes for posting travel photos
router.post("/createAlbum", async (req, res, next) => {
  const file = req.files.file;
  const userId = req.body.user_id;
  const location = req.body.location;

  // placeholder
  console.log("createalbum location", location);

  try {
    const country_id = await Destinations.getCountryIdByName(location);
    const imageinfo = await axios.post(`${ec2path}/createAlbum`, {
      file,
    });

    Media.addMediaByUserIdAndCountryId(userId, country_id[0].country_id, imageinfo.data);

    res.status(200).send(country_id);
  } catch (err) {
    console.error(err);
    res.status(404).send("Unable to retrieve user's media files");
  }
});

module.exports = router;
