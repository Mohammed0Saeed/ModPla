package com.main.modpla.repo;

import com.main.modpla.model.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public interface SemesterRepository extends JpaRepository<Semester, Long> {
}
