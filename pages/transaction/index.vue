<template>
    <div>
        <b-card>
            <b-form-group>
                <b-input-group>
                    <b-col md="6">
                        <b-form-input type="text" v-model="search" placeholder="search"></b-form-input>
                    </b-col>
                    <b-col md="3" offset-md="1" class="datepicker-trigger">
                        <b-form-input
                                type="text"
                                id="datepicker-trigger"
                                placeholder="Select dates"
                                :value="formatDates(dateOne, dateTwo)"
                        ></b-form-input>
                        <AirbnbStyleDatepicker
                                :trigger-element-id="'datepicker-trigger'"
                                :mode="'range'"
                                :fullscreen-mobile="true"
                                :date-one="dateOne"
                                :date-two="dateTwo"
                                @date-one-selected="val => { dateOne = val }"
                                @date-two-selected="val => { dateTwo = val }"
                        />
                    </b-col>
                    <b-col>
                        <b-button @click="filterByDate" variant="primary">Filter</b-button>
                    </b-col>
                </b-input-group>
            </b-form-group>
        </b-card>
        <b-card :header="caption">
            <b-table :hover="hover"
                     :striped="striped"
                     :bordered="bordered"
                     :small="small"
                     :fixed="fixed"
                     responsive="sm"
                     :items="transaction"
                     :fields="fields"
                     :current-page="currentPage"
                     :per-page="perPage"
                     @row-clicked="showTransaction"
            >
                <template slot="total" slot-scope="data">
                    {{data.item.total | currency}}
                </template>
                <template slot="created_at" slot-scope="data">
                    {{data.item.created_at | moment('MM/DD/YYYY')}}
                </template>
                <template slot="status" slot-scope="data">
                    <b-button variant="success"><i class="fa fa-magic"></i>&nbsp;Edit</b-button>
                </template>
            </b-table>
            <nav>
                <b-pagination :total-rows="getRowCount(transaction)" :per-page="perPage" v-model="currentPage"
                              prev-text="Prev" next-text="Next" hide-goto-end-buttons/>
            </nav>
        </b-card>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import format from 'date-fns/format'

    /**
     * Randomize array element order in-place.
     * Using Durstenfeld shuffle algorithm.
     */
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1))
            let temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }
        return array
    }

    export default {
        name: 'c-table',
        layout: 'default',
        props: {
            caption: {
                type: String,
                default: 'Transactions'
            },
            hover: {
                type: Boolean,
                default: false
            },
            striped: {
                type: Boolean,
                default: true
            },
            bordered: {
                type: Boolean,
                default: false
            },
            small: {
                type: Boolean,
                default: false
            },
            fixed: {
                type: Boolean,
                default: false
            }
        },
        mounted() {
            let vm = this;
            let data = {
                outlet_uuid: vm.outlet.outlet_uuid,
                filter: false
            };
            vm.$store.dispatch('transaction/fetch', data);
        },
        computed: {
            ...mapGetters('transaction', {
                transaction: 'get'
            }),
            ...mapGetters('outlet', {
                outlet: 'getOutlet',
            }),
        },
        data: () => {
            return {
                primaryModal: false,
                fields: [
                    {key: 'trans_uuid'},
                    {key: 'sales_person.name'},
                    {key: 'quantity', sortable: true},
                    {key: 'total', sortable: true},
                    {key: 'created_at', sortable: true},
                    {key: 'status'}
                ],
                currentPage: 1,
                perPage: 5,
                totalRows: 0,
                form: {
                    biz_uuid: '',
                    outlet_uuid: '',
                    name: '',
                    description: '',
                    price: 0.00,
                    quantity: 0,
                    cate_uuid: ''
                },
                search: '',
                dateFormat: 'MM/DD/YYYY',
                serverFormat: 'YYYY-MM-DD',
                dateOne: '',
                dateTwo: '',
                startDate: '',
                endDate: ''
            }
        },
        methods: {
            getRowCount(items) {
                return items.length
            },
            showTransaction(item, index) {
                this.$router.push({path: '/transaction/' + item.trans_uuid});
            },
            formatDates(dateOne, dateTwo) {
                let formattedDates = '';
                if (dateOne) {
                    formattedDates = format(dateOne, this.dateFormat);
                    this.startDate = format(dateOne, this.serverFormat);
                }
                if (dateTwo) {
                    formattedDates += ' - ' + format(dateTwo, this.dateFormat);
                    this.endDate = format(dateTwo, this.serverFormat);
                }
                return formattedDates
            },
            filterByDate() {
                let data = {
                    outlet_uuid: this.outlet.outlet_uuid,
                    filter: true,
                    startDate: this.startDate ? this.startDate : false,
                    endDate: this.endDate ? this.endDate : false,
                };

                console.log(data);
                this.$store.dispatch('transaction/fetch', data)
            }
        },
        watch: {
            search() {
                if (this.search.length > 0) {
                    let data = {
                        outlet_uuid: this.outlet.outlet_uuid,
                        search: this.search,
                        filter: true,
                        startDate: this.startDate ? this.startDate : false,
                        endDate: this.endDate ? this.endDate : false,
                    };
                    this.$store.dispatch('transaction/fetch', data)
                } else {
                    let data = {
                        outlet_uuid: this.outlet.outlet_uuid,
                        filter: false,
                        startDate: this.startDate ? this.startDate : false,
                        endDate: this.endDate ? this.endDate : false,
                    };
                    this.$store.dispatch('transaction/fetch', data)
                }
            }
        }
    }
</script>
