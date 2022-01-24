const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    author:
    {
        type: String,
        required: true
    },
    content:
    {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('blog', blogSchema);