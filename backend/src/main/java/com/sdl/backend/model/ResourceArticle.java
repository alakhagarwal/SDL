package com.sdl.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "resource_articles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long articleId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String summary;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String contentBody;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_staff_id")
    private User authorStaff;

    private String tags;

    @Builder.Default
    private Integer readTimeMinutes = 5;

    private String thumbnailUrl;

    @Builder.Default
    private String status = "Published";

    @Builder.Default
    private LocalDate publishedDate = LocalDate.now();
}
