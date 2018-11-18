<template>
    <div class="app flex-row align-items-center">
        <div class="container">
            <b-row class="justify-content-center">
                <b-col md="8" sm="8">
                    <b-card
                            header-tag="header"
                            footer-tag="footer">
                        <div slot="header">
                            <i class="fa fa-align-justify"></i> <strong>Bootstrap Progress</strong>
                            <div class="card-actions">
                                <a href="https://bootstrap-vue.js.org/docs/components/progress" target="_blank">
                                    <small class="text-muted">docs</small>
                                </a>
                            </div>
                        </div>
                        <div>
                            <b-progress class="mt-1" :max="max" show-progress animated>
                                <b-progress-bar :value="counter" variant="success"></b-progress-bar>
                            </b-progress>

                        </div>

                        <b-card>
                            <div slot="header">
                                <strong>Company</strong> <small>Form</small>
                            </div>
                            <b-form-group>
                                <label for="company">Business name</label>
                                <b-form-input type="text" id="company" v-model="form.name" placeholder="Enter your company name"></b-form-input>
                                <span v-if="error.name" style="color:red">{{ error.name }}</span>
                            </b-form-group>
                            <b-form-group>
                                <label for="description">Description</label>
                                <b-form-input type="text" id="vat" v-model="form.description" placeholder="Enter description"></b-form-input>
                            </b-form-group>
                            <hr/>
                            <b-row>
                                <b-col sm="8">
                                    <b-form-group>
                                        <label for="search">Search Address</label>
                                        <b-form-input type="text" id="city" v-model="search" placeholder="Search address"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="3">
                                    <b-form-group>
                                        <b-btn class="mt-4" @click.prevent="getLatLng">Get Current Location</b-btn>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <hr/>
                            <b-form-group>
                                <label for="street">Address</label>
                                <b-form-input type="text" id="address" v-model="form.address" placeholder="Enter address name"></b-form-input>
                                <span v-if="error.address" style="color:red">{{ error.address }}</span>
                            </b-form-group>
                            <b-row>
                                <b-col sm="8">
                                    <b-form-group>
                                        <label for="city">City</label>
                                        <b-form-input type="text" id="city" v-model="form.city" placeholder="Enter your city"></b-form-input>
                                        <span v-if="error.city" style="color:red">{{ error.city }}</span>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="postal-code">District</label>
                                        <b-form-input type="text" id="district" v-model="form.district" placeholder="district"></b-form-input>
                                        <span v-if="error.district" style="color:red">{{ error.district }}</span>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-form-group>
                                <label for="country">Country</label>
                                <b-form-input type="text" id="country" v-model="form.country" placeholder="Country name"></b-form-input>
                                <span v-if="error.country" style="color:red">{{ error.country }}</span>
                            </b-form-group>
                        </b-card>
                        <b-btn class="mt-4" @click.prevent="submit">Click me</b-btn>
                    </b-card>

                </b-col>
            </b-row>
        </div>
    </div>
</template>

<script>
    import {
        mapActions
    } from 'vuex';
    export default {
        name: 'Unboarding',
        layout: 'clean',
        data () {
            return {
                counter: 50,
                max: 100,
                value: 33.333333333,
                value3: 75,
                bars: [
                    {variant: 'success', value: 75},
                ],
                timer: null,
                striped: true,
                animate: true,
                max3: 100,
                values: [ 15, 30, 20 ],
                form: {
                    name: '',
                    description: '',
                    address: '',
                    city: '',
                    district: '',
                    country: '',
                    lng: '',
                    lat: '',
                },
                valid: true,
                error: {
                    name: '',
                    address: '',
                    city: '',
                    district: '',
                    country: '',
                },
                search: ''
            }
        },
        methods: {
            ...mapActions('outlet',{
                registerAction: 'register'
            }),
            clicked () {
                if(this.counter === 100){
                    this.counter = 0;
                }else {
                    this.counter = this.counter + 50;
                }

            },
            getLatLng(){
                let vm = this;
                vm.search = '';
                let options = {
                    enableHighAccuracy: false, //defaults to false
                    timeout: Infinity, //defaults to Infinity
                    maximumAge: 0 //defaults to 0
                };

                vm.$watchLocation(options)
                    .then(coordinates => {
                        console.log(coordinates);

                        let key = 'key=AIzaSyDBQYDxw2AAMERTu091lFdb1WWDV2V5GMg';
                        let searchAdd = 'latlng='+coordinates.lat+','+coordinates.lng;
                        let uri = 'https://maps.googleapis.com/maps/api/geocode/json?';
                        let query = uri+''+searchAdd+'&'+key;
                        vm.$http.get(
                            query
                        ).then(response => {
                            // get body data
                            let data = response.data.results[0];
                            let places = data.address_components;
                            console.log("GOOD : ", data);
                            vm.form.address = data.formatted_address;
                            for (let i in places){
                                console.log(places[i]);
                                places[i].types[0] === 'administrative_area_level_2' ? vm.form.district = places[i].long_name : '';
                                places[i].types[0] === 'administrative_area_level_1' ? vm.form.city = places[i].long_name : '';
                                places[i].types[0] === 'country' ? vm.form.country = places[i].long_name : '';
                            }
                            console.log(data.geometry.location.lng, data.geometry.location.lat);
                            vm.form.lng = data.geometry.location.lng;
                            vm.form.lat = data.geometry.location.lat;

                        }, error => {
                            // error callback
                            console.log("Error : ",error)
                        });
                    });
            },
            submit(){
                let vm = this;
                if (!vm.check()) return;
                vm.registerAction(vm.form).then(res => {
                    vm.$router.push('/');
                });

                console.log(this.form);
                vm.clicked()
            },
            check(){
                this.error.name = '';
                this.error.address = '';
                this.error.city = '';
                this.error.district = '';
                this.error.country = '';
                this.valid = true;

                if(!this.form.name){
                    this.error.name = 'Name required';
                    this.valid = false;
                }
                if(!this.form.address){
                    this.error.address = 'Address required';
                    this.valid = false;
                }
                if(!this.form.city){
                    this.error.city = 'City required';
                    this.valid = false;
                }
                if(!this.form.district){
                    this.error.district = 'District required';
                    this.valid = false;
                }
                if(!this.form.country){
                    this.error.country = 'Country required';
                    this.valid = false;
                }

                return this.valid;
            }
        },
        mounted () {
            this.timer = setInterval(() => {
                this.bars.forEach(bar => {
                    bar.value = 25 + (Math.random() * 75)
                })
            }, 2000)
        },
        beforeDestroy () {
            clearInterval(this.timer)
            this.timer = null
        },
        watch: {
            search() {
                let vm = this;
                if (vm.search.length > 0){
                    let vm = this;
                    let key = 'key=AIzaSyDBQYDxw2AAMERTu091lFdb1WWDV2V5GMg';
                    let searchAdd = 'address='+vm.search;
                    let uri = 'https://maps.googleapis.com/maps/api/geocode/json?';
                    let query = uri+''+searchAdd+'&'+key;
                    vm.$http.get(
                        query
                    ).then(response => {
                        // get body data
                        let data = response.data.results[0];
                        let places = data.address_components;
                        console.log("GOOD : ", data);
                        vm.form.address = data.formatted_address;
                        for (let i in places){
                            console.log(places[i]);
                            places[i].types[0] === 'administrative_area_level_2' ? vm.form.district = places[i].long_name : '';
                            places[i].types[0] === 'administrative_area_level_1' ? vm.form.city = places[i].long_name : '';
                            places[i].types[0] === 'country' ? vm.form.country = places[i].long_name : '';
                        }
                        console.log(data.geometry.location.lng, data.geometry.location.lat);
                        vm.form.lng = data.geometry.location.lng;
                        vm.form.lat = data.geometry.location.lat;

                    }, error => {
                        // error callback
                        console.log("Error : ",error)
                    });
                }
            }
        }
    }
</script>
