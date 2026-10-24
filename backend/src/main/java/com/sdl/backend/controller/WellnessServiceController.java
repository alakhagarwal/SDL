package com.sdl.backend.controller;

import com.sdl.backend.model.WellnessService;
import com.sdl.backend.service.ServiceCatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class WellnessServiceController {

    private final ServiceCatalogService serviceCatalogService;

    // FR-016 & FR-020: Browse active wellness service catalog
    @GetMapping
    public ResponseEntity<List<WellnessService>> getAllActiveServices() {
        return ResponseEntity.ok(serviceCatalogService.getAllActiveServices());
    }

    // FR-017: View detailed service specifications
    @GetMapping("/{id}")
    public ResponseEntity<WellnessService> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceCatalogService.getServiceById(id));
    }

    // FR-019: Filter by category (Mental Health, Academic Stress, Nutrition & Fitness, Peer Support)
    @GetMapping("/category/{category}")
    public ResponseEntity<List<WellnessService>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(serviceCatalogService.filterByCategory(category));
    }
}
