package com.main.modpla.service;

import com.main.modpla.model.Task;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

import java.util.List;
import java.util.Objects;

@Service
public class GeminiService {
    private final String apiKey;

    public GeminiService(@Value("${gemini.api.key}") String apiKey) {
        this.apiKey = apiKey;
    }

    public List<Task> getChatResponse(String title) {
        List<String> tasks = List.of();

        while (tasks.size() < 7 || tasks.size() > 12) {
            String prompt = "You are an expert curriculum designer. Your sole function is to receive a topic and generate a list of actionable study tasks.\n" +
                    "\n" +
                    "The tasks must be logically ordered, maximum 7 - 10 tasks, in English, each task not longer than 20 words, starting from foundational concepts and progressing to more complex applications.\n" +
                    "\n" +
                    "Your response MUST ONLY be a single line of text.\n" +
                    "- Separate each task with a pipe symbol (`:`).\n" +
                    "- Do NOT include any introductory or concluding text.\n" +
                    "- Do NOT use bullet points, headings, or newlines.\n" +
                    "- Begin the response directly with the first task.\n" +
                    "\n" +
                    "The topic is: " + title;

            Client client = Client.builder().apiKey(apiKey).build();
            GenerateContentResponse response = client.models.generateContent(
                    "gemini-2.5-flash",
                    prompt,
                    null
            );

            if (Objects.requireNonNull(response.text()).isEmpty()) throw new RuntimeException("Empty response");

            tasks = List.of(response.text().split(":"));
        }


        return tasks.stream().map(Task::new).toList();
    }
}
