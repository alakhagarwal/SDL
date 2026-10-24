package com.sdl.backend.service;

import com.sdl.backend.model.AdminAuditLog;
import com.sdl.backend.model.User;
import com.sdl.backend.repository.AdminAuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AdminAuditLogRepository auditLogRepository;

    @Transactional
    public void recordAction(User actor, String actionType, String targetEntity, Long entityId, String details) {
        AdminAuditLog log = AdminAuditLog.builder()
                .actorUser(actor)
                .actionType(actionType)
                .targetEntity(targetEntity)
                .entityId(entityId)
                .ipAddress("127.0.0.1")
                .timestamp(LocalDateTime.now())
                .details(details)
                .build();
        auditLogRepository.save(log);
    }
}
