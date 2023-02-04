// first we have to import the reviews DAO. this gives the user options on what they can do
import ReviewsDAO from "./dao/reviewsDAO.js"

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
            const ReviewResponse = await ReviewsDAO.addReview(
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

    static async apiUpdateReview(req, res, next){
        try {
            const reviewId = req.body.review_id
            const text = req.body.text
            const date = new Date()

            const reviewResponse = await ReviewsDAO.updateReview(
                reviewId,
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

        } catch (e){
            // if it is not a success we send a status of 500 and the message.
            res.status(500).json({error: e.message})
        }

    }

    static async apiDeleteReview(req,res,next){
        try{
            const reviewId =
        }
    }
}