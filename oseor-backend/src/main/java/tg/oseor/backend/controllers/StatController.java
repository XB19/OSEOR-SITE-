package tg.oseor.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tg.oseor.backend.dtos.StatDTO;
import tg.oseor.backend.services.StatService;

import java.util.List;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatController {
    private final StatService statService;

    @GetMapping
    public List<StatDTO> getAllStats() {
        return statService.getAllStats();
    }
}
