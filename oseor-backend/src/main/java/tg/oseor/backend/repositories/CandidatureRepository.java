package tg.oseor.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tg.oseor.backend.entities.Candidature;
import java.util.List;

public interface CandidatureRepository extends JpaRepository<Candidature, Long> {
    List<Candidature> findAllByOrderByCreatedAtDesc();
    List<Candidature> findAllByOffreIdOrderByCreatedAtDesc(Long offreId);
}
