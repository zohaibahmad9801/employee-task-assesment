package com.zohaib.taskmanager.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zohaib.taskmanager.dto.LoginRequest;
import com.zohaib.taskmanager.dto.LoginResponse;
import com.zohaib.taskmanager.dto.RegisterRequest;
import com.zohaib.taskmanager.dto.RegisterResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth/")
public class AuthController {

	@Autowired
	private AuthService authService;

	@PostMapping("/register")
	public ResponseEntity<RegisterResponse> createUser(@Valid @RequestBody RegisterRequest request) {

		return ResponseEntity.ok(authService.register(request));
	}

	@PostMapping("/login")
	public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {

		return ResponseEntity.ok(authService.login(request));

	}

}
