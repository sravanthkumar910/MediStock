package com.medistock.controller;

import com.medistock.service.ReportService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *   GET /api/reports/inventory/export - download full inventory as CSV
 *   GET /api/reports/{type}/pdf - download a generated PDF report
 */
@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','PHARMACIST')")
@Tag(name = "Reports & Export")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/inventory/export")
    public ResponseEntity<String> exportInventory() {
        String csv = reportService.exportInventoryCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=medistock_inventory.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }

    @GetMapping("/{reportType}/pdf")
    public ResponseEntity<byte[]> exportPdf(@org.springframework.web.bind.annotation.PathVariable String reportType) {
        byte[] pdf = reportService.exportPdf(reportType);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=medistock-" + reportType + "-report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
