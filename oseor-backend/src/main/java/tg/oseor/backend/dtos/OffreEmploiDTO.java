package tg.oseor.backend.dtos;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class OffreEmploiDTO {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String contractType;
    private LocalDateTime deadline;
    private boolean published;
    private boolean archived;
    private LocalDateTime createdAt;
}
