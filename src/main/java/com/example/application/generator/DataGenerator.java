package com.example.application.generator;

import com.example.application.entity.Person;
import com.example.application.repository.PersonRepository;
import com.vaadin.exampledata.DataType;
import com.vaadin.exampledata.ExampleDataGenerator;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataGenerator implements ApplicationRunner {

    private final PersonRepository personRepository;

    public DataGenerator(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        if (personRepository.count() != 0L) {
            return;
        }
        int seed = 123;

        ExampleDataGenerator<Person> samplePersonRepositoryGenerator = new ExampleDataGenerator<>(
                Person.class, LocalDateTime.of(2022, 6, 14, 0, 0, 0));
        samplePersonRepositoryGenerator.setData(Person::setFirstName, DataType.FIRST_NAME);
        samplePersonRepositoryGenerator.setData(Person::setLastName, DataType.LAST_NAME);
        samplePersonRepositoryGenerator.setData(Person::setEmail, DataType.EMAIL);
        samplePersonRepositoryGenerator.setData(Person::setPhone, DataType.PHONE_NUMBER);
        samplePersonRepositoryGenerator.setData(Person::setDateOfBirth, DataType.DATE_OF_BIRTH);
        samplePersonRepositoryGenerator.setData(Person::setOccupation, DataType.OCCUPATION);
        samplePersonRepositoryGenerator.setData(Person::setImportant, DataType.BOOLEAN_10_90);
        personRepository.saveAll(samplePersonRepositoryGenerator.create(100, seed));
    }
}
