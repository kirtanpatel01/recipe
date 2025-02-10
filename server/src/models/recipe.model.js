import { model, Schema } from "mongoose";

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    ingredients: [
      {
        type: String,
        required: true
      },
    ],
    instructions: [
      {
        srNo: { type: Number, required: true }, // Serial Number
        text: { type: String, required: true }, // Instruction Text
      },
    ],
  },
  { timestamps: true }
);

export const Recipe = model("Recipe", recipeSchema);
