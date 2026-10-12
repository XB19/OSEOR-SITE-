package tg.oseor.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tg.oseor.backend.dtos.ActualiteDTO;
import tg.oseor.backend.services.ActualiteService;

import java.util.List;

@RestController
@RequestMapping("/api/actualites")
@RequiredArgsConstructor
public class ActualiteController {
    private final ActualiteService service;

    @GetMapping
    public List<ActualiteDTO> getPublicActualites() {
        return service.getPublicActualites();
    }

    @GetMapping("/{id}")
    public ActualiteDTO getActualiteById(@PathVariable Long id) {
        return service.getActualiteById(id);
    }
}
