<template>
    <div>
        <b-card>
            <b-form-group>
                <b-input-group>
                    <!-- Attach Left button -->
                    <b-col md="6">
                        <b-form-input type="text" v-model="search" placeholder="search"></b-form-input>
                    </b-col>
                    <b-col md="2" offset-md="2">
                        <b-button variant="primary" class="px-4" @click="primaryModal = true">Add Product</b-button>
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
                     :items="products"
                     :fields="fields"
                     :current-page="currentPage"
                     :per-page="perPage"
                     @row-clicked="showProduct"
            >
                <template slot="status" slot-scope="data">
                    <b-button variant="success"><i class="fa fa-magic"></i>&nbsp;Edit</b-button>
                </template>
            </b-table>
            <nav>
                <b-pagination :total-rows="getRowCount(products)" :per-page="perPage" v-model="currentPage" prev-text="Prev" next-text="Next" hide-goto-end-buttons/>
            </nav>
        </b-card>

        <b-modal title="New Category" class="modal-primary" v-model="primaryModal" hide-footer @ok="primaryModal = false">
            <b-form-group
                    label="Name"
                    label-for="basicName"
                    :label-cols="3"
                    :horizontal="true">
                <b-form-input id="basicName" v-model="form.name" type="text"></b-form-input>
            </b-form-group>
            <b-form-group
                    label="Description"
                    label-for="basicName"
                    :label-cols="3"
                    :horizontal="true">
                <b-form-textarea id="textarea1"
                                 v-model="form.description"
                                 placeholder="Enter something"
                                 :rows="3"
                                 :max-rows="6">
                </b-form-textarea>
            </b-form-group>
            <b-form-group
                    label="Parent Category"
                    label-for="basicSelect"
                    :label-cols="3"
                    :horizontal="true">
                <b-form-select v-model="form.cate_uuid" :options="categories.name" class="mb-3">
                    <template slot="first">
                        <option :value="null">--Please select an option--</option>
                    </template>
                    <option v-for="(category, index) in categories" :key="index" :value="category.cate_uuid">{{ category.name }}</option>
                </b-form-select>
            </b-form-group>
            <b-form-group
                    label="Quantity"
                    label-for="basicName"
                    :label-cols="3"
                    :horizontal="true">
                <b-form-input id="basicName" v-model="form.quantity" type="number"></b-form-input>
            </b-form-group>
            <b-form-group
                    label="Price"
                    label-for="basicName"
                    :label-cols="3"
                    :horizontal="true">
                <b-form-input id="basicName" v-model="form.price" type="number"></b-form-input>
            </b-form-group>
            <b-button type="submit" size="md" variant="primary" @click.prevent="addProduct"><i class="fa fa-dot-circle-o"></i> Submit</b-button>
            <b-button type="reset" size="md" variant="danger"><i class="fa fa-ban"></i> Reset</b-button>
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
            vm.$store.dispatch('product/fetch', data).then(res => {
                vm.$store.dispatch('category/fetch', data);
            })
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
                    {key: 'name', sortable: true},
                    {key: 'description'},
                    {key: 'category.name'},
                    {key: 'quantity', sortable: true},
                    {key: 'price'},
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
                search: ''
            }
        },
        methods: {
            ...mapActions('product',{
                addAction: 'add'
            }),
            getRowCount (items) {
                return items.length
            },
            addProduct(){
                event.preventDefault();
                let vm = this;
                vm.form.biz_uuid = vm.outlet.biz_uuid;
                vm.form.outlet_uuid = vm.outlet.outlet_uuid;

                vm.addAction(vm.form).then(res => {
                    vm.primaryModal = false;
                });
            },
            showProduct(item, index) {
                this.$router.push({ path: '/product/'+item.prod_uuid });
            }
        },
        watch: {
            search() {
                if (this.search.length > 0){
                    let data = {
                        outlet_uuid: this.outlet.outlet_uuid,
                        search: this.search,
                        filter: true
                    };
                    this.$store.dispatch('product/fetch', data)
                } else{
                    let data = {
                        outlet_uuid: this.outlet.outlet_uuid,
                        filter: false
                    };
                    this.$store.dispatch('product/fetch', data)
                }
            }
        }
    }
</script>
