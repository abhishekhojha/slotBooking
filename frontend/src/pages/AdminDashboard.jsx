import { useEffect, useState } from "react";
import axios from "../api";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [slots, setSlots] = useState([]);

  const fetchSlots = async () => {
    try {
      const res = await axios.get(`/slots/availability?date=${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots(res.data.slots);
    } catch (err) {
      console.error("Failed to fetch slots", err);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [date]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      <div className="mb-4">
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-60"
        />
      </div>

      {slots?.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {slots.map((slot) => (
            <Card key={slot._id} className="p-4">
              <p className="font-semibold">{slot.time}</p>
              {slot.isBooked ? (
                <div className="text-sm text-gray-700 mt-2">
                  <p>
                    <strong>Booked By:</strong> {slot.bookedBy?.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {slot.bookedBy?.email}
                  </p>
                  <p>
                    <strong>Purpose:</strong> {slot.purpose}
                  </p>
                </div>
              ) : (
                <p className="text-green-600 mt-2">Available</p>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-8">
          <p>No slots available for the selected date.</p>
        </div>
      )}
    </div>
  );
}
