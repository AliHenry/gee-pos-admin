<template>
      <b-nav-item-dropdown right no-caret>
        <template slot="button-content">
          <img src="~static/img/avatars/6.jpg" class="img-avatar" alt="admin@bootstrapmaster.com">
        </template>
        <b-dropdown-item><i class="fa fa-user"></i> Profile</b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item @click="logout"><i class="fa fa-lock"></i> Logout</b-dropdown-item>
      </b-nav-item-dropdown>
</template>

<script>
  import {mapActions} from 'vuex'
  export default {
    name: 'header-dropdown',
    data: () => {
      return { itemsCount: 42 }
    },
    methods: {
        ...mapActions('authen', {
            logoutAction: 'logout'
        }),
      async logout() {
            let vm = this;
          vm.logoutAction().then(res => {
              this.$router.push('/login')
          }).catch(err => {
              this.formError = err.data
          });
      }
    }
  }
</script>

