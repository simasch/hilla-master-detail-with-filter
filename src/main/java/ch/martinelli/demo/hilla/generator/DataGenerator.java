package ch.martinelli.demo.hilla.generator;

import ch.martinelli.demo.hilla.entity.Person;
import ch.martinelli.demo.hilla.repository.PersonRepository;
import com.vaadin.exampledata.DataType;
import com.vaadin.exampledata.ExampleDataGenerator;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

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

        ExampleDataGenerator<Person> dataGenerator = new ExampleDataGenerator<>(
                Person.class, LocalDateTime.of(2022, 6, 14, 0, 0, 0));
        dataGenerator.setData(Person::setFirstName, DataType.FIRST_NAME);
        dataGenerator.setData(Person::setLastName, DataType.LAST_NAME);
        dataGenerator.setData(Person::setEmail, DataType.EMAIL);
        dataGenerator.setData(Person::setPhone, DataType.PHONE_NUMBER);
        dataGenerator.setData(Person::setDateOfBirth, DataType.DATE_OF_BIRTH);
        dataGenerator.setData(Person::setOccupation, DataType.OCCUPATION);
        dataGenerator.setData(Person::setImportant, DataType.BOOLEAN_10_90);
        personRepository.saveAll(dataGenerator.create(100, seed));
    }
}
