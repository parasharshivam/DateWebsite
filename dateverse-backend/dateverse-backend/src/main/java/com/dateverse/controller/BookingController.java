package com.dateverse.controller;

import com.dateverse.entity.Booking;
import com.dateverse.service.BookingService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://metadata-pope-seller-million.trycloudflare.com"
})
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // Request data received from the React frontend
    public record BookingRequest(
            String bookingType,
            String movieName,
            String location,
            String planDetails,

            @NotNull
            LocalDate bookingDate,

            @NotNull
            LocalTime bookingTime,

            String note
    ) {}

    // Save a new booking
    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @Valid @RequestBody BookingRequest request) {

        try {
            Booking saved = bookingService.createBooking(
                    request.bookingType(),
                    request.movieName(),
                    request.location(),
                    request.planDetails(),
                    request.bookingDate(),
                    request.bookingTime(),
                    request.note()
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(saved);

        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    ex.getMessage(),
                    ex
            );
        }
    }

    // Retrieve all bookings
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(
                bookingService.getAllBookings()
        );
    }
}
