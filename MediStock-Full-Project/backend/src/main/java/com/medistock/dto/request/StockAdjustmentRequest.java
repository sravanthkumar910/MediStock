package com.medistock.dto.request;

import com.medistock.entity.StockMovementType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StockAdjustmentRequest {
    @NotNull
    private StockMovementType movementType; // STOCK_IN, STOCK_OUT, ADJUSTMENT

    @NotNull
    @PositiveOrZero
    private Integer quantity; // positive number; direction comes from movementType

    private String remarks;
}
