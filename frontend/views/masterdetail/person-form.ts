import {html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {View} from 'Frontend/views/view';
import {Binder, field} from '@hilla/form';
import {Notification} from '@vaadin/notification';
import {EndpointError} from '@hilla/frontend';
import {personStore} from 'Frontend/views/masterdetail/person-store';
import '@vaadin/button';
import '@vaadin/checkbox';
import '@vaadin/text-field';
import "@vaadin/form-layout";
import "@vaadin/date-picker";
import "@vaadin/horizontal-layout";
import PersonModel from 'Frontend/generated/com/example/application/entity/PersonModel';
import Person from 'Frontend/generated/com/example/application/entity/Person';
import {PersonEndpoint} from 'Frontend/generated/endpoints';

@customElement('person-form')
export class PersonForm extends View {

    private binder = new Binder<Person, PersonModel>(this, PersonModel);

    constructor() {
        super();

        this.autorun(() => {
            if (personStore.selectedPerson) {
                this.binder.read(personStore.selectedPerson);
            } else {
                this.binder.clear();
            }
        });
    }

    render() {
        return html`
            <div class="editor-layout">
                <div class="editor">
                    <vaadin-form-layout>
                        <vaadin-text-field
                                label="First name"
                                id="firstName"
                                ${field(this.binder.model.firstName)}
                        ></vaadin-text-field>
                        <vaadin-text-field
                                label="Last name"
                                id="lastName"
                                ${field(this.binder.model.lastName)}
                        ></vaadin-text-field>
                        <vaadin-text-field
                                label="Email"
                                id="email"
                                ${field(this.binder.model.email)}
                        ></vaadin-text-field>
                        <vaadin-text-field
                                label="Phone"
                                id="phone"
                                ${field(this.binder.model.phone)}
                        ></vaadin-text-field>
                        <vaadin-date-picker
                                label="Date of birth"
                                id="dateOfBirth"
                                ${field(this.binder.model.dateOfBirth)}
                        ></vaadin-date-picker>
                        <vaadin-text-field
                                label="Occupation"
                                id="occupation"
                                ${field(this.binder.model.occupation)}
                        ></vaadin-text-field>
                        <vaadin-checkbox
                                id="important"
                                ${field(this.binder.model.important)}
                                label="Important"
                        ></vaadin-checkbox>
                    </vaadin-form-layout>
                </div>
                <vaadin-horizontal-layout class="button-layout">
                    <vaadin-button theme="primary" @click=${this.save}>Save</vaadin-button>
                    <vaadin-button theme="tertiary" @click=${this.cancel}>Cancel</vaadin-button>
                </vaadin-horizontal-layout>
            </div>
        `;
    }

    private async save() {
        try {
            await this.binder.submitTo(PersonEndpoint.update);
            this.binder.clear();

            personStore.selectedPerson = null;

            this.dispatchEvent(new CustomEvent('contact-form-saved'));

            Notification.show(`Person details stored.`, {position: 'bottom-start'});

        } catch (error: any) {
            if (error instanceof EndpointError) {
                Notification.show(`Server error. ${error.message}`, {theme: 'error', position: 'bottom-start'});
            } else {
                throw error;
            }
        }
    }

    private cancel() {
        personStore.selectedPerson = null;
    }

}
