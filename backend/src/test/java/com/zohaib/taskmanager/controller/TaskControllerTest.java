package com.zohaib.taskmanager.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
import com.zohaib.taskmanager.dto.DeleteResponse;
import com.zohaib.taskmanager.dto.TaskRequest;
import com.zohaib.taskmanager.dto.TaskResponse;
import com.zohaib.taskmanager.dto.UpdateTaskStatusRequest;
import com.zohaib.taskmanager.entity.TaskPriority;
import com.zohaib.taskmanager.entity.TaskStatus;
import com.zohaib.taskmanager.service.TaskService;

@WebMvcTest(TaskController.class)
@AutoConfigureMockMvc(addFilters = false)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TaskService taskService;

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

    private TaskResponse taskResponse;

    @BeforeEach
    void setUp() {
        taskResponse = new TaskResponse();
        taskResponse.setId(10L);
        taskResponse.setTitle("Audit Quarterly FX Ledger");
        taskResponse.setDescription("Verify all exchange transaction logs against central ledger");
        taskResponse.setPriority("HIGH");
        taskResponse.setStatus("TODO");
        taskResponse.setDueDate(LocalDate.now().plusDays(5));
        taskResponse.setAssignedUserId(2L);
        taskResponse.setAssignedTo("Faisal Tariq");
        taskResponse.setAssignedUserName("faisal.tariq@alnada.com");
    }

    @Test
    void createTask_Success() throws Exception {
        TaskRequest request = new TaskRequest();
        request.setTitle("Audit Quarterly FX Ledger");
        request.setDescription("Verify all exchange transaction logs against central ledger");
        request.setPriority(TaskPriority.HIGH);
        request.setDueDate(LocalDate.now().plusDays(5));
        request.setAssignedUserId(2L);

        when(taskService.createTask(any(TaskRequest.class))).thenReturn(taskResponse);

        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.title").value("Audit Quarterly FX Ledger"))
                .andExpect(jsonPath("$.status").value("TODO"));
    }

    @Test
    void getAllTasks_Success() throws Exception {
        when(taskService.getAllTasks()).thenReturn(List.of(taskResponse));

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(10))
                .andExpect(jsonPath("$[0].title").value("Audit Quarterly FX Ledger"));
    }

    @Test
    void getTaskById_Success() throws Exception {
        when(taskService.getTaskById(10L)).thenReturn(taskResponse);

        mockMvc.perform(get("/api/tasks/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.title").value("Audit Quarterly FX Ledger"));
    }

    @Test
    void updateTask_Success() throws Exception {
        TaskRequest request = new TaskRequest();
        request.setTitle("Reconcile Daily Counter Currency Logs");
        request.setDescription("Reconcile cash flow entries with daily branch balances");
        request.setPriority(TaskPriority.MEDIUM);
        request.setDueDate(LocalDate.now().plusDays(7));
        request.setAssignedUserId(2L);

        taskResponse.setTitle("Reconcile Daily Counter Currency Logs");

        when(taskService.updateTask(eq(10L), any(TaskRequest.class))).thenReturn(taskResponse);

        mockMvc.perform(put("/api/tasks/10")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Reconcile Daily Counter Currency Logs"));
    }

    @Test
    void deleteTask_Success() throws Exception {
        DeleteResponse deleteResponse = new DeleteResponse();
        deleteResponse.setMessage("Task deleted successfully");
        deleteResponse.setTimestamp(LocalDateTime.now().withNano(0));

        when(taskService.deleteTask(10L)).thenReturn(deleteResponse);

        mockMvc.perform(delete("/api/tasks/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Task deleted successfully"));
    }

    @Test
    void getMyTasks_Success() throws Exception {
        when(taskService.getMyTasks()).thenReturn(List.of(taskResponse));

        mockMvc.perform(get("/api/tasks/my-tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(10));
    }

    @Test
    void updateTaskStatus_Success() throws Exception {
        UpdateTaskStatusRequest request = new UpdateTaskStatusRequest();
        request.setStatus(TaskStatus.IN_PROGRESS);

        taskResponse.setStatus("IN_PROGRESS");

        when(taskService.updateTaskStatus(eq(10L), any(UpdateTaskStatusRequest.class))).thenReturn(taskResponse);

        mockMvc.perform(put("/api/tasks/10/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
    }
}
