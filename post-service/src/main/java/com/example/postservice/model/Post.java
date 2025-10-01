package com.example.postservice.model;

import jakarta.persistence.*;

@Entity
@Table(name = "posts")
public class Post {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 10000)
    private String content;

    private String ownerUsername;

    public Post() {}
    public Post(String title, String content, String ownerUsername){
        this.title=title; this.content=content; this.ownerUsername=ownerUsername;
    }

    // getters and setters
    public Long getId(){ return id; }
    public void setId(Long id){ this.id = id; }
    public String getTitle(){ return title; }
    public void setTitle(String t){ this.title = t; }
    public String getContent(){ return content; }
    public void setContent(String c){ this.content = c; }
    public String getOwnerUsername(){ return ownerUsername; }
    public void setOwnerUsername(String u){ this.ownerUsername = u; }
}
