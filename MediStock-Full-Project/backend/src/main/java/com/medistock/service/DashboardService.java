package com.medistock.service;

import com.medistock.dto.response.DashboardSummaryResponse;
import com.medistock.dto.response.MedicineResponse;
import com.medistock.entity.Medicine;
import com.medistock.entity.PurchaseOrderStatus;
import com.medistock.repository.MedicineRepository;
import com.medistock.repository.PurchaseOrderRepository;
import com.medistock.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final MedicineRepository medicineRepository;
    private final SupplierRepository supplierRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    @Value("${medistock.alerts.expiry-warning-days}")
    private int expiryWarningDays;

    public DashboardSummaryResponse summary() {
        List<Medicine> lowStock = medicineRepository.findLowStock();
        List<Medicine> expiring = medicineRepository.findExpiringBefore(java.time.LocalDate.now().plusDays(expiryWarningDays));

        BigDecimal totalValue = medicineRepository.findAll().stream()
                .map(m -> m.getPrice().multiply(BigDecimal.valueOf(m.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DashboardSummaryResponse.builder()
                .totalMedicines(medicineRepository.count())
                .lowStockCount(lowStock.size())
                .outOfStockCount(medicineRepository.findOutOfStock().size())
                .nearExpiryCount(expiring.size())
                .expiredCount(medicineRepository.findExpired().size())
                .totalSuppliers(supplierRepository.count())
                .pendingPurchaseOrders(purchaseOrderRepository.countByStatus(PurchaseOrderStatus.PENDING))
                .totalInventoryValue(totalValue)
                .lowStockItems(lowStock.stream().map(m -> MedicineResponse.from(m, expiryWarningDays)).toList())
                .nearExpiryItems(expiring.stream().map(m -> MedicineResponse.from(m, expiryWarningDays)).toList())
                .build();
    }
}
