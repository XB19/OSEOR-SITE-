package tg.oseor.backend.controllers.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tg.oseor.backend.dtos.ActualiteDTO;
import tg.oseor.backend.services.ActualiteService;
import java.util.List;

@RestController
@RequestMapping("/api/admin/actualites")
@RequiredArgsConstructor
public class AdminActualiteController {
    private final ActualiteService service;

    @GetMapping
    public ResponseEntity<List<ActualiteDTO>> getAll() {
        return ResponseEntity.ok(service.getAllActualites());
    }

    @PostMapping
    public ResponseEntity<ActualiteDTO> create(@RequestBody ActualiteDTO actualite) {
        return ResponseEntity.ok(service.createActualite(actualite));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActualiteDTO> update(@PathVariable Long id, @RequestBody ActualiteDTO actualite) {
        return ResponseEntity.ok(service.updateActualite(id, actualite));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteActualite(id);
        return ResponseEntity.ok().build();
    }
}
