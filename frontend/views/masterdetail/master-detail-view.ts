import {Binder, field} from '@hilla/form';
import {EndpointError} from '@hilla/frontend';
import '@vaadin/button';
import '@vaadin/date-picker';
import '@vaadin/date-time-picker';
import '@vaadin/form-layout';
import '@vaadin/grid';
import {Grid, GridDataProviderCallback, GridDataProviderParams} from '@vaadin/grid';
import {columnBodyRenderer} from '@vaadin/grid/lit';
import '@vaadin/grid/vaadin-grid-sort-column';
import '@vaadin/horizontal-layout';
import '@vaadin/icon';
import '@vaadin/icons';
import '@vaadin/notification';
import {Notification} from '@vaadin/notification';
import '@vaadin/polymer-legacy-adapter';
import '@vaadin/split-layout';
import '@vaadin/vertical-layout';
import '@vaadin/text-field';
import '@vaadin/upload';
import '@vaadin/vaadin-icons';
import SamplePerson from 'Frontend/generated/com/example/application/data/entity/SamplePerson';
import SamplePersonModel from 'Frontend/generated/com/example/application/data/entity/SamplePersonModel';
import Sort from 'Frontend/generated/dev/hilla/mappedtypes/Sort';
import Direction from 'Frontend/generated/org/springframework/data/domain/Sort/Direction';
import * as SamplePersonEndpoint from 'Frontend/generated/SamplePersonEndpoint';
import {html} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {View} from '../view';

@customElement('master-detail-view')
export class MasterDetailView extends View {
    @query('#grid')
    private grid!: Grid;

    @property({type: Number})
    private gridSize = 0;

    private filter = '';

    private gridDataProvider = this.getGridData.bind(this);

    private binder = new Binder<SamplePerson, SamplePersonModel>(this, SamplePersonModel);

    render() {
        return html`
            <vaadin-vertical-layout theme="padding">
                <vaadin-text-field label="Search" @value-changed=${this.search}></vaadin-text-field>
            </vaadin-vertical-layout>

            <vaadin-split-layout>
                <div class="grid-wrapper">
                    <vaadin-grid
                            id="grid"
                            theme="no-border"
                            .size=${this.gridSize}
                            .dataProvider=${this.gridDataProvider}
                            @active-item-changed=${this.itemSelected}
                    >
                        <vaadin-grid-sort-column path="firstName" auto-width></vaadin-grid-sort-column>
                        <vaadin-grid-sort-column path="lastName" auto-width></vaadin-grid-sort-column>
                        <vaadin-grid-sort-column path="email" auto-width></vaadin-grid-sort-column>
                        <vaadin-grid-sort-column path="phone" auto-width></vaadin-grid-sort-column>
                        <vaadin-grid-sort-column path="dateOfBirth" auto-width></vaadin-grid-sort-column>
                        <vaadin-grid-sort-column path="occupation" auto-width></vaadin-grid-sort-column>
                        <vaadin-grid-column
                                path="important"
                                auto-width
                                ${columnBodyRenderer<SamplePerson>((item) =>
                                        item.important
                                                ? html`
                                                    <vaadin-icon
                                                            icon="vaadin:check"
                                                            style="width: var(--lumo-icon-size-s); height: var(--lumo-icon-size-s); color: var(--lumo-primary-text-color);"
                                                    >
                                                    </vaadin-icon>`
                                                : html`
                                                    <vaadin-icon
                                                            icon="vaadin:minus"
                                                            style="width: var(--lumo-icon-size-s); height: var(--lumo-icon-size-s); color: var(--lumo-disabled-text-color);"
                                                    >
                                                    </vaadin-icon>`
                                )}
                        ></vaadin-grid-column>
                    </vaadin-grid>
                </div>
                <div class="editor-layout">
                    <div class="editor">
                        <vaadin-form-layout
                        >
                            <vaadin-text-field
                                    label="First name"
                                    id="firstName"
                                    ${field(this.binder.model.firstName)}
                            ></vaadin-text-field
                            >
                            <vaadin-text-field
                                    label="Last name"
                                    id="lastName"
                                    ${field(this.binder.model.lastName)}
                            ></vaadin-text-field
                            >
                            <vaadin-text-field label="Email" id="email" ${field(this.binder.model.email)}></vaadin-text-field
                            >
                            <vaadin-text-field label="Phone" id="phone" ${field(this.binder.model.phone)}></vaadin-text-field
                            >
                            <vaadin-date-picker
                                    label="Date of birth"
                                    id="dateOfBirth"
                                    ${field(this.binder.model.dateOfBirth)}
                            ></vaadin-date-picker
                            >
                            <vaadin-text-field
                                    label="Occupation"
                                    id="occupation"
                                    ${field(this.binder.model.occupation)}
                            ></vaadin-text-field
                            >
                            <vaadin-checkbox id="important" ${field(this.binder.model.important)} label="Important"></vaadin-checkbox
                            >
                        </vaadin-form-layout>
                    </div>
                    <vaadin-horizontal-layout class="button-layout">
                        <vaadin-button theme="primary" @click=${this.save}>Save</vaadin-button>
                        <vaadin-button theme="tertiary" @click=${this.cancel}>Cancel</vaadin-button>
                    </vaadin-horizontal-layout>
                </div>
            </vaadin-split-layout>
        `;
    }

    private async getGridData(
        params: GridDataProviderParams<SamplePerson>,
        callback: GridDataProviderCallback<SamplePerson | undefined>
    ) {
        const sort: Sort = {
            orders: params.sortOrders.map((order) => ({
                property: order.path,
                direction: order.direction == 'asc' ? Direction.ASC : Direction.DESC,
                ignoreCase: false,
            })),
        };
        const data = await SamplePersonEndpoint.list(this.filter, {pageNumber: params.page, pageSize: params.pageSize, sort});
        callback(data);
    }

    async connectedCallback() {
        super.connectedCallback();
        this.gridSize = (await SamplePersonEndpoint.count(this.filter)) ?? 0;
    }

    private async itemSelected(event: CustomEvent) {
        const item: SamplePerson = event.detail.value as SamplePerson;
        this.grid.selectedItems = item ? [item] : [];

        if (item) {
            const fromBackend = await SamplePersonEndpoint.get(item.id!);
            fromBackend ? this.binder.read(fromBackend) : this.refreshGrid();
        } else {
            this.clearForm();
        }
    }

    private async save() {
        try {
            const isNew = !this.binder.value.id;
            await this.binder.submitTo(SamplePersonEndpoint.update);
            if (isNew) {
                // We added a new item
                this.gridSize++;
            }
            this.clearForm();
            this.refreshGrid();
            Notification.show(`SamplePerson details stored.`, {position: 'bottom-start'});
        } catch (error: any) {
            if (error instanceof EndpointError) {
                Notification.show(`Server error. ${error.message}`, {theme: 'error', position: 'bottom-start'});
            } else {
                throw error;
            }
        }
    }

    private cancel() {
        this.grid.activeItem = undefined;
    }

    private clearForm() {
        this.binder.clear();
    }

    private refreshGrid() {
        this.grid.selectedItems = [];
        this.grid.clearCache();
    }

    async search(e: CustomEvent) {
        this.filter = e.detail.value;
        this.gridSize = (await SamplePersonEndpoint.count(this.filter)) ?? 0;
        this.refreshGrid();
    }
}
