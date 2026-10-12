package tg.oseor.backend.dtos;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String email;
    private String role;
    private String password; // Optionnel pour la création/modification
}
