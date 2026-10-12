package tg.oseor.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import tg.oseor.backend.dtos.EntrepriseDTO;
import tg.oseor.backend.services.EntrepriseService;

import java.util.List;

@RestController
@RequestMapping("/api/entreprises")
@RequiredArgsConstructor
public class EntrepriseController {
    private final EntrepriseService entrepriseService;

    @GetMapping
    public List<EntrepriseDTO> getAllEntreprises(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String secteur) {
        if ((search != null && !search.isBlank()) || (secteur != null && !secteur.isBlank())) {
            return entrepriseService.getEntreprisesFiltered(search, secteur);
        }
        return entrepriseService.getAllEntreprises();
    }

    @GetMapping("/paginated")
    public Page<EntrepriseDTO> getEntreprisesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String secteur) {
        Sort sort = Sort.by(sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        PageRequest pageable = PageRequest.of(page, size, sort);
        if ((search != null && !search.isBlank()) || (secteur != null && !secteur.isBlank())) {
            return entrepriseService.getEntreprisesFilteredPaginated(search, secteur, pageable);
        }
        return entrepriseService.getEntreprisesPaginated(pageable);
    }

    @GetMapping("/secteur/{secteur}")
    public List<EntrepriseDTO> getBySecteur(@PathVariable String secteur) {
        return entrepriseService.getEntreprisesBySecteur(secteur);
    }
}
