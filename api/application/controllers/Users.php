<?php

defined('BASEPATH') OR exit('No direct script access allowed');

require_once(APPPATH."controllers/AppController.php");

Class Users extends AppController {
    
	function __construct()
    {
        parent::__construct();
        $this->load->model('users_model');
        $this->load->library('email_manager');
    }

    function login_post()
    {
        $output = array();

        try
        {
            $form = $this->post();
            $email     = $form['email'];
            $password   = $form['password'];

            if(!isset($email, $password)){
                throw new Exception("INVALID_INPUT");                
            }
            
            $user = $this->users_model->get_where(array('email' => $email))->row_array();

            if(!count($user)) {
                throw new Exception("User does not exists.");
            }
            
            if($user['password'] !== md5($password)) {
                throw new Exception("Password does not match.");
            }

            $output['status']       = 'success';
            $output['user_info']    =  $user;

        }
        catch(Exception $e){
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }
        $this->response($output);
    }

    //update userinfo
    function profiles_post()
    {
    
        $output = array();

        try
        {
            $email         = $this->post('email');
            $firstname     = $this->post('first_name');
            $lastname      = $this->post('last_name');
            $id            = $this->post('id');

            if(!isset($firstname)){
                throw new Exception("INVALID Firstname");                
            }
            
            if(!isset($lastname)){
                throw new Exception("INVALID Lastname");                
            }

            if(!isset($email)){
                throw new Exception("INVALID Email ");                
            }

            $data = $this->users_model->get_where(array("email"=>$email,"id!=" => $id),'*');
            if( !$data->num_rows() )
            {
               
                $user_data = array();
                $user_data['first_name']  = $firstname;
                $user_data['last_name']   = $lastname;
                $user_data['email']       = $email;
                $user_data['updated_id']  =  $id;
                $user_data['updated_time']= date("Y-m-d H:i:s");

                $this->users_model->update(array("id" => $id),$user_data);
                $output['user_id']        = $id;
                $user = $this->users_model->get_where(array('id' => $id))->row_array();
                $output['user_info']    =  $user;
            }

            $output['status']    = 'success';
           
            $output['message']   = 'Profile updated Succesfully';
        }
        catch(Exception $e){
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);       
    }  
	
	//create a new user
	function profiles_put(){
    	
        
    }

    //get userinfo 
    function profiles_get()
    {

        try
        {
            $output = $this->users_model->get_data()->row_array();
            $output['status']   = 'success';

        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }
    //get Users
    function get_users_get($role ='', $vendor_id = 0)
    {

        try
        {
            if ($role == 'A') {
                $output['users'] = $this->users_model->get_users($role);
            } else {
                $output['users'] = $this->users_model->get_users_by_vendor($vendor_id);
            }
            
            
            $output['status']   = 'success';
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }


        $this->response($output);
    }

    function forgotpassword_get()
    {
        try
        {
            $this->load->library('Email_manager','email_manager');

            $email  = $this->get('email');

            if(!isset($email)){
                throw new Exception("INVALID_INPUT Email");                
            }

            $result = $this->users_model->get_where(array('email' => $email))->row_array();
            
            if(count($result) === 0){
                throw new Exception("Email doesn't exists!"); 
            }
            $link = base_url();
            $link = str_replace('/api', '', $link);

            $link .= "admin/auth/changepassword/".base64_encode($result['id']);

            $this->email_manager->send_forgot_password_mail($email,$link);
            $output['link']   = $link;
            $output['status']   = 'success';
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }

    function change_password_post()
    {

        try
        {
            $id        = $this->post('id');
            $password  = $this->post('password');
           
            if(!isset($id, $password)){
                throw new Exception("INVALID_INPUT");                
            }
            if(!isset($password)){
                throw new Exception("NVALID_INPUT Password.");                
            }
            
            $result = $this->users_model->get_where(array('id' => $id))->row_array();
            
            if(count($result) === 0){
                throw new Exception("User doesn't exists!"); 
            }

            $ins_data = array();
            $ins_data['password'] = md5($password);

            $result = $this->users_model->update(array('id' => $id),$ins_data);

            $output['status']   = 'success';
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }

    //delete userinfo
    function profiles_delete()
    {
        try
        {
            $user_id = $this->delete('user_id');
            $user_id = (int)$user_id;
            if( !$user_id && $user_id !== NULL )
            {
                throw new Exception("Invalid User ID");
            }
            $data = $this->user_model->get_where(array("id"=>$user_id),'id',"users");
            if( !$data->num_rows() )
            {
                throw new Exception("User not found.");
            }
            $this->user_model->delete(array("id"=>$user_id),"users");   
            $output['status'] = "success";
            $output['message'] = "User deleted successfully.";
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }       
    	$this->response($output);
    }

    //get vendor users 
    function list_post()
    {

        try
        { 
            $this->prepare_listing_params();
            $output = $this->users_model->list_users();
            $output['status']   = 'success';
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }

    //get User 
    function info_get($id = "")
    {

        try
        {
            $info               = $this->users_model->get_data($id);
            $output['info']     = $info;
            $output['status']   = 'success';
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }
   
    /*
    function list_post(){

        $output = array();

        $totalElements = 45;
        $size = $this->post('size');
        $pageNumber = $this->post('pageNumber');
        $totalPages  = ceil($totalElements/$size);

        $start = $pageNumber * $size;
        $end = ($start+$size);

        if($end > $totalElements) $end = $totalElements;

        $data = array();
        for($i=$start;$i<$end;$i++){
            $temp = array("name" => "Ethel Price $i", "gender" => "female", "company" => "CCCC", "age" => 44);
            $data[] = $temp;
        }

        
        
        $output['page'] = array('totalElements' => $totalElements, 'totalPages' => $totalPages, 'pageNumber' => $pageNumber, 'size' => $size);
        $output['data'] = $data;

        $this->response($output); 
    }
    */


     public function shipping_settings_post()   
     {
         try
         {
            $shipping_cost  = $this->post('shipping_cost');
            $key            = $this->post('key');
            $user_id        = $this->post('user_id');

            if(!isset($shipping_cost)){
                throw new Exception("INVALID_INPUT Shipping Cost");                
            }
            $where  = array('key' => $key, 'user_id' => $user_id);
            $result = $this->users_model->get_where($where,"*","settings")->row_array();
            
            $ins_data = array();
            $ins_data['value'] = $shipping_cost;

            if(count($result) === 0){
                $ins_data['user_id'] = $user_id;
                $ins_data['key']     = $key;
                $new_shipping_settings= $this->users_model->insert($ins_data,"settings");
            }
            else
            {
                $new_shipping_settings= $this->users_model->update($where,$ins_data,"settings");
            }

            $output['status']   = 'success';
            $output['message']  = 'Shipping Cost Saved Successfully';
         }
         catch(Exception $e){
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
         }

         $this->response($output);
     }

     public function shipping_settings_get()
     {
         try
         {

            $key            = $this->get('key');
            $user_id        = $this->get('user_id');

            if(!isset($user_id)){
                throw new Exception("INVALID_INPUT User ID");                
            }
            $where         = array('key' => $key, 'user_id' => $user_id);
            $shipping_info = $this->users_model->get_where($where,"*","settings")->row_array();
            
            $output['status']   = 'success';
            $output['info']     = $shipping_info;
         }
         catch(Exception $e){
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
         }

         $this->response($output);
     }

     public function get_paymentinfo_get($vendor_id='')
     {
         try
         {
            
            $paypal_info =  $this->users_model->get_where(array("vendor_id"=> $vendor_id,"payment_type"=>"Paypal"),"*","payment_information")->result_array();
            
            $authorize_info =  $this->users_model->get_where(array("vendor_id"=> $vendor_id,"payment_type"=>"Authorize"),"*","payment_information")->result_array();
           
            $array = array();
            $output['paypal']   = ($paypal_info)? $paypal_info[0]:$array;
            $output['authorize']   = ($authorize_info)? $authorize_info[0]:$array;
            $output['status']   = 'success';
         }
         catch(Exception $e){
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
         }

         $this->response($output);
     }

    function create_paypal_post()
    {
    
        $output = array();
        
        try
        {
            $p_email           = $this->post('email');
            $clientid          = $this->post('clientid');
            $username          = $this->post('username');
            $password          = $this->post('password');
            $signature         = $this->post('signature');
            $payment_type      = $this->post('type');
            $vendor_id         = $this->post('vendorID');
            $payment_mode      = "production";

            if(!isset($p_email)){
                throw new Exception("INVALID Email");                
            }
            if(!isset($username)){
                throw new Exception("INVALID Username");                
            }
            if(!isset($password)){
                throw new Exception("INVALID Password");                
            }
            if(!isset($signature)){
                throw new Exception("INVALID Signature");                
            }
            
            // if(!isset($payment_mode)){
            //     throw new Exception("INVALID Payment Mode");                
            // }

            if(!isset($payment_type)){
                throw new Exception("INVALID Payment Type");                
            }

            if($this->post('mode')){
                $payment_mode = $this->post('mode');              
            }


	        $update = array();
            $p= array();
           
            $p['p_email']   =  $p_email;
            $p['clientid']  =  $clientid;
            $p['username']  =  $username;
            $p['password']  =  $password;
            $p['signature'] =  $signature;

            $update['vendor_id']  = $vendor_id;
            $update['api_credentials']  = json_encode($p);
	        $update['payment_mode']   = $payment_mode;
	        $update['payment_type']   = $payment_type;
	        $update['updated_id']  =  $vendor_id;
           

            $chk = $this->users_model->get_where(array("vendor_id"=>$vendor_id,"payment_type"=>"Paypal"),"*","payment_information")->row_array();
            if($chk){

                $update['updated_time']= date("Y-m-d H:i:s");
             $this->users_model->update(array("vendor_id" => $vendor_id,"payment_type"=>"Paypal"),$update,'payment_information');
             $output['message']   = 'Paypal Info updated Succesfully';
            }  
            else
            {
                $update['created_time']= date("Y-m-d H:i:s");
                $update['payment_type'] = "Paypal";
                $output['message']     = 'Paypal Info added Succesfully';
                $this->users_model->insert($update,'payment_information');
            }
	        
            $output['status']    = 'success';
           
           
        }
        catch(Exception $e){
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);       
    } 

    function create_authorize_post()
    {
    
        $output = array();
        
        try
        {
            $api_login_id        = $this->post('api_login_id');
            $api_transaction_key = $this->post('api_transaction_key');
            $payment_type        = $this->post('type');
            $vendor_id           = $this->post('vendorID');
            $payment_mode        = "production";

            if(!isset($api_login_id)){
                throw new Exception("INVALID Api login id");                
            }
            if(!isset($api_transaction_key)){
                throw new Exception("INVALID Api transaction key");                
            }
            
            if(!isset($payment_type)){
                throw new Exception("INVALID Payment Type");                
            }

            if($this->post('mode')){
               $payment_mode = $this->post('mode');               
            }

	        $update = array();
            $a= array();
           
            $a['api_login_id']         =  $api_login_id;
            $a['api_transaction_key']  =  $api_transaction_key;

            $update['vendor_id']       = $vendor_id;
            $update['api_credentials'] = json_encode($a);
	        $update['payment_mode']    = $payment_mode;
	        $update['payment_type']    = $payment_type;
	       
            $chk = $this->users_model->get_where(array("vendor_id"=>$vendor_id,"payment_type"=>'Authorize'),"*","payment_information")->row_array();
            if($chk) {

                 $update['updated_id']  =  $vendor_id;
                 $update['updated_time']= date("Y-m-d H:i:s");
                $this->users_model->update(array("vendor_id" => $vendor_id,"payment_type"=>"Authorize"),$update,'payment_information');
               $output['message']   = 'Authorize Info updated Succesfully';
            }  
            else
            {
                $update['payment_type'] = "Authorize";
                $output['message']   = 'Authorize Info added Succesfully';
                $this->users_model->insert($update,'payment_information');
            }
	        
            $output['status']    = 'success';
           
           
        }
        catch(Exception $e){
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);       
    } 

    //create a new vendor
    function create_put(){
        
        $output = array();

        try
        {
            $first_name    = $this->put('firstName');
            $last_name     = $this->put('lastName');
            $password      = $this->put('password');
            $email         = $this->put('email');
            
            if(!isset($first_name)){
                throw new Exception("First name is required.");                
            }
            if(!isset($last_name)){
                throw new Exception("Last name is required.");                
            }
            if(!isset($password)){
                throw new Exception("Password name is required.");                
            }
            if(!isset($email)){
                throw new Exception("Email is required.");                
            }
            
            //check if email already exists or not
            $user_data = $this->users_model->get_where(array("email"=> $email))->row_array();
            if(count($user_data)) {
                throw new Exception("Email already exists.");                
            }

            // Start Transaction
            $this->db->trans_begin();

            // Create user entry
            $user_data = array();
            $user_data['first_name']  = $first_name;
            $user_data['last_name']  = $last_name;
            $user_data['email']       = $email;
            $user_data['password']    = md5($password);
            $user_data['role']        = "U";
            $user_data['created_id']  =  "0";
            $user_data['created_time']= date("Y-m-d H:i:s");
            $user_data['updated_id']  =  "0";
            $user_data['updated_time']= date("Y-m-d H:i:s");

            $new_user_id              = $this->users_model->insert($user_data);
            $message = "Hello ".$first_name." <br/> Your User account has beed created successfully and login with below credentials.<br><br>
                <p>Username : ".$email."</p><p>Password : ".$password."<br><br>Thanks<br>ClaraSunwoo";
            $subject = "ClaraSunwoo - Account Created";
            $send_email              = $this->email_manager->send_email($email,"info@clarasunwoo.com",'','',$subject,$message);
            
            $output['user_id']        = $new_user_id;
            

            if(!(int)$new_user_id) {
                throw new Exception("DB_ERROR");                
            }

            $this->db->trans_commit();

            $output['status']    = 'success';            
            $output['user_id'] = $new_user_id;
        }
        catch(Exception $e){
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();

            if($e->getMessage() == 'DB_ERROR') {
                $this->db->trans_rollback();
                $output['message'] = "Something went wrong!.";
            }
        }

        $this->response($output); 
    }

    //update User
    function update_post()
    {
        $output = array();

        try
        {
            $user_id       = $this->post('userId');
            $first_name    = $this->post('firstName');
            $last_name     = $this->post('lastName');
            $password      = $this->post('password');
            $email         = $this->post('email');
                
            
            if(!isset($first_name)){
                throw new Exception("First name is required.");                
            }
            if(!isset($last_name)){
                throw new Exception("Last name is required.");                
            }
            if(!isset($password)){
                throw new Exception("Password name is required.");                
            }
            if(!isset($email)){
                throw new Exception("Email is required.");                
            }

            // check if email already exists or not
            $user_data = $this->users_model->get_where(array("email"=> $email))->row_array();
            if(count($user_data) && $user_data['id'] !== $user_id) {
                throw new Exception("Email already exists.");                
            }


            // Start Transaction
            $this->db->trans_begin();

            // Update users table
            $user_data = array();
            $user_data['first_name']  = $first_name;
            $user_data['last_name']  = $last_name;
            $user_data['email']       = $email;
            $user_data['password']    = md5($password);
            $user_data['updated_id']  =  "0";
            $user_data['updated_time']= date("Y-m-d H:i:s");
            $this->users_model->update(array('id' => $user_id), $user_data);

            if ($this->db->trans_status() === FALSE) {
                throw new Exception("DB_ERROR"); 
            }

            $this->db->trans_commit();
            
            $output['status']    = 'success';            
            $output['vendor_id'] = $user_id;
        }
        catch(Exception $e){
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();

            if($e->getMessage() == 'DB_ERROR') {
                $this->db->trans_rollback();
                $output['message'] = "Something went wrong!.";
            }
        }

        $this->response($output);
    } 
    
}
