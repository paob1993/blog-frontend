<template>
  <div>
    <nav-bar :username="username" />
    <alert :show="show" :title="title" :variant="variant" />
    <b-container v-if="publication" lg="10" class="mt-3">
      <b-row>
        <b-col cols="1" class="text-end" align-self="center">
          <b-button
            @click="getPrevious()"
            variant="light"
            v-b-tooltip.hover
            title="Anterior"
          >
            <b-icon icon="arrow-left-circle" font-scale="3"></b-icon>
          </b-button>
        </b-col>
        <b-col cols="10">
          <b-row>
            <b-col cols="10" style="font-size: 2rem; font-weight: bold">
              {{ publication.title}}
            </b-col>
            <b-col cols="1" class="text-end">
              <b-button
               @click="updateLike(true)"
                variant="light"
                v-b-tooltip.hover
                title="Me gusta"
                class="background-none"
              >
                <b-icon icon="emoji-heart-eyes" font-scale="2"></b-icon>
              </b-button>
            </b-col>
            <b-col cols="1" class="text-start">
              <b-button
               @click="updateLike(false)"
                variant="light"
                v-b-tooltip.hover
                title="Me disgusta"
              >
                <b-icon icon="emoji-angry" font-scale="2"></b-icon>
              </b-button>
            </b-col>
          </b-row>
          <b-row>
            <b-col> 
              {{ publication.publish_date }} 
            </b-col>
          </b-row>
          <b-row class="mt-3 p-3 box">
            <b-col cols="3">
              <b-img :src="publication.image ? publication.image : 'https://placekitten.com/g/300/450'" fluid-grow></b-img>
            </b-col>
            <b-col cols="9" align-self="stretch">
              <b-row>
                {{ publication.content }}
              </b-row>
              <b-row class="mt-5" align-h="end">
                {{ publication.author ? publication.author : 'Anónimo' }}
              </b-row>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="1" align-self="center">
          <b-button
            @click="getNext()"
            variant="light"
            v-b-tooltip.hover
            title="Siguiente"
          >
            <b-icon icon="arrow-right-circle" font-scale="3" class="d-flex justify-content-end"></b-icon>
          </b-button>
        </b-col>
      </b-row>
    </b-container>   
    <div v-else class="d-flex justify-content-center mt-5">
      <h1>Cargando...</h1>
    </div>
  </div>
</template>
<script>
import NavBar from "../../components/NavBar";
import Alert from "../../components/Alert";
import { PublicationServices, InterationServices } from "../../services";
import moment from "moment";
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
          this.publication.publish_date = moment(String(this.publication.publish_date)).format('DD/MM/YYYY');
          if (localStorage.getItem("role") && localStorage.getItem("role") != 1) {
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
        .then(() => {})
        .catch((e) => {
          console.log(e);
        });
    },
    updateLike(reaction) {
      this.show = 0;
      if (localStorage.getItem("role")) {
        if (localStorage.getItem("role") != 1) {
          InterationServices.updateLike({ publication_id: this.publication.id, like: reaction})
            .then(() => {
              this.show = 5;
              this.title = "Su reacción se ha almacenado correctamente";
              this.variant = "success";
            })
            .catch((e) => {
              this.show = 5;
              this.title = "Error al almacenar su reacción";
              this.variant = "danger";
              console.log(e);
            });
        } else {
        this.show = 5;
        this.title = "El administrador no puede reaccionar a las publicaciones.";
        this.variant = "danger";
        }
      } else {
        this.show = 5;
        this.title = "Debes registrarte e iniciar sesión para poder reaccionar a la publicación.";
        this.variant = "info";
      }
    },
    getNext() {
      this.show = 0;
      PublicationServices.getNext(this.publication.id)
        .then((response) => {
          if (response.data.publication != null) {
            this.publication = response.data.publication;
            this.$router.push({ name: 'publication-details', params: { id: this.publication.id } });
            this.publication.publish_date = moment(String(this.publication.publish_date)).format('DD/MM/YYYY');
            if (localStorage.getItem("role") && localStorage.getItem("role") != 1) {
              this.addVisit(this.publication.id);
            }
          } else {
            this.show = 5;
            this.title = response.data.message;
            this.variant = "info";
          }
        })
        .catch((e) => {
          this.show = 5;
          this.title = "Error al almacenar obtener la proxima publicación";
          this.variant = "danger";
          console.log(e);
        });
    },
    getPrevious() {
      this.show = 0;
      PublicationServices.getPrevious(this.publication.id)
        .then((response) => {
          if (response.data.publication != null) {
            this.publication = response.data.publication;
            this.$router.push({ name: 'publication-details', params: { id: this.publication.id } });
            this.publication.publish_date = moment(String(this.publication.publish_date)).format('DD/MM/YYYY');
            if (localStorage.getItem("role") && localStorage.getItem("role") != 1) {
              this.addVisit(this.publication.id);
            }
          } else {
            this.show = 5;
            this.title = response.data.message;
            this.variant = "info";
          }
        })
        .catch((e) => {
          this.show = 5;
          this.title = "Error al almacenar obtener la publicación anterior";
          this.variant = "danger";
          console.log(e);
        });
    }
  },
  created() {
    this.getPublication(this.$route.params.id);
  },
};
</script>
<style scoped>
.box {
  border: 2px solid #9e9e9e5c;
  border-radius: 2rem;
  box-shadow: 3px 4px rgb(0 0 0 / 20%);
}
</style>