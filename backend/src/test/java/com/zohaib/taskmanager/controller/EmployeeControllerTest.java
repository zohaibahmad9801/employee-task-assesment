package com.zohaib.taskmanager.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zohaib.taskmanager.auth.JwtService;
import com.zohaib.taskmanager.dto.EmployeeRequest;
import com.zohaib.taskmanager.dto.EmployeeResponse;
import com.zohaib.taskmanager.dto.UpdateEmployeeRequest;
import com.zohaib.taskmanager.service.EmployeeService;

@WebMvcTest(EmployeeController.class)
@AutoConfigureMockMvc(addFilters = false)
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EmployeeService employeeService;

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

    private EmployeeResponse employeeResponse;

    @BeforeEach
    void setUp() {
        employeeResponse = new EmployeeResponse();
        employeeResponse.setId(2L);
        employeeResponse.setName("Faisal Tariq");
        employeeResponse.setEmail("faisal.tariq@alnada.com");
        employeeResponse.setRole("EMPLOYEE");
    }

    @Test
    void createEmployee_Success() throws Exception {
        EmployeeRequest request = new EmployeeRequest();
        request.setName("Faisal Tariq");
        request.setEmail("faisal.tariq@alnada.com");
        request.setPassword("password123");

        when(employeeService.createEmployee(any(EmployeeRequest.class))).thenReturn(employeeResponse);

        mockMvc.perform(post("/api/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.name").value("Faisal Tariq"))
                .andExpect(jsonPath("$.email").value("faisal.tariq@alnada.com"));
    }

    @Test
    void getAllEmployees_Success() throws Exception {
        when(employeeService.getAllEmployees()).thenReturn(List.of(employeeResponse));

        mockMvc.perform(get("/api/employees"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(2))
                .andExpect(jsonPath("$[0].name").value("Faisal Tariq"));
    }

    @Test
    void getEmployeeById_Success() throws Exception {
        when(employeeService.getEmployeeById(2L)).thenReturn(employeeResponse);

        mockMvc.perform(get("/api/employees/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.name").value("Faisal Tariq"));
    }

    @Test
    void updateEmployee_Success() throws Exception {
        UpdateEmployeeRequest request = new UpdateEmployeeRequest();
        request.setName("Faisal Tariq Updated");
        request.setEmail("faisal.updated@alnada.com");

        employeeResponse.setName("Faisal Tariq Updated");
        employeeResponse.setEmail("faisal.updated@alnada.com");

        when(employeeService.updateEmployee(eq(2L), any(UpdateEmployeeRequest.class))).thenReturn(employeeResponse);

        mockMvc.perform(put("/api/employees/2")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Faisal Tariq Updated"))
                .andExpect(jsonPath("$.email").value("faisal.updated@alnada.com"));
    }

    @Test
    void deleteEmployee_Success() throws Exception {
        doNothing().when(employeeService).deleteEmployee(2L);

        mockMvc.perform(delete("/api/employees/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Employee deleted successfully"));
    }
}
