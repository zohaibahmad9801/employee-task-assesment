package com.zohaib.taskmanager.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.zohaib.taskmanager.dto.DeleteResponse;
import com.zohaib.taskmanager.dto.TaskRequest;
import com.zohaib.taskmanager.dto.TaskResponse;
import com.zohaib.taskmanager.dto.UpdateTaskStatusRequest;
import com.zohaib.taskmanager.service.TaskService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

	@Autowired
	private TaskService taskService;

	@PostMapping
	public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest taskRequest) {

		TaskResponse taskResponse = taskService.createTask(taskRequest);

		return ResponseEntity.status(HttpStatus.CREATED).body(taskResponse);
	}

	@GetMapping
	public ResponseEntity<List<TaskResponse>> getAllTasks() {

		return ResponseEntity.ok(taskService.getAllTasks());
	}

	@PutMapping("/{id}")
	public ResponseEntity<TaskResponse> updateTask(@PathVariable Long id,@Valid @RequestBody TaskRequest taskRequest) {

		return ResponseEntity.ok(taskService.updateTask(id, taskRequest));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<DeleteResponse> deleteTask(@PathVariable Long id) {

		return ResponseEntity.ok(taskService.deleteTask(id));
	}

	@GetMapping("/my-tasks")
	public ResponseEntity<List<TaskResponse>> getMyTasks() {

		return ResponseEntity.ok(taskService.getMyTasks());
	}

	@PutMapping("/{id}/status")
	public ResponseEntity<TaskResponse> updateTaskStatus(@PathVariable Long id,
			@Valid @RequestBody UpdateTaskStatusRequest request) {

		return ResponseEntity.ok(taskService.updateTaskStatus(id, request));
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<TaskResponse> getTaskById(
	        @PathVariable Long id) {

	    return ResponseEntity.ok(
	            taskService.getTaskById(id));

	}
}