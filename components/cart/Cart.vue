<template>
    <b-card>
        <div slot="header">
            <strong>POS</strong>
        </div>
        <div>
            <p><strong>Total:</strong></p>
            <p><strong>Total Qty:</strong></p>
            <p><strong>Amount Given:</strong></p>
            <p><strong>Change:</strong></p>
            <div class="text-center">
                <b-button variant="primary" class="px-4">Cash Out</b-button>
            </div>
        </div>
        <div class="mt-2">
            <b-table :hover="hover" :striped="striped" :bordered="bordered" :small="small" :fixed="fixed" responsive="sm" :items="products" :fields="fields" :current-page="currentPage" :per-page="perPage">
                <template slot="quantity" slot-scope="data">
                    <b-button-toolbar key-nav aria-label="Toolbar with button groups">
                        <b-button-group class="mx-1">
                            <b-btn>&lsaquo;</b-btn>
                            <b-form-input class="col-sm-2" type="text"></b-form-input>
                            <b-btn>&rsaquo;</b-btn>
                        </b-button-group>
                    </b-button-toolbar>
                </template>
            </b-table>
            <nav>
                <b-pagination :total-rows="getRowCount(products)" :per-page="perPage" v-model="currentPage" prev-text="Prev" next-text="Next" hide-goto-end-buttons/>
            </nav>
        </div>
    </b-card>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'

    export default {
        name: 'c-cart',
        props: {
            caption: {
                type: String,
                default: 'Cart'
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
        computed: {
            ...mapGetters('product',{
                products: 'get'
            }),
            ...mapGetters('outlet', {
                outlet: 'getOutlet',
            }),
            ...mapGetters('category', {
                categories: 'get',
            }),
        },
        data: () => {
            return {
                primaryModal: false,
                fields: [
                    {key: 'name'},
                    {key: 'quantity'},
                    {key: 'price'},
                ],
                currentPage: 1,
                perPage: 5,
                totalRows: 0,
                search: ''
            }
        },
        methods: {
            ...mapActions('cart',{
                addCartAction: 'addCart'
            }),
            getRowCount (items) {
                return items.length
            },
            addProduct(product){
                event.preventDefault();
                let vm = this;

                vm.addCartAction(product).then(res => {
                });
            },
        },
    }
</script>