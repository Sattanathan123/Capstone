package com.dbi.backend.repository;

import com.dbi.backend.entity.FundTransfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FundTransferRepository extends JpaRepository<FundTransfer, Long> {
    
    Optional<FundTransfer> findByTransferId(String transferId);
    
    List<FundTransfer> findByApplicationId(Long applicationId);
    
    List<FundTransfer> findByStatus(String status);
    
    @Query("SELECT ft FROM FundTransfer ft WHERE ft.application.user.id = :userId")
    List<FundTransfer> findByUserId(@Param("userId") Long userId);
    
    long countByStatus(String status);
    
    @Query("SELECT SUM(ft.amount) FROM FundTransfer ft WHERE ft.status = 'COMPLETED'")
    Double getTotalDisbursedAmount();
}