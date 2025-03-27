export default{
    template: `<form class="container" style="margin-top:10vh">
    <h1>Signup as Customer</h1>
  
  <div class="form-group">
    <p>Email : {{ customer_signup.email }}</p>
  </div>  

  <div class="form-group">
    <label for="customer_full_name">Enter your Full Name</label>
    <input type="text" class="form-control" id="customer_full_name" placeholder="Customer Housekart" v-model="customer_signup.full_name">
  </div>

  <div class="form-group">
    <label for="customer_contact">Contact</label>
    <input type="number" class="form-control" id="customer_contact" placeholder="0000011111" v-model="customer_signup.contact" min="0000000000" max="9999999999">
  </div>

  <div class="form-group">
    <label for="customer_address">Enter your Residential Address</label>
    <input type="text" class="form-control" id="customer_address" placeholder="Chennai" v-model="customer_signup.address">
  </div>

  <div class="form-group">
    <label for="customer_pincode">Enter your Pincode</label>
    <input type="number" class="form-control" id="customer_pincode" placeholder="000000" v-model="customer_signup.pincode"  min="100000" max="999999">
  </div>

  <button type="submit" class="btn btn-primary" @click.prevent='create_customer'>Register</button>
</form>
`,
data() {
  return {
    customer_signup: {
      email: localStorage.getItem('email'),
      password: localStorage.getItem('password'),
      full_name:'',
      contact:'',
      address:'',
      pincode:'',
      user_id: localStorage.getItem('user_id'),
   },
  }
 },
 methods:{
  async create_customer() {
    const res = await fetch('api/customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.customer_signup),
    });
    if (res.ok) {
      
      this.$root.showFlash('Welcome to HouseKart, happy house-karting😊!', 'alert-success');
      localStorage.clear()
      this.$router.push('/user_login');
    } else {
      this.$root.showFlash('Access Denied!', 'alert-danger');
    }
  }
 }      
}