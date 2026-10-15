
import ActivityBooking from "./ActivityBooking";

export default function PeacefulWalkBooking({ onBack }) {
  return (
    <ActivityBooking
      bookingType="PEACEFUL_WALK"
      title="Peaceful Walk in the Park 🌳"
      activityName="Peaceful Walk in the Park"
      onBack={onBack}
    />
  );
}
