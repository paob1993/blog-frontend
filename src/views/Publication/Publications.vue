<template>
  <div>
    <nav-bar :username="username" />
    <div v-if="publications.length > 0" class="m-3">
      <h2 class="text-center">Publicaciones</h2>
      <div v-for="publication in publications" :key="publication.src">
        <b-container class="mt-5" fluid="sm">
          <b-card no-body border-variant="secondary">
            <b-row no-gutters>
              <b-col md="4">
                <b-card-img
                  height="200"
                  v-bind:src="
                    publication.image
                      ? publication.image
                      : 'https://placekitten.com/g/300/450'
                  "
                  alt="Image"
                  style="object-fit: cover"
                ></b-card-img>
              </b-col>
              <b-col md="8">
                <b-card-body v-bind:title="publication.title">
                  <b-card-text>
                    {{ publication.content.slice(0, 100) }}
                    {{ publication.content.length > 100 ? "[...]" : "" }}
                  </b-card-text>
                  <b-button
                    :to="'/publication/details/' + publication.id"
                    variant="primary"
                    >Leer más</b-button
                  >
                </b-card-body>
              </b-col>
            </b-row>
          </b-card>
        </b-container>
      </div>
      <div class="mt-5" v-if="total > publications.length">
        <b-button size="md" @click="getPublications" style="width: 100%" block variant="primary"
          >Cargar más publicaciones</b-button
        >
      </div>
    </div>
    <div v-else class="d-flex justify-content-center mt-5">
      <h2>Cargando...</h2>
    </div>
  </div>
</template>

<script>
import { PublicationServices } from "../../services";
import NavBar from "../../components/NavBar";
export default {
  components: {
    NavBar,
  },
  data() {
    return {
      total: 0,
      page: 1,
      page_title: "Blog",
      publications: [],
      username: localStorage.getItem("username"),
    };
  },
  methods: {
    getPublications() {
      PublicationServices.getAll(this.page)
        .then((response) => {
          this.publications = this.publications.concat(response.data.publications);
          this.total = response.data.total;
          this.page++;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.getPublications();
  },
};
</script>