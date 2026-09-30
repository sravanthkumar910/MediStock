package com.medistock.controller;

import com.medistock.dto.request.SupplierRequest;
import com.medistock.dto.response.SupplierResponse;
import com.medistock.service.SupplierService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 *   GET    /api/suppliers?keyword=   - list / search suppliers
 *   GET    /api/suppliers/{id}       - get one supplier
 *   POST   /api/suppliers            - create supplier (Admin/Pharmacist)
 *   PUT    /api/suppliers/{id}       - update supplier (Admin/Pharmacist)
 *   DELETE /api/suppliers/{id}       - delete supplier (Admin)
 */
@RestController
@RequestMapping("/suppliers")
@RequiredArgsConstructor
@Tag(name = "Suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping
    public List<SupplierResponse> getAll(@RequestParam(required = false) String keyword) {
        return supplierService.getAll(keyword);
    }

    @GetMapping("/{id}")
    public SupplierResponse getById(@PathVariable Long id) {
        return supplierService.getById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST')")
    public ResponseEntity<SupplierResponse> create(@Valid @RequestBody SupplierRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(supplierService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST')")
    public SupplierResponse update(@PathVariable Long id, @Valid @RequestBody SupplierRequest request) {
        return supplierService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        supplierService.delete(id);
    }
}
