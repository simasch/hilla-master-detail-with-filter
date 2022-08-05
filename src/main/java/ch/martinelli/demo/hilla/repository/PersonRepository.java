package ch.martinelli.demo.hilla.repository;

import ch.martinelli.demo.hilla.entity.Person;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonRepository extends JpaRepository<Person, Integer> {

    Page<Person> findAllByFirstNameLikeIgnoreCaseOrLastNameLikeIgnoreCase(String firstname, String lastName, Pageable pageable);

    long countAllByFirstNameLikeIgnoreCaseOrLastNameLikeIgnoreCase(String firstname, String lastName);
}
