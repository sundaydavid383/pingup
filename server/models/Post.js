// models/Post.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

/* Sub-schemas */

// Attachment (images, videos, files)
const attachmentSchema = new Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ["image", "video", "file", "audio", "link"], default: "image" },
  mimeType: String,
  size: Number, // bytes
  width: Number,
  height: Number,
  provider: { type: String, default: "local" }, // e.g. cloudinary, s3
  providerId: String,
}, { _id: false });

// Link preview (for shared links)
const linkPreviewSchema = new Schema({
  url: String,
  title: String,
  description: String,
  image: String,
  siteName: String,
}, { _id: false });

// Reaction snippet (store a small list of recent reactors + type)
const reactionSnippetSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["like", "love", "haha", "sad", "angry", "care"], default: "like" },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

/* Main Post schema */
const postSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },    // owner
  content: { type: String, trim: true, default: "" },

  attachments: [attachmentSchema],         // images, videos, files
  linkPreview: linkPreviewSchema,          // optional link preview

  // hashtags / tags / mentions
  tags: [{ type: String, index: true }],   // simple hashtag strings
  mentions: [{ type: Schema.Types.ObjectId, ref: "User" }], // user mentions

  // Visibility / audience
  visibility: { type: String, enum: ["public", "friends", "private", "unlisted"], default: "public" },

  // Location (optional geotag)
  location: {
    placeName: String,
    coords: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
    }
  },

  // Post state
  isDraft: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },
  isEdited: { type: Boolean, default: false },
  editedAt: Date,
  editHistory: [
    { content: String, editedAt: Date }
  ],

  // Soft delete / moderation
  isDeleted: { type: Boolean, default: false },
  deleteReason: String,
  isFlagged: { type: Boolean, default: false },
  flags: [{
    user: { type: Schema.Types.ObjectId, ref: "User" },
    reason: String,
    createdAt: { type: Date, default: Date.now }
  }],

  // Counts (denormalized for fast reads)
  likesCount: { type: Number, default: 0, index: true },
  commentsCount: { type: Number, default: 0, index: true },
  sharesCount: { type: Number, default: 0, index: true },
  views: { type: Number, default: 0 },

  // Small "recent reactions" snippet to show actor avatars quickly in UI
  recentReactions: [reactionSnippetSchema],

  // For "shared" posts (repost/retweet)
  sharedPost: { type: Schema.Types.ObjectId, ref: "Post" },

  // Language, permalink, scheduling
  language: String,
  permalink: { type: String, index: true }, // can be built after save (postId-based)
  scheduledAt: Date, // optional scheduled publish

  // Denormalized "pinned until" or promotion
  pinnedUntil: Date,
  promoted: { type: Boolean, default: false },

  // Denormalized preview of owner fields (optional — speeds up reads)
  authorSnapshot: {
    _id: { type: Schema.Types.ObjectId },
    fullName: String,
    username: String,
    profileImage: String,
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/* Virtuals */
postSchema.virtual("isPublic").get(function () {
  return this.visibility === "public";
});

/* Indexes for performance */
postSchema.index({ createdAt: -1 });
postSchema.index({ "location.coords": "2dsphere" });
postSchema.index({ content: "text" });  // full-text search on content
postSchema.index({ user: 1, createdAt: -1 });

/* Instance / Static helpers (examples) */

// Toggle reaction (like/unlike or other reaction types) - optimistic
postSchema.statics.toggleReaction = async function (postId, userId, reactionType = "like") {
  // NOTE: for huge scale move reactions to separate collection and use aggregation
  const Post = this;
  // atomic operations: add recent reaction to snippet and update counts
  const existing = await Post.findOne({ _id: postId, "recentReactions.user": userId });
  if (existing) {
    // remove user's reaction and decrement counts
    await Post.findByIdAndUpdate(postId, {
      $pull: { recentReactions: { user: userId } },
      $inc: { likesCount: -1 }
    });
    return { removed: true };
  } else {
    const snippet = { user: userId, type: reactionType, createdAt: new Date() };
    await Post.findByIdAndUpdate(postId, {
      $push: { recentReactions: { $each: [snippet], $position: 0 }, },
      $inc: { likesCount: 1 }
    });
    // trim recentReactions to N (optional)
    await Post.updateOne({ _id: postId }, { $push: { recentReactions: { $each: [], $slice: 5 } } });
    return { added: true };
  }
};

// Increment counters safely (for comments/shares/views)
postSchema.statics.increment = (postId, field, by = 1) => {
  const allowed = ["likesCount", "commentsCount", "sharesCount", "views"];
  if (!allowed.includes(field)) return null;
  return mongoose.model("Post").findByIdAndUpdate(postId, { $inc: { [field]: by } }, { new: true });
};

const Post = mongoose.model("Post", postSchema);
module.exports = Post;