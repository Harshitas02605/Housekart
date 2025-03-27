export default {
    template: `
      <div class="container">
        <h2 class="my-4">{{ isEditing ? 'Update existing service' : 'Add a new service' }}</h2>
        <form @submit.prevent="addService">
          <div class="form-group">
            <label for="name">Service Name</label>
            <input type="text" class="form-control" id="name" v-model="service.name" required>
          </div>
  
          <div class="form-group">
            <label for="description">Description</label>
            <textarea class="form-control" id="description" v-model="service.description" required></textarea>
          </div>

          <div class="form-group">
            <label for="description">Time Required (in hours)</label>
            <input type="number" class="form-control" id="price" v-model="service.time_required" required>
          </div>
  
          <div class="form-group">
            <label for="price">Price</label>
            <input type="number" class="form-control" id="price" v-model="service.price" required>
          </div>
  
          
        </form>
        <button class="btn btn-primary" 
  @click="addService"
  :disabled="!service.name || !service.description || !service.time_required || !service.price">
  {{ isEditing ? 'Update Service' : 'Add Service' }}
</button>

<button class="btn btn-danger" v-if="isEditing" @click="deleteService">Delete Service</button>

  
        <div v-if="message" :class="['alert', messageClass]" class="mt-3">
          {{ message }}
        </div>
      </div>
    `,
        data() {
          return {
            service: {
              name: '',
              description: '',
              price: 0,
              time_required: 0
            },
            authToken: localStorage.getItem('auth-token'),
            isEditing: false,
            editServiceId: null,
            message: '',
            messageClass: '',
          };
        },
        created() {
            const { id, name, description, price, time_required } = this.$route.query;
            if (id) {
              this.service = { id, name, description, price, time_required };
              this.isEditing = true;
              this.editServiceId = id;
            } else {
              this.service = {
                name: '',
                description: '',
                price: null,
                time_required: null
              };
            }
          }
          
          ,
          
      
        methods: {
          async addService() {
            try {
              const method = this.isEditing ? 'PUT' : 'POST';
              const url = this.isEditing 
                ? `/admin_add_service/${this.editServiceId}` 
                : '/admin_add_service';
      
              const res = await fetch(url, {
                method: method,
                headers: {
                  'Content-Type': 'application/json',
                  'Authentication-Token': this.authToken,
                },
                body: JSON.stringify(this.service),
              });
      
              if (res.ok) {
                this.$root.showFlash(this.isEditing ? 'Service updated!' : 'Service added!', 'alert-success');
                this.$router.push('/admin_dashboard');
              } else {
                const errorData = await res.json();
                this.message = errorData.error || 'Operation failed';
                this.messageClass = 'alert-danger';
              }
            } catch (error) {
              console.error('Error:', error);
              this.message = 'An unexpected error occurred';
              this.messageClass = 'alert-danger';
            }
          },
          
      
          async deleteService() {
            
            try {
              const res = await fetch(`/admin_add_service/${this.editServiceId}`, {
                method: 'DELETE',
                headers: {
                  'Authentication-Token': this.authToken,
                },
              });
          
              if (res.ok) {
                this.$root.showFlash('Service deleted!', 'alert-success');
                this.$router.push('/admin_dashboard');
              } else {
                const errorData = await res.json().catch(() => null); 
                this.message = errorData?.error || 'Failed to delete service';
                this.messageClass = 'alert-danger';
              }
            } catch (error) {
              console.error('Error:', error);
              this.message = 'An unexpected error occurred';
              this.messageClass = 'alert-danger';
            }
          }
          
        }
      };
      
  
