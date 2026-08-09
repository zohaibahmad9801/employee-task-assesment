package com.zohaib.taskmanager.exception;

import java.time.LocalDateTime;

import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.zohaib.taskmanager.dto.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(InvalidCredentialsException.class)
	public ResponseEntity<ErrorResponse> handleInvalidCredentials(InvalidCredentialsException ex) {

		ErrorResponse error = new ErrorResponse();
		error.setMessage(ex.getMessage());
		error.setStatus(HttpStatus.UNAUTHORIZED.value());
		error.setTimestamp(LocalDateTime.now());

		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
	}

	@ExceptionHandler(ConflictException.class)
	public ResponseEntity<ErrorResponse> handleUserAlreadyExistsException(ConflictException ex) {

		ErrorResponse error = new ErrorResponse();
		error.setMessage(ex.getMessage());
		error.setStatus(HttpStatus.CONFLICT.value());
		error.setTimestamp(LocalDateTime.now());

		return ResponseEntity.status(HttpStatus.CONFLICT).body(error);

	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {

		String message = ex.getBindingResult().getFieldError().getDefaultMessage();

		ErrorResponse error = new ErrorResponse();
		error.setMessage(message);
		error.setStatus(HttpStatus.BAD_REQUEST.value());
		error.setTimestamp(LocalDateTime.now());

		return ResponseEntity.badRequest().body(error);

	}

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleUserNotFoundException(ResourceNotFoundException ex) {

		ErrorResponse error = new ErrorResponse();
		error.setMessage(ex.getMessage());
		error.setStatus(HttpStatus.NOT_FOUND.value());
		error.setTimestamp(LocalDateTime.now());

		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);

	}

	@ExceptionHandler(ForbiddenException.class)
	public ResponseEntity<ErrorResponse> handleAdminDeletionException(ForbiddenException ex) {

		ErrorResponse error = new ErrorResponse();

		error.setMessage(ex.getMessage());
		error.setStatus(HttpStatus.FORBIDDEN.value());
		error.setTimestamp(LocalDateTime.now());

		return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
	}

	@ExceptionHandler(BadRequestException.class)
	public ResponseEntity<ErrorResponse> handleInvalidTaskAssignmentException(BadRequestException ex) {

		ErrorResponse error = new ErrorResponse();

		error.setMessage(ex.getMessage());
		error.setStatus(HttpStatus.BAD_REQUEST.value());
		error.setTimestamp(LocalDateTime.now());

		return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ErrorResponse> handleInvalidEnum(HttpMessageNotReadableException ex) {

		ErrorResponse error = new ErrorResponse();

		String message = ex.getMessage();

		if (message.contains("TaskPriority")) {

			error.setMessage("Invalid priority. Allowed values: HIGH, MEDIUM, LOW");

		} else if (message.contains("TaskStatus")) {

			error.setMessage("Invalid status. Allowed values: TODO, IN_PROGRESS, DONE");

		} else if (message.contains("Role")) {

			error.setMessage("Invalid role. Allowed values: ADMIN, EMPLOYEE");

		} else {

			error.setMessage("Invalid Enum in request body ");
		}

		error.setStatus(HttpStatus.BAD_REQUEST.value());
		error.setTimestamp(LocalDateTime.now());

		return ResponseEntity.badRequest().body(error);
		
	}

	
	@ExceptionHandler({
	    InvalidDataAccessApiUsageException.class,
	    IllegalArgumentException.class
	})
	public ResponseEntity<ErrorResponse> handleDatabaseEnumException(Exception ex) {

	    ErrorResponse error = new ErrorResponse();

	    if (ex.getMessage() != null &&
	        ex.getMessage().contains("No enum constant")) {

	        error.setMessage("Database contains an invalid enum value.");

	    } else {

	        error.setMessage("Unexpected database error.");

	    }

	    error.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
	    error.setTimestamp(LocalDateTime.now());

	    return ResponseEntity
	            .status(HttpStatus.INTERNAL_SERVER_ERROR)
	            .body(error);
	}
}
