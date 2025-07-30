package com.kmirim.todolist.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum Status {
    @JsonProperty("pendente")
    PENDENTE,
    @JsonProperty("em-andamento")
    EM_ANDAMENTO,
    @JsonProperty("concluida")
    CONCLUIDA;
}
