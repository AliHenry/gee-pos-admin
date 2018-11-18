<template>
    <b-container class="bv-example-row">
        <b-card :header="caption" class="justify-content-center">
            <b-row>
                <b-col md="8">
                    <b-row>
                        <b-col md="4">
                            <h4>Transaction ID:</h4>
                        </b-col>
                        <b-col md="6">
                            {{getTransaction.trans_uuid}}
                        </b-col>
                    </b-row>
                    <hr/>
                    <b-row>
                        <b-col md="4">
                            <h4>Sales person</h4>
                        </b-col>
                        <b-col md="6">
                            {{getTransaction.sales_person.name}}
                        </b-col>
                    </b-row>
                    <hr/>
                    <b-row>
                        <b-col md="4">
                            <h4>Quantity</h4>
                        </b-col>
                        <b-col md="6">
                            {{getTransaction.quantity}}
                        </b-col>
                    </b-row>
                    <hr/>
                    <b-row>
                        <b-col md="4">
                            <h4>Total</h4>
                        </b-col>
                        <b-col md="6">
                            {{getTransaction.total | currency}}
                        </b-col>
                    </b-row>
                    <hr/>
                    <b-row>
                        <b-col md="4">
                            <h4>Transaction Date</h4>
                        </b-col>
                        <b-col md="6">
                            {{getTransaction.created_at | moment('MM/DD/YYYY') }}
                        </b-col>
                    </b-row>
                </b-col>
                <b-col>
                    <b-card class="justify-content-center">
                        <b-row>
                            <b-col class="text-left">
                                <b-button variant="primary" @click="back"><i class="fa fa-mail-reply"></i>Back</b-button>
                            </b-col>
                            <b-col class="text-right">
                                <b-button variant="danger"><i class="fa fa-undo"></i>&nbsp;Cancel Transaction</b-button>
                            </b-col>
                        </b-row>
                    </b-card>
                </b-col>
            </b-row>
            <b-table :hover="hover"
                     :striped="striped"
                     :bordered="bordered"
                     :small="small"
                     :fixed="fixed"
                     responsive="sm"
                     :items="getTransaction.products"
                     :fields="fields"
                     :current-page="currentPage"
                     :per-page="perPage"
                     @row-clicked="showProduct"
            >
                <template slot="pivot.total" slot-scope="data">
                    {{ data.item.pivot.total | currency}}
                </template>
            </b-table>
            <nav>
                <b-pagination :total-rows="getRowCount(getTransaction.products)" :per-page="perPage" v-model="currentPage" prev-text="Prev" next-text="Next" hide-goto-end-buttons/>
            </nav>
        </b-card>
    </b-container>

</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import cSwitch from '../../components/Switch'

    export default {
        props: {
            TableCaption: {
                type: String,
                default: 'Products'
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
        created() {
            let vm = this;

            console.log(vm.$route.params.id);
            if (vm.$route.params.id === undefined) {
                this.$router.push({path: '/transaction'});
            } else {
                let data = {
                    outlet_uuid: vm.outlet.outlet_uuid,
                    trans_uuid: vm.$route.params.id
                };
                vm.$store.dispatch('transaction/get', data);
            }
        },
        components: {
            cSwitch
        },
        data() {
            return {
                caption: 'Transaction',
                primaryModal: false,
                form: {
                    prod_uuid: '',
                    outlet_uuid: '',
                    name: '',
                    description: '',
                    price: 0.00,
                    quantity: 0,
                    cate_uuid: '',
                    hide: false
                },
                fields: [
                    {key: 'name', sortable: true},
                    {key: 'description'},
                    {key: 'pivot.quantity', label: 'Quantity'},
                    {key: 'pivot.total', label: 'Total'},
                ],
                currentPage: 1,
                perPage: 5,
                totalRows: 0,
            }
        },
        computed: {
            ...mapGetters('transaction', {
                getTransaction: 'getTransaction'
            }),
            ...mapGetters('outlet', {
                outlet: 'getOutlet',
            }),
            ...mapGetters('category', {
                categories: 'get',
            }),
            hide() {
                return this.getProduct.hide === 1 ? true : false;
            },
            icon (icon) {
                return icon
            },

        },
        methods: {
            ...mapActions('product', {
                editAction: 'edit',
            }),
            getRowCount (items) {
                return items.length
            },
            openModal(){
                this.primaryModal = true;
            },
            back() {
                this.$router.push({path: '/transaction'});
            },
            saveProduct(){
                let vm = this;
                vm.form.outlet_uuid = vm.outlet.outlet_uuid;
                vm.form.prod_uuid = vm.getProduct.prod_uuid;

                vm.editAction(vm.form).then(res => {
                    vm.primaryModal = false;
                });
            }
        }
    }
</script>