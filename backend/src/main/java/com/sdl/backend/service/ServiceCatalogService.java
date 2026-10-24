package com.sdl.backend.service;

import com.sdl.backend.exception.ResourceNotFoundException;
import com.sdl.backend.model.WellnessService;
import com.sdl.backend.repository.WellnessServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceCatalogService {

    private final WellnessServiceRepository serviceRepository;

    public List<WellnessService> getAllActiveServices() {
        return serviceRepository.findByStatus("Active");
    }

    public List<WellnessService> getAllServices() {
        return serviceRepository.findAll();
    }

    public WellnessService getServiceById(Long serviceId) {
        return serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Wellness service not found with ID: " + serviceId));
    }

    public List<WellnessService> filterByCategory(String category) {
        return serviceRepository.findByCategoryIgnoreCaseAndStatus(category, "Active");
    }

    @Transactional
    public WellnessService createOrUpdateService(WellnessService service) {
        return serviceRepository.save(service);
    }
}
