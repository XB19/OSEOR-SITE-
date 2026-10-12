package tg.oseor.backend.dtos;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CandidatureDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String cvUrl;
    private String coverLetterUrl;
    private LocalDateTime createdAt;
    private boolean archived;
    private Long offreId;
}
