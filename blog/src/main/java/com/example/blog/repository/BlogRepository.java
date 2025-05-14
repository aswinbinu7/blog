package com.example.blog.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.blog.model.Blog;

public interface BlogRepository extends MongoRepository<Blog, String> {
    List<Blog> findByAuthorEmail(String email);


}
