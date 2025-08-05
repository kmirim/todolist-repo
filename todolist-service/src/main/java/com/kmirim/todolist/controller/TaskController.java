package com.kmirim.todolist.controller;

import com.kmirim.todolist.exception.TaskNotFoundException;
import com.kmirim.todolist.model.Task;
import com.kmirim.todolist.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/task")
//@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {
    private final TaskService service;

    public TaskController(TaskService service){
        this.service = service;
    }
    @GetMapping
    public List<Task> all(){
        return service.findAll();
    }
    @PostMapping
    public Task create(@RequestBody Task task){
        return service.save(task);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id){
        try{
            service.delete(id);
            return ResponseEntity.noContent().build();
        } catch (TaskNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/{id}")
    public Task update(@PathVariable Long id, @RequestBody Task task){
       return service.update(id, task);
    }
    @GetMapping("/{id}")
    public Task getById(@PathVariable Long id){
        return service.findById(id).orElseThrow();
    }
}
