package com.medistock.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PurchaseOrderRequest {
    @NotNull
    private Long supplierId;

    @NotEmpty
    @Valid
    private List<Item> items;

    private String notes;

    @Getter
    @Setter
    public static class Item {
        @NotNull
        private Long medicineId;
        @NotNull
        @Positive
        private Integer quantity;
        @NotNull
        @Positive
        private java.math.BigDecimal unitPrice;
    }
}
