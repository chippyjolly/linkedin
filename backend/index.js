const express = require("express")
const jwt = require("jsonwebtoken")
const cors=require('cors')

const app = express()

app.use(express.json())
app.use(cors())


const { UserModel, PostModel } = require("./models.js")
const { SignupInput, SigninInput, PostInput } = require("./types.js")
const { authmiddleware } = require("./middleware.js")

app.post("/signup", function (req, res) {

   const response = SignupInput.safeParse(req.body)

   if (!response.success) {
      return res.json({ message: "Invalid Input" })
   }

   const { username, email } = response.data

   UserModel.findOne({
      username: username,
      email: email
   })
      .then((user) => {
         if (user) {
            return res.json({ message: "User already exist" })
         }
         else {
            UserModel.create({
               username: username,
               email: email,
               followers: []
            })

            return res.json({ message: "Succesfully Signed Up" })
         }
      })
})


app.post("/signin", function (req, res) {
   const response = SigninInput.safeParse(req.body)
   if (!response.success) {
      return res.json({ message: "Invalid input" })
   }

   const { username, email } = response.data

   UserModel.findOne({
      username: username,
      email: email,

   })
      .then((user) => {
         if (!user) {
            return res.json({ message: "user not found" })
         }
         const token = jwt.sign({ username, email }, "123random")
         res.json({ message: "Succesfully Signed In", token })
      })

})

app.post("/create-post", authmiddleware, function (req, res) {
   const response = PostInput.safeParse(req.body)

   if (!response.success) {
      return res.json({ message: "Invalid input" })
   }

   const { title, content } = response.data

   let username = req.username
   let email = req.email

   UserModel.findOne({
      username: username,
      email: email

   })
      .then((user) => {
         if (user) {
            PostModel.create({
               title: title,
               content: content,
               user_id: user._id

            })
            return res.json({ message: "succesfully created" })
         }
         else {
            res.json({ message: "Invalid user" })
         }
      })

})

app.get("/all-post", function (req, res) {
   PostModel.find({}).sort({ createdAt: -1 }).then((posts) => {
      return res.json(posts)
   })

})

app.get("/get-Otherusers", authmiddleware, function (req, res) {
   let username = req.username
   let email = req.email

   UserModel.findOne({
      username,
      email
   })
      .then((user) => {
         let user_id = user._id
         UserModel.find({
            _id: { $ne: user_id }
         })
            .then((other) => {
               res.send(other)
            })
      })
})

app.post("/followers/:id/:username", authmiddleware, function (req, res) {
   let his_id = req.params.id
   let his_name = req.params.username

   let username = req.username
   let email = req.email
   UserModel.findOne({
      username: username,
      email: email
   })
      .then((user) => {
         friends = user.followers
         const exists = friends.some(friend => friend.username == his_name && friend._id == his_id)
         if (exists) {
            return res.json({ message: "Already following" })
         }
         friends.push({ _id: his_id, username: his_name })
         user.save()
         return res.send({ message: "One follower added" })

      })

})

app.get("/followers-posts", authmiddleware, function (req, res) {
   let username = req.username
   let email = req.email
   UserModel.findOne({
      username,
      email
   })
      .then((user) => {
         const followersid = user.followers.map(f => f._id)

         const postQueries = followersid.map(followerId => {
            return PostModel.find({ user_id: followerId })
         })

         return Promise.all(postQueries)

      })
      .then((postsArray) => {
         const allPost = postsArray
         res.send(allPost)

      })

})


app.get("/postslike/:id/:title", authmiddleware, function (req, res) {
   let post_id = req.params.id
   let post_title = req.params.title

   let username = req.username
   let email = req.email
   UserModel.findOne({
      username,
      email
   })
      .then((user) => {
         let exists = user.likes.some((f => f.post_id == post_id && f.post_title == post_title))
         if (exists) {
            return res.send({ message: "Already liked" })

         }
         user.likes.push({ post_id: post_id, post_title: post_title })
         user.save()
         return res.json({ message: "Liked the post" })
      })


})


app.get("/postsDislike/:id/:title", authmiddleware, function (req, res) {
   let post_id = req.params.id
   let post_title = req.params.title

   let username = req.username
   let email = req.email
   UserModel.findOne({
      username,
      email
   })
      .then((user) => {
         let exists = user.dislikes.some((f => f.post_id == post_id && f.post_title == post_title))
         if (exists) {
            return res.send({ message: "Already Disliked" })

         }
         user.dislikes.push({ post_id: post_id, post_title: post_title })
         user.save()
         return res.json({ message: "DisLiked the post" })
      })


})



app.listen(3000, () => {
   console.log("Server is running")
})























