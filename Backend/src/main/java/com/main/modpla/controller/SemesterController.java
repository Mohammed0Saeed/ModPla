package com.main.modpla.controller;

import com.main.modpla.model.Semester;
import com.main.modpla.model.Subject;
import com.main.modpla.model.User;
import com.main.modpla.service.SemesterService;
import com.main.modpla.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/semester")
@CrossOrigin("http://localhost:5173")
public class SemesterController {
    private final SemesterService semesterService;
    private final UserService userService;
    private final AuthenticationManager authManager;

    public SemesterController(SemesterService semesterService, UserService userService, AuthenticationManager authManager) {
        this.semesterService = semesterService;
        this.userService = userService;
        this.authManager = authManager;
    }

//    @GetMapping("/{id}")
//    public Semester getSemester(@PathVariable long id) {
//        return semesterService.getSemester(id);
//    }

    @GetMapping("/{userId}")
    public List<Semester> getAll(@PathVariable long userId) {
        System.out.println(userId);
        return semesterService.getSemesters(userId);
    }

    @GetMapping("/my-semesters")
    public List<Semester> getMySemesters(Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userService.loadUserByUsername(email);
        return getAll(currentUser.getId());
    }

    @GetMapping("/subjects/{semesterID}")
    public List<Subject> getSubjects(@PathVariable long semesterID) {
        return semesterService.getSemesterSubjects(semesterID);
    }

    @PostMapping("/add")
    public void addSemester(Authentication authentication, @RequestBody Semester semester) {
        String email = authentication.getName();
        User currentUser = userService.loadUserByUsername(email);
        semesterService.addSemester(currentUser.getId(), semester);
    }

    @DeleteMapping("/{id}")
    public void deleteSemester(@PathVariable long id) {
        semesterService.deleteSemester(id);
    }

    @PutMapping("/{id}")
    public void updateSemester(@PathVariable long id, @RequestBody Semester semester) {
        semesterService.updateSemester(id, semester);
    }
}
