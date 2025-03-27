export default {
    template: `<div>
        <div class="d-flex justify-content-center mt-5">
          <form class="form-inline w-100" style="max-width: 800px;" @submit.prevent="submit">
            <div class="input-group w-100">
              <select class="form-control form-control-lg" v-model="selectedCategory" style="max-width: 150px;">
                <option disabled value="Category">Category</option>
                <option value="address">Location</option>
                <option value="name">Name</option>
                <option value="pincode">Pincode</option>
              </select>
  
              <input class="form-control form-control-lg" v-model="searchQuery" type="search" placeholder="Search" aria-label="Search">
  
              <div class="input-group-append">
                <button class="btn btn-outline-success btn-lg" type="submit">Search</button>
              </div>
            </div>
          </form>
        </div>
  
        <h2 v-if="searchresult.length" class="container d-flex justify-content-center my-4">Search Results</h2>
        <h2 v-else class="my-4 container d-flex justify-content-center">No results to display</h2>
  
        <table v-if="searchresult.length" class="table table-striped">
          <thead>
            <tr>
              <th>Serial No</th>
              <th>Name</th>
              <th>Experience</th>
              <th>Contact</th>
              <th>Detailed Description</th>
              <th>Pincode</th>
              <th>Address</th>
              <th>Book Now</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(professional, index) in searchresult" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ professional.full_name }}</td>
              <td>{{ professional.experience }}</td>
              <td>{{ professional.contact }}</td>
              <td>{{ professional.service_type }}</td>
              <td>{{ professional.service_description }}</td>
              <td>{{ professional.pincode }}</td>
              <td>{{ professional.address }}</td>
              <td><button @click="bookservice(professional)" class="btn btn-info">Book Now</button></td>
            </tr>
          </tbody>
        </table>
      </div>`,
  
    data() {
      return {
        selectedCategory: 'Category',
        searchQuery: '',
        searchresult: [],
        authToken: localStorage.getItem('auth-token'),
        servicerequest: {
          service_id: null,
          customer_id: localStorage.getItem('customer_id'),
          professional_id: null,
          date_of_request: new Date().toISOString().slice(0, 19).replace('T', ' '),
          date_of_completion: null,
          service_status: 'Requested',
          remarks: null
        }
      };
    },
  
    methods: {
      async submit() {
        if (!this.searchQuery || this.selectedCategory === 'Category') {
          console.error('Invalid search input');
          return;
        }
  
        let url = '';
        if (this.selectedCategory === 'address') {
          url = `/get_serviceprofessional_by_location/${encodeURIComponent(this.searchQuery)}`;
        } else if (this.selectedCategory === 'name') {
          url = `/get_serviceprofessional/${encodeURIComponent(this.searchQuery)}`;
        } else if (this.selectedCategory === 'pincode') {
          url = `/get_serviceprofessional_by_pincode/${encodeURIComponent(this.searchQuery)}`;
        }
  
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              "Authentication-Token": this.authToken,
              'Content-Type': 'application/json',
            }
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch search results');
          }
  
          this.searchresult = await response.json();
          console.log('Search Results:', this.searchresult);
        } catch (error) {
          console.error('Error:', error);
        }
      },
  
      async bookservice(professional) {
        if (!professional || !professional.id) {
          console.error('Invalid professional data');
          return;
        }
        console.log(professional.service_id)
        this.servicerequest.service_id = professional.service_id ;
        this.servicerequest.professional_id = professional.id;
        console.log(this.servicerequest)
  
        try {
          const res = await fetch('/api/servicerequest', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token':localStorage.getItem('auth-token')
            },
            body: JSON.stringify(this.servicerequest)
          });
  
          if (res.ok) {
            this.$root.showFlash('Your Service has been booked!', 'alert-success');
          } else {
            const errorData = await res.json();
            this.$root.showFlash(errorData.message || 'Error Occurred!', 'alert-danger');
          }
        } catch (error) {
          console.error('Error during booking:', error);
        }
      }
    }
  }
  