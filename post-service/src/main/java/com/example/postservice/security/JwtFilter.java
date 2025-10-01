package com.example.postservice.security;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import jakarta.servlet.FilterChain;
import jakarta.servlet.GenericFilter;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtFilter extends GenericFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) { this.jwtUtil = jwtUtil; }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        String auth = request.getHeader(HttpHeaders.AUTHORIZATION);
        if(auth != null && auth.startsWith("Bearer ")) {
            String token = auth.replaceFirst("Bearer\s+","");
            try {
                Jws<Claims> claims = jwtUtil.validate(token);
                String username = claims.getBody().getSubject();
                var rolesObj = claims.getBody().get("roles");
                List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                if(rolesObj instanceof Collection) {
                    for(Object r: (Collection)rolesObj) authorities.add(new SimpleGrantedAuthority((String)r));
                }
                UsernamePasswordAuthenticationToken a = new UsernamePasswordAuthenticationToken(username, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(a);
            } catch(Exception ex) {
                // invalid token -> no auth
            }
        }
        chain.doFilter(req,res);
    }
}
