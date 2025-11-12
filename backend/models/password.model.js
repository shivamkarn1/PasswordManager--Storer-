import mongoose, { model, Schema } from "mongoose";

import crypto from "crypto";

const SECRET = process.env.JWT_SECRET || "thisismyjwtsecretthatwillbeused";
const ENCRYPTION_KEY = crypto.createHash("sha256").update(SECRET).digest(); // 32 bytes

const passwordSchema = new Schema(
  {
    website: {
      type: String,
      required: [true, "Website is required"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    userId: {
      type: String,
      required: [true, "User ID is required"],
    },
  },
  { timestamps: true }
);

// Add compound index for better query performance
passwordSchema.index({ userId: 1, website: 1 });

// pre before save
passwordSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
      const encrypted =
        cipher.update(this.password, "utf8", "hex") + cipher.final("hex");
      this.password = iv.toString("hex") + "." + encrypted;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// Decrypt when needed
passwordSchema.methods.decryptPassword = function () {
  try {
    const str = String(this.password);
    const parts = str.split(".");
    // If not in expected encrypted format, return the raw value unchanged.
    if (parts.length !== 2) {
      return str;
    }
    const iv = Buffer.from(parts[0], "hex");
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);

    return decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
  } catch (error) {
    return "[Decryption Failed]";
  }
};

export const Password = model("Password", passwordSchema);
