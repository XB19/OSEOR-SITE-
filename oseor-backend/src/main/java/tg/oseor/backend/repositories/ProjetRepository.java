package tg.oseor.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tg.oseor.backend.entities.Projet;

public interface ProjetRepository extends JpaRepository<Projet, Long> {
}
