<template>
  <card :id="'export_' + type + '_' + spec.id" type="export" :res-id="spec.id" :label="spec.label">
    <div class="row align-items-stretch">
      <sub-card label="Data" class="col mx-2">
        <div class="custom-control custom-switch mt-3">
          <input type="checkbox" class="custom-control-input" autocomplete="off"
                 :id="'export_linkset_' + type + '_' + spec.id"
                 v-model="exportLinkset" @change="updateState('export_linkset')"/>
          <label class="custom-control-label" :for="'export_linkset_' + type + '_' + spec.id">
            Linkset
          </label>
        </div>

        <div class="custom-control custom-switch">
          <input type="checkbox" class="custom-control-input" autocomplete="off"
                 :id="'export_links_md_' + type + '_' + spec.id"
                 v-model="exportLinksMd" @change="updateState('export_links_md')"/>
          <label class="custom-control-label" :for="'export_links_md_' + type + '_' + spec.id">
            Links metadata
          </label>
        </div>

        <div class="custom-control custom-switch">
          <input type="checkbox" class="custom-control-input" autocomplete="off"
                 :id="'export_generic_md_' + type + '_' + spec.id"
                 v-model="exportGenericMd" @change="updateState('export_generic_md')"/>
          <label class="custom-control-label" :for="'export_generic_md_' + type + '_' + spec.id">
            Generic metadata
          </label>
        </div>
      </sub-card>

      <sub-card label="Restrictions" class="col mx-2">
        <div class="custom-control custom-switch mt-3">
          <input type="checkbox" class="custom-control-input" autocomplete="off"
                 :id="'export_all_links_' + type + '_' + spec.id"
                 v-model="exportAllLinks" @change="updateState('export_all_links')"/>
          <label class="custom-control-label" :for="'export_all_links_' + type + '_' + spec.id">
            All links
          </label>
        </div>

        <div class="custom-control custom-switch">
          <input type="checkbox" class="custom-control-input" autocomplete="off"
                 :id="'export_validated_links_' + type + '_' + spec.id"
                 v-model="exportValidatedLinks" @change="updateState('export_validated_links')"/>
          <label class="custom-control-label" :for="'export_validated_links_' + type + '_' + spec.id">
            Validated links
          </label>
        </div>

        <div class="custom-control custom-switch">
          <input type="checkbox" class="custom-control-input" autocomplete="off"
                 :id="'export_not_validated_links_' + type + '_' + spec.id"
                 v-model="exportNotValidatedLinks" @change="updateState('export_not_validated_links')"/>
          <label class="custom-control-label" :for="'export_not_validated_links_' + type + '_' + spec.id">
            Not validated links
          </label>
        </div>

        <div class="custom-control custom-switch">
          <input type="checkbox" class="custom-control-input" autocomplete="off"
                 :id="'export_accepted_links_' + type + '_' + spec.id"
                 v-model="exportAcceptedLinks" @change="updateState('export_accepted_links')"/>
          <label class="custom-control-label" :for="'export_accepted_links_' + type + '_' + spec.id">
            Accepted links
          </label>
        </div>

        <div class="custom-control custom-switch">
          <input type="checkbox" class="custom-control-input" autocomplete="off"
                 :id="'export_rejected_links_' + type + '_' + spec.id"
                 v-model="exportRejectedLinks" @change="updateState('export_rejected_links')"/>
          <label class="custom-control-label" :for="'export_rejected_links_' + type + '_' + spec.id">
            Rejected links
          </label>
        </div>
      </sub-card>

      <sub-card label="Format" class="col mx-2">
        <div class="custom-control custom-switch mt-3">
          <input type="checkbox" class="custom-control-input" autocomplete="off"
                 :id="'export_csv_' + type + '_' + spec.id"
                 v-model="exportCSV" @change="updateState('export_csv')"/>
          <label class="custom-control-label" :for="'export_csv_' + type + '_' + spec.id">
            CSV
          </label>
        </div>

        <div class="custom-control custom-switch">
          <input type="checkbox" class="custom-control-input" autocomplete="off"
                 :id="'export_turtle_' + type + '_' + spec.id"
                 v-model="exportTurtle" @change="updateState('export_turtle')"/>
          <label class="custom-control-label" :for="'export_turtle_' + type + '_' + spec.id">
            RDF Turtle
          </label>
        </div>

        <div class="custom-control custom-switch">
          <input type="checkbox" class="custom-control-input" autocomplete="off"
                 :id="'export_trig_' + type + '_' + spec.id"
                 v-model="exportTrig" @change="updateState('export_trig')"/>
          <label class="custom-control-label" :for="'export_trig_' + type + '_' + spec.id">
            RDF TriG
          </label>
        </div>
      </sub-card>

      <sub-card label="RDF reification" class="col mx-2">
        <div class="custom-control custom-switch mt-3">
          <input type="checkbox" class="custom-control-input" autocomplete="off"
                 :id="'export_standard_reif_' + type + '_' + spec.id"
                 v-model="exportStandardReif" @change="updateState('export_standard_reif')"/>
          <label class="custom-control-label" :for="'export_standard_reif_' + type + '_' + spec.id">
            Standard RDF reification
          </label>
        </div>

        <div class="custom-control custom-switch">
          <input type="checkbox" class="custom-control-input" autocomplete="off"
                 :id="'export_rdf_star_reif_' + type + '_' + spec.id"
                 v-model="exportRdfStarReif" @change="updateState('export_rdf_star_reif')"/>
          <label class="custom-control-label" :for="'export_rdf_star_reif_' + type + '_' + spec.id">
            RDF*
          </label>
        </div>

        <div class="custom-control custom-switch">
          <input type="checkbox" class="custom-control-input" autocomplete="off"
                 :id="'export_singleton_reif_' + type + '_' + spec.id"
                 v-model="exportSingletonReif" @change="updateState('export_singleton_reif')"/>
          <label class="custom-control-label" :for="'export_singleton_reif_' + type + '_' + spec.id">
            Singleton
          </label>
        </div>
      </sub-card>
    </div>

    <div class="row justify-content-end align-items-center pt-3 mb-0">
      <div class="col-auto">
        <b-button @click="doExport" variant="info">Export</b-button>
      </div>
    </div>
  </card>
</template>

<script>
    export default {
        name: "Export",
        data() {
            return {
                exportLinkset: false,
                exportLinksMd: false,
                exportGenericMd: false,
                exportAllLinks: false,
                exportValidatedLinks: false,
                exportNotValidatedLinks: false,
                exportAcceptedLinks: false,
                exportRejectedLinks: false,
                exportCSV: false,
                exportTurtle: false,
                exportTrig: false,
                exportStandardReif: false,
                exportRdfStarReif: false,
                exportSingletonReif: false,
            }
        },
        props: {
            type: String,
            spec: Object,
        },
        computed: {
            isLensSpec() {
                return this.type === 'lens';
            },
        },
        methods: {
            updateState(type) {
                switch (type) {
                    case 'export_links_md':
                        if (this.exportLinksMd)
                            this.exportLinkset = true;
                        break;
                    case 'export_all_links':
                        this.exportValidatedLinks = this.exportAllLinks;
                        this.exportNotValidatedLinks = this.exportAllLinks;
                        this.exportAcceptedLinks = this.exportAllLinks;
                        this.exportRejectedLinks = this.exportAllLinks;
                        break;
                    case 'export_validated_links':
                        this.exportAcceptedLinks = this.exportValidatedLinks;
                        this.exportRejectedLinks = this.exportValidatedLinks;
                        this.exportAllLinks = this.exportValidatedLinks && this.exportNotValidatedLinks;
                        break;
                    case 'export_not_validated_links':
                        this.exportAllLinks = this.exportValidatedLinks && this.exportNotValidatedLinks;
                        break;
                    case 'export_accepted_links':
                    case 'export_rejected_links':
                        this.exportValidatedLinks = this.exportAcceptedLinks && this.exportRejectedLinks;
                        break;
                    case 'export_turtle':
                    case 'export_trig':
                        if (!this.exportTurtle && !this.exportTrig) {
                            this.exportStandardReif = false;
                            this.exportRdfStarReif = false;
                            this.exportSingletonReif = false;
                        }
                        break;
                    case 'export_standard_reif':
                    case 'export_rdf_star_reif':
                    case 'export_singleton_reif':
                        if ((this.exportStandardReif || this.exportRdfStarReif || this.exportSingletonReif)
                            && !this.exportTurtle && !this.exportTrig)
                            this.exportTurtle = true;
                        break;
                }
            },

            doExport() {
                // TODO return this.$root.exportCsvLink(this.type, this.spec.id, exportAccepted, exportRejected, exportNotValidated, exportMixed);
            },
        },
    };
</script>
