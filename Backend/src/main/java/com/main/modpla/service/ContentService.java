package com.main.modpla.service;

import com.main.modpla.model.Content;
import com.main.modpla.model.Task;
import com.main.modpla.repo.ContentRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContentService {
    private final ContentRepository contentRepository;

    // Constructor
    public ContentService(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    // Service Method: CREATE
    public void addContent(Content content) {
        if (content != null) {
            contentRepository.save(content);
        }
    }

    // Service Method: DELETE
    public void deleteContent(long id) {
        if (contentRepository.existsById(id))
            contentRepository.deleteById(id);
        else
            throw new IllegalArgumentException("Content not found");
    }

    // Service Method: UPDATE
    @Transactional
    public void updateContent(long id, String content) {
        if (contentRepository.existsById(id)) {
            Content tmpContent = contentRepository.getOne(id);
            tmpContent.setTitle(content);
            contentRepository.save(tmpContent);
        }

        else
            throw new IllegalArgumentException("Content not found");
    }

    public void updateContentTasks(long id, List<Task> newTasks) {
        if (contentRepository.existsById(id)) {
            Content tmpContent = contentRepository.getOne(id);
            tmpContent.setTasks(newTasks);
            contentRepository.save(tmpContent);
        }
        else
            throw new IllegalArgumentException("Content not found");
    }

    // Service Method: READ
    public Content getContent(long id) {
        if (contentRepository.existsById(id))
            return contentRepository.getOne(id);

        else
            throw new IllegalArgumentException("Content not found");
    }

    public List<Content> getAllContent() {
        return contentRepository.findAll();
    }
}
