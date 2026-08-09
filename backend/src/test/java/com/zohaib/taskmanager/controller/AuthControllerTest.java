package com.zohaib.taskmanager.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zohaib.taskmanager.auth.AuthController;
import com.zohaib.taskmanager.auth.AuthService;
import com.zohaib.taskmanager.auth.JwtService;
import com.zohaib.taskmanager.dto.LoginRequest;
import com.zohaib.taskmanager.dto.LoginResponse;
import com.zohaib.taskmanager.dto.RegisterRequest;
import com.zohaib.taskmanager.dto.RegisterResponse;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private com.zohaib.taskmanager.repository.UserRepository userRepository;

    @MockBean
    private org.springframework.security.core.userdetails.UserDetailsService userDetailsService;

    @MockBean
    private com.zohaib.taskmanager.config.CustomAccessDeniedHandler accessDeniedHandler;

    @MockBean
    private com.zohaib.taskmanager.config.CustomAuthenticationEntryPoint authenticationEntryPoint;

    @Test
    void register_Success() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setName("Zohaib Al-Mansoor");
        request.setEmail("zohaib.admin@alnada.com");
        request.setPassword("password123");

        RegisterResponse response = new RegisterResponse();
        response.setMessage("User registered successfully");
        response.setUserId(1L);
        response.setEmail("zohaib.admin@alnada.com");
        response.setRole("ADMIN");

        when(authService.register(any(RegisterRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully"))
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.role").value("ADMIN"));
    }

    @Test
    void login_Success() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("zohaib.admin@alnada.com");
        request.setPassword("password123");

        LoginResponse response = new LoginResponse();
        response.setToken("mockJwtToken");
        response.setRole("ADMIN");
        response.setUserName("zohaib.admin@alnada.com");
        response.setUserId(1L);

        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mockJwtToken"))
                .andExpect(jsonPath("$.role").value("ADMIN"))
                .andExpect(jsonPath("$.userId").value(1));
    }
}
