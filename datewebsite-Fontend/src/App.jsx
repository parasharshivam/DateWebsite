
import { useEffect, useRef, useState } from "react";

import MovieBooking from "./MovieBooking";
import CafeBooking from "./CafeBooking";
import DinnerBooking from "./DinnerBooking";
import PeacefulWalkBooking from "./PeacefulWalkBooking";
import "./App.css";

const places = [
  {
    name: "Movie",
    image: "/images/movie.jpg",
    description: "A movie and some popcorn.",
  },
  {
    name: "Cafe",
    image: "/images/cafe.png",
    description: "Coffee, conversations, and smiles.",
  },
  {
    name: "Dinner",
    image: "/images/dinner.jpg",
    description: "A lovely dinner together.",
  },
  {
    name: "Peaceful walk in park",
    image: "/images/walking.jpg",
    description: "A quiet walk and good conversations.",
  },
  {
    name: "Customize",
    image: null,
    description: "Choose your own date idea.",
  },
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

// Footer displayed on every DATEVERSE screen.
function DeveloperFooter() {
  return (
    <footer
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "18px 12px",
        marginTop: "20px",
        textAlign: "center",
        fontSize: "13px",
        color: "#b8b8c8",
        letterSpacing: "0.5px",
      }}
    >
      Designed &amp; Developed by{" "}
      <span
        style={{
          color: "#ff5ca8",
          fontWeight: 600,
        }}
      >
        Shivam Parashar & Arun Dubey   

      </span>
    </footer>
  );
}

export default function App() {
  const [accepted, setAccepted] = useState(false);
  const [activePage, setActivePage] = useState("places");
  const [customChoice, setCustomChoice] = useState("");
  const [selectedChoice, setSelectedChoice] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const noButtonRef = useRef(null);
  const [noPosition, setNoPosition] = useState(null);

  // Make the No button move away when the pointer approaches it.
  useEffect(() => {
    if (accepted) return;

    function moveNoButton(pointerX, pointerY) {
      const button = noButtonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distance = Math.hypot(
        pointerX - centerX,
        pointerY - centerY
      );

      if (distance > 115) return;

      const padding = 12;

      const maxX = Math.max(
        padding,
        window.innerWidth - rect.width - padding
      );

      const maxY = Math.max(
        padding,
        window.innerHeight - rect.height - padding
      );

      let nextX = padding;
      let nextY = padding;

      for (let attempt = 0; attempt < 20; attempt++) {
        nextX =
          padding + Math.random() * Math.max(0, maxX - padding);

        nextY =
          padding + Math.random() * Math.max(0, maxY - padding);

        const newCenterX = nextX + rect.width / 2;
        const newCenterY = nextY + rect.height / 2;

        if (
          Math.hypot(
            pointerX - newCenterX,
            pointerY - newCenterY
          ) > 150
        ) {
          break;
        }
      }

      setNoPosition({
        x: clamp(nextX, padding, maxX),
        y: clamp(nextY, padding, maxY),
      });
    }

    function handlePointerMove(event) {
      moveNoButton(event.clientX, event.clientY);
    }

    function handleResize() {
      const button = noButtonRef.current;
      if (!button || !noPosition) return;

      const rect = button.getBoundingClientRect();

      setNoPosition({
        x: clamp(
          noPosition.x,
          12,
          Math.max(12, window.innerWidth - rect.width - 12)
        ),
        y: clamp(
          noPosition.y,
          12,
          Math.max(12, window.innerHeight - rect.height - 12)
        ),
      });
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [accepted, noPosition]);

  // Save the selected date idea for the current browser session.
  function saveChoice(choice) {
    setSelectedChoice(choice);
    setShowConfirmation(true);

    try {
      sessionStorage.setItem("dateVerseChoice", choice);
    } catch (error) {
      console.error("Could not save date choice:", error);
    }
  }

  function handleYes() {
    setAccepted(true);
    setActivePage("places");
    setNoPosition(null);
  }

  function handleBackToQuestion() {
    setAccepted(false);
    setActivePage("places");
    setNoPosition(null);
    setShowConfirmation(false);
  }

  // Open the correct page for the selected date idea.
  function handlePlaceClick(place) {
    if (place.name === "Movie") {
      setActivePage("movie");
      return;
    }

    if (place.name === "Cafe") {
      setActivePage("cafe");
      return;
    }

    if (place.name === "Dinner") {
      setActivePage("dinner");
      return;
    }

    if (place.name === "Peaceful walk in park") {
      setActivePage("peacefulWalk");
      return;
    }

    if (place.name === "Customize") {
      setSelectedChoice("Customize");
      setCustomChoice("");
      setShowConfirmation(false);
    }
  }

  // Return to the date selection page from a booking component.
  function handleBackToPlaces() {
    setActivePage("places");
  }

  // Movie booking page.
  if (accepted && activePage === "movie") {
    return (
      <>
        <MovieBooking onBack={handleBackToPlaces} />
        <DeveloperFooter />
      </>
    );
  }

  // Cafe booking page.
  if (accepted && activePage === "cafe") {
    return (
      <>
        <CafeBooking onBack={handleBackToPlaces} />
        <DeveloperFooter />
      </>
    );
  }

  // Dinner booking page.
  if (accepted && activePage === "dinner") {
    return (
      <>
        <DinnerBooking onBack={handleBackToPlaces} />
        <DeveloperFooter />
      </>
    );
  }

  // Peaceful walk booking page.
  if (accepted && activePage === "peacefulWalk") {
    return (
      <>
        <PeacefulWalkBooking onBack={handleBackToPlaces} />
        <DeveloperFooter />
      </>
    );
  }

  // Date selection page.
  if (accepted) {
    return (
      <>
        <main className="dateverse-container">
          <section className="places-page">
            <p className="eyebrow">OUR LITTLE ADVENTURE</p>

            <h1>Where should we go? 💗</h1>

            <p className="subtitle">
              Pick the date you would love most.
            </p>

            <div className="places-grid">
              {places.map((place) => (
                <button
                  key={place.name}
                  type="button"
                  className="place-card"
                  onClick={() => handlePlaceClick(place)}
                >
                  {place.image ? (
                    <img
                      src={place.image}
                      alt={place.name}
                      className="place-card-image"
                    />
                  ) : (
                    <div className="customize-placeholder">
                      <span>✨</span>
                    </div>
                  )}

                  <span className="place-card-title">
                    {place.name}
                  </span>

                  <span className="place-card-description">
                    {place.description}
                  </span>
                </button>
              ))}
            </div>

            {selectedChoice === "Customize" && (
              <form
                className="custom-choice-form"
                onSubmit={(event) => {
                  event.preventDefault();

                  const choice = customChoice.trim();

                  if (choice) {
                    saveChoice(choice);
                  }
                }}
              >
                <label htmlFor="customChoice">
                  Your date idea
                </label>

                <input
                  id="customChoice"
                  name="customChoice"
                  type="text"
                  value={customChoice}
                  onChange={(event) =>
                    setCustomChoice(event.target.value)
                  }
                  placeholder="Tell me what you have in mind..."
                  maxLength={200}
                  required
                />

                <button type="submit">
                  Choose this date 💕
                </button>
              </form>
            )}

            {showConfirmation && (
              <div className="choice-confirmation" role="status">
                <h2>That sounds lovely! 💖</h2>

                <p>Your choice: {selectedChoice}</p>

                <button
                  type="button"
                  onClick={() => setShowConfirmation(false)}
                >
                  Continue
                </button>
              </div>
            )}

            <button
              type="button"
              className="back-button"
              onClick={handleBackToQuestion}
            >
              Back to the question
            </button>
          </section>
        </main>

        <DeveloperFooter />
      </>
    );
  }

  // Original invitation screen.
  return (
    <>
      <main className="dateverse-container">
        <section className="invitation-card">
          <div className="invitation-heart" aria-hidden="true">
            💖
          </div>

          <p className="eyebrow">
            A VERY IMPORTANT QUESTION
          </p>

          <h1>Will you go on a date with me?</h1>

          <p className="subtitle">Choose wisely... 😉</p>

          <div className="button-area">
            <button
              type="button"
              className="yes-button"
              onClick={handleYes}
            >
              Yes, obviously! 💕
            </button>

            <button
              ref={noButtonRef}
              type="button"
              className={`no-button ${
                noPosition ? "is-running" : ""
              }`}
              style={
                noPosition
                  ? {
                      position: "fixed",
                      left: `${noPosition.x}px`,
                      top: `${noPosition.y}px`,
                    }
                  : undefined
              }
              onPointerEnter={(event) => {
                const button = event.currentTarget;
                const rect = button.getBoundingClientRect();

                const maxX = Math.max(
                  12,
                  window.innerWidth - rect.width - 12
                );

                const maxY = Math.max(
                  12,
                  window.innerHeight - rect.height - 12
                );

                setNoPosition({
                  x: clamp(Math.random() * maxX, 12, maxX),
                  y: clamp(Math.random() * maxY, 12, maxY),
                });
              }}
              onClick={() => {
                const button = noButtonRef.current;
                if (!button) return;

                const rect = button.getBoundingClientRect();

                const maxX = Math.max(
                  12,
                  window.innerWidth - rect.width - 12
                );

                const maxY = Math.max(
                  12,
                  window.innerHeight - rect.height - 12
                );

                setNoPosition({
                  x: clamp(Math.random() * maxX, 12, maxX),
                  y: clamp(Math.random() * maxY, 12, maxY),
                });
              }}
            >
              No 🙈
            </button>
          </div>
        </section>
      </main>

      <DeveloperFooter />
    </>
  );
}
