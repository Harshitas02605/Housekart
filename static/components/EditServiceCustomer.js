export default {
    template: `<div>
      <div class="container mt-4">
  <h2 class="mb-4 text-success">Edit Service request</h2>
  
  <form @submit.prevent="submitForm" class="p-4 border rounded shadow-sm bg-light">
    <div class="mb-3">
          <label class="form-label fw-bold">Customer Name:</label>
          <p class="text-primary">{{ formData.customer_name }}</p>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Professional Name:</label>
          <p class="text-primary">{{ formData.professional_name }}</p>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Professional ID:</label>
          <p class="text-primary">{{ formData.professional_id }}</p>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Service Type:</label>
          <p class="text-primary">{{ formData.service_name }}</p>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Service Time:</label>
          <p class="text-primary">{{ formData.service_time }}</p>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Service Price:</label>
          <p class="text-primary">Rs {{ formData.service_price }}</p>
        </div>

    <div class="mb-3">
      <label class="form-label fw-bold">Date of Request:</label>
      <input v-model="formData.date_of_request" class="form-control" type="date" />
    </div>

    

    <button type="Submit" @click.prevent="editservice" class="btn btn-success">Edit Date</button>
    <button type="Submit" @click.prevent="deleteservice" class="btn btn-danger">Delete Service Request</button>
  </form>
</div>

    </div>`,
  
    data() {
      return {
        formData:{
            customer_name:'',
            professional_name:'',
            professional_id:'',
            service_name:'',
            service_time:'',
            service_price:'',
            date_of_request:''
        },
        authToken: localStorage.getItem("auth-token"),
        id : this.$route.params.serviceid
      };
    },
    async created() {
        const id = this.$route.params.serviceid;
        try {
          const res = await fetch(`/get_service_request_from_customer/${id}`, {
            method: 'GET',
            headers: {
              "Authentication-Token": this.authToken,
              'Content-Type': 'application/json',
            }
          });
    
          if (!res.ok) {
            const errorData = await res.json();
            console.error('Error response:', errorData);
          }
    
          const data = await res.json();
          console.log(data);
    
          this.formData = { ...data };
    
          
    
        } catch (error) {
          console.error(error);
        }
      },
      methods:{
        async editservice(){
            try {
                const res = await fetch(`editservicecustomer/${this.id}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token':localStorage.getItem('auth-token')
                  },
                  body: JSON.stringify(this.formData)
                });
        
                if (res.ok) {
                  this.$root.showFlash('Edit Successful!', 'alert-success');
                  this.$router.push('/customer_home')
                } else {
                  const errorData = await res.json();
                  this.$root.showFlash(errorData.message || 'Error Occurred!', 'alert-danger');
                }
              } catch (error) {
                console.error('Error during editing', error);
              }
        }
        ,
        async deleteservice(){
            console.log();
      const res = await fetch(`/delete_request_from_professional/${this.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authentication-Token': localStorage.getItem('auth-token')
        }
      });
      if (res.ok) {
        this.$root.showFlash('Service Rejected!', 'alert-warning');
        this.$router.push('/customer_home')
      } else {
        const error = await res.json();
        console.error('Error:', error);
      }
        }
      }
   
  };
  