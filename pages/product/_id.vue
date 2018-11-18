<template>
    <b-container class="bv-example-row">
        <b-card-group class="mb-4">
            <b-card>
                <div class="h1 text-muted text-right mb-4">
                    <i class="icon-people"></i>
                </div>
                <div class="h4 mb-0">87.500</div>
                <small class="text-muted text-uppercase font-weight-bold">Visitors</small>
                <b-progress height={} class="progress-xs mt-3 mb-0" variant="info" :value="25"/>
            </b-card>
            <b-card>
                <div class="h1 text-muted text-right mb-4">
                    <i class="icon-user-follow"></i>
                </div>
                <div class="h4 mb-0">{{ getProduct.pro_likes }}</div>
                <small class="text-muted text-uppercase font-weight-bold">Likes</small>
                <b-progress height={} class="progress-xs mt-3 mb-0" variant="success" :value="25"/>
            </b-card>
            <b-card>
                <div class="h1 text-muted text-right mb-4">
                    <i class="icon-basket-loaded"></i>
                </div>
                <div class="h4 mb-0">{{ getProduct.sold_amount | currency}}</div>
                <small class="text-muted text-uppercase font-weight-bold">Products Amount sold</small>
                <b-progress height={} class="progress-xs mt-3 mb-0" variant="warning" :value="25"/>
            </b-card>
            <b-card>
                <div class="h1 text-muted text-right mb-4">
                    <i class="icon-pie-chart"></i>
                </div>
                <div class="h4 mb-0">{{ getProduct.sold_quantity }}</div>
                <small class="text-muted text-uppercase font-weight-bold">Quantity Sold</small>
                <b-progress height={} class="progress-xs mt-3 mb-0" :value="25"/>
            </b-card>
            <b-card>
                <div class="h1 text-muted text-right mb-4">
                    <i class="icon-speech"></i>
                </div>
                <div class="h4 mb-0">972</div>
                <small class="text-muted text-uppercase font-weight-bold">Comments</small>
                <b-progress height={} class="progress-xs mt-3 mb-0" variant="info" :value="25"/>
            </b-card>
        </b-card-group>
        <b-card :header="caption" class="justify-content-center">
            <b-row>
                <b-col md="8">
                    <b-row>
                        <b-col md="4">
                            <h4>Name</h4>
                        </b-col>
                        <b-col md="2">
                            {{getProduct.name}}
                        </b-col>
                    </b-row>
                    <hr/>
                    <b-row>
                        <b-col md="4">
                            <h4>Description</h4>
                        </b-col>
                        <b-col md="4">
                            {{getProduct.description}}
                        </b-col>
                    </b-row>
                    <hr/>
                    <b-row>
                        <b-col md="4">
                            <h4>Category</h4>
                        </b-col>
                        <b-col md="4">
                            {{getProduct.category.name}}
                        </b-col>
                    </b-row>
                    <hr/>
                    <hr/>
                    <b-row>
                        <b-col md="4">
                            <h4>Qty</h4>
                        </b-col>
                        <b-col md="4">
                            {{getProduct.quantity}}
                        </b-col>
                    </b-row>
                    <hr/>
                    <b-row>
                        <b-col md="4">
                            <h4>Price</h4>
                        </b-col>
                        <b-col md="4">
                            {{getProduct.price}}
                        </b-col>
                    </b-row>
                    <hr/>
                    <b-row>
                        <b-col md="4">
                            <h4>Hide Product</h4>
                        </b-col>
                        <b-col md="4">
                            {{ hide }}
                        </b-col>
                    </b-row>
                    <hr/>
                </b-col>
                <b-col>
                    <b-card class="justify-content-center">
                        <b-row>
                            <b-col class="text-left">
                                <b-button variant="primary" @click="back"><i class="fa fa-mail-reply"></i>Back</b-button>
                            </b-col>
                            <b-col class="text-right">
                                <b-button variant="primary" @click="openModal"><i class="fa fa-edit"></i>&nbsp;Edit Product</b-button>
                            </b-col>
                        </b-row>
                    </b-card>

                </b-col>
            </b-row>
        </b-card>

        <b-modal title="New Category" class="modal-primary" v-model="primaryModal" hide-footer @ok="primaryModal = false">
            <b-form-group
                    label="Name"
                    label-for="basicName"
                    :label-cols="3"
                    :horizontal="true">
                <b-form-input id="basicName" v-model="name" type="text"></b-form-input>
            </b-form-group>
            <b-form-group
                    label="Description"
                    label-for="basicName"
                    :label-cols="3"
                    :horizontal="true">
                <b-form-textarea id="textarea1"
                                 v-model="description"
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
                <b-form-select v-model="category" :options="categories.name" class="mb-3">
                    <template slot="first">
                        <option :value="null">--Please select an option--</option>
                    </template>
                    <option v-for="(category, index) in categories"
                            :key="index"
                            :value="category.cate_uuid">{{ category.name }}</option>
                </b-form-select>
            </b-form-group>
            <b-form-group
                    label="Quantity"
                    label-for="basicName"
                    :label-cols="3"
                    :horizontal="true">
                <b-form-input id="basicName" v-model="quantity" type="number"></b-form-input>
            </b-form-group>
            <b-form-group
                    label="Price"
                    label-for="basicName"
                    :label-cols="3"
                    :horizontal="true">
                <b-form-input id="basicName" v-model="price" type="number"></b-form-input>
            </b-form-group>
            <b-form-group
                    label="Hide"
                    label-for="basicName"
                    :label-cols="3"
                    :horizontal="true">
                <div class="animated fadeIn">
                    <c-switch type="icon" variant="primary-outline-alt" v-model="hideShow" v-bind="{on: '\uf00c', off: '\uf00d'}" :pill="true" :checked="true"/>
                </div>
            </b-form-group>
            <b-form-group>
                <b-col class="text-center">
                    <b-button type="submit" size="md" variant="primary" @click.prevent="saveProduct"><i class="fa fa-dot-circle-o"></i> Save</b-button>
                </b-col>
            </b-form-group>
        </b-modal>
    </b-container>

</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import cSwitch from '../../components/Switch'

    export default {
        created() {
            let vm = this;

            console.log(vm.$route.params.id);
            if (vm.$route.params.id === undefined) {

            } else {
                let data = {
                    outlet_uuid: vm.outlet.outlet_uuid,
                    prod_uuid: vm.$route.params.id
                };
                vm.$store.dispatch('product/get', data);
                let data2 = {
                    outlet_uuid: vm.outlet.outlet_uuid,
                    filter: false
                };
                vm.$store.dispatch('category/fetch', data2);
            }
        },
        components: {
            cSwitch
        },
        data() {
            return {
                caption: 'Product',
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
            }
        },
        computed: {
            ...mapGetters('product', {
                getProduct: 'getProduct'
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
            name:{
                get(){
                    return this.getProduct.name;
                },
                set(value){
                    this.form.name = value;
                }
            },
            description:{
                get(){
                    return this.getProduct.description;
                },
                set(value){
                    this.form.description = value;
                }
            },
            price:{
                get(){
                    return this.getProduct.price;
                },
                set(value){
                    this.form.price = value;
                }
            },
            quantity:{
                get(){
                    return this.getProduct.quantity;
                },
                set(value){
                    this.form.quantity = value;
                }
            },
            hideShow:{
                get(){
                    return this.getProduct.hide;
                },
                set(value){
                    this.form.hide = value;
                }
            },
            category:{
                get(){
                    return this.getProduct.category.cate_uuid;
                },
                set(value){
                    this.form.cate_uuid = value;
                }
            },

        },
        methods: {
            ...mapActions('product', {
                editAction: 'edit',
            }),
            openModal(){
                this.primaryModal = true;
            },
            back() {
                this.$router.push({path: '/product'});
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