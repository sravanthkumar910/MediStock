package com.medistock.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class MedicineRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String batchNumber;

    private Long categoryId;

    private Long supplierId;

    @Min(0)
    private Integer quantity;

    @Min(0)
    private Integer reorderLevel;

    private LocalDate manufacturingDate;

    @NotNull
    private LocalDate expiryDate;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal price;

    private String unit;

    private String description;
}
