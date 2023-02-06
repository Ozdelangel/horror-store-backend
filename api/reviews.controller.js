// first we have to import the reviews DAO. this gives the user options on what they can do
import ReviewsDAO from "../dao/reviewsDAO.js"
import bson from "bson"

const ObjectId = bson.ObjectId

export default class ReviewsController {
    static async apiPostReview(req, res, next){
        try {
            // instead of using a query parameter we are going to be using the body
            // we are also going to be sending information through the body
            const restaurantId = req.body.restaurant_id
            const review = req.body.text
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id
            }
            
            const  date = new Date()
            // this is what we are going to be sending to the database
            const reviewResponse = await ReviewsDAO.addReview(
                restaurantId,
                userInfo,
                review,
                date,
            )
            // if it is a success 
            res.json({status: "success"}) 
        } catch (e){
            // if it is not a success we send a status of 500 and the message.
            res.status(500).json({error: e.message})
        }
    }
    // for update we are doing something a similar to post
    static async apiUpdateReview(req, res, next){
        try {
            // what we need from thr body is the review id
            const reviewId = req.body.review_id
            // the text that was entered 
            const text = req.body.text
            // then we are automatically set a new date
            const date = new Date()

            // then we are going to send this to the database
            const reviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                // the userID is going to check if its the same user that made the original post
                // since update is about letting the client update a post and make changes to it if they wanted to
                req.body.user_id,
                text,
                date,
            )
            
            var {error} = reviewResponse
            if (error) {
                res.status(400).json({error})
            }

            if (reviewResponse.modifiedCount === 0) {
                throw new Error(
                    "unable to update review - user may not be original poster"
                )
            }

            res.json({status: "success"})

        } catch (e){
            // if it is not a success we send a status of 500 and the message.
            res.status(500).json({error: e.message})
        }

    }

    static async apiDeleteReview(req,res,next){
        try{
            // instead of getting information from the body we are going to want to get whatever is the id in the query paramater
            const reviewId =  req.query.id
            const userId = req.body.user_id
            console.log(reviewId)
            const reviewResponse = await ReviewsDAO.deleteReview(
                reviewId,
                userId,
            )
            res.json({status: "success"})
        } catch(e){
            res.status(500).json({error:e.message})
        }
            
        
    }
}