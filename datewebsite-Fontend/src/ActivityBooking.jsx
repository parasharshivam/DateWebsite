import { useState } from "react";
import "./ActivityBooking.css";

const API_URL = "/api/bookings";

function getEmptyForm() {
  return {
    bookingDate: "",
    bookingTime: "",
    location: "",
    planDetails: "",
    note: "",
  };
}

function getStorageItem(key) {
  try {
    const saved = sessionStorage.getItem(key);

    if (!saved) {
      return null;
    }

    const parsed = JSON.parse(saved);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }

    return {
      bookingDate:
        typeof parsed.bookingDate === "string"
          ? parsed.bookingDate
          : "",
      bookingTime:
        typeof parsed.bookingTime === "string"
          ? parsed.bookingTime
          : "",
      location:
        typeof parsed.location === "string" ? parsed.location : "",
      planDetails:
        typeof parsed.planDetails === "string" ? parsed.planDetails : "",
      note: typeof parsed.note === "string" ? parsed.note : "",
    };
  } catch (error) {
    console.error("Could not read booking draft:", error);
    return null;
  }
}

function saveStorageItem(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("Could not save booking data in this tab:", error);
    return false;
  }
}

export default function ActivityBooking({
  bookingType,
  title,
  activityName,
  onBack,
}) {
  const normalizedType = String(bookingType || "").toUpperCase();

  const storageKey = `dateverse-${normalizedType.toLowerCase() || "activity"}-draft`;
  const confirmedKey = `dateverse-${normalizedType.toLowerCase() || "activity"}-confirmed`;

  const [form, setForm] = useState(
    () => getStorageItem(storageKey) || getEmptyForm()
  );

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;

    const updated = {
      ...form,
      [name]: value,
    };

    setForm(updated);
    saveStorageItem(storageKey, updated);

    setMessage("");
    setMessageType("");
  }

  async function handleBooking(event) {
    event.preventDefault();

    if (saving) {
      return;
    }

    setMessage("");
    setMessageType("");

    if (!normalizedType || !title || !activityName) {
      setMessage(
        "Booking configuration is incomplete. Please check the component props."
      );
      setMessageType("error");
      return;
    }

    if (
      !form.bookingDate ||
      !form.bookingTime ||
      !form.location.trim() ||
      !form.planDetails.trim()
    ) {
      setMessage(
        "Please fill in the date, time, location, and plan details."
      );
      setMessageType("error");
      return;
    }

    // Compare the selected local date and time with the current time.
    const selectedDate = new Date(
      `${form.bookingDate}T${form.bookingTime}`
    );

    if (Number.isNaN(selectedDate.getTime())) {
      setMessage("Please enter a valid date and time.");
      setMessageType("error");
      return;
    }

    if (selectedDate <= new Date()) {
      setMessage("Please select a future date and time.");
      setMessageType("error");
      return;
    }

    const booking = {
      bookingType: normalizedType,
      movieName: activityName,
      location: form.location.trim(),
      planDetails: form.planDetails.trim(),
      bookingDate: form.bookingDate,
      bookingTime: `${form.bookingTime}:00`,
      note: form.note.trim() || null,
    };

    saveStorageItem(storageKey, form);
    setSaving(true);

    try {
      console.log("Sending booking payload:", booking);

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(booking),
      });

      const responseText = await response.text();

      if (!response.ok) {
        console.error("Booking API error response:", responseText);

        throw new Error(
          `Server returned ${response.status}: ${
            responseText || "No error details returned"
          }`
        );
      }

      let savedBooking = booking;

      if (responseText.trim()) {
        try {
          savedBooking = JSON.parse(responseText);
        } catch {
          console.warn("The server response was not JSON.");
        }
      }

      saveStorageItem(confirmedKey, savedBooking);

      try {
        sessionStorage.removeItem(storageKey);
      } catch (error) {
        console.error("Could not remove the saved draft:", error);
      }

      setForm(getEmptyForm());
      setMessage("Booking saved successfully! ❤️");
      setMessageType("success");
    } catch (error) {
      console.error("Booking request failed:", error);

      setMessage(
        `Booking could not be saved: ${error.message}. Your draft remains available in this browser tab.`
      );
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="activity-booking">
      {onBack && (
        <button
          type="button"
          className="back-button"
          onClick={onBack}
          disabled={saving}
        >
          ← Back to date ideas
        </button>
      )}

      <h2>{title}</h2>

      <p className="activity-subtitle">
        Let's plan our {String(activityName).toLowerCase()} ❤️
      </p>

      <form onSubmit={handleBooking}>
        <div className="activity-fields">
          <label>
            Date
            <input
              type="date"
              name="bookingDate"
              value={form.bookingDate}
              onChange={updateField}
              min={new Date().toLocaleDateString("en-CA")}
              required
              disabled={saving}
            />
          </label>

          <label>
            Time
            <input
              type="time"
              name="bookingTime"
              value={form.bookingTime}
              onChange={updateField}
              required
              disabled={saving}
            />
          </label>
        </div>

        <label>
          Location
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={updateField}
            placeholder="Enter cafe, restaurant, or park location"
            maxLength={200}
            required
            disabled={saving}
          />
        </label>

        <label>
          Plan details
          <textarea
            name="planDetails"
            value={form.planDetails}
            onChange={updateField}
            placeholder="What would you like to eat, or where would you like to walk?"
            rows={3}
            maxLength={2000}
            required
            disabled={saving}
          />
        </label>

        <label className="activity-note">
          A little note (optional)
          <textarea
            name="note"
            value={form.note}
            onChange={updateField}
            placeholder="Write something sweet..."
            rows={4}
            maxLength={1000}
            disabled={saving}
          />
        </label>

        {message && (
          <p
            className={`activity-message ${messageType}`}
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        )}

        <button
          className="activity-submit"
          type="submit"
          disabled={saving}
        >
          {saving ? "Saving..." : "Confirm our date ❤️"}
        </button>

        <p className="activity-footnote">
          Your unfinished form is remembered in this browser tab.
          Confirming sends your booking to the server for permanent
          storage.
        </p>
      </form>
    </main>
  );
}