package tg.oseor.backend.controllers.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tg.oseor.backend.dtos.ProjetDTO;
import tg.oseor.backend.services.ProjetService;
import java.util.List;

@RestController
@RequestMapping("/api/admin/projets")
@RequiredArgsConstructor
public class AdminProjetController {
    private final ProjetService service;

    @GetMapping
    public ResponseEntity<List<ProjetDTO>> getAll() {
        return ResponseEntity.ok(service.getAllProjets());
    }

    @PostMapping
    public ResponseEntity<ProjetDTO> create(@RequestBody ProjetDTO projet) {
        return ResponseEntity.ok(service.createProjet(projet));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjetDTO> update(@PathVariable Long id, @RequestBody ProjetDTO projet) {
        return ResponseEntity.ok(service.updateProjet(id, projet));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteProjet(id);
        return ResponseEntity.ok().build();
    }
}
