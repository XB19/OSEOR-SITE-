package tg.oseor.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppelOffre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String reference;
    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;
    private LocalDateTime deadline;
    private String documentUrls; // Liste d'URLs séparées par des virgules ou JSON
    private boolean published;
    private boolean archived;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
