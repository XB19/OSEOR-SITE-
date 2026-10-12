package tg.oseor.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tg.oseor.backend.dtos.ServiceDTO;
import tg.oseor.backend.services.ServiceService;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {
    private final ServiceService serviceService;

    @GetMapping
    public List<ServiceDTO> getAllServices() {
        return serviceService.getAllServices();
    }

    @PostMapping
    public ServiceDTO createService(@RequestBody ServiceDTO serviceDTO) {
        return serviceService.createService(serviceDTO);
    }

    @PutMapping("/{id}")
    public ServiceDTO updateService(@PathVariable Long id, @RequestBody ServiceDTO serviceDTO) {
        return serviceService.updateService(id, serviceDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);
    }
}
