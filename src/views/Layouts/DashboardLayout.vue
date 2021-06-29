<template>
  <div>
    <b-navbar class="p-4" type="dark" variant="dark">
      <div class="h2">
        <b-icon
          class="border rounded p-2"
          variant="light"
          v-b-toggle.sidebar-no-header
          icon="border-width"
        ></b-icon>
      </div>
      <b-navbar-nav class="navbar-collapse justify-content-end">
        <b-nav-item @click="logout">Cerrar sesi&oacute;n</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <b-sidebar
      id="sidebar-no-header"
      aria-labelledby="sidebar-no-header-title"
      no-header
      backdrop
      shadow
    >
      <template #default="{ hide }">
        <div class="p-3">
          <h4 id="sidebar-no-header-title">Paola Brito</h4>
          <p>Mi primera aplicacion con Vue.js! 😊</p>
          <nav class="mb-3">
            <b-nav vertical>
              <b-nav-item to="/dashboard">Publicaciones</b-nav-item>
              <b-nav-item to="/publications">Blog</b-nav-item>
              <b-nav-item to="/statistics">Estadisticas</b-nav-item>
              <b-nav-item @click="logout">Salir</b-nav-item>
            </b-nav>
          </nav>
          <b-button variant="primary" block @click="hide"
            >Cerrar barra lateral</b-button
          >
        </div>
      </template>
    </b-sidebar>
    <b-container class="mt-5" fluid="lg">
      <b-row class="justify-content-md-center">
        <b-col col lg="10">
          <router-view></router-view>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { UserServices } from "../../services";

export default {
  methods: {
    logout() {
      UserServices.logout()
        .then(() => {
          localStorage.clear();
          this.$router.push({ name: "login" });
        })
        .catch((e) => {
          console.log(e);
        });
    },
  }
};
</script>
