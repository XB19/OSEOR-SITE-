package tg.oseor.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tg.oseor.backend.dtos.SecteurDTO;
import tg.oseor.backend.services.SecteurService;

import java.util.List;

@RestController
@RequestMapping("/api/secteurs")
@RequiredArgsConstructor
public class SecteurController {
    private final SecteurService secteurService;

    @GetMapping
    public List<SecteurDTO> getAllSecteurs() {
        return secteurService.getAllSecteurs();
    }
}
