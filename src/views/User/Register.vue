<template>
  <div>
    <nav-bar :username="username" />
    <alert :show="show" :title="title" :variant="variant" />
    <b-container class="mt-5" fluid="sm">
      <b-row class="justify-content-md-center">
        <b-col md="4">
          <b-card bg-variant="light">
            <b-form @submit="onSubmit">
              <b-form-group
                label-cols-lg="6"
                label="Datos de usuario:"
                label-size="lg"
                label-class="font-weight-bold pt-0"
                class="mb-0"
              >
                <b-form-group
                  label="Nombre:"
                  label-for="name"
                  label-align-sm="right"
                >
                  <b-form-input
                    id="name"
                    v-model="form.name"
                    required
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  label="Apellido:"
                  label-for="lastname"
                  label-cols-sm="6"
                  label-align-sm="right"
                >
                  <b-form-input
                    id="lastname"
                    v-model="form.lastname"
                    required
                  ></b-form-input>
                </b-form-group>

                <b-form-group label="Correo:" label-for="email">
                  <b-form-input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  label="Contraseña:"
                  label-for="password"
                  label-cols-sm="6"
                  label-align-sm="right"
                >
                  <b-form-input
                    id="password"
                    type="password"
                    v-model="form.password"
                    required
                  ></b-form-input>
                </b-form-group>
              </b-form-group>
              <div class="mt-3 text-center">
                <b-button type="submit" variant="primary">Registrarse</b-button>
              </div>
            </b-form>
          </b-card>
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
    NavBar,
  },
  data() {
    return {
      form: {
        name: "",
        lastname: "",
        password: ""
      },
      username: localStorage.getItem("username"),
      show: 0,
      title: "",
      variant: "",
    };
  },
  methods: {
    onSubmit(event) {
      this.show = 0;
      event.preventDefault();
      UserServices.register(this.form)
        .then(() => {
          this.$router.push({ name: "login" });
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
  },
};
</script>