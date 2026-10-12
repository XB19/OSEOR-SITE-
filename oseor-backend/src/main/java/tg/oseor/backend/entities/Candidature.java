package tg.oseor.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Candidature {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String cvUrl;
    private String coverLetterUrl;
    private LocalDateTime createdAt;
    private boolean archived;

    @ManyToOne
    @JoinColumn(name = "offre_id")
    private OffreEmploi offre;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
