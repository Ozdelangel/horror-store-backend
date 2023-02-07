import RestaurantsDAO from "../dao/restaurantsDAO.js";
// we need to import this file because we are going to be using a method from this file in the oncoming methods

export default class RestaurantsController{
    static async apiGetRestaurants(req, res, next) {
        // the main objective of this file is to build a query string to send to our routes page
        // what the restaurants per page constant is doing is we are setting it to equal what ever query is passed through the url
        // we check if its been passed then convert it to an integer and if not the default is 20 per page
        // this is whats called a ternary statement
        const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.restaurantsPerPage, 10) : 20
        // this basically doing the same thing but with the actual page
        // we are going to check if the page is in the query string
        // if so parse into an integer
        // the default is page 0
        const page = req.query.page ? parseInt(req.query.page,10) : 0
        
        // this is basically doing the same thing as above
        // we are checking what kind of filters the user wants and adjusting it accordingly
        let filters = {}
        if (req.query.cuisine) {
            filters.cuisine = req.query.cuisine
        } else if (req.query.zipcode) {
            filters.zipcode = req.query.zipcode
        }else if (req.query.name){
            filters.name = req.query.name
        }

        // what we are doing here is calling our getRestaurants method from our data access object
        // and passing filters page and restaurants per page and it should return restaurantsList and totalNumRestaurants
        const {restaurantsList, totalNumRestaurants} = await RestaurantsDAO.getRestaurants({
            filters,
            page,
            restaurantsPerPage,
        })
            // this is what we molded our response to be and we are returning it back as json
            
        let response = {
            restaurants: restaurantsList,
            page: page,
            filter: filters,
            entries_per_page: restaurantsPerPage,
            total_results: totalNumRestaurants,
        }

        res.json(response)
    }

    static async apiGetRestaurantById(req,res,next){
        try {
            // in this method we are looking for the ID parameter
            // a query is something that is after the question mark
            // a parameter is something that is actually in the URL after the slash
            // body is something that is after the request
            let id = req.params.id || {}
            let restaurant = await RestaurantsDAO.apiGetRestaurantById(id)
            if(!restaurant){
                res.status(404).json({ error: "Not Found"})
                return
            }
            res.json(restaurant)
        } catch(e) {
            console.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }

    static async apiGetRestaurantCuisines(req,res,next){
        try{
            let cuisines = await RestaurantsDAO.getCuisines()
            res.json(cuisines)
        }catch (e){
            console.log(`api ${e}`)
            res.status(500).json({error: e})
        }
    }
}