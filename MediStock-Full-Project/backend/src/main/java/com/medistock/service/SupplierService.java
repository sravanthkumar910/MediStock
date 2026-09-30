package com.medistock.service;

import com.medistock.dto.request.SupplierRequest;
import com.medistock.dto.response.SupplierResponse;
import com.medistock.entity.Supplier;
import com.medistock.exception.ResourceNotFoundException;
import com.medistock.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public List<SupplierResponse> getAll(String keyword) {
        List<Supplier> suppliers = (keyword == null || keyword.isBlank())
                ? supplierRepository.findAll()
                : supplierRepository.search(keyword);
        return suppliers.stream().map(SupplierResponse::from).toList();
    }

    public SupplierResponse getById(Long id) {
        return SupplierResponse.from(findEntity(id));
    }

    public SupplierResponse create(SupplierRequest request) {
        Supplier supplier = Supplier.builder()
                .name(request.getName())
                .contactNumber(request.getContactNumber())
                .email(request.getEmail())
                .address(request.getAddress())
                .notes(request.getNotes())
                .build();
        return SupplierResponse.from(supplierRepository.save(supplier));
    }

    public SupplierResponse update(Long id, SupplierRequest request) {
        Supplier supplier = findEntity(id);
        supplier.setName(request.getName());
        supplier.setContactNumber(request.getContactNumber());
        supplier.setEmail(request.getEmail());
        supplier.setAddress(request.getAddress());
        supplier.setNotes(request.getNotes());
        return SupplierResponse.from(supplierRepository.save(supplier));
    }

    public void delete(Long id) {
        supplierRepository.delete(findEntity(id));
    }

    private Supplier findEntity(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));
    }
}
