package com.medistock.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medistock.dto.request.CategoryRequest;
import com.medistock.dto.response.CategoryResponse;
import com.medistock.entity.Category;
import com.medistock.exception.BadRequestException;
import com.medistock.exception.DuplicateResourceException;
import com.medistock.exception.ResourceNotFoundException;
import com.medistock.repository.CategoryRepository;
import com.medistock.repository.MedicineRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final MedicineRepository medicineRepository;

    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll().stream().map(CategoryResponse::from).toList();
    }

    public CategoryResponse getById(Long id) {
        return CategoryResponse.from(findEntity(id));
    }

    public CategoryResponse create(CategoryRequest request) {
        String name = normalizeName(request.getName());
        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new DuplicateResourceException("Category '" + name + "' already exists");
        }
        Category category = Category.builder()
                .name(name)
                .description(normalizeDescription(request.getDescription()))
                .build();
        return CategoryResponse.from(categoryRepository.save(category));
    }

    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = findEntity(id);
        String name = normalizeName(request.getName());
        if (!category.getName().equalsIgnoreCase(name) && categoryRepository.existsByNameIgnoreCase(name)) {
            throw new DuplicateResourceException("Category '" + name + "' already exists");
        }
        category.setName(name);
        category.setDescription(normalizeDescription(request.getDescription()));
        return CategoryResponse.from(categoryRepository.save(category));
    }

    public void delete(Long id) {
        Category category = findEntity(id);
        if (medicineRepository.existsByCategory_Id(id)) {
            throw new BadRequestException("Cannot delete category '" + category.getName() + "' because medicines are still linked to it.");
        }
        categoryRepository.delete(category);
    }

    private Category findEntity(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    private String normalizeName(String name) {
        String normalized = name == null ? "" : name.trim();
        if (normalized.isEmpty()) {
            throw new BadRequestException("Category name is required");
        }
        return normalized;
    }

    private String normalizeDescription(String description) {
        return description == null ? null : description.trim();
    }
}
