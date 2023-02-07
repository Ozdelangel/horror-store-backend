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
// gets all restaurants
router.route("/").get(RestaurantsController.apiGetRestaurants)
// returns a list of restaurants by ID
// and all reviews
router.route("/id/:id").get(RestaurantsController.apiGetRestaurantById)
// this will return a list of all cuisines
// on the front end we want to make a drop down of all cuisines
router.route("/cuisines").get(RestaurantsController.apiGetRestaurantCuisines)


// here is where we are going to give them access to be able to do all CRUD actions

router
// this is what is going to be in the URL
// e.x. /api/v1/restaurants/review
.route("/review")
// create a review
.post(ReviewsController.apiPostReview)
// edit review
.put(ReviewsController.apiUpdateReview)
// delete review all together
.delete(ReviewsController.apiDeleteReview)
// create and import all methods.
export default router