package com.main.modpla.controller;

import com.main.modpla.model.Content;
import com.main.modpla.model.Task;
import com.main.modpla.service.ContentService;
import com.main.modpla.service.GeminiService;
import com.main.modpla.service.SubjectService;
import com.main.modpla.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contents")
@CrossOrigin("http://localhost:5173")
public class ContentController {
    private final ContentService contentService;
    private final TaskService taskService;
    private final GeminiService geminiService;
    private final SubjectService subjectService;

    @Autowired
    public ContentController(ContentService contentService, GeminiService geminiService, TaskService taskService, SubjectService subjectService) {
        this.contentService = contentService;
        this.geminiService = geminiService;
        this.taskService = taskService;
        this.subjectService = subjectService;
    }

    @GetMapping
    public List<Content> getAll() {
        return contentService.getAllContent();
    }

    @GetMapping("/{id}")
    public Content get(@PathVariable long id) {
        return contentService.getContent(id);
    }

    @PostMapping("/{subjectID}")
    public void save(@PathVariable long subjectID, @RequestBody Content content) {
        List<Task> tasks = geminiService.getChatResponse(content.getTitle());
        content.setSubject(subjectService.getSubject(subjectID));
        contentService.addContent(content);
        taskService.addTasks(content.getId(), tasks);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable long id) {
        contentService.deleteContent(id);
        taskService.deleteTask(id);
    }

    @PutMapping("/{id}")
    public void update(@PathVariable long id, String content) {
        contentService.updateContent(id, content);
        taskService.deleteTaskByContentId(id);
        List<Task> newTasks = geminiService.getChatResponse(content);
        taskService.addTasks(id, newTasks);
        contentService.updateContentTasks(id, newTasks);
    }
}
