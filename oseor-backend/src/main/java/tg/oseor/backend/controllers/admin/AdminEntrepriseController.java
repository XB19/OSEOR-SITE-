package tg.oseor.backend.controllers.admin;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tg.oseor.backend.dtos.EntrepriseDTO;
import tg.oseor.backend.services.EntrepriseService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/entreprises")
@RequiredArgsConstructor
public class AdminEntrepriseController {
    private final EntrepriseService service;

    @GetMapping
    public ResponseEntity<List<EntrepriseDTO>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String secteur) {
        if ((search != null && !search.isBlank()) || (secteur != null && !secteur.isBlank())) {
            return ResponseEntity.ok(service.getEntreprisesFiltered(search, secteur));
        }
        return ResponseEntity.ok(service.getAllEntreprises());
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<EntrepriseDTO>> getPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String secteur) {
        Sort sort = Sort.by(sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        return ResponseEntity.ok(service.getEntreprisesFilteredPaginated(search, secteur, PageRequest.of(page, size, sort)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntrepriseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getAllEntreprises().stream()
                .filter(e -> e.getId() != null && e.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Entreprise not found")));
    }

    @PostMapping
    public ResponseEntity<EntrepriseDTO> create(@Valid @RequestBody EntrepriseDTO dto) {
        return ResponseEntity.ok(service.createEntreprise(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntrepriseDTO> update(@PathVariable Long id, @Valid @RequestBody EntrepriseDTO dto) {
        return ResponseEntity.ok(service.updateEntreprise(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteEntreprise(id);
        return ResponseEntity.noContent().build();
    }
}
