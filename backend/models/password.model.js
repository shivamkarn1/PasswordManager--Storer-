
import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema(
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
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add compound index for better query performance
passwordSchema.index({ userId: 1, website: 1 });

export const Password = mongoose.model("Password", passwordSchema);

/* encryption is not needed here while saving as it's just for the
 website  frontend saving so we skip those processes. */