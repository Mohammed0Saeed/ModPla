package com.main.modpla.controller;

import com.main.modpla.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin("http://localhost:5173")
public class ChatController {
    private final GeminiService geminiService;

    @Autowired
    public ChatController(GeminiService openAIService) {
        this.geminiService = openAIService;
    }

    @PostMapping
    public String getChatResponse(@RequestBody String prompt) {
        return geminiService.getChatResponse(prompt).get(0).getTask();
    }
}
