package com.main.modpla.controller;

import com.main.modpla.model.Semester;
import com.main.modpla.model.Subject;
import com.main.modpla.service.SemesterService;
import com.main.modpla.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subject")
@CrossOrigin("http://localhost:5173")
public class SubjectController {
    private final SubjectService subjectService;
    private final SemesterService semesterService;

    @Autowired
    public SubjectController(SubjectService subjectService, SemesterService semesterService) {
        this.subjectService = subjectService;
        this.semesterService = semesterService;
    }

    @GetMapping
    public List<Subject> getAll() {
        return subjectService.getSubjects();
    }

    @GetMapping("/{id}")
    public Subject get(@PathVariable long id) {
        return subjectService.getSubject(id);
    }

    @PostMapping("/{semesterID}")
    public void add(@PathVariable long semesterID, @RequestBody Subject subject) {
        Semester semester = semesterService.getSemester(semesterID);
        semester.addSubject(subject);
        subject.setSemester(semester);
        subjectService.addSubject(subject);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable long id) {
        subjectService.deleteSubject(id);
    }

    @PutMapping("/{id}")
    public void update(@PathVariable long id, @RequestBody Subject subject) {
        Subject tmpSub = subjectService.getSubject(id);
        tmpSub.setName(subject.getName());
        subjectService.updateSubject(tmpSub);
    }
}
