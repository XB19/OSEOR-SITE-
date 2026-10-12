package tg.oseor.backend.dtos;

import lombok.Data;

@Data
public class ProjetDTO {
    private Long id;
    private String title;
    private String description;
    private String image;

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
