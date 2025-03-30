export default {
    template: `
      <div class="container-fluid">
           <div v-if="!asked_service_professional_details.length > 0" class="d-flex justify-content-center">
  <div class="d-flex flex-wrap" style="gap: 10px;">
    <div v-for="(service, index) in services" :key="index" class="card" style="width: 15rem; top: 10px">
      <div class="card-body d-flex flex-column justify-content-between">
        <div>
          <h5 class="card-title">{{ service.name }}</h5>
          <p class="card-text">{{ service.description }}</p>
        </div>
        <a @click.prevent="askservice(service)" class="btn btn-primary">Book Now</a>
      </div>
    </div>
  </div>
</div>


<div v-if="asked_service_professional_details.length > 0">
 <h2 class="my-4 container d-flex justify-content-center">Book A Service for {{ serviceasked.name }} Now (Base Price:- {{ serviceasked.price }} Rs)</h2>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Serial No</th>
                <th>Name</th>
                <th>Experience</th>
                <th>Contact</th>
                <th>Detailed description</th>
                <th>Pincode</th>
                <th>Address</th> 
                <th>Book Now</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(professional, index) in asked_service_professional_details" :key="index">
               <td>{{ index + 1 }}</td>
               <td>{{ professional.full_name}}</td>
               <td>{{ professional.experience }} yrs</td>
               <td>{{ professional.contact }}</td>
               <td>{{ professional.service_description }}</td>
               <td>{{ professional.pincode }}</td>
               <td>{{ professional.address }}</td>
               <td><a @click.prevent="bookservice(professional)" class="btn btn-info">Book Now</a></td>
              </tr>
            </tbody>
          </table>
</div>


  
        <div>
          <h2 class="my-4" v-if="customer_service_requests.length === 0">No Service Requests Found</h2>
<h2 class="my-4 container d-flex justify-content-center" v-else>Service Request Details</h2>
          <table class="table table-striped">
            <thead>
  <tr>
    <th>Serial No</th>
    <th>Date of Request</th>
    <th>Service status</th>
    <th>Professional Name</th>
    <th>Professional's Contact</th>
    <th>Professional's Experience</th>
    <th>Date of Completion</th>
    <th>Action</th>
  </tr>
</thead>
<tbody>
  <tr v-for="(service, index) in customer_service_requests" :key="index">
    <td>{{ index + 1 }}</td>
    <td>{{ service.date_of_request }}</td>
    <td :class="{
      'text-danger': service.service_status === 'Requested',
      'text-success': service.service_status === 'Completed',
      'text-warning': service.service_status === 'Pending'
    }">
      {{ service.service_status }}
    </td>

    <td :class="{'text-danger': !service.professional_name || service.service_status === 'Requested'}">
      {{ service.professional_name || 'Yet to get accepted' }}
    </td>

    <td :class="{'text-danger': !service.professional_contact || service.service_status === 'Requested'}">
      {{ service.professional_contact || 'Yet to get accepted' }}
    </td>

    <td :class="{'text-danger': !service.professional_experience || service.service_status === 'Requested'}">
      {{ service.professional_experience || 'Yet to get accepted' }} yrs
    </td>

    <td v-if="service.service_status==='Requested' " :class="{'text-danger': !service.date_of_completion || service.service_status === 'Requested'}">
      Yet to get accepted
    </td>

    <td v-if="service.service_status==='Pending' " :class="{'text-danger': !service.date_of_completion || service.service_status === 'Requested'}">
      N/A
    </td>

    <td v-if="service.service_status==='Completed' " :class="{'text-danger': !service.date_of_completion || service.service_status === 'Requested'}">
      {{ service.date_of_completion || 'Yet to get accepted'}}
    </td>

    

    <td>
  <button v-if="service.service_status === 'Pending'" class="btn btn-info" @click="closeService(service.id)">
    Close Service
  </button>

  <button v-if="service.service_status === 'Requested'" class="btn btn-warning" @click="editRequest(service.id)">
    Edit and Delete Request
  </button>

  <p v-if="service.service_status === 'Completed'" class="text-danger">
    Closed
  </p>
</td>

  </tr>
</tbody>

          </table>


          
        </div>
      </div>
    `,
    data() {
      return {
        services: [],
        servicerequest: {
          service_id: '',
          customer_id: localStorage.getItem('customer_id'),
          professional_id: null,
          date_of_request: new Date().toISOString().slice(0, 19).replace('T', ' '),
          date_of_completion: null,
          service_status: 'Requested',
          remarks: null
        },
        customer_service_requests: [],
        asked_service_professional_details:[],
        serviceasked:[]
      };
    },
    methods: {
        async bookservice(professional) {
            this.servicerequest.service_id = this.serviceasked.id;
            this.servicerequest.professional_id = professional.id;
            console.log('service',this.servicerequest.service_id)
          
            const res = await fetch('/api/servicerequest', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(this.servicerequest)
            });
          
            if (res.ok) {
              this.$root.showFlash('Your Service has been booked!', 'alert-success');
              this.fetchServiceRequests(); 
              this.asked_service_professional_details=[]
            } else {
              const errorData = await res.json();
              this.$root.showFlash(errorData.message || 'Error Occurred!', 'alert-danger');
            }
          }
          ,
          
          async fetchServiceRequests() {
            try {
              const res = await fetch(`/get_servicerequest_customer/${this.servicerequest.customer_id}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authentication-Token': localStorage.getItem('auth-token')
                }
              });
              const data = await res.json().catch(() => ({ message: 'Invalid response from server' }));
              this.customer_service_requests = data;
              console.log(this.customer_service_requests)
            } catch (error) {
              console.log(error);
            }
          },

          async askservice(service) {
            this.serviceasked = service
            try {
              const res = await fetch(`/get_serviceprofessional/${service.name}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authentication-Token': localStorage.getItem('auth-token')
                }
              });
          
              if (res.ok) {
                const data = await res.json();
                this.asked_service_professional_details = data
                console.log('this this',this.asked_service_professional_details)
              } else {
                const errorData = await res.json();
                
              }
            } catch (error) {
              console.error('Error:', error);
              
            }
          },
          async closeService(id){
            this.$router.push(`/addserviceremarks/${id}`);
          },
          async editRequest(id){
            this.$router.push(`/editservice/${id}`)
          }
         
          
          
    },
    async created() {
      try {
        const response = await fetch('/admin_get_service', { method: 'GET' });
        if (!response.ok) throw new Error('Failed to fetch all services details');
        this.services = await response.json();
      } catch (error) {
        console.error(error);
      }
  
      try {
        const res = await fetch(`/get_servicerequest_customer/${this.servicerequest.customer_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem('auth-token')
          }
        });
      
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            this.customer_service_requests = data;
          } else {
            console.log('Unexpected response:', data);
          }
        } else {
          const error = await res.json();
          console.log('Error:', error.message || 'Failed to fetch data');
        }
      } catch (error) {
        console.log('Network error:', error);
      }
      
    }
  }
  