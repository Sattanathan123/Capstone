package com.dbi.backend.repository;

import com.dbi.backend.entity.Scheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface SchemeRepository extends JpaRepository<Scheme, Long> {
    List<Scheme> findByStatus(String status);
    List<Scheme> findBySchemeComponent(String schemeComponent);

    @Modifying
    @Query("UPDATE Scheme s SET s.status = 'Expired', s.updatedAt = CURRENT_TIMESTAMP WHERE s.status = 'Active' AND s.applicationEndDate < :today")
    int expireSchemesBefore(LocalDate today);
}
