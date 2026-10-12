package tg.oseor.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tg.oseor.backend.dtos.ContactDTO;
import tg.oseor.backend.entities.Contact;
import tg.oseor.backend.mappers.OseorMapper;
import tg.oseor.backend.repositories.ContactRepository;

@Service
@RequiredArgsConstructor
public class ContactService {
    private final ContactRepository contactRepository;
    private final OseorMapper mapper;
    private final EmailService emailService;

    public ContactDTO saveContact(ContactDTO contactDTO) {
        Contact contact = mapper.toContactEntity(contactDTO);
        Contact savedContact = contactRepository.save(contact);
        // Le message est enregistré et visible dans le tableau de bord : un échec d’envoi
        // de l’e-mail de notification (SMTP non configuré, réseau…) ne doit pas faire échouer le formulaire.
        try {
            emailService.sendContactNotification(mapper.toContactDTO(savedContact));
        } catch (RuntimeException e) {
            org.slf4j.LoggerFactory.getLogger(ContactService.class).warn("Notification e-mail non envoyée : {}", e.getMessage());
        }
        return mapper.toContactDTO(savedContact);
    }

    public java.util.List<ContactDTO> getAllContacts() {
        return mapper.toContactDTOList(contactRepository.findAll());
    }

    public void deleteContact(Long id) {
        contactRepository.deleteById(id);
    }
}
