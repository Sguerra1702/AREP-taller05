package edu.eci.arep.CRUD_API.service;

import edu.eci.arep.CRUD_API.model.Property;
import edu.eci.arep.CRUD_API.Repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.Optional;
import java.util.stream.IntStream;

@Service
public class PropertyService {
    private static final List<String> STREETS = Arrays.asList("Calle", "Carrera", "Avenida", "Diagonal", "Transversal");
    private static final List<String> TYPES = Arrays.asList("Casa", "Apartamento", "Finca", "Bodega", "Oficina", "Apartaestudio");
    private static final Random random = new Random();


    @Autowired
    private PropertyRepository repository;

    public List<Property> getAllProperties() {
        return repository.findAll();
    }

    public Optional<Property> getPropertyById(Long id) {
        return repository.findById(id);
    }

    public List<Property> searchProperties(String address, Long minPrice, Long maxPrice, Integer minSize) {
        return repository.findByFilters(
                (address != null && !address.isEmpty()) ? address : null,
                (minPrice != null && minPrice > 0) ? minPrice : null,
                (maxPrice != null && maxPrice > 0) ? maxPrice : null,
                (minSize != null && minSize > 0) ? minSize : null
        );
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

    public void generateSampleProperties() {
        IntStream.range(0, 100).forEach(i -> {
            String address = generateRandomAddress();
            int price = random.nextInt(901) + 100; // Precio entre 100 y 1000 millones
            int size = random.nextInt(176) + 25;  // Área entre 25 y 200 m²
            String description = TYPES.get(random.nextInt(TYPES.size())) + " en excelente ubicación.";

            Property property = new Property(address, price * 1_000_000L, size, description);
            repository.save(property);
        });
    }

    private String generateRandomAddress() {
        String streetType = STREETS.get(random.nextInt(STREETS.size()));
        int mainNumber = random.nextInt(200) + 1;
        int secondaryNumber = random.nextInt(100) + 1;
        int tertiaryNumber = random.nextInt(100);
        return String.format("%s %d # %d - %d", streetType, mainNumber, secondaryNumber, tertiaryNumber);
    }

    public void deleteAllProperties() {
        repository.deleteAll();
    }
}
