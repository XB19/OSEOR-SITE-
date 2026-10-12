package tg.oseor.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tg.oseor.backend.dtos.SiteContentDTO;
import tg.oseor.backend.entities.SiteContent;
import tg.oseor.backend.mappers.OseorMapper;
import tg.oseor.backend.repositories.SiteContentRepository;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SiteContentService {
    private final SiteContentRepository repository;
    private final OseorMapper mapper;

    public List<SiteContentDTO> getAllContent() {
        return mapper.toSiteContentDTOList(repository.findAll());
    }

    public List<SiteContentDTO> getContentBySection(String section) {
        return mapper.toSiteContentDTOList(repository.findBySection(section));
    }

    public SiteContentDTO updateContent(String key, String value) {
        SiteContent content = repository.findByContentKey(key)
                .orElse(SiteContent.builder().contentKey(key).build());
        content.setContentValue(value);
        return mapper.toSiteContentDTO(repository.save(content));
    }

    public Map<String, String> getAllContentAsMap() {
        return repository.findAll().stream()
                .collect(Collectors.toMap(SiteContent::getContentKey, SiteContent::getContentValue));
    }
    
    public SiteContentDTO saveContent(SiteContentDTO dto) {
        SiteContent entity = mapper.toSiteContentEntity(dto);
        return mapper.toSiteContentDTO(repository.save(entity));
    }
}
