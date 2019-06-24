<?php

defined('BASEPATH') OR exit('No direct script access allowed');

require_once(APPPATH."controllers/AppController.php");

Class Variants extends AppController {
	function __construct()
    {
        parent::__construct();
        $this->load->model('variants_model');
    }

    //create a new Variants
    function create_put(){
        
        $output = array();

        try
        {
            $variants_name = $this->put('variants_name');
            $user_id = $this->put('user_id');
            if(!isset($variants_name)){
                throw new Exception("Variants Name should be Blank");                
            }
            
                $ins_data = array();
                $ins_data['variant']  = $variants_name;
                $ins_data['created_id ']  = $user_id;
                $ins_data['created_time']= date("Y-m-d H:i:s");
                $new_user_id              = $this->variants_model->insert($ins_data,"variants");
                $output['category']        = json_encode($ins_data);            
                $output['status']    = 'success';
                $output['message'] = 'Variants Added Successfully';
        }
        catch(Exception $e){
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output); 
    }

  /// Variants Name List ////
    function list_variants_name_post()
    {

        $output = array(); 
        try{
            
            $output['variants']  = $this->variants_model->list_variants_name();
            $output['status']   = 'success';

        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }

 /// Variants Value Create////
    function variants_value_create_put(){
        
        $output = array();

        try
        {
            $variants_id = $this->put('variants_id');
            $variants_value = $this->put('variants_value');
            $short_code = $this->put('short_code');
            $user_id = $this->put('user_id');
            
            if(!isset($variants_value)){
                throw new Exception("Variants Value should be Blank");                
            }

            if(!isset($short_code)){
                throw new Exception("Short Code should be Blank");                
            }
            
                $ins_data = array();
                $ins_data['variant_id']  = $variants_id;
                $ins_data['value']       = $variants_value;
                $ins_data['short_code']  = $short_code;
                $ins_data['created_id '] = $user_id;
                $ins_data['created_time'] = date("Y-m-d H:i:s");
                $new_user_id              = $this->variants_model->insert($ins_data,"variant_value");
                $output['category']        = json_encode($ins_data);            
                $output['status']    = 'success';
                $output['message'] = 'Variants Value Added Successfully';
        }
        catch(Exception $e){
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output); 
    }

    function variantslist_post()
    {

        try{
            
            $this->prepare_listing_params();
            $output = $this->variants_model->list_variants();
            $output['status']   = 'success';

        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }

    function variantsvaluelist_post()
    {

        try{
            
            $this->prepare_listing_params();
            $output = $this->variants_model->list_variants_value();
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
