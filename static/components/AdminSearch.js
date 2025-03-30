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
  
            <input class="form-control form-control-lg" v-model="searchQuery" type="search" placeholder="search for professional service provider" aria-label="Search">
  
            <div class="input-group-append">
              <button class="btn btn-outline-success btn-lg" type="submit">Search</button>
            </div>
          </div>
        </form>
      </div>

    <h2 v-if="searchresult && searchresult.length" class="container d-flex justify-content-center my-4">Search Results</h2>
<h2 v-else class="my-4 container d-flex justify-content-center">No results to display</h2>
<p v-if="searchresult && searchresult.length" class="my-4 container d-flex justify-content-center" style="color: #FF6392;">Please click on service provider name to view submitted verification document</p>
<table v-if="searchresult && searchresult.length" class="table table-striped">
  <thead>
    <tr>
      <th>Sr No</th>
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
    <tr v-for="(professional, index) in searchresult" :key="index">
      <td>{{ index + 1 }}</td>
      <td>{{ professional.email }}</td>
     <a :href="'/uploads/' + professional.document" target="_blank"><td>{{ professional.full_name }}</td></a>
      <td>{{ professional.age }}</td>
      <td>{{ professional.contact }}</td>
      <td>{{ professional.experience }}</td>
      <td>{{ professional.service_type }}</td>
      <td>{{ professional.service_description }}</td>
      <td>{{ professional.address }}</td>
      <td>{{ professional.pincode }}</td>
      <td>
        <div>
          <button class="btn btn-success" v-if="!professional.active" @click="approveUser(professional.id)">Enable Access</button>
          <button class="btn btn-warning" v-if="!professional.active" @click="rejectUser(professional.id)">Remove</button>
          <button class="btn btn-danger" v-if="professional.active" @click="blockUser(professional.id)">Block</button>
        </div>
      </td>
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
          const index = this.searchresult.findIndex(user => user.id === userId);
          if (index !== -1) {
            this.$set(this.searchresult[index], 'active', true);
          }
        } else {
          const error = await res.json();
          console.error('Error:', error);
        }
      },
      
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
          const index = this.searchresult.findIndex(user => user.id === userId);
          if (index !== -1) {
            this.searchresult.splice(index, 1);
          }
        } else {
          const error = await res.json();
          console.error('Error:', error);
        }
      },
      
      async blockUser(userId) {
        const res = await fetch(`/block_user/user/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': this.authToken
          }
        });
      
        if (res.ok) {
          this.$root.showFlash('User blocked successfully!', 'alert-warning');
          const index = this.searchresult.findIndex(user => user.id === userId);
          if (index !== -1) {
            this.$set(this.searchresult[index], 'active', false);
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
          const index = this.searchresult.findIndex(user => user.id === userId);
          if (index !== -1) {
            this.$set(this.searchresult[index], 'active', true);
          }
        } else {
          const error = await res.json();
          console.error('Error:', error);
        }
      }
      
    }
  };
  