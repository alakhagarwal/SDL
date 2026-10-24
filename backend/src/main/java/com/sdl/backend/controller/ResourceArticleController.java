package com.sdl.backend.controller;

import com.sdl.backend.model.ResourceArticle;
import com.sdl.backend.security.UserPrincipal;
import com.sdl.backend.service.ResourceArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceArticleController {

    private final ResourceArticleService articleService;

    // FR-057: Curated library of psychoeducational articles & mindfulness guides
    @GetMapping
    public ResponseEntity<List<ResourceArticle>> getAllArticles() {
        return ResponseEntity.ok(articleService.getAllPublishedArticles());
    }

    // FR-059: Read single article
    @GetMapping("/{id}")
    public ResponseEntity<ResourceArticle> getArticleById(@PathVariable Long id) {
        return ResponseEntity.ok(articleService.getArticleById(id));
    }

    // FR-058: Browse by category (Stress Management, Sleep Hygiene, Exam Coping, Nutrition, Mindfulness)
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ResourceArticle>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(articleService.getArticlesByCategory(category));
    }

    // FR-060: Author & publish resources (Counselor / Admin)
    @PostMapping
    @PreAuthorize("hasAnyRole('COUNSELOR', 'ADMIN')")
    public ResponseEntity<ResourceArticle> publishArticle(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody ResourceArticle article
    ) {
        ResourceArticle published = articleService.publishArticle(principal.getUser(), article);
        return ResponseEntity.status(HttpStatus.CREATED).body(published);
    }
}
