import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "../api";

const SlotBookingDialog = ({ open, setOpen, slot, date, refresh }) => {
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    try {
      setLoading(true);
      await axios.post("/slots/book", {
        date,
        time: slot.time,
        purpose,
      });
      refresh();
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book Slot: {slot.time}</DialogTitle>
        </DialogHeader>

        <Textarea
          placeholder="Enter purpose (optional)"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        />

        <DialogFooter>
          <Button onClick={handleBooking} disabled={loading}>
            {loading ? "Booking..." : "Confirm Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SlotBookingDialog;
