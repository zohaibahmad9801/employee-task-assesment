package com.zohaib.taskmanager.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

@Service
public class EmployeeService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private TaskRepository taskRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	private EmployeeResponse mapToEmployeeResponse(User user) {
		EmployeeResponse response = new EmployeeResponse();
		response.setId(user.getId());
		response.setName(user.getName());
		response.setEmail(user.getEmail());
		response.setRole(user.getRole() != null ? user.getRole().name() : null);
		return response;
	}

	public EmployeeResponse createEmployee(EmployeeRequest employeeRequest) {
		Optional<User> employeeExist = userRepository.findByEmail(employeeRequest.getEmail());

		if (employeeExist.isPresent())
			throw new ConflictException("Employee Already Exist");

		User user = new User();
		user.setEmail(employeeRequest.getEmail());
		user.setName(employeeRequest.getName());
		user.setPassword(passwordEncoder.encode(employeeRequest.getPassword()));
		user.setRole(Role.EMPLOYEE);
		user.setCreatedAt(LocalDateTime.now().withNano(0));

		User savedEmployee = userRepository.save(user);

		return mapToEmployeeResponse(savedEmployee);
	}

	public List<EmployeeResponse> getAllEmployees() {
		List<User> allEmployees = userRepository.findByRole(Role.EMPLOYEE);
		return allEmployees.stream().map(this::mapToEmployeeResponse).toList();
	}

	public EmployeeResponse getEmployeeById(Long id) {
		User employee = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User Not Found"));

		return mapToEmployeeResponse(employee);
	}

	public EmployeeResponse updateEmployee(Long id, UpdateEmployeeRequest updateEmployeeRequest) {
		User employee = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User Not Found"));

		Optional<User> existingUser = userRepository.findByEmail(updateEmployeeRequest.getEmail());

		if (existingUser.isPresent() && !existingUser.get().getId().equals(id)) {
			throw new ConflictException("Email already exists");
		}

		employee.setName(updateEmployeeRequest.getName());
		employee.setEmail(updateEmployeeRequest.getEmail());
		employee.setUpdatedAt(LocalDateTime.now().withNano(0));

		User updatedEmployee = userRepository.save(employee);

		return mapToEmployeeResponse(updatedEmployee);
	}

	public void deleteEmployee(Long id) {
		User employee = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User Not Found"));

		if (employee.getRole() == Role.ADMIN) {
			throw new ForbiddenException("Admin cannot be deleted");
		}

		if (taskRepository.existsByAssignedUserId(id)) {
			throw new ConflictException("Employee cannot be deleted because tasks are assigned to this employee.");
		}

		userRepository.delete(employee);
	}
}
