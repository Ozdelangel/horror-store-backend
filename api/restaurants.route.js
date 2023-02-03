import express from "express"
// we are going to make a controller file
// a controller file is what the route uses
// what this file basically does is where we control the options of what the user can do
import RestaurantsController from "./restaurants.controller.js"
import ReviewsController from "./reviews.controller.js"


const router = express.Router()

// with this we made so our users can do a simple get request
// in restaurants.controller is where we make our query strings
// in the DAO we made what kind of data they can get back

router.route("/").get(RestaurantsController.apiGetRestaurants)


// here is where we are going to give them access to be able to do all CRUD actions

router
// this is what is going to be in the URL
// e.x. /api/v1/restaurants/review
.route("/review")
// create a review
.post(Reviews.Ctrl.apiPostReview)
// edit review
.put(ReviewCtrl.apiUpdateReview)
// delete review all together
.delete(ReviewsCtrl.apiDeleteReview)
// create and import all methods.
export default router