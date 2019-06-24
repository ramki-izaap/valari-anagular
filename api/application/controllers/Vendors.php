<?php

defined('BASEPATH') OR exit('No direct script access allowed');

require_once(APPPATH."controllers/AppController.php");

Class Vendors extends AppController {
    
    
	function __construct()
    {
        parent::__construct();
        $this->load->model('vendors_model');
        $this->load->model('users_model');
        $this->load->library('email_manager');

        $this->_bucket = "inventory-clara";

    }

    
	//update vendor
    function update_post()
    {
        $output = array();

        try
        {
            $user_id       = $this->post('userId');
            $vendor_name   = $this->post('vendorName');
            $store_name    = $this->post('storeName');
            $boutique_name    = $this->post('boutiqueName');
            $email         = $this->post('email');
            $phone_number  = $this->post('phoneNumber');
            $shipping_rate  = $this->post('shippingRate');
            //$return_policy  = $this->post('returnPolicy');
            $return_shipping_rate  = $this->post('returnShippingRate');
            
            // $ret_address1       = $this->post('retaddress1');
            // $ret_address2       = $this->post('retaddress2');
            // $ret_city           = $this->post('retcity');
            // $ret_state          = $this->post('retstate');
            // $ret_country        = $this->post('retcountry');
            // $ret_zip            = $this->post('retzip');
            
            $address1       = $this->post('address1');
            $address2       = $this->post('address2');
            $city           = $this->post('city');
            $state          = $this->post('state');
            $country        = $this->post('country');
            $zip            = $this->post('zip');
            $price_id       = $this->post('priceId');

            if(!isset($user_id)){
                throw new Exception("Invalid user.");                
            }
            if(!isset($boutique_name)){
                throw new Exception("Boutique name is required.");                
            }

            if(!isset($vendor_name)){
                throw new Exception("Vendor name is required.");                
            }
            if(!isset($store_name)){
                throw new Exception("Store name is required.");                
            }
            if(!isset($email)){
                throw new Exception("Email is required.");                
            }
            if(!isset($phone_number)){
                throw new Exception("Phone number is required.");                
            }

            if(!is_dir("./uploads")){
                throw new Exception("Uploads directory doesn't exists");
            }
            
            if(isset($_FILES['fileKey']['tmp_name'])){
                $file_upload  = $this->do_upload();
            }
            
            // if(!isset($address1)){
            //     throw new Exception("Address1 is required.");                
            // }

            // if(!isset($city)){
            //     throw new Exception("City is required.");                
            // }

            // if(!isset($state)){
            //     throw new Exception("State is required.");                
            // }

            // if(!isset($country)){
            //     throw new Exception("Country is required.");                
            // }

            // if(!isset($zip)){
            //     throw new Exception("Zip is required.");                
            // }

            // if(!isset($ret_address1)){
            //     throw new Exception("Return Address1 is required.");                
            // }

            // if(!isset($ret_city)){
            //     throw new Exception("Return City is required.");                
            // }

            // if(!isset($ret_state)){
            //     throw new Exception("Return State is required.");                
            // }

            // if(!isset($ret_country)){
            //     throw new Exception("Return Country is required.");                
            // }

            // if(!isset($ret_zip)){
            //     throw new Exception("Return Zip is required.");                
            // }

            if(!isset($price_id)){
            	throw new Exception("Price is required."); 
            }

            // check if email already exists or not
            $user_data = $this->users_model->get_where(array("email"=> $email))->row_array();
            if(count($user_data) && $user_data['id'] !== $user_id) {
                throw new Exception("Email already exists.");                
            }

            // check if store name already exists or not
            $vendor_data = $this->vendors_model->get_where(array("store_name"=> $store_name))->row_array();
            if(count($vendor_data) && $vendor_data['user_id'] !== $user_id) {
                throw new Exception("Store already exists.");                
            }

            // Start Transaction
            $this->db->trans_begin();

            // Update users table
            $user_data = array();
            $user_data['first_name']  = $vendor_name;
            $user_data['email']       = $email;
            $user_data['updated_id']  =  "0";
            $user_data['updated_time']= date("Y-m-d H:i:s");
            $this->users_model->update(array('id' => $user_id), $user_data);

            $file_name = '';

            if(isset($file_upload['status']) && ( $file_upload['status'] == 'success')){

                $file_name = $file_upload['msg']['file_name'];
                $uri       = "vendors/".$user_id."/".$file_name;
                $this->s3_upload($uri, $_FILES['fileKey']['tmp_name']); 

            }

            // Update address table
            $vendor_data = $this->vendors_model->get_where(array("user_id"=> $user_id))->row_array();
            $address = array();
            $address['address1']    = $address1;
            $address['address2']    = $address2;
            $address['city']        = $city;
            $address['state']       = $state;
            $address['country']     = $country;
            $address['zip']         = $zip;
            $address['updated_id']  =  "0";
            $address['updated_time']= date("Y-m-d H:i:s");
            $this->users_model->update(array('id' => $vendor_data['address_id']), $address, 'address');

            // Update Return address table
            // $ret_address = array();
            // $ret_address['address1']    = $ret_address1;
            // $ret_address['address2']    = $ret_address2;
            // $ret_address['city']        = $ret_city;
            // $ret_address['state']       = $ret_state;
            // $ret_address['country']     = $ret_country;
            // $ret_address['zip']         = $ret_zip;
            // $ret_address['updated_id']  =  "0";
            // $ret_address['updated_time']= date("Y-m-d H:i:s");
            // $this->users_model->update(array('id' => $vendor_data['return_address_id']), $ret_address, 'address');

            // Update Vendors Info
            $vendor_info = array();
            $vendor_info['store_name']     = $store_name;
            $vendor_info['boutique_name']  = $boutique_name;
            $vendor_info['shipping_rate']          = $shipping_rate;
            //$vendor_info['return_policy']  = $return_policy;
            $vendor_info['return_shipping_rate']   = $return_shipping_rate;
            $vendor_info['vendor_price_config_id'] = $price_id;
            $vendor_info['phone_number']           = $phone_number;
            $vendor_info['updated_id']             =  "0";
            $vendor_info['updated_time']           = date("Y-m-d H:i:s");

            if(!empty($file_name)){
                $vendor_info['file_name']   =  $file_name;
            }    
            $this->vendors_model->update(array('user_id' => $user_id), $vendor_info);

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
	
	//create a new vendor
	function create_post(){
    	
        $output = array();

        try
        {
            
            $vendor_name    = $this->post('vendorName');
            $boutique_name  = $this->post('boutiqueName');
            $store_name     = $this->post('storeName');
            $email          = $this->post('email');
            $phone_number   = $this->post('phoneNumber');
            $shipping_rate  = $this->post('shippingRate');
            $address1       = $this->post('address1');
            $address2       = $this->post('address2');
            $city           = $this->post('city');
            $state          = $this->post('state');
            $country        = $this->post('country');
            $zip            = $this->post('zip');
            $price_id       = $this->post('priceId');
            
            if(!isset($boutique_name)){
                throw new Exception("Boutique name is required.");                
            }
            if(!isset($store_name)){
                throw new Exception("Store name is required.");                
            }
            if(!isset($email)){
                throw new Exception("Email is required.");                
            }
            if(!isset($phone_number)){
                throw new Exception("Phone number is required.");                
            }

            if(!isset($price_id)){
            	throw new Exception("Price is required."); 
            }

            // check if email already exists or not
            $user_data = $this->users_model->get_where(array("email"=> $email))->row_array();
            if(count($user_data)) {
                throw new Exception("Email already exists.");                
            }

            // check if store name already exists or not
            $vendor_data = $this->vendors_model->get_where(array("store_name"=> $store_name))->row_array();
            if(count($vendor_data)) {
                throw new Exception("Store already exists.");                
            }

            if(!is_dir("./uploads")){
                throw new Exception("Uploads directory doesn't exists");
            }
            

            if(isset($_FILES['fileKey']['tmp_name'])){
                $file_upload  = $this->do_upload();
            }

            //print_r($file_upload); exit;
            // Start Transaction
            $this->db->trans_begin();

            // Create user entry
            $pass = $this->random_number_generation();
            $user_data = array();
            $user_data['first_name']  = $vendor_name;
            $user_data['email']       = $email;
            $user_data['password']    = md5($pass);
            $user_data['role']        = "V";
            $user_data['created_id']  =  "0";
            $user_data['created_time']= date("Y-m-d H:i:s");
            $user_data['updated_id']  =  "0";
            $user_data['updated_time']= date("Y-m-d H:i:s");

            $new_user_id              = $this->users_model->insert($user_data);

            $file_name = '';

            if(isset($file_upload['status']) && ( $file_upload['status'] == 'success')){

                $file_name = $file_upload['msg']['file_name'];
                $uri       = "vendors/".$new_user_id."/".$file_name;
                $this->s3_upload($uri, $_FILES['fileKey']['tmp_name']); 

            }


            $message = "Hello ".$vendor_name."<br/> Your vendor account has been created successfully and login with below credentials.<br><br>
                <p>Username : ".$email."</p><p>Password : ".$pass."<br><br>Thanks<br>ClaraSunwoo";
            $subject = "ClaraSunwoo - Account Created";
            $send_email              = $this->email_manager->send_email($email,"info@clarasunwoo.com",'','',$subject,$message);
            
            $output['user_id']        = $new_user_id;
            

            if(!(int)$new_user_id) {
                throw new Exception("DB_ERROR");                
            }

            //create address entry
            $address = array();
            $address['type']         = 'V';
            $address['address1']    = $address1;
            $address['address2']    = $address2;
            $address['city']        = $city;
            $address['state']       = $state;
            $address['country']     = $country;
            $address['zip']         = $zip;
            
            //Create Return Address Enrty
            // $ret_address['type']         = 'V';
            // $ret_address['address1']    = $ret_address1;
            // $ret_address['address2']    = $ret_address2;
            // $ret_address['city']        = $ret_city;
            // $ret_address['state']       = $ret_state;
            // $ret_address['country']     = $ret_country;
            // $ret_address['zip']         = $ret_zip;

            $address['created_id']  =  "0";
            $address['updated_id']  =  "0";
            $address['created_time']= date("Y-m-d H:i:s");
            $address['updated_time']= date("Y-m-d H:i:s");

            $address_id = $this->users_model->insert($address, 'address');
            //$return_address_id = $this->users_model->insert($ret_address, 'address');

            if(!(int)$address_id) {
                throw new Exception("DB_ERROR");                
            }

            $vendor_info = array();
            $vendor_info['user_id']     = $new_user_id;
            $vendor_info['store_name']  = $store_name;

            $vendor_info['boutique_name']  = $store_name;
            $vendor_info['address_id']  = $address_id;
            //$vendor_info['return_address_id']  = $return_address_id;
            $vendor_info['vendor_price_config_id'] = $price_id;
            $vendor_info['phone_number']= $phone_number;
            $vendor_info['shipping_rate']= $shipping_rate;
            //$vendor_info['return_policy']= $return_policy;
            //$vendor_info['return_shipping_rate']= $return_shipping_rate;
            $vendor_info['created_id']  =  "0";
            $vendor_info['updated_id']  =  "0";
            $vendor_info['created_time']= date("Y-m-d H:i:s");
            $vendor_info['updated_time']= date("Y-m-d H:i:s");
            if(!empty($file_name)){
                $vendor_info['file_name']   =  $file_name;
            }

            $new_vendor_id = $this->vendors_model->insert($vendor_info);            
            
            if(!(int)$new_vendor_id) {
                throw new Exception("DB_ERROR");                
            }

            if ($this->db->trans_status() === FALSE) {
                throw new Exception("DB_ERROR"); 
            }
            
            $this->db->trans_commit();

            $output['status']    = 'success';            
            $output['vendor_id'] = $new_user_id;
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

    public function s3_upload($uri='',$path='')
    {
        $this->load->library('s3');
        $this->s3->putBucket($this->_bucket);
        $contents = file_get_contents($path);
        $this->s3->putObject($contents, $this->_bucket,$uri);
    }


  public function do_upload()
  {

    $config['upload_path']          = './uploads';
    $config['allowed_types']        = 'pdf';
   // $config['max_size']             = 100000;
   // $config['max_width']            = 280;
   // $config['max_height']           = 425;

    $this->load->library('upload');

    $this->upload->initialize($config);

    if ( ! $this->upload->do_upload('fileKey') )
    {
      $data = array('status' =>'error','msg'=> $this->upload->display_errors());
      //print_r($data); exit;
    }
    else
    {
      $data = array('status' =>'success','msg'=> $this->upload->data());
    }
    return $data;
  }

    //get vendors 
    function list_post()
    {

        try
        { 
            $this->prepare_listing_params();
            $output = $this->vendors_model->list_vendors();
            
            $output['status']   = 'success';
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }

    //Disable vendors
    function vendor_disable_post()
    {
        $output = array();

        try
        {
            $id       = $this->post('id');
            $vendor_info = array();
            $vendor_info['status'] = "Disable";
            $vendor_info['updated_id']  =  "0";
            $vendor_info['updated_time']= date("Y-m-d H:i:s");
            $this->vendors_model->update(array('id' => $id), $vendor_info);
            
            $output['message'] = 'Vendor disabled successfully';
            $output['status']    = 'success';           
            
        }
        catch(Exception $e){
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();

        }

        $this->response($output);
    }

    //Enable vendor
    function vendor_enable_post()
    {
        $output = array();

        try
        {
            $id       = $this->post('id');
            $vendor_info = array();
            $vendor_info['status'] = "Enable";
            $vendor_info['updated_id']  =  "0";
            $vendor_info['updated_time']= date("Y-m-d H:i:s");
            $this->vendors_model->update(array('id' => $id), $vendor_info);
            
            $output['message'] = 'Vendor enabled successfully';
            $output['status']    = 'success';           
            
        }
        catch(Exception $e){
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();

        }

        $this->response($output);
    }

    //delete vendor
    function remove_delete($vendor_id = 0)
    {
        $output['status']    = 'success';

        try
        {
            $data = $this->vendors_model->delete(array("id" => $vendor_id));
            $output['message'] = 'Vendor removed successfully';
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }

    //get vendorInfo 
    function info_get($id = "")
    {
        try
        {
            // $id = $this->get('id')
            $info               = $this->vendors_model->get_vendor($id);
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

    function random_number_generation()
    {
        $this->load->helper('string');
        return random_string('alnum', 6);
    }

    function list_price_config_post()
    {

        $output = array(); 
        try
        {
            $output['vendor_price']  = $this->vendors_model->list_price_config();
            $output['status']   = 'success';
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }


}
