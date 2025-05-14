package com.example.blog.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "blogs")
@Data
public class Blog {

    @Id
    private String id;

    private String title;
    private String content;
    private String author;
    private String authorEmail;

    private LocalDateTime createdAt;

    // Constructors
    public Blog() {}

    public Blog(String title, String content, String author, String authorEmail, LocalDateTime createdAt) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.authorEmail = authorEmail;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    // (You can use Lombok @Getter @Setter if preferred)
}
