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
                    <i class="icon-speedometer"></i>
                </div>
                <div class="h4 mb-0">{{ getUser.transaction_items}}</div>
                <small class="text-muted text-uppercase font-weight-bold">Total item sold</small>
                <b-progress height={} class="progress-xs mt-3 mb-0" variant="success" :value="25"/>
            </b-card>
            <b-card>
                <div class="h1 text-muted text-right mb-4">
                    <i class="icon-basket-loaded"></i>
                </div>
                <div class="h4 mb-0">{{ getUser.transaction_amount | currency}}</div>
                <small class="text-muted text-uppercase font-weight-bold">Sale maid amount</small>
                <b-progress height={} class="progress-xs mt-3 mb-0" variant="warning" :value="25"/>
            </b-card>
            <b-card>
                <div class="h1 text-muted text-right mb-4">
                    <i class="icon-pie-chart"></i>
                </div>
                <div class="h4 mb-0">{{ getUser.transaction_count}}</div>
                <small class="text-muted text-uppercase font-weight-bold">Transactions</small>
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
                            {{getUser.name}}
                        </b-col>
                    </b-row>
                    <hr/>
                    <b-row>
                        <b-col md="4">
                            <h4>Email</h4>
                        </b-col>
                        <b-col md="4">
                            {{getUser.email}}
                        </b-col>
                    </b-row>
                    <hr/>
                    <b-row>
                        <b-col md="4">
                            <h4>Role</h4>
                        </b-col>
                        <b-col md="4">
                            {{getUser.role_name}}
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
                    label="Email"
                    label-for="basicName"
                    :label-cols="3"
                    :horizontal="true">
                <b-form-input id="basicName" v-model="email" type="text"></b-form-input>
            </b-form-group>
            <b-form-group
                    label="Parent Category"
                    label-for="basicSelect"
                    :label-cols="3"
                    :horizontal="true">
                <b-form-select v-model="role" :options="role.name" class="mb-3">
                    <template slot="first">
                        <option :value="null">--Please select an option--</option>
                    </template>
                    <option v-for="(role, index) in roles"
                            :key="index"
                            :value="role.id">{{ role.name }}</option>
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
                    user_id: vm.$route.params.id
                };
                vm.$store.dispatch('user/get', data).then(res => {
                    vm.$store.dispatch('user/fetchRoles');
                });

            }
        },
        components: {
            cSwitch
        },
        data() {
            return {
                caption: 'User Profile',
                primaryModal: false,
                form: {
                    outlet_uuid: '',
                    name: '',
                    email: '',
                    role_id: '',
                },
                configSymbol: '₫',
            }
        },
        computed: {
            ...mapGetters('user', {
                getUser: 'getUser'
            }),
            ...mapGetters('outlet', {
                outlet: 'getOutlet',
            }),
            ...mapGetters('user', {
                roles: 'getRole',
            }),
            icon (icon) {
                return icon
            },
            name:{
                get(){
                    return this.getUser.name;
                },
                set(value){
                    this.form.name = value;
                }
            },
            email:{
                get(){
                    return this.getUser.email;
                },
                set(value){
                    this.form.email = value;
                }
            },
            role:{
                get(){
                    return this.getUser.role_id;
                },
                set(value){
                    this.form.role_id = value;
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