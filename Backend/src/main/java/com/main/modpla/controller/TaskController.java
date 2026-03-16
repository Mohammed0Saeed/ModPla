package com.main.modpla.controller;

import com.main.modpla.model.Task;
import com.main.modpla.service.ContentService;
import com.main.modpla.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/task")
@CrossOrigin("http://localhost:5173")
public class TaskController {
    TaskService taskService;
    ContentService contentService;

    @Autowired
    public TaskController(TaskService taskService, ContentService contentService) {
        this.taskService = taskService;
        this.contentService = contentService;
    }

    @GetMapping
    public List<Task> getTasks() {
        return taskService.getAllTasks();
    }

    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable long id) {
        return taskService.getTask(id);
    }

    @PostMapping("/{contentId}")
    public void addTask(@PathVariable long contentId, @RequestBody Task task) {
        taskService.addTask(task);
    }

    @PutMapping("/{id}")
    public void updateDone(@PathVariable long id, @RequestBody Task task) {
        Task tmpTask = taskService.getTask(id);
        tmpTask.setTask(task.getTask());
        tmpTask.setDone(task.isDone());
        taskService.updateTask(tmpTask);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable long id) {
        taskService.deleteTask(id);
    }

}
