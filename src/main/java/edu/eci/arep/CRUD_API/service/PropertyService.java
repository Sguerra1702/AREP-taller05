package edu.eci.arep.CRUD_API.service;

import edu.eci.arep.CRUD_API.model.Property;
import edu.eci.arep.CRUD_API.Repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository repository;

    public List<Property> getAllProperties() {
        return repository.findAll();
    }

    public Optional<Property> getPropertyById(Long id) {
        return repository.findById(id);
    }

    public Property createProperty(Property property) {
        return repository.save(property);
    }

    public Property updateProperty(Long id, Property newProperty) {
        return repository.findById(id).map(property -> {
            property.setAddress(newProperty.getAddress());
            property.setPrice(newProperty.getPrice());
            property.setSize(newProperty.getSize());
            property.setDescription(newProperty.getDescription());
            return repository.save(property);
        }).orElseThrow(() -> new RuntimeException("Property not found"));
    }

    public void deleteProperty(Long id) {
        repository.deleteById(id);
    }
}
