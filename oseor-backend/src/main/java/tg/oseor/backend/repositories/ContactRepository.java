package tg.oseor.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tg.oseor.backend.entities.Contact;

public interface ContactRepository extends JpaRepository<Contact, Long> {
}
