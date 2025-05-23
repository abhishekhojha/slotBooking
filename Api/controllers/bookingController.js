const Slot = require("../models/Booking");

// Helper to generate 30-min slots 9AM-5PM
const generateSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 17; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    slots.push(`${hour.toString().padStart(2, "0")}:30`);
  }
  return slots;
};

exports.getSlotsAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "Date is required" });

    let allSlots = generateSlots();

    // ⚠️ Filter out past slots if the selected date is today
    const today = new Date();
    const selectedDate = new Date(date);
    const isToday =
      today.toISOString().split("T")[0] ===
      selectedDate.toISOString().split("T")[0];

    if (isToday) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();

      allSlots = allSlots.filter((time) => {
        const [h, m] = time.split(":").map(Number);
        return h > currentHour || (h === currentHour && m > currentMinutes);
      });
    }

    // Get existing booked slots
    let slots = await Slot.find({ date }).populate("bookedBy", "name email");

    // Add missing slots to DB
    const slotTimes = slots.map((slot) => slot.time);
    const missingSlots = allSlots
      .filter((time) => !slotTimes.includes(time))
      .map((time) => ({ date, time, isBooked: false }));

    if (missingSlots.length > 0) {
      await Slot.insertMany(missingSlots);
      slots = await Slot.find({ date }).populate("bookedBy", "name email");
    }

    // Filter again to ensure response only has current/future slots
    slots = slots.filter((slot) => allSlots.includes(slot.time));

    const userBookedSlot = slots.find(
      (slot) => slot.bookedBy?._id.toString() === req.user.id
    );

    res.json({
      date,
      slots,
      userBookedSlot: userBookedSlot ? userBookedSlot.time : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.bookSlot = async (req, res) => {
  try {
    const { date, time, purpose } = req.body;
    if (!date || !time)
      return res.status(400).json({ message: "Date and time are required" });

    const today = new Date();
    const bookingDate = new Date(date);
    const diffDays = (bookingDate - today) / (1000 * 3600 * 24);
    if (diffDays < 0 || diffDays > 6)
      return res
        .status(400)
        .json({ message: "Booking date must be within next 7 days" });

    if (!generateSlots().includes(time))
      return res.status(400).json({ message: "Invalid time slot" });

    // Check if user already booked a slot on this date
    const existingUserSlot = await Slot.findOne({
      date,
      bookedBy: req.user.id,
    });
    if (existingUserSlot)
      return res
        .status(400)
        .json({ message: "User already booked a slot this day" });

    // Find slot
    const slotDoc = await Slot.findOne({ date, time });
    if (!slotDoc) return res.status(400).json({ message: "Slot not found" });

    if (slotDoc.isBooked)
      return res.status(400).json({ message: "Slot already booked" });

    // Book it
    slotDoc.isBooked = true;
    slotDoc.bookedBy = req.user.id;
    slotDoc.purpose = purpose || "";
    await slotDoc.save();

    res.json({ message: "Slot booked successfully", slot: slotDoc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
