package tg.oseor.backend.dtos;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ActualiteDTO {
    private Long id;
    private String title;
    private String summary;
    private String content;
    private String imageUrl;
    private LocalDateTime date;
    private boolean published;
    private boolean archived;
}
