// // This model is for the user while login/signup for authentication process.

// import mongoose, { Schema } from "mongoose"
// import jwt from "jsonwebtoken"
// import bcrypt from "bcrypt"

// const userSchema = new Schema(
//   {
//     username: {
//       type: String,
//       required: [true, "Username is required"],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       index: true
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       match: [/.+@.+\..+/, "Please enter a valid email address"]
//     },
//     fullName: {
//       type: String,
//       required: [true, "Fullname is needed"],
//       trim: true,
//       index: true
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: [8, "Password must be at least 8 characters"],
//       validate: {
//         validator: function (v) {
//           // At least one letter, one number, one special character
//           return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/.test(v)
//         },
//         message: "Password must contain a letter, a number, and a special character"
//       }
//     },
//     refreshToken: {
//       type: String,
//       default: null
//     }
//   },
//   { timestamps: true }
// )

// // logic to encrypt the password while storing in database
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next()
//   }
//   this.password = await bcrypt.hash(this.password, 10) // 10 is the number of rounds it hashes the password
//   next()
// })

// // method to compare the encrypted password stored in database and the password entered by user
// userSchema.methods.isPasswordCorrect = async function (password) {
//   return await bcrypt.compare(password, this.password)
// }

// userSchema.methods.generateAccessToken = function () {
//   return jwt.sign(
//     {
//       _id: this._id,
//       email: this.email,
//       username: this.username,
//       fullName: this.fullName
//     },
//     process.env.ACCESS_TOKEN_SECRET,
//     {
//       expiresIn: process.env.ACCESS_TOKEN_EXPIRY
//     }
//   )
// }

// userSchema.methods.generateRefreshToken = function () {
//   return jwt.sign(
//     {
//       _id: this._id
//     },
//     process.env.REFRESH_TOKEN_SECRET,
//     {
//       expiresIn: process.env.REFRESH_TOKEN_EXPIRY
//     }
//   )
// }

// export const User = mongoose.model("User", userSchema)