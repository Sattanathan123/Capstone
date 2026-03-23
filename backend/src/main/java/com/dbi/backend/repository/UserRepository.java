package com.dbi.backend.repository;

import com.dbi.backend.entity.User;
import com.dbi.backend.entity.UserRole;
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
    List<User> findByRoleAndAssignedDistrict(UserRole role, String assignedDistrict);
}
