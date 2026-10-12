package tg.oseor.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tg.oseor.backend.dtos.ServiceDTO;
import tg.oseor.backend.mappers.OseorMapper;
import tg.oseor.backend.repositories.ServiceRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceService {
    private final ServiceRepository serviceRepository;
    private final OseorMapper mapper;

    public List<ServiceDTO> getAllServices() {
        return mapper.toServiceDTOList(serviceRepository.findAll());
    }

    public ServiceDTO createService(ServiceDTO serviceDTO) {
        tg.oseor.backend.entities.Service service = mapper.toServiceEntity(serviceDTO);
        return mapper.toServiceDTO(serviceRepository.save(service));
    }

    public ServiceDTO updateService(Long id, ServiceDTO serviceDTO) {
        tg.oseor.backend.entities.Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        service.setTitle(serviceDTO.getTitle());
        service.setDescription(serviceDTO.getDescription());
        service.setIcon(serviceDTO.getIcon());
        return mapper.toServiceDTO(serviceRepository.save(service));
    }

    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }
}
