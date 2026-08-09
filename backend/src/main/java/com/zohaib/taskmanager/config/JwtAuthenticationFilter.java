package com.zohaib.taskmanager.config;

import java.util.List;
import java.io.IOException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.zohaib.taskmanager.auth.JwtService;
import com.zohaib.taskmanager.entity.User;
import com.zohaib.taskmanager.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter  extends OncePerRequestFilter{
	
	@Autowired
	private JwtService jwtService;
	
	@Autowired
	private UserRepository userRepository;
	
	
/* This is a request Filter Every Request will pass through it and Bearer token will be verified */
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		//GET the Authorization key from Header
		String authHeader = request.getHeader("Authorization");
		
		if(authHeader == null || !authHeader.startsWith("Bearer ")) {
			//Let the next filter or controller handle the request
			filterChain.doFilter(request, response);
			return;
		}
		
		//extract token from authHeader Substring	
		String token = authHeader.substring(7);
		//System.out.println(token);
		
		//Extract username/email from token
		String email = jwtService.extractUsername(token);
		//System.out.println(email);
		
		//check if username/email exist in DB if exist save in user object
		Optional<User> user = userRepository.findByEmail(email);
		//System.out.println(user.get().getEmail());
		
		
		if (user.isPresent()) {

			//create user role
			List<SimpleGrantedAuthority> authorities = List.of(
			        new SimpleGrantedAuthority(
			        		//Spring Security expects roles in this format: ROLE_ADMIN
			                "ROLE_" + user.get().getRole().name()
			        )
			);

			//authorities contains [ROLE_ADMIN]
			//this objects tells the spring security that username, role and isAuthenticated
			UsernamePasswordAuthenticationToken auth =
			        new UsernamePasswordAuthenticationToken(
			                user.get(),
			                null,
			                authorities
			        );
			//save the user in Spring Security. spring security remembers it
			 SecurityContextHolder.getContext().setAuthentication(auth);
		}
		
		filterChain.doFilter(request, response);
		
		
		
	}

}
