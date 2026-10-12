package tg.oseor.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tg.oseor.backend.dtos.CandidatureDTO;
import tg.oseor.backend.entities.Candidature;
import tg.oseor.backend.mappers.OseorMapper;
import tg.oseor.backend.repositories.CandidatureRepository;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidatureService {
    private final CandidatureRepository repository;
    private final OseorMapper mapper;

    public List<CandidatureDTO> getAllCandidatures() {
        return mapper.toCandidatureDTOList(repository.findAllByOrderByCreatedAtDesc());
    }

    public List<CandidatureDTO> getCandidaturesByOffre(Long offreId) {
        return mapper.toCandidatureDTOList(repository.findAllByOffreIdOrderByCreatedAtDesc(offreId));
    }

    public CandidatureDTO getCandidatureById(Long id) {
        return mapper.toCandidatureDTO(repository.findById(id).orElseThrow());
    }

    public CandidatureDTO createCandidature(CandidatureDTO dto) {
        Candidature candidature = mapper.toCandidatureEntity(dto);
        return mapper.toCandidatureDTO(repository.save(candidature));
    }

    public void deleteCandidature(Long id) {
        repository.deleteById(id);
    }
    
    public CandidatureDTO archiveCandidature(Long id) {
        Candidature existing = repository.findById(id).orElseThrow();
        existing.setArchived(true);
        return mapper.toCandidatureDTO(repository.save(existing));
    }
}
