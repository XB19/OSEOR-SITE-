package tg.oseor.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tg.oseor.backend.entities.Stat;

public interface StatRepository extends JpaRepository<Stat, Long> {
}
