package tg.oseor.backend.controllers.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tg.oseor.backend.dtos.SecteurDTO;
import tg.oseor.backend.services.SecteurService;
import java.util.List;

@RestController
@RequestMapping("/api/admin/secteurs")
@RequiredArgsConstructor
public class AdminSecteurController {
    private final SecteurService service;

    @GetMapping
    public ResponseEntity<List<SecteurDTO>> getAll() {
        return ResponseEntity.ok(service.getAllSecteurs());
    }

    @PostMapping
    public ResponseEntity<SecteurDTO> create(@RequestBody SecteurDTO dto) {
        return ResponseEntity.ok(service.createSecteur(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SecteurDTO> update(@PathVariable Long id, @RequestBody SecteurDTO dto) {
        return ResponseEntity.ok(service.updateSecteur(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteSecteur(id);
        return ResponseEntity.ok().build();
    }
}
