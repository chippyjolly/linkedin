const zod = require("zod")

const SignupInput = zod.object({
    username:zod.string().min(4).max(20),
    email:zod.string().min(4).max(20)

})

const SigninInput = zod.object({
    username:zod.string().min(4).max(20),
    email:zod.string().min(4).max(20)
})

const PostInput = zod.object({
    title:zod.string(),
    content:zod.string()
    
})

module.exports = {
    SignupInput,
    SigninInput,
    PostInput
}
