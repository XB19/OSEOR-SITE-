package tg.oseor.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tg.oseor.backend.dtos.UserDTO;
import tg.oseor.backend.entities.Role;
import tg.oseor.backend.entities.User;
import tg.oseor.backend.repositories.UserRepository;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public List<UserDTO> getAllUsers() {
        return repository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public UserDTO createUser(UserDTO dto) {
        User user = User.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(Role.valueOf(dto.getRole()))
                .build();
        return toDTO(repository.save(user));
    }

    public UserDTO updateUser(Long id, UserDTO dto) {
        User user = repository.findById(id).orElseThrow();
        user.setEmail(dto.getEmail());
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        user.setRole(Role.valueOf(dto.getRole()));
        return toDTO(repository.save(user));
    }

    public void deleteUser(Long id) {
        repository.deleteById(id);
    }

    private UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        return dto;
    }
}
