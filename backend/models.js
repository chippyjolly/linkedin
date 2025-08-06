const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://chippy:chippy2004@cluster0.3s1oozc.mongodb.net/linkedin")

const UserSchema = new mongoose.Schema({
    username:String,
    email:String,
    followers:[{user_id:String,username:String}],
    likes:[{post_id:String, post_title: String}],
    dislikes:[{post_id:String, post_title:String}]
})

const PostSchema = new mongoose.Schema({
    title:String,
    content:String,
    user_id:String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports ={
    UserModel: mongoose.model('users',UserSchema),
    PostModel: mongoose.model('posts',PostSchema)
}