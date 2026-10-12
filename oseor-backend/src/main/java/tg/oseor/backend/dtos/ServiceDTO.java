package tg.oseor.backend.dtos;

import lombok.Data;

@Data
public class ServiceDTO {
    private Long id;
    private String title;
    private String description;
    private String icon;
}
