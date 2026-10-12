package tg.oseor.backend.services;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import tg.oseor.backend.dtos.EntrepriseDTO;
import tg.oseor.backend.entities.Entreprise;
import tg.oseor.backend.mappers.OseorMapper;
import tg.oseor.backend.repositories.EntrepriseRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Validated
public class EntrepriseService {
    private final EntrepriseRepository entrepriseRepository;
    private final OseorMapper mapper;

    public List<EntrepriseDTO> getAllEntreprises() {
        return mapper.toEntrepriseDTOList(entrepriseRepository.findAllByOrderByNameAsc());
    }

    public List<EntrepriseDTO> getEntreprisesBySecteur(String secteur) {
        return mapper.toEntrepriseDTOList(entrepriseRepository.findBySecteurOrderByNameAsc(secteur));
    }

    public List<EntrepriseDTO> getEntreprisesFiltered(String search, String secteur) {
        return mapper.toEntrepriseDTOList(entrepriseRepository.findFiltered(search, secteur));
    }

    public EntrepriseDTO createEntreprise(@Valid EntrepriseDTO dto) {
        Entreprise entity = mapper.toEntrepriseEntity(dto);
        return mapper.toEntrepriseDTO(entrepriseRepository.save(entity));
    }

    public EntrepriseDTO updateEntreprise(Long id, @Valid EntrepriseDTO dto) {
        Entreprise entity = entrepriseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entreprise not found with id: " + id));
        entity.setName(dto.getName());
        entity.setSecteur(dto.getSecteur());
        entity.setDescription(dto.getDescription());
        entity.setLogoUrl(dto.getLogoUrl());
        entity.setOfficialSite(dto.getOfficialSite());
        return mapper.toEntrepriseDTO(entrepriseRepository.save(entity));
    }

    public void deleteEntreprise(Long id) {
        if (!entrepriseRepository.existsById(id)) {
            throw new RuntimeException("Entreprise not found with id: " + id);
        }
        entrepriseRepository.deleteById(id);
    }

    public Page<EntrepriseDTO> getEntreprisesPaginated(Pageable pageable) {
        return entrepriseRepository.findAll(pageable).map(mapper::toEntrepriseDTO);
    }

    public Page<EntrepriseDTO> getEntreprisesFilteredPaginated(String search, String secteur, Pageable pageable) {
        return entrepriseRepository.findFilteredPaginated(search, secteur, pageable)
                .map(mapper::toEntrepriseDTO);
    }
}
