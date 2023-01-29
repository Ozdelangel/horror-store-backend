import express from "express"
// we are going to make a controller file
// a controller file is what the route uses
import RestaurantsCtrl from "./restaurants.controller.js"


const router = express.Router()


router.route("/").get(RestaurantsCtrl/apiGetRestaurants)

export default router