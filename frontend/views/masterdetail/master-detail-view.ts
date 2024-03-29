import { Grid, GridDataProviderCallback, GridDataProviderParams } from '@vaadin/grid';
import { columnBodyRenderer } from '@vaadin/grid/lit';
import Sort from 'Frontend/generated/dev/hilla/mappedtypes/Sort';
import Direction from 'Frontend/generated/org/springframework/data/domain/Sort/Direction';
import * as PersonEndpoint from 'Frontend/generated/PersonEndpoint';
import { html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { View } from '../view';
import { personStore } from 'Frontend/views/masterdetail/person-store';
import "@vaadin/vertical-layout";
import "@vaadin/split-layout";
import "@vaadin/grid";
import "@vaadin/grid/vaadin-grid-sort-column";
import "@vaadin/icon";
import "./person-form";
import Person from 'Frontend/generated/ch/martinelli/demo/hilla/entity/Person';

@customElement('master-detail-view')
export class MasterDetailView extends View {

    @query('#grid')
    private grid!: Grid;

    @state()
    private gridSize = 0;

    private filter = '';

    private gridDataProvider = this.getGridData.bind(this);

    render() {
        return html`
            <vaadin-vertical-layout theme="padding">
                <vaadin-text-field label="Search" @value-changed=${this.search}></vaadin-text-field>
            </vaadin-vertical-layout>

            <vaadin-split-layout>
                <div class="grid-wrapper" style="width: 60%">
                    <vaadin-grid
                            id="grid"
                            theme="no-border"
                            .size=${this.gridSize}
                            .dataProvider=${this.gridDataProvider}
                            @active-item-changed=${this.itemSelected}
                            .selectedItems=${[personStore.selectedPerson]}
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
                                ${columnBodyRenderer<Person>((item) =>
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
                        <vaadin-grid-column>
                            <button @click=this._openTab></button>
                        </vaadin-grid-column>
                    </vaadin-grid>
                </div>
                <person-form
                        style="width: 25%"
                        @contact-form-saved=${this.contactFormSave}
                ></person-form>
            </vaadin-split-layout>
        `;
    }

    async connectedCallback() {
        super.connectedCallback();
        this.gridSize = (await PersonEndpoint.count(this.filter)) ?? 0;
    }

    private async getGridData(
        params: GridDataProviderParams<Person>,
        callback: GridDataProviderCallback<Person | undefined>
    ) {
        const sort: Sort = {
            orders: params.sortOrders.map((order) => ({
                property: order.path,
                direction: order.direction == 'asc' ? Direction.ASC : Direction.DESC,
                ignoreCase: false,
            })),
        };
        const data = await PersonEndpoint.list(this.filter, {pageNumber: params.page, pageSize: params.pageSize, sort});
        callback(data);
    }

    private async itemSelected(event: CustomEvent) {
        personStore.selectedPerson = event.detail.value as Person;
    }

    private refreshGrid() {
        this.grid.selectedItems = [];
        this.grid.clearCache();
    }

    private async search(e: CustomEvent) {
        this.filter = e.detail.value;
        this.gridSize = (await PersonEndpoint.count(this.filter)) ?? 0;
        this.refreshGrid();
    }

    private contactFormSave() {
        this.refreshGrid();
    }
}
