import express from "express";
import { Password } from "../models/password.model.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

// GET /api/passwords - Fetch all passwords for authenticated user
router.get("/", async (req, res) => {
  try {
    const passwords = await Password.find({ userId: req.user.id });
    // Decrypt passwords before sending to client
    const response = passwords.map((p) => {
      const obj = p.toObject ? p.toObject() : { ...p };
      obj.password =
        typeof p.decryptPassword === "function"
          ? p.decryptPassword()
          : obj.password;
      return obj;
    });

    res.status(200).json({
      success: true,
      data: response,
      message: "Passwords fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching passwords:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch passwords",
      error: error.message,
    });
  }
});

// POST /api/passwords - Save a new password
router.post("/", async (req, res) => {
  try {
    const { website, username, password } = req.body;

    console.log("Saving password for user:", req.user.id);
    console.log("Data:", {
      website,
      username,
      passwordLength: password.length,
    });

    if (!website || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields (website, username, password) are required",
      });
    }

    const newPassword = new Password({
      website,
      username,
      password,
      userId: req.user.id,
    });

    const savedPassword = await newPassword.save();

    console.log("Password saved! ID:", savedPassword._id);

    // Return decrypted password in the response (DB stays encrypted)
    const savedObj = savedPassword.toObject
      ? savedPassword.toObject()
      : { ...savedPassword };
    savedObj.password =
      typeof savedPassword.decryptPassword === "function"
        ? savedPassword.decryptPassword()
        : savedObj.password;

    res.status(201).json({
      success: true,
      data: savedObj,
      message: "Password saved successfully",
    });
  } catch (error) {
    console.error("❌ Error saving password:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save password",
      error: error.message,
    });
  }
});

// DELETE /api/passwords/:id - Delete a password
router.delete("/:id", async (req, res) => {
  try {
    const password = await Password.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!password) {
      return res.status(404).json({
        success: false,
        message: "Password not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Password deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting password:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete password",
      error: error.message,
    });
  }
});

// PUT /api/passwords/:id - Update an existing password
router.put("/:id", async (req, res) => {
  try {
    const { website, username, password } = req.body;

    if (!website || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields (website, username, password) are required",
      });
    }

    const updated = await Password.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { website, username, password },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Password not found or you are not authorized to edit it",
      });
    }

    // Fetch the latest document so we can run decryptPassword reliably
    const latest = await Password.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    const resp = latest
      ? latest.toObject
        ? latest.toObject()
        : { ...latest }
      : updated;
    if (latest && typeof latest.decryptPassword === "function") {
      resp.password = latest.decryptPassword();
    } else if (updated && typeof updated.decryptPassword === "function") {
      resp.password = updated.decryptPassword();
    }

    res.status(200).json({
      success: true,
      data: resp,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update password",
      error: error.message,
    });
  }
});

export default router;
