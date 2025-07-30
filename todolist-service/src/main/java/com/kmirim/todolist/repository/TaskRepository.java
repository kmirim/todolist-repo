package com.kmirim.todolist.repository;

import com.kmirim.todolist.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // componente do tipo repositorio, especificidade do springboot
public interface TaskRepository extends JpaRepository<Task, Long> {

}
