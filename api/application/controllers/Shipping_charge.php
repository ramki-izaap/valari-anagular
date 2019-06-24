<?php

defined('BASEPATH') OR exit('No direct script access allowed');

require_once(APPPATH."controllers/AppController.php");

Class Shipping_charge extends AppController {
	function __construct()
    {
        parent::__construct();
        $this->load->model('shipping_charge_model');
    }

     //Shipping List
     function list_post()
    {

        try
        {
            
            // $this->prepare_listing_params();
            $output = $this->shipping_charge_model->list_shipping();
            $output['status']   = 'success';

        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }

    //get Shipping info 
    function info_get($id = "")
    {

        try
        {
            $info               = $this->shipping_charge_model->get_data($id);
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

    //create a new shippingcharge
    function create_put(){
        
        $output = array();

        try
        {
            $shipping_name    = $this->put('shippingName');
            $shipping_type    = $this->put('shippingType');
            $shipping_cost     = $this->put('shippingCost');
             
            if(!isset($shipping_name)){
                throw new Exception("Shipping Name is required.");                
            }
            if(!isset($shipping_type)){
                throw new Exception("Shipping Type is required.");                
            }
            if(!isset($shipping_cost)){
                throw new Exception("Shipping Cost is required.");                
            }
           
            // Start Transaction
            $this->db->trans_begin();

            // Create user entry
            $shipping_data = array();
            $shipping_data['shipping_name']  = $shipping_name;
            $shipping_data['shipping_type']  = $shipping_type;
            $shipping_data['shipping_cost']  = $shipping_cost;
            $shipping_data['created_time']= date("Y-m-d H:i:s");
            $shipping_data['updated_time']= date("Y-m-d H:i:s");

            $new_id              = $this->shipping_charge_model->insert($shipping_data);
            
            if(!(int)$new_id) {
                throw new Exception("DB_ERROR");                
            }

            $this->db->trans_commit();

            $output['status']    = 'success';            
            $output['user_id'] = $new_id;
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

    //update shippingcharge
    function update_post()
    {
        $output = array();

        try
        {
            $user_id       = $this->post('userId');
            $shipping_name    = $this->post('shippingName');
            $shipping_type    = $this->post('shippingType');
            $shipping_cost     = $this->post('shippingCost');
                
            if(!isset($shipping_name)){
                throw new Exception("Shipping Name is required.");                
            }
            if(!isset($shipping_type)){
                throw new Exception("Shipping Type is required.");                
            }
            if(!isset($shipping_cost)){
                throw new Exception("Shipping Cost is required.");                
            }

            
            // Start Transaction
            $this->db->trans_begin();

            // Update users table
            $shipping_data = array();
            $shipping_data['shipping_name']  = $shipping_name;
            $shipping_data['shipping_type']  = $shipping_type;
            $shipping_data['shipping_cost']  = $shipping_cost;
            $shipping_data['created_time']= date("Y-m-d H:i:s");
            $shipping_data['updated_time']= date("Y-m-d H:i:s");

            $this->shipping_charge_model->update(array('id' => $user_id), $shipping_data);

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
    
    function remove_delete($id)
    {
        $output['status']    = 'success';

        try
        {
            $data = $this->shipping_charge_model->delete(array("id" => $id),"shipping_charge");
            $output['message'] = 'Shipping Charge removed successfully';
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }
}
