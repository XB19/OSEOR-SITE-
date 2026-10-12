package tg.oseor.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tg.oseor.backend.entities.OffreEmploi;
import java.util.List;

public interface OffreEmploiRepository extends JpaRepository<OffreEmploi, Long> {
    List<OffreEmploi> findAllByOrderByCreatedAtDesc();
    List<OffreEmploi> findAllByPublishedTrueAndArchivedFalseOrderByCreatedAtDesc();
}
