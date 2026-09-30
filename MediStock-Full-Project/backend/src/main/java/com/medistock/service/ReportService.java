package com.medistock.service;

import com.medistock.entity.Medicine;
import com.medistock.entity.Supplier;
import com.medistock.repository.MedicineRepository;
import com.medistock.repository.SupplierRepository;
import com.opencsv.CSVWriter;
import com.lowagie.text.Cell;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Table;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.StringWriter;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final MedicineRepository medicineRepository;
    private final SupplierRepository supplierRepository;

    /** Builds a CSV export of the full inventory for download from /reports/inventory/export. */
    public String exportInventoryCsv() {
        List<Medicine> medicines = medicineRepository.findAll();
        StringWriter sw = new StringWriter();
        try (CSVWriter writer = new CSVWriter(sw)) {
            writer.writeNext(new String[]{
                    "ID", "Name", "Batch Number", "Category", "Supplier", "Quantity",
                    "Reorder Level", "Manufacturing Date", "Expiry Date", "Price", "Unit"
            });
            for (Medicine m : medicines) {
                writer.writeNext(new String[]{
                        String.valueOf(m.getId()),
                        m.getName(),
                        m.getBatchNumber(),
                        m.getCategory() != null ? m.getCategory().getName() : "",
                        m.getSupplier() != null ? m.getSupplier().getName() : "",
                        String.valueOf(m.getQuantity()),
                        String.valueOf(m.getReorderLevel()),
                        String.valueOf(m.getManufacturingDate()),
                        String.valueOf(m.getExpiryDate()),
                        String.valueOf(m.getPrice()),
                        m.getUnit() == null ? "" : m.getUnit()
                });
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate CSV report", e);
        }
        return sw.toString();
    }

    public byte[] exportPdf(String reportType) {
        String normalizedType = reportType.toLowerCase(Locale.ROOT);
        List<Medicine> medicines = medicineRepository.findAll();
        List<String[]> rows = new ArrayList<>();
        String title;
        String[] headers;

        switch (normalizedType) {
            case "inventory" -> {
                title = "Inventory Summary";
                headers = new String[]{"Medicine", "Batch", "Category", "Supplier", "Quantity", "Price"};
                medicines.forEach(medicine -> rows.add(new String[]{
                        medicine.getName(), medicine.getBatchNumber(), categoryName(medicine), supplierName(medicine),
                        String.valueOf(medicine.getQuantity()), String.valueOf(medicine.getPrice())
                }));
            }
            case "expiry" -> {
                title = "Expiry Report";
                headers = new String[]{"Medicine", "Batch", "Expiry Date", "Quantity", "Status"};
                LocalDate cutoff = LocalDate.now().plusDays(45);
                medicines.stream()
                        .filter(medicine -> medicine.getExpiryDate() != null && !medicine.getExpiryDate().isAfter(cutoff))
                        .forEach(medicine -> rows.add(new String[]{
                                medicine.getName(), medicine.getBatchNumber(), String.valueOf(medicine.getExpiryDate()),
                                String.valueOf(medicine.getQuantity()),
                                medicine.getExpiryDate().isBefore(LocalDate.now()) ? "Expired" : "Expiring soon"
                        }));
            }
            case "lowstock" -> {
                title = "Low Stock Report";
                headers = new String[]{"Medicine", "Batch", "Quantity", "Reorder Level", "Supplier"};
                medicines.stream()
                        .filter(medicine -> medicine.getQuantity() <= medicine.getReorderLevel())
                        .forEach(medicine -> rows.add(new String[]{
                                medicine.getName(), medicine.getBatchNumber(), String.valueOf(medicine.getQuantity()),
                                String.valueOf(medicine.getReorderLevel()), supplierName(medicine)
                        }));
            }
            case "supplier" -> {
                title = "Supplier Performance";
                headers = new String[]{"Supplier", "Contact", "Email", "Medicines Supplied"};
                for (Supplier supplier : supplierRepository.findAll()) {
                    rows.add(new String[]{supplier.getName(), supplier.getContactNumber(), supplier.getEmail(),
                            String.valueOf(medicineRepository.countBySupplierId(supplier.getId()))});
                }
            }
            default -> throw new IllegalArgumentException("Unsupported report type: " + reportType);
        }

        return buildPdf(title, headers, rows);
    }

    private byte[] buildPdf(String title, String[] headers, List<String[]> rows) {
        try (ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate(), 28, 28, 28, 28);
            PdfWriter.getInstance(document, output);
            document.open();
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            document.add(new Paragraph("MediStock - " + title, titleFont));
            document.add(new Paragraph("Generated on " + LocalDate.now()));
            document.add(new Paragraph(" "));

            Table table = new Table(headers.length);
            table.setWidth(100);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9);
            for (String header : headers) {
                Cell cell = new Cell(new Phrase(header, headerFont));
                cell.setBackgroundColor(java.awt.Color.LIGHT_GRAY);
                table.addCell(cell);
            }
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 8);
            for (String[] row : rows) {
                for (String value : row) table.addCell(new Phrase(value == null ? "" : value, bodyFont));
            }
            if (rows.isEmpty()) document.add(new Paragraph("No records matched this report."));
            document.add(table);
            document.close();
            return output.toByteArray();
        } catch (DocumentException e) {
            throw new IllegalStateException("Failed to generate PDF report", e);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to close PDF report", e);
        }
    }

    private String categoryName(Medicine medicine) {
        return medicine.getCategory() == null ? "" : medicine.getCategory().getName();
    }

    private String supplierName(Medicine medicine) {
        return medicine.getSupplier() == null ? "" : medicine.getSupplier().getName();
    }
}
