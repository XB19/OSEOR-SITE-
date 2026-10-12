package tg.oseor.backend.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteContent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String contentKey;

    @Column(columnDefinition = "TEXT")
    private String contentValue;

    private String type; // TEXT, IMAGE, HTML
    
    private String section; // HOME, ABOUT, FOOTER, etc.
}
