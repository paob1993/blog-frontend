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
      :per-page="0"
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
          @click="patchValues(row.item)"
          v-b-modal.modal-prevent-closing
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
      :total-rows="total"
      :per-page="perPage"
      @change="changePage($event)"
    ></b-pagination>

    <div>
      <b-modal
        size="lg"
        id="modal-prevent-closing"
        ref="modal"
        title="Crear Publicacion"
        centered
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
      form: {
        title: "",
        content: "",
        image: "",
        author: "",
      },
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
      base64Image: null,
      fileImage: null,
      titleState: null,
      contentState: null,
      show: 0,
      title: "",
      variant: "",
      isEdit: false,
      publicationId: null,
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
      if (this.fileImage) {
        this.imageToBase64(this.fileImage);
      } else {
        if (this.isEdit) {
          this.editPublication();
        } else {
          this.savePublication();
        }
      }
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
        if (this.isEdit) {
          this.editPublication();
        } else {
          this.savePublication();
        }
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
    editPublication() {
      PublicationServices.update(this.publicationId, this.form)
        .then(() => {
          this.show = 5;
          this.title = "Publicacion editada con exito";
          this.variant = "success";
          this.getPublications();
        })
        .catch((e) => {
          this.show = 5;
          this.title = "Error al editar el elemento";
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
    patchValues(publication) {
      this.form = {
        title: publication.title,
        author: publication.author,
        content: publication.content,
        image: publication.image
      };
      this.publicationId = publication.id;
      this.isEdit = true;
    },
    session() {
      if (localStorage.getItem("role") != 1) {
        this.$router.push({ name: "publications" });
      }
    },
    changePage(page) {
      this.currentPage = page;
      this.getPublications();
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