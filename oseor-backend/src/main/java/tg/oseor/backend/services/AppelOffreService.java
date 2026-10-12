package tg.oseor.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tg.oseor.backend.dtos.AppelOffreDTO;
import tg.oseor.backend.entities.AppelOffre;
import tg.oseor.backend.mappers.OseorMapper;
import tg.oseor.backend.repositories.AppelOffreRepository;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppelOffreService {
    private final AppelOffreRepository repository;
    private final OseorMapper mapper;

    public List<AppelOffreDTO> getAllAppelsOffres() {
        return mapper.toAppelOffreDTOList(repository.findAllByOrderByCreatedAtDesc());
    }

    public List<AppelOffreDTO> getPublicAppelsOffres() {
        return mapper.toAppelOffreDTOList(repository.findAllByPublishedTrueAndArchivedFalseOrderByCreatedAtDesc());
    }

    public AppelOffreDTO getAppelOffreById(Long id) {
        return mapper.toAppelOffreDTO(repository.findById(id).orElseThrow());
    }

    public AppelOffreDTO createAppelOffre(AppelOffreDTO dto) {
        AppelOffre entity = mapper.toAppelOffreEntity(dto);
        return mapper.toAppelOffreDTO(repository.save(entity));
    }

    public AppelOffreDTO updateAppelOffre(Long id, AppelOffreDTO dto) {
        AppelOffre existing = repository.findById(id).orElseThrow();
        existing.setReference(dto.getReference());
        existing.setTitle(dto.getTitle());
        existing.setDescription(dto.getDescription());
        existing.setDeadline(dto.getDeadline());
        existing.setDocumentUrls(dto.getDocumentUrls());
        existing.setPublished(dto.isPublished());
        existing.setArchived(dto.isArchived());
        return mapper.toAppelOffreDTO(repository.save(existing));
    }

    public void deleteAppelOffre(Long id) {
        repository.deleteById(id);
    }
}
