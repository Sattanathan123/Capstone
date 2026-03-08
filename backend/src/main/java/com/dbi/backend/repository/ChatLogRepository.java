package com.dbi.backend.repository;

import com.dbi.backend.entity.ChatLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatLogRepository extends JpaRepository<ChatLog, Long> {
    List<ChatLog> findByUserIdOrderByTimestampDesc(Long userId);
    List<ChatLog> findBySessionIdOrderByTimestampAsc(String sessionId);
}
