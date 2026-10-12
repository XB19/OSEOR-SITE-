package tg.oseor.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tg.oseor.backend.dtos.OffreEmploiDTO;
import tg.oseor.backend.services.OffreEmploiService;

import java.util.List;

@RestController
@RequestMapping("/api/offres-emploi")
@RequiredArgsConstructor
public class OffreEmploiController {
    private final OffreEmploiService service;

    @GetMapping
    public List<OffreEmploiDTO> getPublicOffres() {
        return service.getPublicOffres();
    }

    @GetMapping("/{id}")
    public OffreEmploiDTO getOffreById(@PathVariable Long id) {
        return service.getOffreById(id);
    }
}
