import {makeAutoObservable, observable} from 'mobx';
import Person from 'Frontend/generated/ch/martinelli/demo/hilla/entity/Person';

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
