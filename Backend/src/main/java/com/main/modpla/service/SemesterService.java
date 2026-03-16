package com.main.modpla.service;

import com.main.modpla.model.Semester;
import com.main.modpla.model.Subject;
import com.main.modpla.model.User;
import com.main.modpla.repo.SemesterRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SemesterService {
    private final UserService userService;
    private final SemesterRepository semesterRepository;
    private final SubjectService subjectService;

    public SemesterService(UserService userService, SemesterRepository semesterRepository, SubjectService subjectService) {
        this.semesterRepository = semesterRepository;
        this.userService = userService;
        this.subjectService = subjectService;
    }

    public void addSemester(long userId, Semester semester) {
        if (semester != null) {
            User user = userService.findUserById(userId);
            semester.setUser(user);
            semester.generateName();
            if (semester.getName().isEmpty())
                throw new IllegalArgumentException("Semester name is empty");

            semesterRepository.save(semester);
        }
        else
            throw new IllegalArgumentException("Semester is empty");
    }

    public Semester getSemester(long id) {
        if (semesterRepository.existsById(id))
            return semesterRepository.findById(id).orElse(null);
        else
            throw new IllegalArgumentException("Semester not found");
    }

    public List<Subject> getSemesterSubjects(long id) {
        List<Subject> subjects = subjectService.getSubjects();
        return subjects.stream().filter(sub -> sub.getSemester().getId() == id).toList();
    }

    public void deleteSemester(long id) {
        if (semesterRepository.existsById(id))
            semesterRepository.deleteById(id);
        else
            throw new IllegalArgumentException("Semester not found");
    }

    @Transactional
    public void updateSemester(long id, Semester semester) {
        if (semesterRepository.existsById(id) && semester.getName() != null &&
                !semester.getName().isEmpty()) {
            Semester tmpSemester = getSemester(id);
            tmpSemester.setSeason(semester.getSeason());
            tmpSemester.setYear(semester.getYear());
            tmpSemester.generateName();
            semesterRepository.save(tmpSemester);
        }

        else
            throw new IllegalArgumentException("Semester cannot be updated");
    }

    public List<Semester> getSemesters(long userId) {
        if (userId == 0)
            System.out.println("Ignored Request");
        else {
            User user = userService.findUserById(userId);
            return user.getSemesters();
        }
        return List.of( new Semester());
    }
}
