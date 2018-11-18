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
                        <b-button variant="primary" class="px-4" @click="primaryModal = true">Add Category</b-button>
                    </b-col>
                </b-input-group>
            </b-form-group>
        </b-card>
        <b-card :header="caption">
            <b-table
                    :hover="hover"
                    :striped="striped"
                    :bordered="bordered"
                    :small="small"
                    :fixed="fixed"
                    responsive="sm"
                    :items="categories"
                    :fields="fields"
                    @row-clicked="showCategory"
                    :current-page="currentPage"
                    :per-page="perPage">
                <template slot="status" slot-scope="data">
                    <b-button variant="success"><i class="fa fa-magic"></i>&nbsp;Edit</b-button>
                </template>
            </b-table>
            <nav>
                <b-pagination :total-rows="getRowCount(categories)" :per-page="perPage" v-model="currentPage" prev-text="Prev" next-text="Next" hide-goto-end-buttons/>
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
                <b-form-select v-model="form.parent_id" class="mb-3">
                    <option :value="null">Please select an option</option>
                    <option v-for="(category, index) in categories" :key="index" :value="category.cate_uuid">{{ category.name }}</option>
                </b-form-select>
            </b-form-group>
            <b-button type="submit" size="md" variant="primary" @click.prevent="addCategory"><i class="fa fa-dot-circle-o"></i> Submit</b-button>
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
        name: 'cart',
        props: {
            caption: {
                type: String,
                default: 'Categories'
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
            vm.$store.dispatch('category/fetch', data)
        },
        computed: {
            ...mapGetters('category',{
                categories: 'get'
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
                    {key: 'description'},
                    {key: 'parent.name'},
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
                    parent_id: ''
                },
                search: ''
            }
        },
        methods: {
            ...mapActions('category',{
                addAction: 'add'
            }),
            getRowCount (items) {
                return items.length
            },
            addCategory(){
                event.preventDefault();
                let vm = this;
                vm.form.biz_uuid = vm.outlet.biz_uuid;
                vm.form.outlet_uuid = vm.outlet.outlet_uuid;

                vm.addAction(vm.form).then(res => {
                    vm.primaryModal = false;
                });
            },
            showCategory(item, index) {
                this.$router.push({ path: '/category/'+item.cate_uuid });
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
                    this.$store.dispatch('category/fetch', data)
                } else{
                    let data = {
                        outlet_uuid: this.outlet.outlet_uuid,
                        filter: false
                    };
                    this.$store.dispatch('category/fetch', data)
                }
            }
        }
    }
</script>
