import mongoose from "mongoose";
import { boolean } from "zod";
import { required } from "zod/mini";

const BingoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    public: {
      type: Boolean,
      required: false,
      default: false,
    },
    friendsCanView: {
      type: Boolean,
      required: false,
      default: false,
    },
    photoEnabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    gridsize: {
      type: Number,
      required: true,
      default: 25,
    },
    slotEntries: [{
        slot: Number,
        text: String,
        photo: String,
        status: Boolean
    }],
    participants: {
      type: [String],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.models.Bingo || mongoose.model("Bingo", BingoSchema);
