package edu.eci.arep.CRUD_API.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String address;
    private Double price;
    private Double size;
    private String description;

    public Property() {
    }
    public Property(String address, long l, int size, String description) {
        this.address = address;
        this.price = (double) l;
        this.size = (double) size;
        this.description = description;
    }
}

