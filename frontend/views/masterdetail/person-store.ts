import {makeAutoObservable, observable} from 'mobx';
import Person from 'Frontend/generated/com/example/application/entity/Person';

class PersonStore {

    selectedPerson: Person | null = null;

    constructor() {
        makeAutoObservable(
            this,
            {selectedPerson: observable.ref},
            {autoBind: true}
        );
    }
}

export const personStore = new PersonStore();
