package com.medistock;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * MediStock - Medical Inventory Management Platform
 * Entry point for the Spring Boot backend application.
 *
 * Enables scheduling so the ExpiryAlertScheduler / LowStockAlertScheduler
 * jobs (see service.scheduler package usage in NotificationService) can run.
 */
@SpringBootApplication
@EnableScheduling
public class MediStockApplication {
    public static void main(String[] args) {
        SpringApplication.run(MediStockApplication.class, args);
    }
}
