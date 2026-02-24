package com.dbi.backend.repository;

import com.dbi.backend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUserId(Long userId);
    
    @Query(value = "SELECT a.id, s.scheme_name, a.status, a.applied_date, a.remarks " +
           "FROM applications a JOIN schemes s ON a.scheme_id = s.id " +
           "WHERE a.user_id = :userId", nativeQuery = true)
    List<Object[]> findApplicationDataByUserId(@Param("userId") Long userId);
    
    @Query("SELECT a FROM Application a JOIN FETCH a.user JOIN FETCH a.scheme WHERE a.status = :status AND a.user.district = :district")
    List<Application> findByStatusAndUserAssignedDistrict(@Param("status") String status, @Param("district") String district);
    
    @Query("SELECT a FROM Application a JOIN FETCH a.user JOIN FETCH a.scheme WHERE a.status = :status")
    List<Application> findByStatus(@Param("status") String status);
    
    long countByVerificationOfficerIdAndVerifiedDateAfter(Long officerId, LocalDateTime date);
    
    @Query("SELECT COUNT(a) FROM Application a WHERE a.status = :status AND a.user.district = :district")
    long countByStatusAndUserAssignedDistrict(@Param("status") String status, @Param("district") String district);
    
    long countByVerificationOfficerIdAndStatus(Long officerId, String status);
    
    long countBySanctioningOfficerIdAndSanctionedDateAfter(Long officerId, LocalDateTime date);
    
    long countBySanctioningOfficerIdAndStatus(Long officerId, String status);
    
    long countByStatus(String status);
}
