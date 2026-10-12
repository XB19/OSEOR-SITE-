package tg.oseor.backend.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ContactDTO {
    private Long id;
    
    @NotBlank(message = "Le nom est obligatoire")
    private String name;
    
    @Size(max = 100, message = "Le prénom ne peut pas dépasser 100 caractères")
    private String firstName;
    
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'email doit être valide")
    private String email;
    
    @Size(max = 30, message = "Le numéro de téléphone ne peut pas dépasser 30 caractères")
    private String phone;
    
    @NotBlank(message = "Le sujet est obligatoire")
    private String subject;
    
    @NotBlank(message = "Le message est obligatoire")
    private String message;

    // Date de réception (renseignée par l’entité, affichée dans le tableau de bord)
    private java.time.LocalDateTime createdAt;
}
