package com.example.authservice.controller;

import com.example.authservice.model.User;
import com.example.authservice.repository.UserRepository;
import com.example.authservice.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;

    public AuthController(UserRepository repo, PasswordEncoder encoder, JwtUtil jwt){
        this.repo=repo; this.encoder=encoder; this.jwt=jwt;
    }

    record RegisterReq(String username, String password) {}
    record LoginReq(String username, String password) {}
    record LoginResp(String token) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterReq req){
        if(repo.findByUsername(req.username()).isPresent()) return ResponseEntity.badRequest().body("username taken");
        User u = new User(req.username(), encoder.encode(req.password()), Set.of("ROLE_USER"));
        repo.save(u);
        return ResponseEntity.ok(Map.of("username", u.getUsername()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginReq r){
        Optional<User> ou = repo.findByUsername(r.username());
        if(ou.isEmpty()) return ResponseEntity.status(401).body("invalid");
        User u = ou.get();
        if(!encoder.matches(r.password(), u.getPassword())) return ResponseEntity.status(401).body("invalid");
        String token = jwt.generateToken(u.getUsername(), u.getRoles());
        return ResponseEntity.ok(new LoginResp(token));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestHeader("Authorization") String auth, @RequestBody Map<String,String> body){
        // Very simple: expect Authorization: Bearer <token>
        try {
            String token = auth.replaceFirst("Bearer\s+","");
            var claims = jwt.validate(token).getBody();
            String username = claims.getSubject();
            String oldp = body.get("oldPassword");
            String newp = body.get("newPassword");
            var uOpt = repo.findByUsername(username);
            if(uOpt.isEmpty()) return ResponseEntity.status(401).body("user not found");
            var u = uOpt.get();
            if(!encoder.matches(oldp, u.getPassword())) return ResponseEntity.status(400).body("wrong old password");
            u.setPassword(encoder.encode(newp));
            repo.save(u);
            return ResponseEntity.ok("changed");
        } catch(Exception ex){
            return ResponseEntity.status(401).body("invalid token");
        }
    }
}
