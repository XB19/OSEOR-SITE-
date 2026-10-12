package tg.oseor.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tg.oseor.backend.entities.AppelOffre;
import java.util.List;

public interface AppelOffreRepository extends JpaRepository<AppelOffre, Long> {
    List<AppelOffre> findAllByOrderByCreatedAtDesc();
    List<AppelOffre> findAllByPublishedTrueAndArchivedFalseOrderByCreatedAtDesc();
}
