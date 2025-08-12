package com.kmirim.todolist.repository;

import com.kmirim.todolist.model.Status;
import com.kmirim.todolist.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository // componente do tipo repositorio, especificidade do springboot
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {

    @Query("SELECT t FROM Task t WHERE :status IS NULL OR t.status = :status")
    List<Task> findAllWithFilters(@Param("status") Status status);
}
