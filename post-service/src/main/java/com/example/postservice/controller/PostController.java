package com.example.postservice.controller;

import com.example.postservice.model.Post;
import com.example.postservice.repository.PostRepository;
import com.example.postservice.security.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import java.util.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostRepository repo;
    public PostController(PostRepository repo){ this.repo = repo; }

    @GetMapping
    public List<Post> list() { return repo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Post> get(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Post in, Authentication auth) {
        if(auth == null) return ResponseEntity.status(401).body("unauthenticated");
        String username = auth.getName();
        in.setOwnerUsername(username);
        Post p = repo.save(in);
        return ResponseEntity.ok(p);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Post in, Authentication auth) {
        if(auth == null) return ResponseEntity.status(401).body("unauthenticated");
        String username = auth.getName();
        var opt = repo.findById(id);
        if(opt.isEmpty()) return ResponseEntity.notFound().build();
        Post p = opt.get();
        boolean isOwner = username.equals(p.getOwnerUsername());
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a->a.getAuthority().equals("ROLE_ADMIN"));
        if(!isOwner && !isAdmin) return ResponseEntity.status(403).body("forbidden");
        p.setTitle(in.getTitle());
        p.setContent(in.getContent());
        repo.save(p);
        return ResponseEntity.ok(p);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Authentication auth) {
        if(auth == null) return ResponseEntity.status(401).body("unauthenticated");
        String username = auth.getName();
        var opt = repo.findById(id);
        if(opt.isEmpty()) return ResponseEntity.notFound().build();
        Post p = opt.get();
        boolean isOwner = username.equals(p.getOwnerUsername());
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a->a.getAuthority().equals("ROLE_ADMIN"));
        if(!isOwner && !isAdmin) return ResponseEntity.status(403).body("forbidden");
        repo.deleteById(id);
        return ResponseEntity.ok("deleted");
    }

    @GetMapping("/mine")
    public List<Post> mine(Authentication auth) {
        if(auth == null) return List.of();
        return repo.findByOwnerUsername(auth.getName());
    }
}
