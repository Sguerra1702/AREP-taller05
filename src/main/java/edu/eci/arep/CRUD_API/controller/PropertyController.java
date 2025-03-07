package edu.eci.arep.CRUD_API.controller;

import edu.eci.arep.CRUD_API.model.Property;
import edu.eci.arep.CRUD_API.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/properties")
@CrossOrigin(origins = "*")  // Permite accesos desde cualquier origen
public class PropertyController {

    @Autowired
    private PropertyService service;

    @GetMapping
    public List<Property> getAllProperties() {
        return service.getAllProperties();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Property> getPropertyById(@PathVariable Long id) {
        Optional<Property> property = service.getPropertyById(id);
        return property.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public Property createProperty(@RequestBody Property property) {
        return service.createProperty(property);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Property> updateProperty(@PathVariable Long id, @RequestBody Property newProperty) {
        try {
            return ResponseEntity.ok(service.updateProperty(id, newProperty));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        service.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/busqueda")
    public List<Property> searchProperties(
            @RequestParam(required = false) String address,
            @RequestParam(required = false) Long minPrice,
            @RequestParam(required = false) Long maxPrice,
            @RequestParam(required = false) Integer minSize) {
        return service.searchProperties(address, minPrice, maxPrice, minSize);
    }


    @PostMapping("/generate")
    public ResponseEntity<String> generateProperties() {
        service.generateSampleProperties();
        return ResponseEntity.ok("100 propiedades generadas exitosamente.");
    }

    @DeleteMapping("/deleteAll")
    public ResponseEntity<String> deleteAllProperties() {
        service.deleteAllProperties();
        return ResponseEntity.ok("Todas las propiedades han sido eliminadas.");
    }
}
