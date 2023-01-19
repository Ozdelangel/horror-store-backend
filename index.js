import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"

// configure .env
dotenv.config()
//get access to our mongo client from mongodb 
const MongoClient = mongodb.MongoClient

// configure the port
const port = process.env.PORT 
