import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId
// here we are converting a string to mongodb object ID

let reviews


export default class ReviewsDAO {
    static async injectDB(conn){
        if (reviews){
            return
        }

        try {
            reviews = await conn.db(process.env.RESTREVIES_NS).collection("reviews")
        } catch(e){
            console.error(`Unable to establish collection handles in userDAO: ${e} `)
        }
    }

    static async addReview(restaurantId, user, review, date) {
        try {
            const reviewDoc ={
                name: user._id,
                date: date,
                text: review,
                restaurant_id: ObjectId(restaurantId)
         
            }
            return await reviews.insertOne(reviewDoc)
        } catch(e){
            console.error(`unable to post review ${e}`)
            return { error: e }
        }

    }
}