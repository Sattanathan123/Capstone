package com.dbi.backend.repository;

import com.dbi.backend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUserId(Long userId);
    
    @Query(value = "SELECT a.id, s.scheme_name, a.status, a.applied_date, a.remarks " +
           "FROM applications a JOIN schemes s ON a.scheme_id = s.id " +
           "WHERE a.user_id = :userId", nativeQuery = true)
    List<Object[]> findApplicationDataByUserId(@Param("userId") Long userId);
}
