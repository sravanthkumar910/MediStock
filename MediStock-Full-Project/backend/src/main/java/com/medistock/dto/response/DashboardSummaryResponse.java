package com.medistock.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Builder
public class DashboardSummaryResponse {
    private long totalMedicines;
    private long lowStockCount;
    private long outOfStockCount;
    private long nearExpiryCount;
    private long expiredCount;
    private long totalSuppliers;
    private long pendingPurchaseOrders;
    private BigDecimal totalInventoryValue;
    private List<MedicineResponse> lowStockItems;
    private List<MedicineResponse> nearExpiryItems;
}
