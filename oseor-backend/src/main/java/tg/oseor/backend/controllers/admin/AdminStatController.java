package tg.oseor.backend.controllers.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tg.oseor.backend.dtos.StatDTO;
import tg.oseor.backend.services.StatService;
import java.util.List;

@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
public class AdminStatController {
    private final StatService service;

    @GetMapping
    public ResponseEntity<List<StatDTO>> getAll() {
        return ResponseEntity.ok(service.getAllStats());
    }

    @PostMapping
    public ResponseEntity<StatDTO> create(@RequestBody StatDTO dto) {
        return ResponseEntity.ok(service.createStat(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StatDTO> update(@PathVariable Long id, @RequestBody StatDTO dto) {
        return ResponseEntity.ok(service.updateStat(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteStat(id);
        return ResponseEntity.ok().build();
    }
}
