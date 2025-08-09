// middleware/upload.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const { v4: uuidv4 } = require("uuid"); // For unique IDs

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_pics",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 300, height: 300, crop: "limit" }],
    public_id: (req, file) => {
      // Keep original name (without extension) + unique ID
      const originalName = file.originalname.split(".")[0]; // remove extension
      const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
      return `${originalName}-${uniqueSuffix}`;
    },
  },
});

const upload = multer({ storage });

module.exports = upload;