<template>
  <div>
    <b-container>
      <div class="header-body text-center mt-5">
        <b-row class="justify-content-center">
          <b-col xl="5" lg="6" md="6" class="px-5">
            <h1>Ooops!</h1>
            <p class="text-lead">
              Page not found. Don't worry though, we have plenty of other pages
              to explore
            </p>
          </b-col>
          <div class="mt-3 text-center">
            <b-button to="/" variant="primary">Volver al inicio</b-button>
          </div>
        </b-row>
      </div>
    </b-container>
  </div>
</template>
<script>
export default {
  name: "not-found",
};
</script>
