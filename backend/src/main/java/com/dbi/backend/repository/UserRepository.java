package com.dbi.backend.repository;

import com.dbi.backend.entity.User;
import com.dbi.backend.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByMobileNumber(String mobileNumber);
    Optional<User> findByEmail(String email);
    Optional<User> findByAadhaarNumberHash(String aadhaarNumberHash);
    boolean existsByMobileNumber(String mobileNumber);
    boolean existsByAadhaarNumberHash(String aadhaarNumberHash);
    long countByRole(UserRole role);
    List<User> findByRole(UserRole role);
    Page<User> findByRole(UserRole role, org.springframework.data.domain.Pageable pageable);
    List<User> findByRoleAndAssignedDistrict(UserRole role, String assignedDistrict);
    long countByBankAccountNumberAndIdNot(String bankAccountNumber, Long id);
}
