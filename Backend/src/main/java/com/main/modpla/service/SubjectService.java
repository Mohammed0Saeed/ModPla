package com.main.modpla.service;


import com.main.modpla.model.Subject;
import com.main.modpla.repo.SubjectRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {
    private final SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    public void addSubject(Subject subject) {
        if (subject != null && subject.getName() != null) {
            subjectRepository.save(subject);
        }

        else
            throw new IllegalArgumentException("Subject is empty");
    }

    public Subject getSubject(long id) {
        if (!subjectRepository.existsById(id))
            throw new IllegalArgumentException("Subject not found");

        return subjectRepository.findById(id).orElse(null);
    }

    public List<Subject> getSubjects() {
        return subjectRepository.findAll();
    }

    public void deleteSubject(long id) {
        if (subjectRepository.existsById(id))
            throw new IllegalArgumentException("Subject not found");

        subjectRepository.deleteById(id);
    }

    @Transactional
    public void updateSubject(Subject subject) {
        if (!subjectRepository.existsById(subject.getId()))  {
            throw new IllegalArgumentException("Subject not found");
        }
        subjectRepository.save(subject);
    }
}
