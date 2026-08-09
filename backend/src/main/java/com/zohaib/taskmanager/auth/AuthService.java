package com.zohaib.taskmanager.auth;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.zohaib.taskmanager.dto.LoginRequest;
import com.zohaib.taskmanager.dto.LoginResponse;
import com.zohaib.taskmanager.dto.RegisterRequest;
import com.zohaib.taskmanager.dto.RegisterResponse;
import com.zohaib.taskmanager.entity.Role;
import com.zohaib.taskmanager.entity.User;
import com.zohaib.taskmanager.exception.InvalidCredentialsException;
import com.zohaib.taskmanager.exception.ConflictException;
import com.zohaib.taskmanager.repository.UserRepository;

@Service
public class AuthService {

	@Autowired
	private UserRepository userRepository;
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private JwtService jwtService;

	public RegisterResponse register(RegisterRequest registerRequest) {

		Optional<User> userExist = userRepository.findByEmail(registerRequest.getEmail());

		if (userExist.isPresent())
			throw new ConflictException("User Already Exist");

		User user = new User();

		user.setName(registerRequest.getName());
		user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(Role.ADMIN);
        user.setCreatedAt(LocalDateTime.now().withNano(0));

		User savedUser = userRepository.save(user);
		
		RegisterResponse registerResponse = new RegisterResponse();

		registerResponse.setMessage("User registered successfully");
		registerResponse.setUserId(savedUser.getId());
		registerResponse.setEmail(savedUser.getEmail());
		registerResponse.setRole(savedUser.getRole().name());
		
		return registerResponse;
		
		
	}

	public LoginResponse login(LoginRequest loginRequest) {

		Optional<User> user = userRepository.findByEmail(loginRequest.getEmail());

		if (!user.isPresent())
			throw new InvalidCredentialsException("Invalid email or password");

		if (!passwordEncoder.matches(loginRequest.getPassword(), user.get().getPassword()))
			throw new InvalidCredentialsException("Invalid email or password");

		String token = jwtService.generateToken(user.get());

		LoginResponse loginResponse = new LoginResponse();
		loginResponse.setToken(token);
		loginResponse.setRole(user.get().getRole().toString());
		loginResponse.setUserName(user.get().getEmail());
		loginResponse.setUserId(user.get().getId());

		return loginResponse;

	}
}
