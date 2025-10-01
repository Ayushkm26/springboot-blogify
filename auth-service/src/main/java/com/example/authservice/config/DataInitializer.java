package com.example.authservice.config;

import com.example.authservice.model.User;
import com.example.authservice.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner init(UserRepository repo, PasswordEncoder encoder) {
        return args -> {
            if(repo.findByUsername("admin").isEmpty()) {
                User admin = new User("admin", encoder.encode("admin123"), Set.of("ROLE_ADMIN"));
                repo.save(admin);
                System.out.println("Seeded admin/admin123");
            }
        };
    }
}
