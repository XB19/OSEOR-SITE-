package tg.oseor.backend.controllers.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tg.oseor.backend.dtos.CandidatureDTO;
import tg.oseor.backend.services.CandidatureService;
import java.util.List;

@RestController
@RequestMapping("/api/admin/candidatures")
@RequiredArgsConstructor
public class AdminCandidatureController {
    private final CandidatureService service;

    @GetMapping
    public ResponseEntity<List<CandidatureDTO>> getAll() {
        return ResponseEntity.ok(service.getAllCandidatures());
    }

    @PostMapping("/{id}/archive")
    public ResponseEntity<CandidatureDTO> archive(@PathVariable Long id) {
        return ResponseEntity.ok(service.archiveCandidature(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteCandidature(id);
        return ResponseEntity.ok().build();
    }
}
