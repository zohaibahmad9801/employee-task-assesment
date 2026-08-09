package com.zohaib.taskmanager.dto;

import java.time.LocalDate;

import com.zohaib.taskmanager.entity.TaskPriority;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TaskRequest {
	
	@NotBlank(message = "Title cannot be empty")
	private String title;
	@NotBlank(message = "Description cannot be empty")
    private String description;
	@NotNull(message = "Priority cannot be empty or null")
    private TaskPriority priority;
	@NotNull(message = "Due date cannot be empty")
	@FutureOrPresent(message = "Due date must be today or in the future")
    private LocalDate dueDate;
	@NotNull(message = "Assigned user id cannot be empty")
    private Long assignedUserId;

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public TaskPriority getPriority() {
		return priority;
	}

	public void setPriority(TaskPriority priority) {
		this.priority = priority;
	}

	public LocalDate getDueDate() {
		return dueDate;
	}

	public void setDueDate(LocalDate dueDate) {
		this.dueDate = dueDate;
	}

	public Long getAssignedUserId() {
		return assignedUserId;
	}

	public void setAssignedUserId(Long assignedUserId) {
		this.assignedUserId = assignedUserId;
	}
    
    
    

}
