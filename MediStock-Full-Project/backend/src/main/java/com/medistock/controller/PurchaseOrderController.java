package com.medistock.controller;

import com.medistock.dto.request.PurchaseOrderRequest;
import com.medistock.entity.PurchaseOrder;
import com.medistock.entity.PurchaseOrderStatus;
import com.medistock.entity.User;
import com.medistock.service.PurchaseOrderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 *   GET   /api/purchase-orders?status=&page=&size=  - list purchase orders
 *   GET   /api/purchase-orders/{id}                  - get one purchase order
 *   GET   /api/purchase-orders/supplier/{supplierId}  - list orders for a supplier
 *   POST  /api/purchase-orders                        - create a purchase order (Admin/Pharmacist)
 *   PATCH /api/purchase-orders/{id}/status             - update status (Admin/Pharmacist)
 *   POST  /api/purchase-orders/{id}/receive            - mark received & restock (Admin/Pharmacist)
 */
@RestController
@RequestMapping("/purchase-orders")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','PHARMACIST')")
@Tag(name = "Purchase Orders")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    @GetMapping
    public Page<PurchaseOrder> list(@RequestParam(required = false) PurchaseOrderStatus status,
                                     @RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return purchaseOrderService.list(status, pageable);
    }

    @GetMapping("/{id}")
    public PurchaseOrder getById(@PathVariable Long id) {
        return purchaseOrderService.getById(id);
    }

    @GetMapping("/supplier/{supplierId}")
    public List<PurchaseOrder> bySupplier(@PathVariable Long supplierId) {
        return purchaseOrderService.bySupplier(supplierId);
    }

    @PostMapping
    public ResponseEntity<PurchaseOrder> create(@Valid @RequestBody PurchaseOrderRequest request) {
        User actor = CurrentUserResolver.currentUser();
        return ResponseEntity.status(HttpStatus.CREATED).body(purchaseOrderService.create(request, actor));
    }

    @PatchMapping("/{id}/status")
    public PurchaseOrder updateStatus(@PathVariable Long id, @RequestParam PurchaseOrderStatus status) {
        return purchaseOrderService.updateStatus(id, status);
    }

    @PostMapping("/{id}/receive")
    public PurchaseOrder receive(@PathVariable Long id) {
        User actor = CurrentUserResolver.currentUser();
        return purchaseOrderService.markReceived(id, actor);
    }
}
