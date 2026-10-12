package tg.oseor.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tg.oseor.backend.entities.Service;

public interface ServiceRepository extends JpaRepository<Service, Long> {
}
