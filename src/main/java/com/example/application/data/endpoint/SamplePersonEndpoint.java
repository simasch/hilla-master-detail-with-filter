package com.example.application.data.endpoint;

import com.example.application.data.entity.SamplePerson;
import com.example.application.data.repository.SamplePersonRepository;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import dev.hilla.Nonnull;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Endpoint
@AnonymousAllowed
public class SamplePersonEndpoint {

    private final SamplePersonRepository repository;

    @Autowired
    public SamplePersonEndpoint(SamplePersonRepository repository) {
        this.repository = repository;
    }

    @Nonnull
    public Page<@Nonnull SamplePerson> list(String filter, Pageable pageable) {
        if (filter == null || filter.equals("")) {
            return repository.findAll(pageable);
        } else {
            return repository.findAllByFirstNameLikeIgnoreCaseOrLastNameLikeIgnoreCase(filter + "%", filter + "%", pageable);
        }
    }

    public Optional<SamplePerson> get(@Nonnull UUID id) {
        return repository.findById(id);
    }

    @Nonnull
    public SamplePerson update(@Nonnull SamplePerson entity) {
        return repository.save(entity);
    }

    public void delete(@Nonnull UUID id) {
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
