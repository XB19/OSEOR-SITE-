package tg.oseor.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tg.oseor.backend.dtos.OffreEmploiDTO;
import tg.oseor.backend.entities.OffreEmploi;
import tg.oseor.backend.mappers.OseorMapper;
import tg.oseor.backend.repositories.OffreEmploiRepository;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OffreEmploiService {
    private final OffreEmploiRepository repository;
    private final OseorMapper mapper;

    public List<OffreEmploiDTO> getAllOffres() {
        return mapper.toOffreEmploiDTOList(repository.findAllByOrderByCreatedAtDesc());
    }

    public List<OffreEmploiDTO> getPublicOffres() {
        return mapper.toOffreEmploiDTOList(repository.findAllByPublishedTrueAndArchivedFalseOrderByCreatedAtDesc());
    }

    public OffreEmploiDTO getOffreById(Long id) {
        return mapper.toOffreEmploiDTO(repository.findById(id).orElseThrow());
    }

    public OffreEmploiDTO createOffre(OffreEmploiDTO dto) {
        OffreEmploi entity = mapper.toOffreEmploiEntity(dto);
        return mapper.toOffreEmploiDTO(repository.save(entity));
    }

    public OffreEmploiDTO updateOffre(Long id, OffreEmploiDTO dto) {
        OffreEmploi existing = repository.findById(id).orElseThrow();
        existing.setTitle(dto.getTitle());
        existing.setDescription(dto.getDescription());
        existing.setLocation(dto.getLocation());
        existing.setContractType(dto.getContractType());
        existing.setDeadline(dto.getDeadline());
        existing.setPublished(dto.isPublished());
        existing.setArchived(dto.isArchived());
        return mapper.toOffreEmploiDTO(repository.save(existing));
    }

    public void deleteOffre(Long id) {
        repository.deleteById(id);
    }
}
