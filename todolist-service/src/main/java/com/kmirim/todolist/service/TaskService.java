package com.kmirim.todolist.service;

import com.kmirim.todolist.model.Task;
import com.kmirim.todolist.repository.TaskRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.kmirim.todolist.exception.TaskNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

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
        task.setCreatedAt(java.time.LocalDateTime.now());
        return repository.save(task);
    }
    public void delete(@PathVariable Long id) {
        if (!repository.existsById(id))
            throw new TaskNotFoundException(id);
        repository.deleteById(id);
    }

    public Task update(Long id, Task taskAtualizada) {
        Task task = repository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
        if (taskAtualizada.getTitle() != null) {
            task.setTitle(taskAtualizada.getTitle());
        }
        if (taskAtualizada.getDescription() != null) {
            task.setDescription(taskAtualizada.getDescription());
        }
        if (taskAtualizada.getDeadLine() != null) {
            task.setDeadLine(taskAtualizada.getDeadLine());
        }
        if (taskAtualizada.getStatus() != null) {
            task.setStatus(taskAtualizada.getStatus());
        }
        return repository.save(task);
    }
}