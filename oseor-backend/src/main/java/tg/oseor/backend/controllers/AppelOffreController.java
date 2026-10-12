package tg.oseor.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tg.oseor.backend.dtos.AppelOffreDTO;
import tg.oseor.backend.services.AppelOffreService;

import java.util.List;

@RestController
@RequestMapping("/api/appels-offres")
@RequiredArgsConstructor
public class AppelOffreController {
    private final AppelOffreService service;

    @GetMapping
    public List<AppelOffreDTO> getPublicAppelsOffres() {
        return service.getPublicAppelsOffres();
    }

    @GetMapping("/{id}")
    public AppelOffreDTO getAppelOffreById(@PathVariable Long id) {
        return service.getAppelOffreById(id);
    }
}
