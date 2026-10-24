package com.sdl.backend.service;

import com.sdl.backend.exception.ResourceNotFoundException;
import com.sdl.backend.model.ResourceArticle;
import com.sdl.backend.model.User;
import com.sdl.backend.repository.ResourceArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceArticleService {

    private final ResourceArticleRepository articleRepository;
    private final AuditLogService auditLogService;

    public List<ResourceArticle> getAllPublishedArticles() {
        return articleRepository.findByStatusOrderByPublishedDateDesc("Published");
    }

    public ResourceArticle getArticleById(Long articleId) {
        return articleRepository.findById(articleId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource article not found with ID: " + articleId));
    }

    public List<ResourceArticle> getArticlesByCategory(String category) {
        return articleRepository.findByCategoryIgnoreCaseAndStatus(category, "Published");
    }

    @Transactional
    public ResourceArticle publishArticle(User author, ResourceArticle article) {
        article.setAuthorStaff(author);
        article.setStatus("Published");
        article.setPublishedDate(LocalDate.now());
        ResourceArticle saved = articleRepository.save(article);

        auditLogService.recordAction(
                author,
                "PUBLISH_ARTICLE",
                "ResourceArticle",
                saved.getArticleId(),
                "Published psychoeducational article: " + saved.getTitle()
        );

        return saved;
    }
}
