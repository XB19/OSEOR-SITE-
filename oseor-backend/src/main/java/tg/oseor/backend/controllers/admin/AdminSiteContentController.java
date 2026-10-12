package tg.oseor.backend.controllers.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tg.oseor.backend.dtos.SiteContentDTO;
import tg.oseor.backend.services.SiteContentService;
import java.util.List;

@RestController
@RequestMapping("/api/admin/content")
@RequiredArgsConstructor
public class AdminSiteContentController {
    private final SiteContentService service;

    @GetMapping
    public ResponseEntity<List<SiteContentDTO>> getAll() {
        return ResponseEntity.ok(service.getAllContent());
    }

    @PostMapping
    public ResponseEntity<SiteContentDTO> save(@RequestBody SiteContentDTO content) {
        return ResponseEntity.ok(service.saveContent(content));
    }

    @PutMapping("/{key}")
    public ResponseEntity<SiteContentDTO> update(@PathVariable String key, @RequestBody String value) {
        return ResponseEntity.ok(service.updateContent(key, value));
    }
}
