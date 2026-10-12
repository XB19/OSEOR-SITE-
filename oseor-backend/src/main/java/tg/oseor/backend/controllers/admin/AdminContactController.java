package tg.oseor.backend.controllers.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tg.oseor.backend.dtos.ContactDTO;
import tg.oseor.backend.services.ContactService;
import java.util.List;

@RestController
@RequestMapping("/api/admin/messages")
@RequiredArgsConstructor
public class AdminContactController {
    private final ContactService service;

    @GetMapping
    public ResponseEntity<List<ContactDTO>> getAll() {
        return ResponseEntity.ok(service.getAllContacts());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteContact(id);
        return ResponseEntity.ok().build();
    }
}
