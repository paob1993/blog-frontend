<template>
  <div>
    <b-navbar class="p-4" type="dark" variant="dark">
      <b-navbar-brand to="/">PaoB Blog 😊</b-navbar-brand>
      <b-navbar-nav class="navbar-collapse justify-content-end">
        <div v-if="!username" class="d-flex">
          <b-nav-item to="/publications">Blog</b-nav-item>
          <b-nav-item to="/register">Registro</b-nav-item>
          <b-nav-item to="/login">Iniciar sesi&oacute;n</b-nav-item>
        </div>
        <div v-else class="d-flex">
          <b-nav-item v-if="role == 1" to="/dashboard">Dashboard </b-nav-item>
          <b-nav-item>Hola, {{ username }}</b-nav-item>
          <b-nav-item @click="logout">
            <b-icon icon="box-arrow-right" font-scale="1"></b-icon
          ></b-nav-item>
        </div>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>
<script>
import { UserServices } from "../services";

export default {
  data() {
    return {
      role: localStorage.getItem("role"),
    };
  },
  props: {
    username: String,
  },
  methods: {
    logout() {
      UserServices.logout()
        .then(() => {
          this.$router.push({ name: "login" });
          localStorage.clear();
          this.username = null;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  watch: {
    username: {
      handler(val, oldVal) {
        console.log(val, oldVal);
      },
    },
  },
};
</script>
