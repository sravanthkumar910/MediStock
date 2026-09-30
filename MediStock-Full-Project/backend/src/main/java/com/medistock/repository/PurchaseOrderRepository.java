package com.medistock.repository;

import com.medistock.entity.PurchaseOrder;
import com.medistock.entity.PurchaseOrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    Optional<PurchaseOrder> findByOrderNumber(String orderNumber);
    Page<PurchaseOrder> findByStatus(PurchaseOrderStatus status, Pageable pageable);
    List<PurchaseOrder> findBySupplierId(Long supplierId);
    long countByStatus(PurchaseOrderStatus status);
}
