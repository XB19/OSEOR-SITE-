package tg.oseor.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;
import tg.oseor.backend.dtos.ProjetDTO;
import tg.oseor.backend.services.ProjetService;

import java.util.List;

@RestController
@RequestMapping("/api/projets")
@RequiredArgsConstructor
public class ProjetController {
    private final ProjetService projetService;

    @GetMapping
    public List<ProjetDTO> getAllProjets() {
        return projetService.getAllProjets();
    }

    @GetMapping("/paginated")
    public Page<ProjetDTO> getProjetsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return projetService.getProjetsPaginated(PageRequest.of(page, size));
    }

    @PostMapping
    public ProjetDTO createProjet(@RequestBody ProjetDTO projetDTO) {
        return projetService.createProjet(projetDTO);
    }

    @PutMapping("/{id}")
    public ProjetDTO updateProjet(@PathVariable Long id, @RequestBody ProjetDTO projetDTO) {
        return projetService.updateProjet(id, projetDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteProjet(@PathVariable Long id) {
        projetService.deleteProjet(id);
    }
}
