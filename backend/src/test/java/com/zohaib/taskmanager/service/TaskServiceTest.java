package com.zohaib.taskmanager.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import com.zohaib.taskmanager.dto.DeleteResponse;
import com.zohaib.taskmanager.dto.TaskRequest;
import com.zohaib.taskmanager.dto.TaskResponse;
import com.zohaib.taskmanager.dto.UpdateTaskStatusRequest;
import com.zohaib.taskmanager.entity.Role;
import com.zohaib.taskmanager.entity.Task;
import com.zohaib.taskmanager.entity.TaskPriority;
import com.zohaib.taskmanager.entity.TaskStatus;
import com.zohaib.taskmanager.entity.User;
import com.zohaib.taskmanager.exception.BadRequestException;
import com.zohaib.taskmanager.exception.ForbiddenException;
import com.zohaib.taskmanager.exception.InvalidCredentialsException;
import com.zohaib.taskmanager.exception.ResourceNotFoundException;
import com.zohaib.taskmanager.repository.TaskRepository;
import com.zohaib.taskmanager.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskService taskService;

    private User employeeUser;
    private User adminUser;
    private Task testTask;
    private TaskRequest taskRequest;

    @BeforeEach
    void setUp() {
        employeeUser = new User();
        employeeUser.setId(2L);
        employeeUser.setName("Faisal Tariq");
        employeeUser.setEmail("faisal.tariq@alnada.com");
        employeeUser.setRole(Role.EMPLOYEE);

        adminUser = new User();
        adminUser.setId(1L);
        adminUser.setName("Zohaib Al-Mansoor");
        adminUser.setEmail("zohaib.admin@alnada.com");
        adminUser.setRole(Role.ADMIN);

        testTask = new Task();
        testTask.setId(10L);
        testTask.setTitle("Audit Quarterly FX Ledger");
        testTask.setDescription("Verify all exchange transaction logs against central ledger");
        testTask.setPriority(TaskPriority.HIGH);
        testTask.setStatus(TaskStatus.TODO);
        testTask.setDueDate(LocalDate.now().plusDays(5));
        testTask.setAssignedUser(employeeUser);
        testTask.setCreatedAt(LocalDateTime.now().withNano(0));

        taskRequest = new TaskRequest();
        taskRequest.setTitle("Audit Quarterly FX Ledger");
        taskRequest.setDescription("Verify all exchange transaction logs against central ledger");
        taskRequest.setPriority(TaskPriority.HIGH);
        taskRequest.setDueDate(LocalDate.now().plusDays(5));
        taskRequest.setAssignedUserId(2L);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    private void setSecurityContext(User user) {
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    void createTask_Success() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(employeeUser));
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        TaskResponse response = taskService.createTask(taskRequest);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("Audit Quarterly FX Ledger", response.getTitle());
        assertEquals("TODO", response.getStatus());
        assertEquals("HIGH", response.getPriority());
    }

    @Test
    void createTask_UserNotFound_ThrowsResourceNotFoundException() {
        when(userRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> taskService.createTask(taskRequest));
    }

    @Test
    void createTask_AssignedToAdmin_ThrowsBadRequestException() {
        taskRequest.setAssignedUserId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(adminUser));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> taskService.createTask(taskRequest));
        assertEquals("Task can only be assigned to employees", ex.getMessage());
    }

    @Test
    void getAllTasks_Success() {
        when(taskRepository.findAll()).thenReturn(List.of(testTask));

        List<TaskResponse> responses = taskService.getAllTasks();

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("Audit Quarterly FX Ledger", responses.get(0).getTitle());
    }

    @Test
    void updateTask_Success() {
        when(taskRepository.findById(10L)).thenReturn(Optional.of(testTask));
        when(userRepository.findById(2L)).thenReturn(Optional.of(employeeUser));
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        TaskResponse response = taskService.updateTask(10L, taskRequest);

        assertNotNull(response);
        assertEquals(10L, response.getId());
    }

    @Test
    void deleteTask_Success() {
        when(taskRepository.findById(10L)).thenReturn(Optional.of(testTask));

        DeleteResponse response = taskService.deleteTask(10L);

        assertNotNull(response);
        assertEquals("Task deleted successfully", response.getMessage());
        verify(taskRepository, times(1)).delete(testTask);
    }

    @Test
    void getMyTasks_Success() {
        setSecurityContext(employeeUser);
        when(taskRepository.findByAssignedUser(employeeUser)).thenReturn(List.of(testTask));

        List<TaskResponse> responses = taskService.getMyTasks();

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(10L, responses.get(0).getId());
    }

    @Test
    void updateTaskStatus_Success() {
        setSecurityContext(employeeUser);
        when(taskRepository.findById(10L)).thenReturn(Optional.of(testTask));
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        UpdateTaskStatusRequest request = new UpdateTaskStatusRequest();
        request.setStatus(TaskStatus.IN_PROGRESS);

        TaskResponse response = taskService.updateTaskStatus(10L, request);

        assertNotNull(response);
        verify(taskRepository, times(1)).save(testTask);
    }

    @Test
    void updateTaskStatus_UnauthorizedUser_ThrowsInvalidCredentialsException() {
        User otherEmployee = new User();
        otherEmployee.setId(99L);
        setSecurityContext(otherEmployee);

        when(taskRepository.findById(10L)).thenReturn(Optional.of(testTask));

        UpdateTaskStatusRequest request = new UpdateTaskStatusRequest();
        request.setStatus(TaskStatus.IN_PROGRESS);

        assertThrows(InvalidCredentialsException.class, () -> taskService.updateTaskStatus(10L, request));
    }

    @Test
    void getTaskById_Success_AdminUser() {
        setSecurityContext(adminUser);
        when(taskRepository.findById(10L)).thenReturn(Optional.of(testTask));

        TaskResponse response = taskService.getTaskById(10L);

        assertNotNull(response);
        assertEquals(10L, response.getId());
    }

    @Test
    void getTaskById_EmployeeUserOtherTask_ThrowsForbiddenException() {
        User otherEmployee = new User();
        otherEmployee.setId(99L);
        otherEmployee.setRole(Role.EMPLOYEE);
        setSecurityContext(otherEmployee);

        when(taskRepository.findById(10L)).thenReturn(Optional.of(testTask));

        assertThrows(ForbiddenException.class, () -> taskService.getTaskById(10L));
    }
}
