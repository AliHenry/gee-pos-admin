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
                        <b-button variant="primary" class="px-4" @click="showModal">Add User</b-button>
                    </b-col>
                </b-input-group>
            </b-form-group>
        </b-card>
        <b-card :header="caption">
            <b-table :hover="hover" :striped="striped" :bordered="bordered" :small="small" :fixed="fixed" responsive="sm" :items="users" :fields="fields" :current-page="currentPage" :per-page="perPage">
                <template slot="status" slot-scope="data">
                    <b-button variant="success"><i class="fa fa-magic"></i>&nbsp;Edit</b-button>
                </template>
            </b-table>
            <nav>
                <b-pagination :total-rows="getRowCount(users)" :per-page="perPage" v-model="currentPage" prev-text="Prev" next-text="Next" hide-goto-end-buttons/>
            </nav>
        </b-card>

        <b-modal title="New Category" class="modal-primary" v-model="primaryModal" hide-footer @ok="primaryModal = false">
            <b-form-group
                    label="Name"
                    label-for="basicName"
                    :label-cols="3"
                    :horizontal="true">
                <b-form-input id="basicName" v-model="form.name" type="text"></b-form-input>
                <span v-if="status.error.name" style="color:red">{{ status.error.name[0] }}</span>
            </b-form-group>
            <b-form-group
                    label="Email"
                    label-for="basicName"
                    :label-cols="3"
                    :horizontal="true">
                <b-form-input id="basicName" v-model="form.email" type="email"></b-form-input>
                <span v-if="status.error.email" style="color:red">{{ status.error.email[0] }}</span>
            </b-form-group>
            <b-form-group
                    label="Password"
                    label-for="basicName"
                    :label-cols="3"
                    :horizontal="true">
                <b-form-input id="basicName" v-model="form.password" type="password"></b-form-input>
                <span v-if="status.error.password" style="color:red">{{ status.error.password[0] }}</span>
            </b-form-group>
            <b-form-group
                    label="Confirm Password"
                    label-for="basicName"
                    :label-cols="3"
                    :horizontal="true">
                <b-form-input id="basicName" v-model="form.confirm_password" type="password"></b-form-input>
                <span v-if="status.error.confirm_password" style="color:red">{{ status.error.confirm_password[0] }}</span>
            </b-form-group>
            <b-form-group
                    label="Role"
                    label-for="basicSelect"
                    :label-cols="3"
                    :horizontal="true">
                <b-form-select v-model="form.role_id" class="mb-3">
                    <option :value="null">Please select an option</option>
                    <option v-for="(role, index) in roles" :key="index" :value="role.id">{{ role.name }}</option>
                </b-form-select>
                <span v-if="status.error.role_id" style="color:red">{{ status.error.role_id[0] }}</span>
            </b-form-group>
            <b-button type="submit" size="md" variant="primary" @click.prevent="addUser"><i class="fa fa-dot-circle-o"></i> Submit</b-button>
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
        name: 'user',
        props: {
            caption: {
                type: String,
                default: 'Users'
            },
            hover: {
                type: Boolean,
                default: true
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
            vm.$store.dispatch('user/fetch', data).then(res => {
                vm.$store.dispatch('user/fetchRoles');
            });
        },
        computed: {
            ...mapGetters('user',{
                users: 'get',
                roles: 'getRole',
                status: 'getStatus'
            }),
            ...mapGetters('outlet', {
                outlet: 'getOutlet',
            })
        },
        data: () => {
            return {
                primaryModal: false,
                fields: [
                    {key: 'name'},
                    {key: 'email'},
                    {key: 'role_name'},
                    {key: 'status'}
                ],
                currentPage: 1,
                perPage: 5,
                totalRows: 0,
                form: {
                    outlet_uuid: '',
                    name: '',
                    email: '',
                    password: '',
                    confirm_password: '',
                    role_id: ''
                },
                search: ''
            }
        },
        methods: {
            ...mapActions('user',{
                addAction: 'add',
                clearError: 'clearError'
            }),
            showModal(){
              this.primaryModal = true;
              this.clearError();
            },
            getRowCount (items) {
                return items.length
            },
            addUser(){
                event.preventDefault();
                let vm = this;
                vm.form.outlet_uuid = vm.outlet.outlet_uuid;

                vm.addAction(vm.form).then(res => {
                    vm.primaryModal = false;
                    vm.reset()
                });
            },
            reset(){
                this.form.outlet_uuid = '';
                this.form.name = '';
                this.form.email = '';
                this.form.password = '';
                this.form.confirm_password = '';
                this.form.role_id = '';
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
                    this.$store.dispatch('user/fetch', data)
                } else{
                    let data = {
                        outlet_uuid: this.outlet.outlet_uuid,
                        filter: false
                    };
                    this.$store.dispatch('user/fetch', data)
                }
            }
        }
    }
</script>
