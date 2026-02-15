package com.dbi.backend.repository;

import com.dbi.backend.entity.Scheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SchemeRepository extends JpaRepository<Scheme, Long> {
    List<Scheme> findByStatus(String status);
    List<Scheme> findBySchemeComponent(String schemeComponent);
}
