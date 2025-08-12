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
    @GetMapping("/{id}")
    public Task getById(@PathVariable Long id){
        return service.findById(id).orElseThrow();
    }
    @GetMapping
    public List<Task>all(
        @RequestParam(name = "status", required = false) String status,
        @RequestParam(name = "title", required = false) String title,
        @RequestParam(name = "description", required = false) String description,
        @RequestParam(name = "deadline_filter", required = false) String deadLineFilter,
        @RequestParam(name = "date_from", required = false) String dateFrom, 
        @RequestParam(name = "date_to", required = false) String dateTo
    ) {
        return service.findAllWithFilters(status);
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
    public ResponseEntity<Task> update(@PathVariable ("id")Long id, @RequestBody Task task){
        try{
            Task updatedTask = service.update(id, task);
            return ResponseEntity.ok(updatedTask);
        } catch (TaskNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }
}
