package com.zohaib.taskmanager.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.zohaib.taskmanager.dto.EmployeeRequest;
import com.zohaib.taskmanager.dto.EmployeeResponse;
import com.zohaib.taskmanager.dto.UpdateEmployeeRequest;
import com.zohaib.taskmanager.entity.Role;
import com.zohaib.taskmanager.entity.User;
import com.zohaib.taskmanager.exception.ConflictException;
import com.zohaib.taskmanager.exception.ForbiddenException;
import com.zohaib.taskmanager.exception.ResourceNotFoundException;
import com.zohaib.taskmanager.repository.TaskRepository;
import com.zohaib.taskmanager.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private EmployeeService employeeService;

    private User employeeUser;
    private User adminUser;
    private EmployeeRequest employeeRequest;
    private UpdateEmployeeRequest updateEmployeeRequest;

    @BeforeEach
    void setUp() {
        employeeUser = new User();
        employeeUser.setId(2L);
        employeeUser.setName("Faisal Tariq");
        employeeUser.setEmail("faisal.tariq@alnada.com");
        employeeUser.setPassword("encodedPassword");
        employeeUser.setRole(Role.EMPLOYEE);
        employeeUser.setCreatedAt(LocalDateTime.now().withNano(0));

        adminUser = new User();
        adminUser.setId(1L);
        adminUser.setName("Zohaib Al-Mansoor");
        adminUser.setEmail("zohaib.admin@alnada.com");
        adminUser.setRole(Role.ADMIN);

        employeeRequest = new EmployeeRequest();
        employeeRequest.setName("Faisal Tariq");
        employeeRequest.setEmail("faisal.tariq@alnada.com");
        employeeRequest.setPassword("password123");

        updateEmployeeRequest = new UpdateEmployeeRequest();
        updateEmployeeRequest.setName("Faisal Tariq Updated");
        updateEmployeeRequest.setEmail("faisal.updated@alnada.com");
    }

    @Test
    void createEmployee_Success() {
        when(userRepository.findByEmail(employeeRequest.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(employeeRequest.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(employeeUser);

        EmployeeResponse response = employeeService.createEmployee(employeeRequest);

        assertNotNull(response);
        assertEquals(2L, response.getId());
        assertEquals("Faisal Tariq", response.getName());
        assertEquals("faisal.tariq@alnada.com", response.getEmail());
        assertEquals("EMPLOYEE", response.getRole());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void createEmployee_AlreadyExists_ThrowsConflictException() {
        when(userRepository.findByEmail(employeeRequest.getEmail())).thenReturn(Optional.of(employeeUser));

        ConflictException exception = assertThrows(
            ConflictException.class,
            () -> employeeService.createEmployee(employeeRequest)
        );

        assertEquals("Employee Already Exist", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void getAllEmployees_Success() {
        when(userRepository.findByRole(Role.EMPLOYEE)).thenReturn(List.of(employeeUser));

        List<EmployeeResponse> responses = employeeService.getAllEmployees();

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("Faisal Tariq", responses.get(0).getName());
        assertEquals("EMPLOYEE", responses.get(0).getRole());
    }

    @Test
    void getEmployeeById_Success() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(employeeUser));

        EmployeeResponse response = employeeService.getEmployeeById(2L);

        assertNotNull(response);
        assertEquals(2L, response.getId());
        assertEquals("Faisal Tariq", response.getName());
    }

    @Test
    void getEmployeeById_NotFound_ThrowsResourceNotFoundException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> employeeService.getEmployeeById(99L)
        );

        assertEquals("User Not Found", exception.getMessage());
    }

    @Test
    void updateEmployee_Success() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(employeeUser));
        when(userRepository.findByEmail(updateEmployeeRequest.getEmail())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(employeeUser);

        EmployeeResponse response = employeeService.updateEmployee(2L, updateEmployeeRequest);

        assertNotNull(response);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void updateEmployee_EmailAlreadyExistsForAnotherUser_ThrowsConflictException() {
        User anotherUser = new User();
        anotherUser.setId(3L);
        anotherUser.setEmail("faisal.updated@alnada.com");

        when(userRepository.findById(2L)).thenReturn(Optional.of(employeeUser));
        when(userRepository.findByEmail(updateEmployeeRequest.getEmail())).thenReturn(Optional.of(anotherUser));

        ConflictException exception = assertThrows(
            ConflictException.class,
            () -> employeeService.updateEmployee(2L, updateEmployeeRequest)
        );

        assertEquals("Email already exists", exception.getMessage());
    }

    @Test
    void deleteEmployee_Success() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(employeeUser));
        when(taskRepository.existsByAssignedUserId(2L)).thenReturn(false);

        assertDoesNotThrow(() -> employeeService.deleteEmployee(2L));
        verify(userRepository, times(1)).delete(employeeUser);
    }

    @Test
    void deleteEmployee_AdminUser_ThrowsForbiddenException() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(adminUser));

        ForbiddenException exception = assertThrows(
            ForbiddenException.class,
            () -> employeeService.deleteEmployee(1L)
        );

        assertEquals("Admin cannot be deleted", exception.getMessage());
        verify(userRepository, never()).delete(any(User.class));
    }

    @Test
    void deleteEmployee_HasAssignedTasks_ThrowsConflictException() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(employeeUser));
        when(taskRepository.existsByAssignedUserId(2L)).thenReturn(true);

        ConflictException exception = assertThrows(
            ConflictException.class,
            () -> employeeService.deleteEmployee(2L)
        );

        assertEquals("Employee cannot be deleted because tasks are assigned to this employee.", exception.getMessage());
        verify(userRepository, never()).delete(any(User.class));
    }
}
