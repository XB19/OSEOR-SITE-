package tg.oseor.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tg.oseor.backend.entities.Actualite;
import java.util.List;

public interface ActualiteRepository extends JpaRepository<Actualite, Long> {
    List<Actualite> findAllByOrderByDateDesc();
    List<Actualite> findAllByPublishedTrueAndArchivedFalseOrderByDateDesc();
}
