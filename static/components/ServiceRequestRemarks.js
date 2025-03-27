export default {
  template: `<div>
    <div class="container mt-4">
      <h2 class="mb-4 text-success">Please provide your feedback before closing this service</h2>
      
      <form class="p-4 border rounded shadow-sm bg-light">
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
          <p class="text-primary">{{ formData.date_of_request }}</p>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Remarks</label>
          <textarea v-model="formData.remarks" class="form-control" placeholder="Enter your feedback here..."></textarea>
        </div>

        <button type="submit" @click.prevent="submitForm" class="btn btn-success">Close this Service</button>
      </form>
    </div>
  </div>`,

  data() {
    return {
      formData: {
        remarks:''
      },
      authToken: localStorage.getItem("auth-token"),
      serviceRequestData: {},
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
        throw new Error(`Failed to update service request: ${errorData?.error || 'Unknown error'}`);
      }

      const data = await res.json();
      console.log(data);

      this.formData = { ...data, remarks: data.remarks };

      this.serviceRequestData = {
        id: data.id,
        service_id: data.service_id,
        customer_id: data.customer_id,
        professional_id: data.professional_id,
        date_of_request: data.date_of_request,
        date_of_completion: null,
        service_status: 'Completed',
        remarks: this.formData.remarks
      };

    } catch (error) {
      console.error(error);
    }
  },

  methods: {
    async submitForm() {
      this.serviceRequestData.remarks = this.formData.remarks || "Customer didnt provide any remarks on service"
      this.serviceRequestData.date_of_completion = new Date().toISOString().split('T')[0]
        const res = await fetch('/close_service_request_from_customer', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            "Authentication-Token": this.authToken,
          },
          body: JSON.stringify(this.serviceRequestData)
        });
    
        if (res.ok) {
          this.$root.showFlash('Service closed!', 'alert-info');

        } else {
          const error = await res.json();
          console.error('Error:', error);
        }
      
      this.$router.push('/customer_home');
    }
  }
};
