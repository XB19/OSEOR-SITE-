package tg.oseor.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import tg.oseor.backend.dtos.ProjetDTO;
import tg.oseor.backend.mappers.OseorMapper;
import tg.oseor.backend.repositories.ProjetRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjetService {
    private final ProjetRepository projetRepository;
    private final OseorMapper mapper;

    public List<ProjetDTO> getAllProjets() {
        return mapper.toProjetDTOList(projetRepository.findAll());
    }

    public Page<ProjetDTO> getProjetsPaginated(Pageable pageable) {
        return projetRepository.findAll(pageable).map(mapper::toProjetDTO);
    }

    public ProjetDTO createProjet(ProjetDTO projetDTO) {
        tg.oseor.backend.entities.Projet projet = mapper.toProjetEntity(projetDTO);
        return mapper.toProjetDTO(projetRepository.save(projet));
    }

    public ProjetDTO updateProjet(Long id, ProjetDTO projetDTO) {
        tg.oseor.backend.entities.Projet projet = projetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projet not found"));
        projet.setTitle(projetDTO.getTitle());
        projet.setDescription(projetDTO.getDescription());
        projet.setImageUrl(projetDTO.getImage());
        return mapper.toProjetDTO(projetRepository.save(projet));
    }

    public void deleteProjet(Long id) {
        projetRepository.deleteById(id);
    }
}
