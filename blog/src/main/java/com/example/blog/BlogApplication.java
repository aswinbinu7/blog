package com.example.blog;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.mongodb.client.MongoClient;

@SpringBootApplication
public class BlogApplication {

    private static final Logger logger = LoggerFactory.getLogger(BlogApplication.class);

    @Autowired
    private MongoClient mongoClient;

    public static void main(String[] args) {
        SpringApplication.run(BlogApplication.class, args);
    }

    // Check database connection on startup
    @Bean
    public CommandLineRunner checkDatabaseConnection() {
        return args -> {
            try {
                // Ping the database to check if the connection is successful
                mongoClient.getDatabase("blogdb").runCommand(new org.bson.Document("ping", 1));
                logger.info("Database connected successfully.");
            } catch (Exception e) {
                logger.error("Database connection failed: " + e.getMessage());
            }
        };
    }
}
