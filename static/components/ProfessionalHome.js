export default{
    template: `<div>
    <div>
 <h2 class="my-4">Today's Request</h2>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Serial No</th>
                <th>Customer Name</th>
                <th>Customer Contact</th>
                <th>Customer Address</th>
                <th>Customer Pincode</th>
                <th>Accept or Decline</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(service, index) in open_services" :key="index">
               <td>{{ index + 1 }}</td>
               <td>{{ service.customer_name }}</td>
               <td>{{ service.customer_contact }}</td>
               <td>{{ service.customer_address }}</td>
               <td>{{ service.customer_pincode }}</td>
               <td>
      <div>
        <button class="btn btn-success" @click.prevent="acceptreq(service.id)">Accept</button>
        <button class="btn btn-warning" @click.prevent="deletereq(service.id)">Reject</button>
      </div>
    </td>
    </tr>
            </tbody>
          </table>


          <h2 class="my-4">Current Ongoing Service</h2>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Serial No</th>
                <th>Customer Name</th>
                <th>Customer Address</th>
                <th>Customer Pincode</th>
                <th>Customer Contact</th>
                <th>Close Services</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(service, index) in ongoing_services" :key="index">
               <td>{{ index + 1 }}</td>
               <td>{{ service.customer_name }}</td>
               <td>{{ service.customer_address }}</td>
               <td>{{ service.customer_pincode }}</td>
               <td>{{ service.customer_contact }}</td>
               <td>
      <div>
        <button class="btn btn-info" @click.prevent="closereq(service.id)" >Close Service</button>
      </div>
    </td>
               
    </tr>
            </tbody>
          </table>



<h2 class="my-4">Closed Service</h2>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Serial No</th>
                <th>Customer Name</th>
                <th>Date of request</th>
                <th>Date of completion</th>
                <th>Customer Address</th>
                <th>Customer Pincode</th>
                <th>Customer Contact</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(service, index) in closed_services" :key="index">
               <td>{{ index + 1 }}</td>
               <td>{{ service.customer_name }}</td>
               <td>{{ service.date_of_request }}</td>
               <td>{{ service.date_of_completion }}</td>
               <td>{{ service.customer_address }}</td>
               <td>{{ service.customer_pincode }}</td>
               <td>{{ service.customer_contact }}</td>
               <td>{{ service.remarks }}</td>
               
    </tr>
            </tbody>
          </table>



</div></div>`,
data() {
    return {
      closed_services: [],
      open_services: [],
      ongoing_services: [],
      authToken: localStorage.getItem('auth-token'),
    }
  },

  created() {
    this.getopenservices();
    this.getclosedservices();
    this.getongoingservices();
  },

  methods: {
    async getopenservices() {
      const id = localStorage.getItem('professional_id');
      const res = await fetch(`/get_open_services_for_professionals/${id}`, {
        method: 'GET',
        headers: {
          "Authentication-Token": this.authToken,
          'Content-Type': 'application/json',
        }
      });
      if (res.ok) {
        this.open_services = await res.json();
      } else {
        console.error('Failed to fetch open services');
      }
    },

    async getclosedservices() {
      const id = localStorage.getItem('professional_id');
      const res = await fetch(`/get_closed_services_for_professionals/${id}`, {
        method: 'GET',
        headers: {
          "Authentication-Token": this.authToken,
          'Content-Type': 'application/json',
        }
      });
      if (res.ok) {
        this.closed_services = await res.json();
      } else {
        console.error('Failed to fetch closed services');
      }
    },

    async getongoingservices() {
      const id = localStorage.getItem('professional_id');
      const res = await fetch(`/get_ongoing_services_for_professionals/${id}`, {
        method: 'GET',
        headers: {
          "Authentication-Token": this.authToken,
          'Content-Type': 'application/json',
        }
      });
      if (res.ok) {
        this.ongoing_services = await res.json();
      } else {
        console.error('Failed to fetch ongoing services');
      }
    },

    async closereq(id) {
      console.log(id);
      try {const res = await fetch(`/close_request_from_professional/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authentication-Token': localStorage.getItem('auth-token')
        }
      });
      if (res.ok) {
        this.$root.showFlash('Service closed!', 'alert-info');
        await this.getongoingservices();
        await this.getclosedservices();
      } else {
        const error = await res.json();
        console.error('Error:', error);
      }}
      catch{
        console.log("Something went wrong")
      }
    },

    async deletereq(id) {
      console.log(id);
      const res = await fetch(`/delete_request_from_professional/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authentication-Token': localStorage.getItem('auth-token')
        }
      });
      if (res.ok) {
        this.$root.showFlash('Service rejected!', 'alert-warning');
        await this.getopenservices();
        await this.getongoingservices();
      } else {
        const error = await res.json();
        console.error('Error:', error);
      }
    },

    async acceptreq(id) {
      console.log(id);
      const res = await fetch(`/accept_request_from_professional/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authentication-Token': localStorage.getItem('auth-token')
        }
      });
      if (res.ok) {
        this.$root.showFlash('Service Accepted!', 'alert-success');
        await this.getopenservices();
        await this.getongoingservices();
      } else if (res.status === 400) {
        this.$root.showFlash('You already have one incomplete service request', 'alert-danger');
      } else {
        const error = await res.json();
        console.error('Error:', error);
      }
    }
  }
}