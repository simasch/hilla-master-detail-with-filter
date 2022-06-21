package com.example.application.data.repository;

import com.example.application.data.entity.SamplePerson;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SamplePersonRepository extends JpaRepository<SamplePerson, UUID> {

    Page<SamplePerson> findAllByFirstNameLikeIgnoreCaseOrLastNameLikeIgnoreCase(String firstname, String lastName, Pageable pageable);

    long countAllByFirstNameLikeIgnoreCaseOrLastNameLikeIgnoreCase(String firstname, String lastName);
}
