package tg.oseor.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tg.oseor.backend.entities.SiteContent;
import java.util.List;
import java.util.Optional;

public interface SiteContentRepository extends JpaRepository<SiteContent, Long> {
    Optional<SiteContent> findByContentKey(String contentKey);
    List<SiteContent> findBySection(String section);
}
