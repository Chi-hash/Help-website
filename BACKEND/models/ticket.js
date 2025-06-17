import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
    {
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ["open", "in progress", "closed"],
        default: "open",
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // this will reference the user model
        
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // this will reference the user model
        default: null,
    },
    attachments: {
        type: [String],
        default: [],
    }
},{
    timestamps: true,
}
);

export default mongoose.model("Ticket", ticketSchema);