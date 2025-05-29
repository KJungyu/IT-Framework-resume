// src/main/java/kr/pe/nh/resumeweb/repository/ResumeRepository.java
package kr.pe.nh.resumeweb.repository;

import kr.pe.nh.resumeweb.model.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeRepository extends JpaRepository<Resume, Long> {}
