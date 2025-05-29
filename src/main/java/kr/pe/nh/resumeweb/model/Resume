package kr.pe.nh.resumeweb.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resume {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String rawText;

    @Column(length = 5000)
    private String refinedText;

    @Column(length = 2000)
    private String analysisJson;

    private String sentenceScore;
    private String detailScore;
    private String motiveScore;
    private String growthScore;
    private String createdAt;
}
