<template>
    <div class="animated fadeIn">
        <b-row>
            <b-col sm="6">
                <b-card>
                    <div slot="header">
                        <strong>Search Item</strong>
                    </div>
                    <b-form-group>
                        <b-input-group>
                            <!-- Attach Left button -->
                            <b-col>
                                <b-form-input type="text" v-model="search" placeholder="search"></b-form-input>
                            </b-col>
                        </b-input-group>
                    </b-form-group>
                    <b-table :hover="hover" :striped="striped" :bordered="bordered" :small="small" :fixed="fixed" responsive="sm" :items="products" :fields="fields" :current-page="currentPage" :per-page="perPage">
                        <template slot="to cart" slot-scope="data">
                            <b-button variant="success" @click="addProduct(data.item)"><i class="fa fa-magic"></i>&nbsp;Add To Cart</b-button>
                        </template>
                    </b-table>
                    <nav>
                        <b-pagination :total-rows="getRowCount(products)" :per-page="perPage" v-model="currentPage" prev-text="Prev" next-text="Next" hide-goto-end-buttons/>
                    </nav>
                </b-card>
            </b-col>
            <b-col sm="6">
                <b-col>
                    <b-card>
                        <div slot="header">
                            <strong>POS</strong>
                        </div>
                        <div>
                            <div class="text-center">
                                <h3><strong>Total :</strong> {{ cartTotal }}</h3>
                            </div>
                            <h5><strong>Total Qty :</strong> {{ cartTotalQty }}</h5>
                            <h5><strong>Amount Given:</strong> {{ givingAmount }}</h5>
                            <h5><strong>Change: </strong> {{ customerChange}}</h5>
                            <b-row>
                                <b-col class="text-left">
                                    <b-button variant="primary" class="px-4" @click.prevent="showChange">Payment</b-button>
                                </b-col>
                                <b-col class="text-right">
                                    <b-button variant="primary" class="px-4 text-right" :disabled="!paid" @click.prevent="transaction">Check Out</b-button>
                                </b-col>
                            </b-row>
                        </div>
                        <div class="mt-2">
                            <b-table :hover="hover" :striped="striped" :bordered="bordered" :small="small" :fixed="fixed" responsive="sm" :items="cartProducts" :fields="fields2" :current-page="currentPage" :per-page="perPage">
                                <template slot="quantity" slot-scope="data">
                                    <b-button-toolbar key-nav aria-label="Toolbar with button groups">
                                        <b-button-group class="mx-1">
                                            <b-btn @click.prevent="decrease(data.item)">&lsaquo;</b-btn>
                                            <b-form-input class="col-sm-2" type="text" :value="data.item.quantity"></b-form-input>
                                            <b-btn @click.prevent="increase(data.item)">&rsaquo;</b-btn>
                                        </b-button-group>
                                    </b-button-toolbar>
                                </template>
                                <template slot="status" slot-scope="data">
                                    <div class="text-center">
                                        <b-button variant="danger" class="px-4" @click.prevent="remove(data.item)">Delete</b-button>
                                    </div>
                                </template>
                            </b-table>
                            <nav>
                                <b-pagination :total-rows="getRowCount(products)" :per-page="perPage" v-model="currentPage" prev-text="Prev" next-text="Next" hide-goto-end-buttons/>
                            </nav>
                        </div>
                    </b-card>
                </b-col>
            </b-col>
        </b-row>

        <b-modal title="New Category" class="modal-primary" v-model="primaryModal" hide-footer @ok="primaryModal = false">
            <b-form-group
                    label="Name"
                    label-for="basicName"
                    :label-cols="3"
                    :horizontal="true">
                <b-form-input id="basicName" v-model="givingAmount" type="number"></b-form-input>
            </b-form-group>
            <b-button type="submit" size="md" variant="primary" @click.prevent="paidTrans"><i class="fa fa-dot-circle-o"></i> Submit</b-button>
            <b-button type="reset" size="md" variant="danger" @click.prevent="reset"><i class="fa fa-ban"></i> Reset</b-button>
        </b-modal>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
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
                default: true
            },
            fixed: {
                type: Boolean,
                default: false
            }
        },
        mounted(){
            let vm = this;
            let data = {
                outlet_uuid: vm.outlet.outlet_uuid,
                filter: false
            };
            vm.$store.dispatch('product/fetch', data)
        },
        computed: {
            ...mapGetters('product',{
                products: 'getSearch',
                cartProducts: 'cartProduct',
                cartTotal: 'cartTotal',
                cartTotalQty: 'cartTotalQty'
            }),
            ...mapGetters('outlet', {
                outlet: 'getOutlet',
            }),
            ...mapGetters('category', {
                categories: 'get',
            }),
            customerChange:{
                get(){
                    //if (this.cartTotal >= this.givingAmount )
                    return this.cartTotal <= this.givingAmount ? this.givingAmount - this.cartTotal : 0;
                },

            }
        },
        data: () => {
            return {
                primaryModal: false,
                givingAmount: 0,
                paid: false,
                fields: [
                    {key: 'name'},
                    {key: 'quantity'},
                    {key: 'price'},
                    {key: 'to cart'},
                ],
                fields2: [
                    {key: 'name'},
                    {key: 'quantity'},
                    {key: 'price'},
                    {key: 'status'},
                ],
                currentPage: 1,
                perPage: 5,
                totalRows: 0,
                search: ''
            }
        },
        methods: {
            ...mapActions('product',{
                addCartAction: 'addCart',
                increaseAction: 'increase',
                decreaseAction: 'decrease',
                removeAction: 'remove',
                transactionAction: 'transaction'
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
            increase(cartItem){
                let vm = this;
                vm.increaseAction(cartItem)

            },
            decrease(cartItem){
                if (cartItem.quantity === 1 || cartItem.quantity < 1 ){

                } else {
                    let vm = this;
                    vm.decreaseAction(cartItem)
                }
            },
            remove(cartItem){
                let vm = this;
                vm.removeAction(cartItem).then(res => {
                    vm.givingAmount = 0;
                    vm.paid = false;
                });
            },
            paidTrans(){
                if(this.cartTotal <= this.givingAmount){
                    this.paid = true;
                    this.primaryModal = false;
                }
            },
            reset(){
                this.givingAmount = 0;
                this.paid = false;
            },
            showChange(){
                //this.showLoginError();
              this.primaryModal = true;
              this.showLoginError();
            },
            transaction(){
                let vm = this;
                if (vm.paid){
                    let data = {
                        biz_uuid: vm.outlet.biz_uuid,
                        outlet_uuid: vm.outlet.outlet_uuid,
                        total: vm.cartTotal,
                        quantity: vm.cartTotalQty,
                        items: vm.cartProducts
                    };
                    console.log(data);
                    vm.transactionAction(data).then(res => {
                        vm.reset();
                    })
                }else{
                    console.log('not paid');
                }
            },
        },
        watch: {
            search() {
                if (this.search.length > 0){
                    let data = {
                        outlet_uuid: this.outlet.outlet_uuid,
                        search: this.search,
                        filter: true
                    };
                    this.$store.dispatch('product/search', data)
                }else{
                    this.$store.dispatch('product/emptySearch')
                }
            },

        },
        notifications: {
            showLoginError: { // You can have any name you want instead of 'showLoginError'
                title: 'Login Failed',
                message: 'Failed to authenticate',
                type: 'error' // You also can use 'VueNotifications.types.error' instead of 'error'
            }
        }
    }
</script>