package tg.oseor.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tg.oseor.backend.dtos.StatDTO;
import tg.oseor.backend.mappers.OseorMapper;
import tg.oseor.backend.repositories.StatRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StatService {
    private final StatRepository statRepository;
    private final OseorMapper mapper;

    public List<StatDTO> getAllStats() {
        return mapper.toStatDTOList(statRepository.findAll());
    }

    public StatDTO createStat(StatDTO statDTO) {
        tg.oseor.backend.entities.Stat stat = mapper.toStatEntity(statDTO);
        return mapper.toStatDTO(statRepository.save(stat));
    }

    public StatDTO updateStat(Long id, StatDTO statDTO) {
        tg.oseor.backend.entities.Stat stat = statRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stat not found"));
        stat.setLabel(statDTO.getLabel());
        stat.setValue(statDTO.getValue());
        stat.setIcon(statDTO.getIcon());
        return mapper.toStatDTO(statRepository.save(stat));
    }

    public void deleteStat(Long id) {
        statRepository.deleteById(id);
    }
}
