package tg.oseor.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tg.oseor.backend.dtos.ActualiteDTO;
import tg.oseor.backend.entities.Actualite;
import tg.oseor.backend.mappers.OseorMapper;
import tg.oseor.backend.repositories.ActualiteRepository;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActualiteService {
    private final ActualiteRepository repository;
    private final OseorMapper mapper;

    public List<ActualiteDTO> getAllActualites() {
        return mapper.toActualiteDTOList(repository.findAllByOrderByDateDesc());
    }

    public List<ActualiteDTO> getPublicActualites() {
        return mapper.toActualiteDTOList(repository.findAllByPublishedTrueAndArchivedFalseOrderByDateDesc());
    }

    public ActualiteDTO getActualiteById(Long id) {
        return mapper.toActualiteDTO(repository.findById(id).orElseThrow());
    }

    public ActualiteDTO createActualite(ActualiteDTO dto) {
        Actualite actualite = mapper.toActualiteEntity(dto);
        return mapper.toActualiteDTO(repository.save(actualite));
    }

    public ActualiteDTO updateActualite(Long id, ActualiteDTO dto) {
        Actualite existing = repository.findById(id).orElseThrow();
        existing.setTitle(dto.getTitle());
        existing.setSummary(dto.getSummary());
        existing.setContent(dto.getContent());
        existing.setImageUrl(dto.getImageUrl());
        existing.setPublished(dto.isPublished());
        existing.setArchived(dto.isArchived());
        return mapper.toActualiteDTO(repository.save(existing));
    }

    public void deleteActualite(Long id) {
        repository.deleteById(id);
    }
}
