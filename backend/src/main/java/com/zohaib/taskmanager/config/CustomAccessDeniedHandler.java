package com.zohaib.taskmanager.config;

import java.io.IOException;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zohaib.taskmanager.dto.ErrorResponse;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
//Whenever a logged-in user tries to access something he is not allowed to access, call this class.
public class CustomAccessDeniedHandler implements AccessDeniedHandler{
	
	@Autowired
	ObjectMapper objectMapper;//converts Java objects into JSON.

	@Override
	//Spring automatically calls this method whenever an authorization failure occurs.
	//request → incoming HTTP request
	//response → HTTP response sent back to the client
	//accessDeniedException → exception thrown by Spring Security
	public void handle(HttpServletRequest request, HttpServletResponse response,
			AccessDeniedException accessDeniedException) throws IOException, ServletException {
		// TODO Auto-generated method stub
		
		ErrorResponse error = new ErrorResponse();
		
		error.setMessage("Access denied. You do not have permission to access this resource.");
		error.setStatus(HttpStatus.FORBIDDEN.value());
		error.setTimestamp(LocalDateTime.now());
		
		response.setStatus(HttpStatus.FORBIDDEN.value());
		response.setContentType("application/json");
		
		objectMapper.writeValue(response.getOutputStream(), error);
		
	}

}
