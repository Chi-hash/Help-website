import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    emailToken: {
        type: String,
        default: null
    },
    emailTokenExpires: {
        type: Date,
        default: null
    },
    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        enum: ["staff", "admin", "IT", "superAdmin"],
        default: "staff",
    },

    department: {
        type: String,
    },
    status: {
        type: String,
        enum: ["Active", "Suspended"],
        default: "Active",
    },
    profilePic: {
        type: String,
        default: null // Optional field for profile picture URL
    }
}, {
    timestamps: true,
});

const user = mongoose.model("User", userSchema);
export default user;