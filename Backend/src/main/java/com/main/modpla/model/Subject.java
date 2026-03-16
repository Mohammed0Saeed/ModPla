package com.main.modpla.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "subject")
@Data
@NoArgsConstructor
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;


    private String name;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Content> contents;

    @ManyToOne()
    @JsonIgnore
    private Semester semester;

    public Subject(String name) {
        this.name = name;
    }

    public void addContent(Content content) {
        contents.add(content);
        content.setSubject(this);
    }
}
