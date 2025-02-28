package edu.eci.arep.CRUD_API.Repository;

import edu.eci.arep.CRUD_API.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
}

