package com.zohaib.taskmanager.dto;

import java.time.LocalDateTime;

public class DeleteResponse {

    private String message;
    private LocalDateTime timestamp;
    
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public LocalDateTime getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}
    
    
    
}
