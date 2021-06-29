<template>
  <div>
    <nav-bar :username="username" />
    <alert :show="show" :title="title" :variant="variant" />
    <b-container class="mt-5" fluid="sm">
      <div class="d-flex justify-content-center">
        <img alt="Vue logo" src="../../assets/logo.png" />
      </div>
      <b-row class="justify-content-md-center">
        <b-col md="4">
          <b-form @submit="onSubmit">
            <b-form-group label="Correo:" label-for="email">
              <b-form-input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="Ingrese su correo"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Contraseña:" label-for="password">
              <b-form-input
                id="password"
                v-model="form.password"
                placeholder="Ingrese su contraseña"
                type="password"
                required
              ></b-form-input>
            </b-form-group>
            <div class="mt-3 text-center">
              <b-button type="submit" variant="primary"
                >Iniciar sesi&oacute;n</b-button
              >
            </div>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { UserServices } from "../../services";
import Alert from "../../components/Alert";
import NavBar from "../../components/NavBar";
export default {
  components: {
    Alert,
    NavBar
  },
  data() {
    return {
      username: localStorage.getItem("username"),
      form: {
        email: "",
        password: "",
      },
      show: 0,
      title: "",
      variant: ""
    };
  },
  methods: {
    onSubmit(event) {
      this.show = 0;
      event.preventDefault();
      UserServices.login(this.form)
        .then((response) => {
          localStorage.setItem("token", response.data.access_token);
          localStorage.setItem("role", response.data.user.role);
          localStorage.setItem(
            "username",
            (
              response.data.user.name +
              " " +
              response.data.user.lastname
            ).toUpperCase()
          );
          if (response.data.user.role == 1) {
            this.$router.push({ name: "dashboard" });
          } else {
            this.$router.push({ name: "publications" });
          }
        })
        .catch((e) => {
          this.show = 5;
          this.title = "Error al procesar sus datos";
          this.variant = "danger";
          console.log(e);
        });
    },
    session() {
      if (localStorage.getItem("token")) {
        this.$router.push({ name: "publications" });
      }
    },
  },
  created() {
    this.session();
  }
};
</script>