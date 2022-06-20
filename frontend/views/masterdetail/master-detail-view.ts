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
import '@vaadin/polymer-legacy-adapter';
import '@vaadin/split-layout';
import '@vaadin/vertical-layout';
import '@vaadin/text-field';
import '@vaadin/upload';
import '@vaadin/vaadin-icons';
import './person-form';
import SamplePerson from 'Frontend/generated/com/example/application/data/entity/SamplePerson';
import Sort from 'Frontend/generated/dev/hilla/mappedtypes/Sort';
import Direction from 'Frontend/generated/org/springframework/data/domain/Sort/Direction';
import * as SamplePersonEndpoint from 'Frontend/generated/SamplePersonEndpoint';
import {html} from 'lit';
import {customElement, query, state} from 'lit/decorators.js';
import {View} from '../view';
import {personStore} from 'Frontend/views/masterdetail/person-store';

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
                <div class="grid-wrapper" style="width: 75%">
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
                <person-form
                        style="width: 25%"
                        @contact-form-saved=${this.contactFormSave}
                ></person-form>
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
        personStore.selectedPerson = event.detail.value as SamplePerson;
    }

    private refreshGrid() {
        this.grid.selectedItems = [];
        this.grid.clearCache();
    }

    private async search(e: CustomEvent) {
        this.filter = e.detail.value;
        this.gridSize = (await SamplePersonEndpoint.count(this.filter)) ?? 0;
        this.refreshGrid();
    }

    private contactFormSave(e: CustomEvent) {
        this.refreshGrid();
    }
}
