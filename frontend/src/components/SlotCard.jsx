import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import SlotBookingDialog from "./SlotBookingDialog";

const SlotCard = ({ slot, isUserSlot, date, refresh }) => {
  const [open, setOpen] = useState(false);

  const status = slot.isBooked
    ? isUserSlot
      ? "Your Booking"
      : "Booked"
    : "Available";

  const bgColor = slot.isBooked
    ? isUserSlot
      ? "bg-green-100 border-green-400"
      : "bg-red-100 border-red-400"
    : "bg-white";

  return (
    <>
      <Card
        className={`cursor-pointer border ${bgColor} hover:shadow-md transition`}
        onClick={() => {
          if (!slot.isBooked) setOpen(true);
        }}
      >
        <CardContent className="p-4 text-center">
          <h3 className="text-lg font-medium">{slot.time}</h3>
          <p className="text-sm text-muted-foreground">{status}</p>
        </CardContent>
      </Card>

      <SlotBookingDialog
        open={open}
        setOpen={setOpen}
        slot={slot}
        date={date}
        refresh={refresh}
      />
    </>
  );
};

export default SlotCard;
