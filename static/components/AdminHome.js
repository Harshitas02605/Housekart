export default {
    template: `
      <div>
<br>

<div style="display: flex; justify-content: flex-end;">

  <button v-if="!iswaiting" @click.prevent="getreport" class="btn btn-success">
    Generate a CSV report of Service sequests closed by Service Professionals
  </button>

   <button v-else class="btn btn-warning" disabled>
    Waiting...
  </button>
  
</div>







<div>
      <h2 class="my-4 container d-flex justify-content-center">Services</h2>
<table class="table table-striped">
  <thead>
    <tr>
      <th>Service Name</th>
      <th>Description</th>
      <th>Time Required</th>
      <th>Price</th>
      <th>Edit and Delete</th>      
    </tr>
  </thead>
  <tbody>
    <tr v-for="(service, index) in services" :key="index">
      <td>{{ service.name }}</td>
      <td>{{ service.description }}</td>
      <td>{{ service.time_required }} hours</td>
      <td>{{ service.price }} Rs</td>
      <td>
      <button class="btn btn-warning" @click="editService(service)">Edit and delete service</button>
      </td>
    </tr>
  </tbody>
  <button class="btn btn-primary" @click.prevent="goToAddService">Add Service</button>
</table>
</div>







<div>

        <h2 class="my-4 container d-flex justify-content-center">Consumer Details</h2>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Email</th>
              <th>Full Name</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Pincode</th>
              <th>Action</th>

            </tr>
          </thead>
          <tbody>
            <tr v-for="(user,index) in customers" :key="user.index">
              <td>{{ index + 1 }}</td>
              <td>{{ user.customer.email }}</td>
              <td>{{ user.customer.full_name }}</td>
              <td>{{ user.customer.contact }}</td>
              <td>{{ user.customer.address }}</td>
              <td>{{ user.customer.pincode }}</td>
              <td>
      <div>
        <button class="btn btn-info"  v-if="!user.active" @click="unblockUser(user.id)">Unblock</button>
        <button class="btn btn-danger"  v-if="user.active" @click="blockUser(user.id)">Block</button>
      </div>
    </td>
            </tr>
          </tbody>
        </table>

        </div>
        <br>






        <div >
        <h2 class="my-4 container d-flex justify-content-center">Professional Details</h2>
        <p class="my-4 container d-flex justify-content-center" style="color: #FF6392;">Please click on service provider name to view submitted verification document</p>

        <table class="table table-striped text-nowrap ">
          <thead>
            <tr>
            <th>Sr no</th>
              <th>Email</th>
              <th>Full Name</th>
              <th>Age</th>
              <th>Contact</th>
              <th>Experience</th>
              <th>Service Type</th>
              <th>Service Description</th>
              <th>Address</th>
              <th>Pincode</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
  <tr v-for="(user, index) in professionals" :key="index">
  <td>{{ index + 1 }}</td>  
  <td>{{ user.service_professional.email }}</td>
    <a :href="'/uploads/' + user.service_professional.document" target="_blank"><td>{{ user.service_professional.full_name }}</td></a>
    <td>{{ user.service_professional.age }}</td>
    <td>{{ user.service_professional.contact }}</td>
    <td>{{ user.service_professional.experience }}</td>
    <td>{{ user.service_professional.service_type }}</td>
    <td>{{ user.service_professional.service_description }}</td>
    <td>{{ user.service_professional.address }}</td>
    <td>{{ user.service_professional.pincode }}</td>
    <td>
      <div>
        <button class="btn btn-success" v-if="!user.active" @click="approveUser(user.id)">Enable Access</button>
        <br v-if="!user.active"><button class="btn btn-warning"  v-if="!user.active" @click="rejectUser(user.id)">Remove</button>
        <div>
        </div>
        <button class="btn btn-danger"  v-if="user.active" @click="blockUser(user.id)">Block</button>
      </div>
    </td>
  </tr>
</tbody>

        </table>
        </div>






        <br>
        <div>
        <h2 class="my-4 container d-flex justify-content-center">Service Request Details</h2>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Service Type</th>
              <th>Professional Name</th>
              <th>Customer Name</th>
              <th>Service Status</th>
              <th>Date of Service Request</th>
              <th>Date of Service Completed</th>
              <th>Service Remarks</th>
              
            </tr>
          </thead>
          <tbody>
<tr v-for="(servicerequest, index) in servicerequest" 
    :key="index"
    :class="{
      'text-success': servicerequest.status === 'Completed',
      'text-danger': servicerequest.status === 'Requested',
      'text-warning': servicerequest.status === 'Pending'
    }">    <td>{{ index + 1 }}</td>
    <td>{{ servicerequest.service_name }}</td>
    <td>{{ servicerequest.professional_name }}</td>
    <td>{{ servicerequest.customer_name }}</td>
    <td>{{ servicerequest.status }}</td>
    <td>{{ servicerequest.date_of_request }}</td>
    <td>{{ servicerequest.date_of_completion }}</td>
    <td>{{ servicerequest.remarks }}</td>
    
    
  </tr>
</tbody>

        </table>
      </div>
      </div>
    `,


    data() {
      return {
        services:[],
        users: [],
        authToken: localStorage.getItem('auth-token'),
        customers:[],
        professionals:[],
        servicerequest:[],
        iswaiting : false
      };
    },
    
    created() {
      const userDetailsFetch = fetch('/user_details', {
        method: 'GET',
        headers: {
          "Authentication-Token": this.authToken,
          'Content-Type': 'application/json',
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch user details');
          }
          return response.json();
        })
        .then(data => {
          this.customers = data.filter(user => user.customer !== null);
          this.professionals = data.filter(user => user.service_professional !== null);
        });
    
      const serviceFetch = fetch('/admin_get_service', {
        method: 'GET',
        headers: {
          "Authentication-Token": this.authToken,
          'Content-Type': 'application/json',
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch service details');
          }
          return response.json();
          
        }).then(data => {
          this.services = data;
        });

        const servicerequestFetch= fetch('/get_servicerequest',{
          method: 'GET',
          headers: {
            "Authentication-Token": this.authToken,
            'Content-Type': 'application/json',
          }
        }).then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch service requests details');
          }
          return response.json();
          
        }).then(data => {
          this.servicerequest = data;
          console.log(this.servicerequest)
        });
        
    
      Promise.all([userDetailsFetch, serviceFetch, servicerequestFetch])
        .then(([userData, serviceData]) => {
          console.log('User and Service Data Fetched');
        })
        .catch(error => {
          console.error('Error:', error);
        });
    },
    

    methods: {
      
      async approveUser(userId) {
        const res = await fetch(`/approve_user/user/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': this.authToken
          }
        });
      
        if (res.ok) {
          this.$root.showFlash('Access Granted!', 'alert-success');
      
          let index = this.professionals.findIndex(user => user.id === userId);
          let targetArray = this.professionals;
      
          if (index === -1) {
            index = this.customers.findIndex(user => user.id === userId);
            targetArray = this.customers;
          }
      
          if (index !== -1) {
            this.$set(targetArray[index], 'active', true);
          }
        } else {
          const error = await res.json();
          console.error('Error:', error);
        }
      }
      
          ,


          async rejectUser(userId) {
            const res = await fetch(`/delete_user/user/${userId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authentication-Token': this.authToken
              }
            });
          
            if (res.ok) {
              this.$root.showFlash('User removed successfully!', 'alert-warning');
          
              let index = this.professionals.findIndex(user => user.id === userId);
              let targetArray = this.professionals;
          
              if (index === -1) {
                index = this.customers.findIndex(user => user.id === userId);
                targetArray = this.customers;
              }
          
              if (index !== -1) {
                targetArray.splice(index, 1); 
              }
            } else {
              const error = await res.json();
              console.error('Error:', error);
            }
          }
          
        ,


        async blockUser(userId) {
          const res = await fetch(`/block_user/user/${userId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': this.authToken
            }
          });
        
          if (res.ok) {
            this.$root.showFlash('Professional blocked successfully!', 'alert-warning');
        
            let index = this.professionals.findIndex(user => user.id === userId);
            let targetArray = this.professionals;
        
            if (index === -1) {
              index = this.customers.findIndex(user => user.id === userId);
              targetArray = this.customers;
            }
        
            if (index !== -1) {
              this.$set(targetArray[index], 'active', false);
            }
          } else {
            const error = await res.json();
            console.error('Error:', error);
          }
        },
        async unblockUser(userId) {
          const res = await fetch(`/approve_user/user/${userId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': this.authToken
            }
          });
        
          if (res.ok) {
            this.$root.showFlash('User was unblocked successfully!', 'alert-success');
        
            let index = this.professionals.findIndex(user => user.id === userId);
            let targetArray = this.professionals;
        
            if (index === -1) {
              index = this.customers.findIndex(user => user.id === userId);
              targetArray = this.customers;
            }
        
            if (index !== -1) {
              this.$set(targetArray[index], 'active', true);
            }
          } else {
            const error = await res.json();
            console.error('Error:', error);
          }
    
        },
        goToAddService() {
          this.$router.push('/addservice');
        },
        editService(service) {
          console.log(service)
          this.$router.push({ 
            path: '/addservice', 
            query: { 
              id: service.id, 
              name: service.name,
              description: service.description,
              price: service.price,
              time_required: service.time_required
            }
          });
        },

        async getreport() {
          this.iswaiting = true
          const res = await fetch('/get_professional_closed_service_request')
          const data = await res.json()
          if (res.ok){
            const taskid = data['task_id']
            const intv = setInterval( async ()=>{
              const csv_res = await fetch(`/get_file/${taskid}`)
              if (csv_res.ok){
                this.iswaiting=false
                clearInterval(intv)
                window.location.href = `/get_file/${taskid}`
                alert("File has been downloaded")
              }
            },1000)
          }
        }
        
    }
  };
  