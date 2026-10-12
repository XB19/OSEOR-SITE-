package tg.oseor.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tg.oseor.backend.entities.Secteur;

public interface SecteurRepository extends JpaRepository<Secteur, Long> {
}
