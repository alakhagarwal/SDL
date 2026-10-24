package com.sdl.backend.repository;

import com.sdl.backend.model.ResourceArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceArticleRepository extends JpaRepository<ResourceArticle, Long> {
    List<ResourceArticle> findByStatusOrderByPublishedDateDesc(String status);
    List<ResourceArticle> findByCategoryIgnoreCaseAndStatus(String category, String status);
}
