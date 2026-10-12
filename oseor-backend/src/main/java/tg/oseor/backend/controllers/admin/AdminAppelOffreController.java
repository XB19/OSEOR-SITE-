package tg.oseor.backend.controllers.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tg.oseor.backend.dtos.AppelOffreDTO;
import tg.oseor.backend.services.AppelOffreService;
import java.util.List;

@RestController
@RequestMapping("/api/admin/appels-offres")
@RequiredArgsConstructor
public class AdminAppelOffreController {
    private final AppelOffreService service;

    @GetMapping
    public ResponseEntity<List<AppelOffreDTO>> getAll() {
        return ResponseEntity.ok(service.getAllAppelsOffres());
    }

    @PostMapping
    public ResponseEntity<AppelOffreDTO> create(@RequestBody AppelOffreDTO dto) {
        return ResponseEntity.ok(service.createAppelOffre(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppelOffreDTO> update(@PathVariable Long id, @RequestBody AppelOffreDTO dto) {
        return ResponseEntity.ok(service.updateAppelOffre(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteAppelOffre(id);
        return ResponseEntity.ok().build();
    }
}
