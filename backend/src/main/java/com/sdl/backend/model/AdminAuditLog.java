package com.sdl.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "admin_audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long auditId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "actor_user_id")
    private User actorUser;

    @Column(nullable = false)
    private String actionType;

    @Column(nullable = false)
    private String targetEntity;

    private Long entityId;

    private String ipAddress;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    @Column(columnDefinition = "TEXT")
    private String details;
}
