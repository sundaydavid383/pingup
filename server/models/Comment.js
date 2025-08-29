// models/Comment.js  (separate collection — recommended for scale)
const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  parent: { type: Schema.Types.ObjectId, ref: "Comment" }, // threaded replies
  attachments: [attachmentSchema], // reuse same attachmentSchema if exported
  likesCount: { type: Number, default: 0 },
  isEdited: { type: Boolean, default: false },
  editedAt: Date,
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

commentSchema.index({ post: 1, createdAt: -1 });

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;