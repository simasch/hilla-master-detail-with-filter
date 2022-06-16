import {makeAutoObservable, observable} from 'mobx';
import SamplePerson from 'Frontend/generated/com/example/application/data/entity/SamplePerson';

class PersonStore {

    selectedPerson: SamplePerson | null = null;

    constructor() {
        makeAutoObservable(
            this,
            {selectedPerson: observable.ref},
            {autoBind: true}
        );
    }

    setSelectedPerson(samplePerson: SamplePerson) {
        this.selectedPerson = samplePerson;
    }
}

export const personStore = new PersonStore();
