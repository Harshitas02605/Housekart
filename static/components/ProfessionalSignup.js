export default{
    template: `
    <div>
    <form class="container" style="margin-top:10vh">
    <h1>Signup as Professional</h1>

 <div class="form-group">
    <p>Email : {{ professional_signup.email }}</p>
  </div>  

  <div class="form-group">
    <label for="full_name">Full Name</label>
    <input type="text" class="form-control" id="full_name" placeholder="Enter your full name" v-model="professional_signup.full_name">
  </div>

  <div class="form-group">
    <label for="age" min="18" max="65">Age</label>
    <input type="number" class="form-control" id="age" placeholder="Enter your age" v-model="professional_signup.age">
  </div>

  <div class="form-group">
    <label for="contact" min="0000000000" max="9999999999">Contact Number</label>
    <input type="number" class="form-control" id="contact" placeholder="Enter your contact number" v-model="professional_signup.contact">
  </div>

  <div class="form-group">
  <label for="service_type">Service Type</label>
  <select class="form-control" id="service_type" v-model="professional_signup.service_type">
  <option v-for="service in servicedropdown" :key="service.id" :value="service.name">
    {{ service.name }} - {{ service.description }}
  </option>
</select>

</div>


  <div class="form-group">
    <label for="service_description">Service Description</label>
    <textarea class="form-control" id="service_description" rows="3" placeholder="The service description above represents what HouseKart expects for this category. If you offer any specialized services within this category, please describe them in the given space. This is what consumer will get to see while booking a service form you" v-model="professional_signup.service_description"></textarea>
  </div>

  <div class="form-group">
    <label for="experience">Experience</label>
    <input type="text" class="form-control" id="experience" placeholder="Enter your experience (e.g., 5 years)" v-model="professional_signup.experience">
  </div>

  <div>
  <label>Upload Document:</label>
  <input type="file" @change="onFileChange" required />
 </div>


  <div class="form-group">
    <label for="address">Address</label>
    <input type="text" class="form-control" id="address" placeholder="Enter your address" v-model="professional_signup.address">
  </div>

  <div class="form-group">
    <label for="pincode">Pincode</label>
    <input type="text" class="form-control" id="pincode" placeholder="Enter your pincode" v-model="professional_signup.pincode">
  </div>

  <button type="submit" class="btn btn-primary" @click.prevent="createprofessional">Register</button>
</form>
  </div>

`,
data() {
  return {
    professional_signup: {
      email: localStorage.getItem('email'),
      full_name:'',
      age:'',
      contact:'',
      service_type:[],
      service_description:'',
      experience:'',
      document:'',
      address:'',
      pincode:'',
      password: localStorage.getItem('password'),
      user_id:localStorage.getItem('user_id')
   },
   servicedropdown:[],
   file: null,
   user_name: 'sampleUser',
   selectedFile: null
   ,
  }
 },
 async created() {
  try {
    const response = await fetch('/admin_get_service', {
      method: 'GET'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch all services details');
    }
    const data = await response.json();
    this.servicedropdown = data;
    console.log(this.servicedropdown);
  } catch (error) {
    console.error(error);
  }
}
,


 methods: {
  async createprofessional() {
    const formData = new FormData();
  
    // Append form fields
    for (const key in this.professional_signup) {
      formData.append(key, this.professional_signup[key]);
    }
  
    // Append file
    if (this.selectedFile) {
      formData.append('document', this.selectedFile);
    }
  
    try {
      const res = await fetch('/api/serviceprofessional', {
        method: 'POST',
        body: formData,
      });
  
      if (res.ok) {
        this.$root.showFlash('Welcome to HomeKart!', 'alert-success');
        this.$router.push('approval');
      } else {
        const errorData = await res.json();
        this.$root.showFlash(errorData.message || 'Error Occurred!', 'alert-danger');
      }
    } catch (error) {
      console.error(error);
      this.$root.showFlash('Unexpected error occurred!', 'alert-danger');
    }
  },
  
  onFileChange(event) {
    this.selectedFile = event.target.files[0];
  }
  ,
},

  
}