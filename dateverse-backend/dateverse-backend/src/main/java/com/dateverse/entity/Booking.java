package com.dateverse.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.PrePersist;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_type", nullable = false, length = 30)
    private String bookingType = "MOVIE";

    @Column(length = 200)
    private String location;

    @Column(name = "plan_details", length = 2000)
    private String planDetails;

    // Kept for compatibility with existing movie bookings.
    // For cafe, dinner, and park walks, this stores the activity name.
    @Column(nullable = false, length = 150)
    private String movieName;

    @Column(nullable = false)
    private LocalDate bookingDate;

    @Column(nullable = false)
    private LocalTime bookingTime;

    @Column(length = 1000)
    private String note;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    // Required by JPA
    protected Booking() {
    }

    // Existing constructor retained for movie bookings.
    public Booking(
            String movieName,
            LocalDate bookingDate,
            LocalTime bookingTime,
            String note) {

        this.movieName = movieName;
        this.bookingDate = bookingDate;
        this.bookingTime = bookingTime;
        this.note = note;
        this.bookingType = "MOVIE";
    }

    @PrePersist
    public void beforeSave() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }

        if (bookingType == null || bookingType.isBlank()) {
            bookingType = "MOVIE";
        }
    }

    public Long getId() {
        return id;
    }

    public String getBookingType() {
        return bookingType;
    }

    public void setBookingType(String bookingType) {
        this.bookingType = bookingType;
    }

    public String getMovieName() {
        return movieName;
    }

    public void setMovieName(String movieName) {
        this.movieName = movieName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getPlanDetails() {
        return planDetails;
    }

    public void setPlanDetails(String planDetails) {
        this.planDetails = planDetails;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public LocalTime getBookingTime() {
        return bookingTime;
    }

    public void setBookingTime(LocalTime bookingTime) {
        this.bookingTime = bookingTime;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}