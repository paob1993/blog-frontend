<template>
  <div>
    <nav-bar :username="username" />
    <alert :show="show" :title="title" :variant="variant" />
    <b-card
      v-if="publication"
      :img-src="
        publication.image
          ? publication.image
          : 'https://placekitten.com/g/300/450'
      "
      :title="publication.title"
      body-class="text-center"
      img-left
      class="mb-3"
      header-tag="nav"
      style="object-fit: cover;"
      height="200"
    >
      <template #header>
        <b-nav card-header> </b-nav>
      </template>
      <b-card-text>
        {{ publication.content }}
      </b-card-text>
    </b-card>
    <div v-else class="d-flex justify-content-center mt-5">
      <h1>Cargando...</h1>
    </div>
  </div>
</template>
<script>
import NavBar from "../../components/NavBar";
import Alert from "../../components/Alert";
import { PublicationServices, InterationServices } from "../../services";
export default {
  components: {
    NavBar,
    Alert,
  },
  data() {
    return {
      username: localStorage.getItem("username"),
      blog: null,
      id: null,
      publication: null,
      show: 0,
      title: "",
      variant: "",
    };
  },
  methods: {
    getPublication(id) {
      this.show = 0;
      PublicationServices.get(id)
        .then((response) => {
          this.publication = response.data.publication;
          if (localStorage.getItem("role") != 1) {
            this.addVisit(this.$route.params.id);
          }
        })
        .catch((e) => {
          this.show = 5;
          this.title = "Error al obtener los datos";
          this.variant = "danger";
          console.log(e);
        });
    },
    addVisit(id) {
      InterationServices.addVisit({ publication_id: id })
        .then(() => {
          console.log("success");
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  created() {
    this.getPublication(this.$route.params.id);
  },
};
</script>