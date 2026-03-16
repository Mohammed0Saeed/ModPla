package com.main.modpla.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "semester")
@Data
@NoArgsConstructor
public class Semester {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Enumerated(EnumType.STRING)
    private Season season;
    private int year;
    private String name;

    @OneToMany(mappedBy = "semester", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Subject> subjects;

    @ManyToOne()
    @JsonIgnore
    private User user;

    public Semester(Season season, int year) {
        this.season = season;
        this.year = year;
        this.name = season == Season.SUMMER ? ("SoSe" + (year % 2000)) : ("WiSe" + (year % 2000));
    }

    public void generateName() {
        this.name = season == Season.SUMMER ? ("SoSe" + (year % 2000)) : ("WiSe" + (year % 2000));
    }

    public void addSubject(Subject subject) {
        subjects.add(subject);
    }
}
