
import ActivityBooking from "./ActivityBooking";

export default function DinnerBooking({ onBack }) {
  return (
    <ActivityBooking
      bookingType="DINNER"
      title="Dinner Date 🍽️"
      activityName="Dinner Date"
      onBack={onBack}
    />
  );
}
