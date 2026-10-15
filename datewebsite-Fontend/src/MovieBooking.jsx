
import { useEffect, useState } from "react";
import "./MovieBooking.css";

const API_URL = "/api/bookings";
const SESSION_KEY = "dateverseCurrentBooking";

function getInitialBooking() {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);

    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Could not read session booking:", error);
  }

  return {
    movieName: "",
    bookingDate: "",
    bookingTime: "",
    note: "",
  };
}

export default function MovieBooking({ onBack }) {
  const [booking, setBooking] = useState(getInitialBooking);
  const [savedBooking, setSavedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(booking));
    } catch (storageError) {
      console.error("Could not save session booking:", storageError);
    }
  }, [booking]);

  const updateField = (event) => {
    const { name, value } = event.target;

    setBooking((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const minimumDate = new Date().toLocaleDateString("en-CA");

  async function handleBooking(event) {
    event.preventDefault();
    setError("");
    setShowSuccess(false);

    if (!booking.movieName.trim()) {
      setError("Please enter the movie name.");
      return;
    }

    if (!booking.bookingDate || !booking.bookingTime) {
      setError("Please select your date and time.");
      return;
    }

    const selectedDateTime = new Date(
      `${booking.bookingDate}T${booking.bookingTime}`
    );

    if (
      Number.isNaN(selectedDateTime.getTime()) ||
      selectedDateTime <= new Date()
    ) {
      setError("Please select a future date and time.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieName: booking.movieName.trim(),
          bookingDate: booking.bookingDate,
          bookingTime:
            booking.bookingTime.length === 5
              ? `${booking.bookingTime}:00`
              : booking.bookingTime,
          note: booking.note.trim(),
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.detail ||
          result?.message ||
          result?.title ||
          "Booking could not be saved. Please try again."
        );
      }

      setSavedBooking(result);
      setShowSuccess(true);

      // The current browser session remembers the saved booking too.
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          ...booking,
          savedBookingId: result.id,
        })
      );
    } catch (requestError) {
      console.error("Booking request failed:", requestError);

      setError(
        requestError.message ||
        "Cannot connect to the backend. Check that Spring Boot is running."
      );
    } finally {
      setLoading(false);
    }
  }

  function startNewBooking() {
    const emptyBooking = {
      movieName: "",
      bookingDate: "",
      bookingTime: "",
      note: "",
    };

    setBooking(emptyBooking);
    setSavedBooking(null);
    setShowSuccess(false);
    setError("");
    sessionStorage.removeItem(SESSION_KEY);
  }

  return (
    <main className="movie-booking-page">
      <button
        type="button"
        className="back-button"
        onClick={onBack}
      >
        ← Back to date choices
      </button>

      <section className="booking-card">
        <div className="booking-heading">
          <span className="booking-eyebrow">YOUR LITTLE DATE PLAN</span>
          <h1>Movie Night 🎬</h1>
          <p>
            Pick a movie, choose a time, and let’s make a memory.
          </p>
        </div>

        <form onSubmit={handleBooking} className="booking-form">
          <label htmlFor="movieName">Movie name</label>
          <input
            id="movieName"
            name="movieName"
            type="text"
            placeholder="Which movie should we watch?"
            value={booking.movieName}
            onChange={updateField}
            maxLength={150}
            required
          />

          <div className="booking-fields">
            <div>
              <label htmlFor="bookingDate">Date</label>
              <input
                id="bookingDate"
                name="bookingDate"
                type="date"
                min={minimumDate}
                value={booking.bookingDate}
                onChange={updateField}
                required
              />
            </div>

            <div>
              <label htmlFor="bookingTime">Time</label>
              <input
                id="bookingTime"
                name="bookingTime"
                type="time"
                value={booking.bookingTime}
                onChange={updateField}
                required
              />
            </div>
          </div>

          <label htmlFor="note">A little note (optional)</label>
          <textarea
            id="note"
            name="note"
            placeholder="Snacks, plans, or anything else..."
            rows={3}
            maxLength={1000}
            value={booking.note}
            onChange={updateField}
          />

          {error && (
            <p className="booking-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="confirm-booking-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Saving your plan..."
              : "Confirm our movie date 💗"}
          </button>
        </form>

        <p className="session-note">
          Your unfinished form is remembered in this browser tab's
          session. Confirming sends the booking to the server for
          permanent storage.
        </p>
      </section>

      {showSuccess && savedBooking && (
        <div
          className="success-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-title"
        >
          <div className="success-modal">
            <div className="success-heart" aria-hidden="true">💖</div>
            <h2 id="success-title">Booking confirmed!</h2>
            <p>Cool, you have booked a date with a cool guy! 😎</p>

            <div className="saved-details">
              <p>
                <strong>Movie:</strong> {savedBooking.movieName}
              </p>
              <p>
                <strong>Date:</strong> {savedBooking.bookingDate}
              </p>
              <p>
                <strong>Time:</strong> {savedBooking.bookingTime}
              </p>
              <p>
                <strong>Booking ID:</strong> {savedBooking.id}
              </p>
            </div>

            <p className="success-caption">
              Your booking has been saved. See you there! ✨
            </p>

            <button
              type="button"
              className="confirm-booking-button"
              onClick={() => setShowSuccess(false)}
            >
              Sounds good 💕
            </button>
          </div>
        </div>
      )}

      {savedBooking && !showSuccess && (
        <div className="booking-saved-again">
          <p>
            Booking #{savedBooking.id} was saved successfully.
          </p>
          <button type="button" onClick={startNewBooking}>
            Make another booking
          </button>
        </div>
      )}
    </main>
  );
}
