import React, { useState, useEffect } from "react";
import axios from "../api";
import SlotCard from "../components/SlotCard";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [userSlot, setUserSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  if (!token) {
    return (
      <div className="text-center">Please log in to view your dashboard.</div>
    );
  }
  useEffect(() => {
    // Generate next 7 days
    const today = new Date();
    const nextDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d.toISOString().split("T")[0]; // YYYY-MM-DD
    });
    setDates(nextDays);
    setSelectedDate(nextDays[0]);
  }, []);

  useEffect(() => {
    if (selectedDate) fetchSlots(selectedDate);
  }, [selectedDate]);

  const fetchSlots = async (date) => {
    try {
      setLoading(true);
      const res = await axios.get(`/slots/availability?date=${date}`);
      setSlots(res.data.slots);
      setUserSlot(res.data.userBookedSlot);
    } catch (err) {
      console.error(err);
      alert("Error loading slots.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Slot Booking Dashboard</h1>

      <div className="flex gap-3 overflow-x-auto mb-6">
        {dates.map((date) => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`px-4 py-2 rounded-lg border ${
              selectedDate === date ? "bg-primary text-white" : "bg-muted"
            }`}
          >
            {new Date(date).toDateString()}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading slots...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {slots?.length > 0 ? (
            slots.map((slot) => (
              <SlotCard
                key={slot.time}
                slot={slot}
                isUserSlot={userSlot === slot.time}
                date={selectedDate}
                refresh={() => fetchSlots(selectedDate)}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 mt-8">
              <p>No slots available for the selected date.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
