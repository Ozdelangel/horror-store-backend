import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

// this file is called the data access object
// its where we are going to give the users the reference to our database and mold what kind of data the get back

// this is where we are going to store a reference to our database
let restaurants

export default class RestaurantsDAO {
    // this is how we initially connect to our database
    // call this method as soon as our server starts
    // this gets a reference to our restaurants database
    static async injectDB(conn){
        if (restaurants) {
            return
        }
        // if there is nothing there we are telling our program to fill it with this reference to our database
        try {
            restaurants = await conn.db(process.env.RESTREVIES_NS).collection("restaurants")
        }
        // if we are sucessfully able to get it great if not we need to send an error message
        catch (e) {
            console.error(`Unable to establish connection ${e}`)
        }
    }


    // this method is what we are going to call when we want to get a list of all the restaurants in the database

    static async getRestaurants({
        //  options we made up  for this method
        // whatever you want the user to have to use
        filters = null,
        page = 0,
        restaurantsPerPage = 20,
    } = {}) {
        // the query will stay empty unless the user has used any of the filters
        // basically saying to the user here is the options but to use them this variable must be filled
        let query 
        if(filters) {
            if ("name" in filters){
                query = {$text: {$search: filters["name"]}}
            } else if ("cuisine" in filters) {
                query = {"cuisine": {$eq: filters["cuisine"]}}
            } else if ("zipcode" in filters) {
                query = { "address.zipcode": { $eq: filters["zipcode"]}}
            }
        }
        let cursor

        try {
            // this is going to find all restaurants in the database with the query we pass in 
            cursor = await restaurants.find(query)
        }
        catch (e) {
            // if there is an error this will return an empty list
            // what these try catches do is they basically is a choose you own adventure story if there is a success this is what were going to give you
            // if it isn't a success we need to know about it and we need to do something to let the user know this didn't work try again
            console.error(`unable to find command ${e}`)
            return { restaurantsList: [], totalNumRestaurants: 0 }
        }
        // so if there is a succesful query to the data base this is going to limit the results that the user gets back to what we set it to above and it will skip to the specific page we are on
        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)

        try {
            // what this does is its going to convert the restaurants to and array and return
            const restaurantsList = await displayCursor.toArray()
            const totalNumRestaurants = await restaurants.countDocuments(query)
            return { restaurantsList, totalNumRestaurants}
        } catch(e){
            console.error(`unable to convert cursor to array ${e}`)
            return {restaurantsList: [], totalNumRestaurants: 0}
        }
    }
    // after this part of the process is complete we want to be able to access these methods in other files


// we are creating a pipeline
// this helps maps different collection
// this one we are matching a certain ID to a restaurant
// it also is going to add the reviews
    static async getRestaurantById(id) {
        try {
          const pipeline = [
            {
                $match: {
                    _id: new ObjectId(id),
                },
            },
                  {
                      $lookup: {
                          from: "reviews",
                          let: {
                              id: "$_id",
                          },
                          pipeline: [
                              {
                                  $match: {
                                      $expr: {
                                          $eq: ["$restaurant_id", "$$id"],
                                      },
                                  },
                              },
                              {
                                  $sort: {
                                      date: -1,
                                  },
                              },
                          ],
                          as: "reviews",
                      },
                  },
                  {
                      $addFields: {
                          reviews: "$reviews",
                      },
                  },
              ]
            //   this part returns the two collections together
            // resources: https://www.mongodb.com/docs/manual/reference/operator/
            // this will help me make another pipeline in the future
          return await restaurants.aggregate(pipeline).next()
        } catch (e) {
          console.error(`Something went wrong in getRestaurantByID: ${e}`)
          throw e
        }
      }
    
      static async getCuisines() {
        let cuisines = []
        try {
          cuisines = await restaurants.distinct("cuisine")
          return cuisines
        } catch (e) {
          console.error(`Unable to get cuisines, ${e}`)
          return cuisines
        }
      }
    }  



