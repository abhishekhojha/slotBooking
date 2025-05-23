const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  date: { type: String, required: true },   // YYYY-MM-DD
  time: { type: String, required: true },   // HH:MM
  isBooked: { type: Boolean, default: false },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  purpose: { type: String }, // Only if booked
}, { timestamps: true });

slotSchema.index({ date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model("Slot", slotSchema);