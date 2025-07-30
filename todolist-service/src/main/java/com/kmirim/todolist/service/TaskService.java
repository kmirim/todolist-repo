package com.kmirim.todolist.service;

import com.kmirim.todolist.model.Task;
import com.kmirim.todolist.repository.TaskRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class TaskService {
    private final TaskRepository repository;

    public List<Task> findAll() {
        return repository.findAll();
    }

    public Optional<Task> findById(Long id) {
        return repository.findById(id);
    }

    public Task save(Task task) {
        task.setCreateAt(java.time.LocalDateTime.now());
        return repository.save(task);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Task update(Long id, Task taskAtualizada) {
        Task task = repository.findById(id).orElseThrow();
        task.setTitle(taskAtualizada.getTitle());
        task.setDescription(taskAtualizada.getDescription());
        task.setDeadLine(taskAtualizada.getDeadLine());
        task.setStatus(taskAtualizada.getStatus());
        return repository.save(task);
    }
}