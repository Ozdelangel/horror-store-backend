import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import RestaurantsDAO from "./dao/restaurantsDAO.js"
import ReviewsDAO from "./dao/reviewsDAO.js"

// configure .env
dotenv.config()
//get access to our mongo client from mongodb 
const MongoClient = mongodb.MongoClient

// configure the port
const port = process.env.PORT || 8000

// connect to the database
MongoClient.connect(
    process.env.RESTREVIEWS_DB_URI,

    {
        maxPoolSize: 50,
        wtimeoutMS:2500,
        useNewUrlParser: true}
    
)
// catch any errors
.catch( err => {
    // log the error
    console.error(err.stack)
    // exit the process
    process.exit(1)
})
// now we can do something
.then(async client => {
    // this is where we are going to give the references to the other files
    await RestaurantsDAO.injectDB(client)
    await ReviewsDAO.injectDB(client)
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    })
})