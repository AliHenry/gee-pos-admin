<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6" sm="8">
          <b-card no-body class="mx-4">
            <b-card-body class="p-4">
              <h1>Register</h1>
              <p class="text-muted">Create your account</p>
              <b-input-group class="mb-3">
                <b-input-group-prepend>
                  <b-input-group-text><i class="icon-user"></i></b-input-group-text>
                </b-input-group-prepend>
                <input type="text" v-model="form.name" class="form-control" placeholder="Username">
                <small v-if="error.name" class="form-text text-danger">{{error.name[0]}}</small>
              </b-input-group>

              <b-input-group class="mb-3">
                <b-input-group-prepend>
                  <b-input-group-text>@</b-input-group-text>
                </b-input-group-prepend>
                <input type="text" v-model="form.email" class="form-control" placeholder="Email">
                <small v-if="error.email" class="form-text text-danger">{{error.email[0]}}</small>
              </b-input-group>

              <b-input-group class="mb-3">
                <b-input-group-prepend>
                  <b-input-group-text><i class="icon-lock"></i></b-input-group-text>
                </b-input-group-prepend>
                <input type="password" v-model="form.password" class="form-control" placeholder="Password">
                <small v-if="error.password" class="form-text text-danger">{{error.password[0]}}</small>
              </b-input-group>

              <b-input-group class="mb-2">
                <b-input-group-prepend>
                  <b-input-group-text><i class="icon-lock"></i></b-input-group-text>
                </b-input-group-prepend>
                <input type="password" v-model="form.confirm_password" class="form-control" placeholder="Repeat password">
              </b-input-group>

              <b-button variant="success" @click="register" block>Create Account</b-button>

              <b-input-group class="mb-4">
                <a href="/login" class="mt-5">Login</a>
              </b-input-group>
            </b-card-body>
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
  name: 'Register',
  layout: 'clean',
    data(){
      return {
          form: {
              name: '',
              email: '',
              password: '',
              confirm_password: ''
          },
          valid: true,
          error: {
              name: [],
              email: [],
              password: [],
          }
      }
    },
    methods: {
        ...mapActions('authen', {
            registerAction: 'register'
        }),
        register(e){
            e.preventDefault();
            let vm = this;
            if(!this.checkForm()) return;
            console.log(this.form);
            vm.registerAction(vm.form).then(res => {
                vm.$router.push('/unboarding');
            })
        },
        checkForm() {
            this.error.name = [];
            this.error.email = [];
            this.error.password = [];

            if (!this.form.name) {
                this.error.name.push('Name required.');
                this.valid = false;
            }

            if (!this.form.email) {
                this.error.email.push('Email required.');
                this.valid = false;
            } else if (!this.validEmail(this.form.email)) {
                this.error.email.push('Valid email required.');
                this.valid = false;
            }

            if (!this.form.password) {
                this.error.password.push('Password required.');
                this.valid = false;
            } else if (this.form.password.length < 6) {
                this.error.password.push('Password must more than six characters.');
                this.valid = false;
            }

            if (this.form.confirm_password !== this.form.password) {
                this.error.password.push('Password does not match.');
                this.valid = false;
            }

            return this.valid;
        },
        validEmail: function(email) {
            // email validation
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
    }
}
</script>
