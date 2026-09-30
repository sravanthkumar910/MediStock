package com.medistock.service;

import com.medistock.dto.request.PurchaseOrderRequest;
import com.medistock.entity.*;
import com.medistock.exception.ResourceNotFoundException;
import com.medistock.repository.MedicineRepository;
import com.medistock.repository.PurchaseOrderRepository;
import com.medistock.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SupplierRepository supplierRepository;
    private final MedicineRepository medicineRepository;
    private final StockLogService stockLogService;

    public Page<PurchaseOrder> list(PurchaseOrderStatus status, Pageable pageable) {
        if (status != null) {
            return purchaseOrderRepository.findByStatus(status, pageable);
        }
        return purchaseOrderRepository.findAll(pageable);
    }

    public PurchaseOrder getById(Long id) {
        return findEntity(id);
    }

    public PurchaseOrder create(PurchaseOrderRequest request, User actor) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found: " + request.getSupplierId()));

        PurchaseOrder order = PurchaseOrder.builder()
                .orderNumber("PO-" + Instant.now().toEpochMilli())
                .supplier(supplier)
                .status(PurchaseOrderStatus.PENDING)
                .createdBy(actor)
                .notes(request.getNotes())
                .build();

        BigDecimal total = BigDecimal.ZERO;
        for (PurchaseOrderRequest.Item itemReq : request.getItems()) {
            Medicine medicine = medicineRepository.findById(itemReq.getMedicineId())
                    .orElseThrow(() -> new ResourceNotFoundException("Medicine not found: " + itemReq.getMedicineId()));

            PurchaseOrderItem item = PurchaseOrderItem.builder()
                    .purchaseOrder(order)
                    .medicine(medicine)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(itemReq.getUnitPrice())
                    .build();
            order.getItems().add(item);
            total = total.add(itemReq.getUnitPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity())));
        }
        order.setTotalAmount(total);
        return purchaseOrderRepository.save(order);
    }

    /** Marks a PENDING/ORDERED purchase order as RECEIVED and increments stock for every item. */
    public PurchaseOrder markReceived(Long id, User actor) {
        PurchaseOrder order = findEntity(id);
        if (order.getStatus() == PurchaseOrderStatus.RECEIVED) {
            throw new IllegalStateException("Purchase order already marked as received");
        }
        for (PurchaseOrderItem item : order.getItems()) {
            Medicine medicine = item.getMedicine();
            medicine.setQuantity(medicine.getQuantity() + item.getQuantity());
            medicineRepository.save(medicine);
            stockLogService.record(medicine, StockMovementType.STOCK_IN, item.getQuantity(), actor,
                    "Received via purchase order " + order.getOrderNumber());
        }
        order.setStatus(PurchaseOrderStatus.RECEIVED);
        return purchaseOrderRepository.save(order);
    }

    public PurchaseOrder updateStatus(Long id, PurchaseOrderStatus status) {
        PurchaseOrder order = findEntity(id);
        order.setStatus(status);
        return purchaseOrderRepository.save(order);
    }

    public List<PurchaseOrder> bySupplier(Long supplierId) {
        return purchaseOrderRepository.findBySupplierId(supplierId);
    }

    private PurchaseOrder findEntity(Long id) {
        return purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order not found with id: " + id));
    }
}
