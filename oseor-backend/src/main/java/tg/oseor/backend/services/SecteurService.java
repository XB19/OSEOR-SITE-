package tg.oseor.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tg.oseor.backend.dtos.SecteurDTO;
import tg.oseor.backend.mappers.OseorMapper;
import tg.oseor.backend.repositories.SecteurRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SecteurService {
    private final SecteurRepository secteurRepository;
    private final OseorMapper mapper;

    public List<SecteurDTO> getAllSecteurs() {
        return mapper.toSecteurDTOList(secteurRepository.findAll());
    }

    public SecteurDTO createSecteur(SecteurDTO dto) {
        tg.oseor.backend.entities.Secteur entity = mapper.toSecteurEntity(dto);
        return mapper.toSecteurDTO(secteurRepository.save(entity));
    }

    public SecteurDTO updateSecteur(Long id, SecteurDTO dto) {
        tg.oseor.backend.entities.Secteur entity = secteurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Secteur not found"));
        entity.setName(dto.getName());
        entity.setImageUrl(dto.getImageUrl());
        return mapper.toSecteurDTO(secteurRepository.save(entity));
    }

    public void deleteSecteur(Long id) {
        secteurRepository.deleteById(id);
    }
}
