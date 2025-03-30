export default{
    template: `<div><div class="d-flex justify-content-center mt-5">
        <form class="form-inline w-100" style="max-width: 800px;" @submit.prevent="submit">
          <div class="input-group w-100">
            <select class="form-control form-control-lg" v-model="selectedCategory" style="max-width: 150px;">
              <option disabled value="Category">Category</option>
              <option value="address">Location</option>
              <option value="pincode">Pincode</option>
            </select>
  
            <input class="form-control form-control-lg" v-model="searchQuery" type="search" placeholder="Search for closed requests" aria-label="Search">
  
            <div class="input-group-append">
              <button class="btn btn-outline-success btn-lg" type="submit">Search</button>
            </div>
          </div>
        </form>
      </div>
      
      <h5 v-if="searchresult && searchresult.length" class="container d-flex justify-content-center my-4">Search Results</h5>
<h2 v-else class="my-4 container d-flex justify-content-center">No results to display</h2>

<table v-if="searchresult && searchresult.length" class="table table-striped">
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
              <tr v-for="(service, index) in searchresult" :key="index">
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

      </div>`,
    data(){
        return{
            selectedCategory: 'Category',
            searchQuery: '',
            searchresult: [],
            authToken: localStorage.getItem('auth-token'),
            professional_id: localStorage.getItem('professional_id'),
        }
    },
    methods:{
        async submit() {
            if (!this.searchQuery || this.selectedCategory === 'Category') {
                console.error('Invalid search input');
                return;
              }
        
              let url = '';
              if (this.selectedCategory === 'address') {
                url = `/get_searchresult_professional_by_location/${encodeURIComponent(this.professional_id)}/${encodeURIComponent(this.searchQuery)}`;
              }
              else if (this.selectedCategory === 'pincode') {
                url = `/get_searchresult_professional_by_pincode/${encodeURIComponent(this.professional_id)}/${encodeURIComponent(this.searchQuery)}`;
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
                    this.$root.showFlash('No result found!', 'alert-success');
                }
        
                this.searchresult = await response.json();
                console.log('Search Results:', this.searchresult);
              } catch (error) {
                console.error('Error:', error);
              }
          }
    }
}