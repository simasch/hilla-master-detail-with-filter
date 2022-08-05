package com.example.application.endpoints;

import com.example.application.entity.Person;
import com.example.application.repository.PersonRepository;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import dev.hilla.Nonnull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

@Endpoint
@AnonymousAllowed
public class PersonEndpoint {

    private final PersonRepository repository;

    public PersonEndpoint(PersonRepository repository) {
        this.repository = repository;
    }

    @Nonnull
    public Page<@Nonnull Person> list(String filter, Pageable pageable) {
        if (filter == null || filter.equals("")) {
            return repository.findAll(pageable);
        } else {
            return repository.findAllByFirstNameLikeIgnoreCaseOrLastNameLikeIgnoreCase(filter + "%", filter + "%", pageable);
        }
    }

    public Optional<Person> get(@Nonnull Integer id) {
        return repository.findById(id);
    }

    @Nonnull
    public Person update(@Nonnull Person entity) {
        return repository.save(entity);
    }

    public void delete(@Nonnull Integer id) {
        repository.deleteById(id);
    }

    public long count(String filter) {
        if (filter == null || filter.equals("")) {
            return repository.count();
        } else {
            return repository.countAllByFirstNameLikeIgnoreCaseOrLastNameLikeIgnoreCase(filter + "%", filter + "%");
        }
    }

}
