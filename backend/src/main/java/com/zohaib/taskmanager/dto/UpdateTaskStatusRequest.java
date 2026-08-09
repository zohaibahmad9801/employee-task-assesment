package com.zohaib.taskmanager.dto;

import com.zohaib.taskmanager.entity.TaskStatus;

import jakarta.validation.constraints.NotNull;

public class UpdateTaskStatusRequest {
	
	@NotNull(message = "Status cannot be null")
	private TaskStatus status;

	public TaskStatus getStatus() {
		return status;
	}

	public void setStatus(TaskStatus status) {
		this.status = status;
	}
	
	

}
