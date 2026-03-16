package com.main.modpla.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Entity
@Table(name = "task")
@Data
@NoArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String task;
    private boolean isDone;

    @ManyToOne()
    @JsonIgnore
    private Content content;

    public Task(String task) {
        this.task = task;
        this.isDone = false;
    }
}
