
import ActivityBooking from "./ActivityBooking";

export default function CafeBooking({ onBack }) {
  return (
    <ActivityBooking
      bookingType="CAFE"
      title="Cafe Date ☕"
      activityName="Cafe Date"
      onBack={onBack}
    />
  );
}
