package com.medistock.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.medistock.dto.response.StockLogResponse;
import com.medistock.service.StockLogService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

/**
 *   GET /api/stock-logs?medicineId=&page=&size=  - paginated stock movement history
 */
@RestController
@RequestMapping("/stock-logs")
@RequiredArgsConstructor
@Tag(name = "Stock Movement History")
public class StockLogController {

    private final StockLogService stockLogService;

    @GetMapping
    public Page<StockLogResponse> history(
            @RequestParam(required = false) Long medicineId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return stockLogService.history(medicineId, pageable);
    }
}
