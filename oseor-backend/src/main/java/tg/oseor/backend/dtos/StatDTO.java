package tg.oseor.backend.dtos;

import lombok.Data;

@Data
public class StatDTO {
    private Long id;
    private String label;
    private String value;
    private String icon;
}
