package tg.oseor.backend.controllers.admin;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

/**
 * Envoi de fichiers depuis le tableau de bord (logos, images, dossiers d'appels d'offres).
 * Les fichiers sont enregistrés dans le dossier UPLOAD_DIR et servis publiquement sous /uploads/.
 * Seuls les types listés ci-dessous sont acceptés, et le contenu est vérifié (signature du fichier)
 * pour qu'on ne puisse pas déposer un script déguisé en image.
 */
@RestController
@RequestMapping("/api/admin/uploads")
public class AdminUploadController {

    private record FileKind(String extension, byte[]... signatures) {}

    private static final Map<String, FileKind> ALLOWED = Map.of(
            "image/jpeg", new FileKind("jpg", new byte[]{(byte) 0xFF, (byte) 0xD8, (byte) 0xFF}),
            "image/png", new FileKind("png", new byte[]{(byte) 0x89, 'P', 'N', 'G'}),
            "image/webp", new FileKind("webp", new byte[]{'R', 'I', 'F', 'F'}),
            "image/gif", new FileKind("gif", new byte[]{'G', 'I', 'F', '8'}),
            "application/pdf", new FileKind("pdf", new byte[]{'%', 'P', 'D', 'F'}),
            "application/msword", new FileKind("doc", new byte[]{(byte) 0xD0, (byte) 0xCF, 0x11, (byte) 0xE0}),
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", new FileKind("docx", new byte[]{'P', 'K', 3, 4})
    );

    private final Path uploadDir;

    public AdminUploadController(@Value("${oseor.upload-dir:uploads}") String uploadDir) throws IOException {
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(this.uploadDir);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> upload(@RequestParam("file") MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return error("Aucun fichier reçu.");
        }
        FileKind kind = ALLOWED.get(file.getContentType());
        if (kind == null) {
            return error("Format non accepté. Images : JPG, PNG, WEBP, GIF. Documents : PDF, DOC, DOCX.");
        }
        if (!hasSignature(file, kind)) {
            return error("Le contenu du fichier ne correspond pas à son format.");
        }

        String name = UUID.randomUUID() + "." + kind.extension();
        Path target = uploadDir.resolve(name).normalize();
        if (!target.startsWith(uploadDir)) {
            return error("Nom de fichier invalide.");
        }
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        }

        String original = file.getOriginalFilename() == null ? name : Paths.get(file.getOriginalFilename()).getFileName().toString();
        return ResponseEntity.ok(Map.of(
                "url", "/uploads/" + name,
                "name", original,
                "size", file.getSize(),
                "contentType", file.getContentType()
        ));
    }

    private boolean hasSignature(MultipartFile file, FileKind kind) throws IOException {
        try (InputStream in = file.getInputStream()) {
            byte[] head = in.readNBytes(8);
            for (byte[] sig : kind.signatures()) {
                if (head.length < sig.length) continue;
                boolean match = true;
                for (int i = 0; i < sig.length; i++) {
                    if (head[i] != sig[i]) { match = false; break; }
                }
                if (match) return true;
            }
            return false;
        }
    }

    private ResponseEntity<Map<String, Object>> error(String message) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", message));
    }
}
