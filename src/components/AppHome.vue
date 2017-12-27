<template>
  <main>
    <div class="container page-wrapper">
      <div class="row page-wrapper">
        <div v-loading="userProjects.length < 1" class="col-12 d-flex flex-center page-wrapper">
          <div class="projects-panel w-100">
            <div class="row bg-primary text-white">
              <div class="col-12 py-3 d-flex justify-content-between">
                <h3 class="h3 mb-0">
                  Projects
                </h3>
                <el-button @click="addProjectModal = true">
                  Add project
                </el-button>
              </div>
              <div 
                v-for="project in userProjects" 
                :key="project.id"
                @click.self="goToProject(project.id)"
                class="col-12 project-row py-2 d-flex justify-content-between align-center">
                <h3 class="h3 text-primary mb-0">
                  {{project.title}}
                </h3>
                <h5 class="h5 text-gray mb-0"> 
                  {{project.description}}
                </h5>

                <el-button @click="handleDeleteProject(project.id, project.title)" type="danger">
                  Delete Project
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="Add new project" :visible.sync="addProjectModal">
      <el-form v-loading="makingAddRequest" :model="addProjectForm">
        <div class="row">
          <div class="col-12">
            <el-form-item label="Project title">
              <el-input v-model="addProjectForm.title" auto-complete="off"></el-input>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="Project description">
          <el-input v-model="addProjectForm.description" type="textarea"
            :rows="2" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addProjectModal = false">Cancel</el-button>
        <el-button type="primary" @click="handleAddProject">Add Project</el-button>
      </span>
    </el-dialog>
  </main>
</template>

<script>

export default {
  name: 'app-home',
  data () {
    return {
      addProjectModal: false,
      makingAddRequest: false,
      addProjectForm: {
        title: ``,
        description: ``,
        dayLog: []
      }
    }
  },
  computed: {
    userProjects () {
      return this.$store.getters.getUserProjects
    }
  },
  methods: {
    reloadProjectList () {
      this.$store.commit('clearUserProjects')
      this.$store.dispatch('fetchUserProjects')
    },
    goToProject (id) {
      this.$router.push({
        name: 'ViewProject',
        params: {
          id
        }
      })
    },
    handleAddProject () {
      this.makingAddRequest = true
      this.$store.dispatch('addNewProject', this.addProjectForm)
      .then((docRef) => {
        this.$message.success(`Project added with ID (${docRef.id})`)
        this.addProjectModal = false
        this.reloadProjectList()
        this.makingAddRequest = false
      })
      .catch((error) => {
        this.$message.error(`Error adding document: ${error}`)
        this.addProjectModal = false
      })
    },
    handleDeleteProject (id, title) {
      this.$confirm(`Are you sure you wanna delete ${title} ?`)
      .then(() => {
        this.$store.dispatch('deleteProject', {id})
        .then(() => {
          this.$message.success(`Document deleted successfully`)
          this.reloadProjectList()
        })
      })
    }
  },
  mounted () {
    this.reloadProjectList()
  }
}
</script>

<style lang="scss">
@import '../sass/base/vars';

.project-row {
  color: $color-primary;
  max-height: 10rem;
  cursor: pointer;
  background: #e9ecef;
  &:hover {
    background: darken(#e9ecef, 10%)
  }
}
.project-row:nth-child(even) {
  background: #fff;
  &:hover {
    background: darken(#fff, 10%)
  }
}

</style>
