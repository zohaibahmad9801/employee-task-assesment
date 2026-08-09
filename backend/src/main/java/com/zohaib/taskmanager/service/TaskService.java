package com.zohaib.taskmanager.service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.zohaib.taskmanager.dto.DeleteResponse;
import com.zohaib.taskmanager.dto.TaskRequest;
import com.zohaib.taskmanager.dto.TaskResponse;
import com.zohaib.taskmanager.dto.UpdateTaskStatusRequest;
import com.zohaib.taskmanager.entity.Role;
import com.zohaib.taskmanager.entity.Task;
import com.zohaib.taskmanager.entity.TaskStatus;
import com.zohaib.taskmanager.entity.User;
import com.zohaib.taskmanager.exception.BadRequestException;
import com.zohaib.taskmanager.exception.ForbiddenException;
import com.zohaib.taskmanager.exception.InvalidCredentialsException;
import com.zohaib.taskmanager.exception.ResourceNotFoundException;
import com.zohaib.taskmanager.repository.TaskRepository;
import com.zohaib.taskmanager.repository.UserRepository;

@Service
public class TaskService {

	@Autowired
	private TaskRepository taskRepository;

	@Autowired
	private UserRepository userRepository;

	private TaskResponse mapToTaskResponse(Task task) {
		TaskResponse response = new TaskResponse();
		response.setId(task.getId());
		response.setTitle(task.getTitle());
		response.setDescription(task.getDescription());
		response.setPriority(task.getPriority() != null ? task.getPriority().name() : null);
		response.setStatus(task.getStatus() != null ? task.getStatus().name() : null);
		response.setDueDate(task.getDueDate());
		if (task.getAssignedUser() != null) {
			response.setAssignedUserId(task.getAssignedUser().getId());
			response.setAssignedUserName(task.getAssignedUser().getEmail());
			response.setAssignedTo(task.getAssignedUser().getName());
		}
		response.setCreatedAT(task.getCreatedAt());
		response.setUpdatedAt(task.getUpdatedAt());
		return response;
	}

	public TaskResponse createTask(TaskRequest taskRequest) {
		User employee = userRepository.findById(taskRequest.getAssignedUserId())
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		if (employee.getRole() == Role.ADMIN) {
			throw new BadRequestException("Task can only be assigned to employees");
		}

		Task task = new Task();
		task.setTitle(taskRequest.getTitle());
		task.setDescription(taskRequest.getDescription());
		task.setPriority(taskRequest.getPriority());
		task.setDueDate(taskRequest.getDueDate());
		task.setAssignedUser(employee);
		task.setStatus(TaskStatus.TODO);
		task.setCreatedAt(LocalDateTime.now().withNano(0));

		Task savedTask = taskRepository.save(task);

		return mapToTaskResponse(savedTask);
	}

	public List<TaskResponse> getAllTasks() {
		List<Task> tasks = taskRepository.findAll();
		return tasks.stream().map(this::mapToTaskResponse).toList();
	}

	public TaskResponse updateTask(Long taskId, TaskRequest taskRequest) {
		Task task = taskRepository.findById(taskId)
				.orElseThrow(() -> new ResourceNotFoundException("Task not found"));

		User employee = userRepository.findById(taskRequest.getAssignedUserId())
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		if (employee.getRole() == Role.ADMIN) {
			throw new BadRequestException("Task can only be assigned to employees");
		}

		task.setTitle(taskRequest.getTitle());
		task.setDescription(taskRequest.getDescription());
		task.setPriority(taskRequest.getPriority());
		task.setDueDate(taskRequest.getDueDate());
		task.setAssignedUser(employee);
		task.setUpdatedAt(LocalDateTime.now().withNano(0));

		Task updatedTask = taskRepository.save(task);

		return mapToTaskResponse(updatedTask);
	}

	public DeleteResponse deleteTask(Long taskId) {
		Task task = taskRepository.findById(taskId)
				.orElseThrow(() -> new ResourceNotFoundException("Task not found"));

		taskRepository.delete(task);

		DeleteResponse response = new DeleteResponse();
		response.setMessage("Task deleted successfully");
		response.setTimestamp(LocalDateTime.now().withNano(0));

		return response;
	}

	public List<TaskResponse> getMyTasks() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		User user = (User) authentication.getPrincipal();

		List<Task> tasks = taskRepository.findByAssignedUser(user);

		return tasks.stream().map(this::mapToTaskResponse).toList();
	}

	public TaskResponse updateTaskStatus(Long taskId, UpdateTaskStatusRequest updateTaskStatusRequest) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		User user = (User) authentication.getPrincipal();

		Task task = taskRepository.findById(taskId)
				.orElseThrow(() -> new ResourceNotFoundException("Task not found"));

		if (!task.getAssignedUser().getId().equals(user.getId())) {
			throw new InvalidCredentialsException("You are not authorized to update this task");
		}

		task.setStatus(updateTaskStatusRequest.getStatus());
		task.setUpdatedAt(LocalDateTime.now().withNano(0));

		Task savedTask = taskRepository.save(task);

		return mapToTaskResponse(savedTask);
	}

	public TaskResponse getTaskById(Long taskId) {
		Task task = taskRepository.findById(taskId)
				.orElseThrow(() -> new ResourceNotFoundException("Task not found"));

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		User user = (User) authentication.getPrincipal();

		if (user.getRole() == Role.EMPLOYEE && !task.getAssignedUser().getId().equals(user.getId())) {
			throw new ForbiddenException("You are not authorized to view this task");
		}

		return mapToTaskResponse(task);
	}
}
