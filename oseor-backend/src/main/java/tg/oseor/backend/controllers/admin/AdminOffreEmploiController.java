package tg.oseor.backend.controllers.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tg.oseor.backend.dtos.OffreEmploiDTO;
import tg.oseor.backend.services.OffreEmploiService;
import java.util.List;

@RestController
@RequestMapping("/api/admin/offres")
@RequiredArgsConstructor
public class AdminOffreEmploiController {
    private final OffreEmploiService service;

    @GetMapping
    public ResponseEntity<List<OffreEmploiDTO>> getAll() {
        return ResponseEntity.ok(service.getAllOffres());
    }

    @PostMapping
    public ResponseEntity<OffreEmploiDTO> create(@RequestBody OffreEmploiDTO dto) {
        return ResponseEntity.ok(service.createOffre(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OffreEmploiDTO> update(@PathVariable Long id, @RequestBody OffreEmploiDTO dto) {
        return ResponseEntity.ok(service.updateOffre(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteOffre(id);
        return ResponseEntity.ok().build();
    }
}
