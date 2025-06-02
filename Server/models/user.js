const {Schema,model} = require("mongoose")
const bcrypt = require('bcrypt');
const { createTokenForUser } = require("../services/authentication");


const userSchema = new Schema({
    fullName :{
        type: String,
        required: true
    },
    email :{
        type: String,
        required: true,
        unique: true
    },
    password :{
        type: String,
        required: true
    },
    profileImageURL:{
        type:String,
        default:"/images/default.png"

    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:"USER"
    }
},{timestamps:true})





userSchema.pre('save', async function (next) {
  console.log('Hashing middleware running'); 
  const user = this;

  if (!user.isModified('password')) return next();

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword;
    next(); 
  } catch (err) {
    next(err); 
  }
});

userSchema.static("matchPasswordAndGenerateToken",async function(email,password){
  const user = await this.findOne({email});
  if(!user) throw new Error('User not found')

  const isCorrect = await bcrypt.compare(password,user.password)

  if(!isCorrect) throw new Error('Invalid Password')

    const token = createTokenForUser(user)
    return token
})

const User = model("user",userSchema);


module.exports=User

