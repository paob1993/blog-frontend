<template>
  <div>
    <alert :show="show" :title="title" :variant="variant" />
    <div class="mt-3 text-end">
      <b-button
        v-b-modal.modal-prevent-closing
        v-b-tooltip.hover
        title="Crear Publicación"
        type="submit"
        variant="outline-dark"
        ><b-icon icon="plus-square"></b-icon
      ></b-button>
    </div>
    <b-table
      :items="publications"
      :fields="fields"
      :per-page="perPage"
      :current-page="currentPage"
      striped
      responsive="sm"
    >
      <template #cell(author)="row">
        {{ row.value ? row.value : "Anónimo" }}
      </template>
      <template #cell(Acciones)="row">
        <b-button
          :to="'/publication/details/' + row.item.id"
          size="sm"
          class="m-1"
          variant="light"
          v-b-tooltip.hover
          title="Visualizar"
        >
          <b-icon variant="dark" icon="eye" font-scale="1"></b-icon>
        </b-button>
        <b-button
          size="sm"
          class="m-1"
          variant="light"
          v-b-tooltip.hover
          title="Editar"
        >
          <b-icon variant="dark" icon="pencil-square" font-scale="1"></b-icon>
        </b-button>
        <b-button
          @click="deletePublication(row.item.id)"
          size="sm"
          class="m-1"
          variant="light"
          v-b-tooltip.hover
          title="Eliminar"
        >
          <b-icon variant="dark" icon="trash" font-scale="1"></b-icon>
        </b-button>
      </template>
    </b-table>
    <b-pagination
      align="center"
      pills
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
    ></b-pagination>

    <div>
      <b-modal
        size="lg"
        id="modal-prevent-closing"
        ref="modal"
        title="Crear Publicacion"
        centered
        @show="resetModal"
        @hidden="resetModal"
        @ok="handleOk"
      >
        <form ref="form" @submit.prevent="handleSubmit">
          <b-form-group
            class="m-2"
            label="Titulo:"
            label-for="title-input"
            invalid-feedback="Titulo requerido"
            :state="titleState"
          >
            <b-form-input
              id="title-input"
              v-model="form.title"
              :state="titleState"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group
            class="m-2"
            label="Contenido:"
            label-for="content-input"
            invalid-feedback="Contenido requerido"
            :state="contentState"
          >
            <b-form-textarea
              id="content-input"
              v-model="form.content"
              :state="contentState"
              rows="8"
              required
            ></b-form-textarea>
          </b-form-group>

          <b-form-group class="m-2" label="Autor:" label-for="author-input">
            <b-form-input
              id="author-input"
              v-model="form.author"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            class="m-2"
            label="Imagen Principal:"
            label-for="image-input"
          >
            <b-form-file
              accept="image/*"
              id="image-input"
              v-model="fileImage"
              plain
            ></b-form-file>
          </b-form-group>
        </form>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { PublicationServices } from "../../services";
import Alert from "../../components/Alert";
export default {
  components: {
    Alert,
  },
  data() {
    return {
      fields: [
        { key: "title", label: "Título" },
        { key: "publish_date", label: "Publicación" },
        { key: "author", label: "Autor" },
        { key: "Acciones" },
      ],
      perPage: 5,
      currentPage: 1,
      total: 0,
      publications: [],
      form: {
        title: "",
        content: "",
        image: "",
        author: "",
      },
      base64Image: null,
      fileImage: null,
      titleState: null,
      contentState: null,
      show: 0,
      title: "",
      variant: "",
    };
  },
  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.titleState = valid;
      this.contentState = valid;
      return valid;
    },
    resetModal() {
      this.form = {
        title: "",
        content: "",
        image: null,
        author: "",
      };
      this.titleState = null;
      this.contentState = null;
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    handleSubmit() {
      if (!this.checkFormValidity()) {
        return;
      }
      this.imageToBase64(this.fileImage);
      this.$nextTick(() => {
        this.$bvModal.hide("modal-prevent-closing");
      });
    },
    imageToBase64(file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.image = reader.result;
        this.show = 0;
        this.savePublication();
      };
      reader.onerror = function (e) {
        console.log("Error: ", e);
      };
    },
    getPublications() {
      PublicationServices.getAll(this.currentPage)
        .then((response) => {
          this.publications = response.data.publications;
          this.currentPage = response.data.page;
          this.total = response.data.total;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    savePublication() {
      PublicationServices.create(this.form)
        .then(() => {
          this.show = 5;
          this.title = "Publicacion creada con exito";
          this.variant = "success";
          this.getPublications();
        })
        .catch((e) => {
          this.show = 5;
          this.title = "Error al borrar el elemento";
          this.variant = "danger";
          console.log(e);
        });
    },
    deletePublication(id) {
      this.show = 0;
      PublicationServices.delete(id)
        .then(() => {
          this.show = 5;
          this.title = "Publicacion eliminada con exito";
          this.variant = "success";
          this.getPublications();
        })
        .catch((e) => {
          this.show = 5;
          this.title = "Error al borrar el elemento";
          this.variant = "danger";
          console.log(e);
        });
    },
    session() {
      if (localStorage.getItem("role") != 1) {
        this.$router.push({ name: "publications" });
      }
    },
  },
  computed: {
    rows() {
      return this.total;
    },
  },
  created() {
    this.getPublications();
    this.session();
  },
};
</script>