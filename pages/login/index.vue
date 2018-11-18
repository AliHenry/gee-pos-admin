<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="8">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body v-if="!outletCheck.status">
                <h1>Login Outlet</h1>
                <p class="text-muted">Sign In to outlet with code</p>
                <b-input-group>
                  <b-input-group-prepend><b-input-group-text><i class="icon-user"></i></b-input-group-text></b-input-group-prepend>
                  <input type="text" class="form-control" v-model="code" placeholder="Outlet Code">
                </b-input-group>
                <b-input-group class="mb-3">
                  <span v-if="status.error" style="color:red">{{ status.error.code[0] }}</span>
                </b-input-group>
                <b-row>
                  <b-col cols="6">
                    <b-button variant="primary" class="px-4" @click.prevent="findOutlet">Login</b-button>
                  </b-col>
                </b-row>
              </b-card-body>
              <b-card-body v-else>
                <b-col class="text-right">
                  <b-button variant="link" class="px-0" @click.prevent="back">Back</b-button>
                </b-col>
                <h1>Login</h1>
                <p class="text-muted">Sign In to your account</p>
                <b-input-group class="mb-3">
                  <b-input-group-prepend><b-input-group-text><i class="icon-user"></i></b-input-group-text></b-input-group-prepend>
                  <input type="text" class="form-control" v-model="form.email" placeholder="Username">
                </b-input-group>
                <b-input-group class="mb-4">
                  <b-input-group-prepend><b-input-group-text><i class="icon-lock"></i></b-input-group-text></b-input-group-prepend>
                  <input type="password" class="form-control" v-model="form.password" placeholder="Password">
                </b-input-group>
                <b-row>
                  <b-col cols="6">
                    <b-button variant="primary" class="px-4" @click="login">Login</b-button>
                  </b-col>
                  <b-col cols="6" class="text-right">
                    <b-button variant="link" class="px-0">Forgot password?</b-button>
                  </b-col>
                </b-row>
              </b-card-body>
            </b-card>
            <b-card no-body class="text-white bg-primary py-5 d-md-down-none" style="width:44%">
              <b-card-body class="text-center">
                <div>
                  <h2>Sign up</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  <nuxt-link to="/register">
                    <b-button variant="primary" class="active mt-3">Register Now!</b-button>
                  </nuxt-link>
                </div>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>


<script>
    import {
        mapState,
        mapGetters,
        mapActions
    } from 'vuex';

    export default {
        name: 'Login',
        layout: 'clean',
        computed: {
            ...mapState('authen', {
                status: 'status',
                isAuthenticated: 'isAuthenticated'
            }),
            ...mapGetters('outlet', {
                outletCheck: 'getCheck',
                status: 'getStatus'
            })
        },
        data() {
            return {
                code: '',
                form: {
                    email: null,
                    password: null,
                    outlet_uuid: ''
                }
            };
        },
        methods: {
            ...mapActions('authen', {
                loginAction: 'login'
            }),
            ...mapActions('outlet', {
                checkOutletAction: 'checkOutlet',
                clearOutletAction: 'clearOutlet'
            }),
            back(){
                let vm = this;
                localStorage.removeItem('outlet');
                vm.clearOutletAction();
            },
            findOutlet(){
                let vm = this;
                this.outletCheck = false;
                vm.checkOutletAction(vm.code)
            },
            async login(e) {
                e.preventDefault();
                let vm = this;
                vm.form.outlet_uuid = vm.outletCheck.outletId;
                this.loginAction(vm.form).then(res => {
                    if (res) {
                        console.log('login done...')
                        vm.$router.push('/');
                    }
                });
            },
            async authenticate(provider) {
                let vm = this;
                this.$auth.loginWith(provider).then(res => {
                    if (res) {
                        vm.close();
                    }
                });
            },
            close() {
                this.$refs.agLoginModal.hide();
            },
            show(){
                this.$refs.agLoginModal.show();
            }
        },
        created(){
            let vm = this;
            this.$root.$on('notLogin', filter => {
                vm.show()
            })
        }
    };
</script>
