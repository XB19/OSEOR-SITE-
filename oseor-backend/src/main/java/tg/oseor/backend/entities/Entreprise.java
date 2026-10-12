package tg.oseor.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Entreprise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 255)
    private String name;

    @NotBlank(message = "Le secteur est obligatoire")
    @Size(max = 50)
    private String secteur;

    @NotBlank(message = "La description est obligatoire")
    @Column(length = 1000)
    @Size(max = 1000)
    private String description;

    @Size(max = 500)
    private String logoUrl;

    @Size(max = 500)
    private String officialSite;
}
