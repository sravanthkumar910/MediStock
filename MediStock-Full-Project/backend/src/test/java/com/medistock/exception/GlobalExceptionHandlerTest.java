package com.medistock.exception;

import com.medistock.dto.response.ApiErrorResponse;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;

import java.sql.SQLException;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.assertEquals;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void handleDataIntegrityViolation_WhenMedicineNameAndBatchConflict_ShouldExplainDuplicate() {
        DataIntegrityViolationException exception = new DataIntegrityViolationException(
                "Duplicate medicine", new SQLException("Duplicate entry for key 'uk_medicine_name_batch'"));

        var response = handler.handleDataIntegrityViolation(exception);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        ApiErrorResponse body = Objects.requireNonNull(response.getBody());
        assertEquals("A medicine with this name and batch already exists.", body.getMessage());
    }
}