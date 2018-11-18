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
                <div class="h4 mb-0">385</div>
                <small class="text-muted text-uppercase font-weight-bold">Likes</small>
                <b-progress height={} class="progress-xs mt-3 mb-0" variant="success" :value="25"/>
            </b-card>
            <b-card>
                <div class="h1 text-muted text-right mb-4">
                    <i class="icon-basket-loaded"></i>
                </div>
                <div class="h4 mb-0">{{ getCategory.sold_amount }}</div>
                <small class="text-muted text-uppercase font-weight-bold">Category Amount sold</small>
                <b-progress height={} class="progress-xs mt-3 mb-0" variant="warning" :value="25"/>
            </b-card>
            <b-card>
                <div class="h1 text-muted text-right mb-4">
                    <i class="icon-pie-chart"></i>
                </div>
                <div class="h4 mb-0">{{ getCategory.sold_quantity }}</div>
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
                            {{getCategory.name}}
                        </b-col>
                    </b-row>
                    <hr/>
                    <b-row>
                        <b-col md="4">
                            <h4>Description</h4>
                        </b-col>
                        <b-col md="4">
                            {{getCategory.description}}
                        </b-col>
                    </b-row>
                    <hr/>
                    <b-row>
                        <b-col md="4">
                            <h4>Category</h4>
                        </b-col>
                        <b-col md="4" v-if="getCategory.parent">
                            {{getCategory.parent.name}}
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
            <b-form-group>
                <b-col class="text-center">
                    <b-button type="submit" size="md" variant="primary" @click.prevent="saveCategory"><i class="fa fa-dot-circle-o"></i> Save</b-button>
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
                    cate_uuid: vm.$route.params.id
                };
                vm.$store.dispatch('category/get', data).then(res => {
                    let data2 = {
                        outlet_uuid: vm.outlet.outlet_uuid,
                        filter: false
                    };
                    vm.$store.dispatch('category/fetch', data2);
                });

            }
        },
        components: {
            cSwitch
        },
        data() {
            return {
                caption: 'Category',
                primaryModal: false,
                form: {
                    outlet_uuid: '',
                    name: '',
                    description: '',
                    cate_uuid: '',
                    parent_id: '',
                    hide: false
                },
            }
        },
        computed: {
            ...mapGetters('category', {
                getCategory: 'getCategory'
            }),
            ...mapGetters('outlet', {
                outlet: 'getOutlet',
            }),
            ...mapGetters('category', {
                categories: 'get',
            }),
            hide() {
                return this.getCategory.hide === 1 ? true : false;
            },
            icon (icon) {
                return icon
            },
            name:{
                get(){
                    return this.getCategory.name;
                },
                set(value){
                    this.form.name = value;
                }
            },
            description:{
                get(){
                    return this.getCategory.description;
                },
                set(value){
                    this.form.description = value;
                }
            },
            category:{
                get(){
                    if (this.getCategory.parent){
                        return this.getCategory.parent.cate_uuid;
                    } else {
                        return ''
                    }
                },
                set(value){
                    this.form.parent_id = value;
                }
            },

        },
        methods: {
            ...mapActions('category', {
                editAction: 'edit',
            }),
            openModal(){
                this.primaryModal = true;
            },
            back() {
                this.$router.push({path: '/category'});
            },
            saveCategory(){
                let vm = this;
                vm.form.outlet_uuid = vm.outlet.outlet_uuid;
                vm.form.cate_uuid = vm.getCategory.cate_uuid;

                vm.editAction(vm.form).then(res => {
                    vm.primaryModal = false;
                });
            }
        }
    }
</script>