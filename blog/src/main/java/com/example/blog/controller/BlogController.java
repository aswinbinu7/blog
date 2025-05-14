package com.example.blog.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.blog.model.Blog;
import com.example.blog.repository.BlogRepository;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    @Autowired
    private BlogRepository blogRepository;

    // Create blog post (Only logged-in users)
    @PostMapping("/create")
    public ResponseEntity<?> createBlog(@RequestBody Blog blog, HttpSession session) {
        String email = (String) session.getAttribute("userEmail");

        if (email == null) {
            return ResponseEntity.status(401).body("Unauthorized: Please log in.");
        }

        // Setting the author email and name for the blog post
        blog.setAuthorEmail(email);
        blog.setCreatedAt(LocalDateTime.now());

        Blog savedBlog = blogRepository.save(blog);
        return ResponseEntity.ok(savedBlog);
    }

    // Get all blog posts with pagination (Public access)
   @GetMapping
public ResponseEntity<?> getAllBlogs(
    @RequestParam(value = "page", defaultValue = "0") int page,
    @RequestParam(value = "size", defaultValue = "10") int size) {

    PageRequest pageRequest = PageRequest.of(page, size);
    Page<Blog> blogPage = blogRepository.findAll(pageRequest);

    return ResponseEntity.ok(
        Map.of(
            "blogs", blogPage.getContent(),
            "totalPages", blogPage.getTotalPages(),
            "currentPage", blogPage.getNumber(),
            "totalItems", blogPage.getTotalElements()
        )
    );
}


    // Get a single blog by ID (Public access)
    @GetMapping("/{id}")
    public ResponseEntity<Blog> getBlogById(@PathVariable String id) {
        Optional<Blog> blog = blogRepository.findById(id);
        return blog.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update blog post (Only original author)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBlog(@PathVariable String id, @RequestBody Blog blogDetails, HttpSession session) {
        String email = (String) session.getAttribute("userEmail");

        if (email == null) {
            return ResponseEntity.status(401).body("Unauthorized: Please log in.");
        }

        Optional<Blog> blogOpt = blogRepository.findById(id);
        if (blogOpt.isPresent()) {
            Blog blog = blogOpt.get();

            // Check if the logged-in user is the author of the blog
            if (!blog.getAuthorEmail().equals(email)) {
                return ResponseEntity.status(403).body("Forbidden: You can't edit this blog.");
            }

            blog.setTitle(blogDetails.getTitle());
            blog.setContent(blogDetails.getContent());
            blog.setCreatedAt(LocalDateTime.now());

            blogRepository.save(blog);
            return ResponseEntity.ok(blog);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete blog post (Only original author)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBlog(@PathVariable String id, HttpSession session) {
        String email = (String) session.getAttribute("userEmail");

        if (email == null) {
            return ResponseEntity.status(401).body("Unauthorized: Please log in.");
        }

        Optional<Blog> blogOpt = blogRepository.findById(id);
        if (blogOpt.isPresent()) {
            Blog blog = blogOpt.get();

            // Check if the logged-in user is the author of the blog
            if (!blog.getAuthorEmail().equals(email)) {
                return ResponseEntity.status(403).body("Forbidden: You can't delete this blog.");
            }

            blogRepository.deleteById(id);
            return ResponseEntity.ok("Blog deleted successfully.");
        } else {
            return ResponseEntity.status(404).body("Blog not found.");
        }
    }

    // Get blogs created by the logged-in user
    @GetMapping("/myblogs")
    public ResponseEntity<?> getMyBlogs(HttpSession session) {
        String email = (String) session.getAttribute("userEmail");

        if (email == null) {
            return ResponseEntity.status(401).body("Unauthorized: Please log in.");
        }

        List<Blog> blogs = blogRepository.findByAuthorEmail(email);
        return ResponseEntity.ok(blogs);
    }
}
