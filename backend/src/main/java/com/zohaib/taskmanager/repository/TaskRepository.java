package com.zohaib.taskmanager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zohaib.taskmanager.entity.Task;
import com.zohaib.taskmanager.entity.User;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByAssignedUser(User user);

	boolean existsByAssignedUserId(Long id);

}