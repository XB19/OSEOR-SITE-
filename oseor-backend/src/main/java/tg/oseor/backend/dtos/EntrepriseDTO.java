package tg.oseor.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class EntrepriseDTO {
    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 255)
    private String name;

    @NotBlank(message = "Le secteur est obligatoire")
    @Size(max = 50)
    private String secteur;

    @NotBlank(message = "La description est obligatoire")
    @Size(max = 1000)
    private String description;

    @Size(max = 500)
    private String logoUrl;

    @Size(max = 500)
    private String officialSite;
}
