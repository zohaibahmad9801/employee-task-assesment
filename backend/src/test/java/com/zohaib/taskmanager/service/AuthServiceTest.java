package com.zohaib.taskmanager.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.zohaib.taskmanager.auth.AuthService;
import com.zohaib.taskmanager.auth.JwtService;
import com.zohaib.taskmanager.dto.LoginRequest;
import com.zohaib.taskmanager.dto.LoginResponse;
import com.zohaib.taskmanager.dto.RegisterRequest;
import com.zohaib.taskmanager.dto.RegisterResponse;
import com.zohaib.taskmanager.entity.Role;
import com.zohaib.taskmanager.entity.User;
import com.zohaib.taskmanager.exception.ConflictException;
import com.zohaib.taskmanager.exception.InvalidCredentialsException;
import com.zohaib.taskmanager.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setName("Zohaib Al-Mansoor");
        testUser.setEmail("zohaib.admin@alnada.com");
        testUser.setPassword("encodedPassword");
        testUser.setRole(Role.ADMIN);
        testUser.setCreatedAt(LocalDateTime.now().withNano(0));

        registerRequest = new RegisterRequest();
        registerRequest.setName("Zohaib Al-Mansoor");
        registerRequest.setEmail("zohaib.admin@alnada.com");
        registerRequest.setPassword("password123");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("zohaib.admin@alnada.com");
        loginRequest.setPassword("password123");
    }

    @Test
    void register_Success() {
        when(userRepository.findByEmail(registerRequest.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        RegisterResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("User registered successfully", response.getMessage());
        assertEquals(1L, response.getUserId());
        assertEquals("zohaib.admin@alnada.com", response.getEmail());
        assertEquals("ADMIN", response.getRole());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_UserAlreadyExists_ThrowsConflictException() {
        when(userRepository.findByEmail(registerRequest.getEmail())).thenReturn(Optional.of(testUser));

        ConflictException exception = assertThrows(
            ConflictException.class,
            () -> authService.register(registerRequest)
        );

        assertEquals("User Already Exist", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Success() {
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(loginRequest.getPassword(), testUser.getPassword())).thenReturn(true);
        when(jwtService.generateToken(testUser)).thenReturn("mockJwtToken");

        LoginResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("mockJwtToken", response.getToken());
        assertEquals("ADMIN", response.getRole());
        assertEquals("zohaib.admin@alnada.com", response.getUserName());
        assertEquals(1L, response.getUserId());
    }

    @Test
    void login_UserNotFound_ThrowsInvalidCredentialsException() {
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.empty());

        InvalidCredentialsException exception = assertThrows(
            InvalidCredentialsException.class,
            () -> authService.login(loginRequest)
        );

        assertEquals("Invalid email or password", exception.getMessage());
    }

    @Test
    void login_PasswordMismatch_ThrowsInvalidCredentialsException() {
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(loginRequest.getPassword(), testUser.getPassword())).thenReturn(false);

        InvalidCredentialsException exception = assertThrows(
            InvalidCredentialsException.class,
            () -> authService.login(loginRequest)
        );

        assertEquals("Invalid email or password", exception.getMessage());
    }
}
