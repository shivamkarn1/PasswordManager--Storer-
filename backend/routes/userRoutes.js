// import express from "express"
// import { User } from "../models/user.model.js"
// import asyncHandler from "../utils/asyncHandler.js"
// import { ApiError } from "../utils/ApiError.js"
// import { ApiResponse } from "../utils/ApiResponse.js"

// const router = express.Router()

// // Register
// router.post("/register", asyncHandler(async (req, res) => {
//   const { username, email, fullName, password } = req.body
//   // if (!username || !email || !fullName || !password) throw new ApiError(400, "All fields required")
//   try {
//     const user = await User.create({ username, email, fullName, password })
//     return res.json(new ApiResponse(201, user, "User registered"))
//   } catch (err) {
//     if (err.code === 11000) {
//       if (err.keyPattern.username) throw new ApiError(400, "Username already exists")
//       if (err.keyPattern.email) throw new ApiError(400, "Email already exists")
//     }
//     throw err
//   }
// }))

// // Login
// router.post("/login", asyncHandler(async (req, res) => {
//   const { username, password } = req.body
//   if (!username || !password) throw new ApiError(400, "Username and password required")
//   const user = await User.findOne({ username })
//   if (!user || !(await user.isPasswordCorrect(password))) throw new ApiError(401, "Invalid credentials")

//   const accessToken = user.generateAccessToken()
//   const refreshToken = user.generateRefreshToken()
//   user.refreshToken = refreshToken
//   await user.save()

//   res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "strict" })
//   res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict" })
//   return res.json(new ApiResponse(200, { user, accessToken }, "Login successful"))
// }))

// // Logout
// router.post("/logout", asyncHandler(async (req, res) => {
//   const refreshToken = req.cookies.refreshToken
//   if (!refreshToken) throw new ApiError(400, "No refresh token")

//   const user = await User.findOne({ refreshToken })
//   if (user) {
//     user.refreshToken = null
//     await user.save()
//   }
//   res.clearCookie("accessToken")
//   res.clearCookie("refreshToken")
//   return res.json(new ApiResponse(200, null, "Logged out"))
// }))

// export default router