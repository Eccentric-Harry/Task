const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

// Skip password hashing if password is already hashed (during login, not saving)
AdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();  // Only hash the password if it's being modified
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare passwords during login
AdminSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);
