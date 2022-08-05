package com.example.application.repository;

import com.example.application.entity.Person;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonRepository extends JpaRepository<Person, Integer> {

    Page<Person> findAllByFirstNameLikeIgnoreCaseOrLastNameLikeIgnoreCase(String firstname, String lastName, Pageable pageable);

    long countAllByFirstNameLikeIgnoreCaseOrLastNameLikeIgnoreCase(String firstname, String lastName);
}
