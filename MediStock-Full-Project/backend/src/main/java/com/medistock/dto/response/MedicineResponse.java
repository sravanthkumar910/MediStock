package com.medistock.dto.response;

import com.medistock.entity.Medicine;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Builder
public class MedicineResponse {
    private Long id;
    private String name;
    private String batchNumber;
    private Long categoryId;
    private String categoryName;
    private Long supplierId;
    private String supplierName;
    private Integer quantity;
    private Integer reorderLevel;
    private LocalDate manufacturingDate;
    private LocalDate expiryDate;
    private BigDecimal price;
    private String unit;
    private String description;
    private String stockStatus; // IN_STOCK, LOW_STOCK, OUT_OF_STOCK
    private String expiryStatus; // OK, NEAR_EXPIRY, EXPIRED

    public static MedicineResponse from(Medicine m, int expiryWarningDays) {
        String stockStatus = m.getQuantity() == 0 ? "OUT_OF_STOCK"
                : m.getQuantity() <= m.getReorderLevel() ? "LOW_STOCK" : "IN_STOCK";

        LocalDate today = LocalDate.now();
        String expiryStatus = m.getExpiryDate().isBefore(today) ? "EXPIRED"
                : !m.getExpiryDate().isAfter(today.plusDays(expiryWarningDays)) ? "NEAR_EXPIRY" : "OK";

        return MedicineResponse.builder()
                .id(m.getId())
                .name(m.getName())
                .batchNumber(m.getBatchNumber())
                .categoryId(m.getCategory() != null ? m.getCategory().getId() : null)
                .categoryName(m.getCategory() != null ? m.getCategory().getName() : null)
                .supplierId(m.getSupplier() != null ? m.getSupplier().getId() : null)
                .supplierName(m.getSupplier() != null ? m.getSupplier().getName() : null)
                .quantity(m.getQuantity())
                .reorderLevel(m.getReorderLevel())
                .manufacturingDate(m.getManufacturingDate())
                .expiryDate(m.getExpiryDate())
                .price(m.getPrice())
                .unit(m.getUnit())
                .description(m.getDescription())
                .stockStatus(stockStatus)
                .expiryStatus(expiryStatus)
                .build();
    }
}
