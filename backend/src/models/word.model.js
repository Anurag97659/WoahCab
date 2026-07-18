import mongoose, { Schema } from "mongoose";

const wordSchema = new Schema(
  {
    word: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    definitions: [
      {
        partOfSpeech: { type: String, required: true },
        definition: { type: String, required: true },
      }
    ],
    synonyms: {
      type: [String],
      default: [],
    },
    antonyms: {
      type: [String],
      default: [],
    },
    examples: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: {
      type: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
          },
        },
      ],
      default: [],
    },
    // Stars are personal to each user. A word can be important to one user
    // without changing how it appears for anyone else.
    starredBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export const Word = mongoose.model("Word", wordSchema);
