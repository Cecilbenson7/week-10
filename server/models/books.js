const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    pages: {
      type: Number,
      required: true,
    },
    genres: {
      type: [String],
      required: true,
    },
    ratings: {
      type: Number,
      required: true,
    },
  },
  { collection: 'books' }
);

module.exports = mongoose.model("Book", bookSchema);
