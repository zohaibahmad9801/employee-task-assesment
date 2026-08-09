package com.zohaib.taskmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;

@SpringBootApplication(exclude = { UserDetailsServiceAutoConfiguration.class })
public class EmployeeTaskAssesmentApplication {

	public static void main(String[] args) {
		SpringApplication.run(EmployeeTaskAssesmentApplication.class, args);
	}

}
