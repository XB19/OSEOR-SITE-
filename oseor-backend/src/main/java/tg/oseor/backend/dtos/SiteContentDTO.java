package tg.oseor.backend.dtos;

import lombok.Data;

@Data
public class SiteContentDTO {
    private Long id;
    private String contentKey;
    private String contentValue;
    private String type;
    private String section;
}
