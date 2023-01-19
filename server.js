import express from "express"
import cors from "cors"
import restaurant from "./api/restaurants.route.js"

const app = express()
// we tell express what to use
app.use(cors())
app.use(express.json())
// give express an initial route
// and an error message if the user goes somewhere else
app.use("/api/v1/restaurant", restaurant)
app.use("*", (req, res) => res.status(404).json({error: "not found"}))

// export app as a module
// then import to file that runs the database

export default app