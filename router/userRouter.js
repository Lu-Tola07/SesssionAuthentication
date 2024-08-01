const router = require("express").Router();
const passport = require("passport");
const { createUser, homePage,
    logIn, logOut,
    signGoogle, redirectGoogle, 
    successGoogleRedirect} = require("../controller/userController");

router.post("/User", createUser);
router.post("/Login", logIn);
router.post("/LogOut", logOut);

router.get("/", homePage);
router.get("/signUpGoogle", signGoogle);
router.get("/google/callback", redirectGoogle);
router.get("/auth/google/success", successGoogleRedirect);

module.exports = router;