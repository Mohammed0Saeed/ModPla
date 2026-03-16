package com.main.modpla.service;

import com.main.modpla.model.Content;
import com.main.modpla.model.Task;
import com.main.modpla.repo.TaskRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final ContentService contentService;

    public TaskService(TaskRepository taskRepository, ContentService contentService) {
        this.taskRepository = taskRepository;
        this.contentService = contentService;
    }

    public void addTask(Task task) {
        if (task != null) {
            taskRepository.save(task);
        }
        else
            System.out.println("Task is empty");
    }

    public void addTasks(long contentID, List<Task> tasks) {
        if (tasks != null) {
            Content content = contentService.getContent(contentID);
            tasks.forEach(task -> task.setContent(content));
            taskRepository.saveAll(tasks);
        }

        else
            throw new IllegalArgumentException("Tasks is empty");
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksByContentId(long id) {
        Content content = contentService.getContent(id);

        if (content == null)
            throw new IllegalArgumentException("Content not found");

        return content.getTasks();
    }

    public Task getTask(long id) {
        if (taskRepository.existsById(id))
            return taskRepository.findById(id).orElse(null);
        else
            throw new IllegalArgumentException("Task not found");
    }

    public void deleteTask(long id) {
        if (!taskRepository.existsById(id))
            throw new IllegalArgumentException("Task not found");

        taskRepository.deleteById(id);
    }

    public void deleteTaskByContentId(long id) {
        if (contentService.getContent(id) == null)
            throw new IllegalArgumentException("Content not found");

        List<Task> tasksToBeDeleted = contentService.getContent(id).getTasks();
        tasksToBeDeleted.forEach(task -> deleteTask(task.getId()));
    }

    public void deleteAllTasks() {
        taskRepository.deleteAll();
    }

    @Transactional
    public void updateTask(Task task) {
        if (!taskRepository.existsById(task.getId()))
            throw new IllegalArgumentException("Task not found");
        taskRepository.save(task);
    }
}
