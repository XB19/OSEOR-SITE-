package tg.oseor.backend.dtos;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AppelOffreDTO {
    private Long id;
    private String reference;
    private String title;
    private String description;
    private LocalDateTime deadline;
    private String documentUrls;
    private boolean published;
    private boolean archived;
    private LocalDateTime createdAt;
}
