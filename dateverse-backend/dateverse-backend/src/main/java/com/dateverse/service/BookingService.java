
package com.dateverse.service;

import com.dateverse.entity.Booking;
import com.dateverse.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    private static final Set<String> VALID_BOOKING_TYPES = Set.of(
            "MOVIE",
            "CAFE",
            "DINNER",
            "PEACEFUL_WALK"
    );

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public Booking createBooking(
            String bookingType,
            String movieName,
            String location,
            String planDetails,
            LocalDate bookingDate,
            LocalTime bookingTime,
            String note) {

        String type = (bookingType == null || bookingType.isBlank())
                ? "MOVIE"
                : bookingType.trim().toUpperCase(Locale.ROOT);

        if (!VALID_BOOKING_TYPES.contains(type)) {
            throw new IllegalArgumentException(
                    "Invalid booking type: " + type);
        }

        if (movieName == null || movieName.isBlank()) {
            throw new IllegalArgumentException(
                    "Activity name is required.");
        }

        if (bookingDate == null || bookingTime == null) {
            throw new IllegalArgumentException(
                    "Booking date and time are required.");
        }

        if (bookingDate.isBefore(LocalDate.now())
                || (bookingDate.equals(LocalDate.now())
                && !bookingTime.isAfter(LocalTime.now()))) {
            throw new IllegalArgumentException(
                    "Please select a future date and time.");
        }

        String cleanedLocation = clean(location);
        String cleanedPlan = clean(planDetails);

        if (!type.equals("MOVIE")) {
            if (cleanedLocation == null) {
                throw new IllegalArgumentException(
                        "Location is required for this booking.");
            }

            if (cleanedPlan == null) {
                throw new IllegalArgumentException(
                        "Please enter your activity plan.");
            }
        }

        Booking booking = new Booking(
                movieName.trim(),
                bookingDate,
                bookingTime,
                clean(note)
        );

        booking.setBookingType(type);
        booking.setLocation(cleanedLocation);
        booking.setPlanDetails(cleanedPlan);

        return bookingRepository.save(booking);
    }

    // Backward compatibility for the existing movie form.
    @Transactional
    public Booking createBooking(
            String movieName,
            LocalDate bookingDate,
            LocalTime bookingTime,
            String note) {

        return createBooking(
                "MOVIE",
                movieName,
                null,
                null,
                bookingDate,
                bookingTime,
                note
        );
    }

    @Transactional(readOnly = true)
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    private String clean(String value) {
        return value == null || value.isBlank()
                ? null
                : value.trim();
    }
}
