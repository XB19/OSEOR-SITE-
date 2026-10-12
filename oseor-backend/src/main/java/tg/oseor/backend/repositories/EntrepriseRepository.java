package tg.oseor.backend.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tg.oseor.backend.entities.Entreprise;

import java.util.List;

public interface EntrepriseRepository extends JpaRepository<Entreprise, Long> {

    List<Entreprise> findAllByOrderByNameAsc();

    List<Entreprise> findBySecteurOrderByNameAsc(String secteur);

    @Query("SELECT e FROM Entreprise e WHERE " +
           "(:search IS NULL OR :search = '' OR LOWER(e.name) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:secteur IS NULL OR :secteur = '' OR e.secteur = :secteur) " +
           "ORDER BY e.name ASC")
    List<Entreprise> findFiltered(
            @Param("search") String search,
            @Param("secteur") String secteur);

    @Query("SELECT e FROM Entreprise e WHERE " +
           "(:search IS NULL OR :search = '' OR LOWER(e.name) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:secteur IS NULL OR :secteur = '' OR e.secteur = :secteur)")
    Page<Entreprise> findFilteredPaginated(
            @Param("search") String search,
            @Param("secteur") String secteur,
            Pageable pageable);

    boolean existsByName(String name);
}
