package edu.eci.arep.CRUD_API.Repository;

import edu.eci.arep.CRUD_API.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {


    @Query("SELECT p FROM Property p WHERE " +
            "(:address IS NULL OR LOWER(p.address) LIKE LOWER(CONCAT('%', :address, '%'))) AND " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
            "(:minSize IS NULL OR p.size >= :minSize)")
    List<Property> findByFilters(
            @Param("address") String address,
            @Param("minPrice") Long minPrice,
            @Param("maxPrice") Long maxPrice,
            @Param("minSize") Integer minSize
    );

}

