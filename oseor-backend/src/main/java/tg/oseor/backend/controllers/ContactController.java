package tg.oseor.backend.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tg.oseor.backend.dtos.ContactDTO;
import tg.oseor.backend.services.ContactService;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {
    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<ContactDTO> submitContact(@Valid @RequestBody ContactDTO contactDTO) {
        return ResponseEntity.ok(contactService.saveContact(contactDTO));
    }

    @GetMapping
    public ResponseEntity<java.util.List<ContactDTO>> getAllContacts() {
        return ResponseEntity.ok(contactService.getAllContacts());
    }
}
