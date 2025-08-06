package com.kmirim.todolist.model;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Status {
    PENDENTE("pendente"),
    EM_ANDAMENTO("em-andamento"),
    CONCLUIDA("concluida");

    private final String value;

    Status (String value){
        this.value = value;
    }

    @JsonValue
    public String getValue(){
        return value;
    }
    @JsonCreator
    public static Status fromString(String value){
        for(Status status : Status.values()){
            if(status.value.equals(value)){
                return status;
            }
        }
        throw new IllegalArgumentException("Status inválido: " + value);
    }
}
