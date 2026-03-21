package com.dbi.backend.repository;

import com.dbi.backend.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    
    @Query("SELECT f FROM Feedback f WHERE f.user.id = :userId ORDER BY f.submittedAt DESC")
    List<Feedback> findByUserIdOrderBySubmittedAtDesc(@Param("userId") Long userId);
    
    List<Feedback> findAllByOrderBySubmittedAtDesc();
    
    @Query("SELECT f FROM Feedback f WHERE f.application.id = :applicationId")
    Optional<Feedback> findByApplicationId(@Param("applicationId") Long applicationId);
    
    @Query("SELECT COUNT(f) > 0 FROM Feedback f WHERE f.application.id = :applicationId")
    boolean existsByApplicationId(@Param("applicationId") Long applicationId);
}
