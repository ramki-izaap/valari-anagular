<?php

defined('BASEPATH') OR exit('No direct script access allowed');

require_once(APPPATH."controllers/AppController.php");

Class Category extends AppController {
	function __construct()
    {
        parent::__construct();
        $this->load->model('category_model');
    }

    //create a new Category
    function create_put(){
        
        $output = array();

        try
        {
            $category_name = $this->put('category_name');
            $user_id = $this->put('user_id');
            if(!isset($category_name)){
                throw new Exception("Category Name should be Blank");                
            }
            
                $ins_data = array();
                $ins_data['name ']  = $category_name;
                $ins_data['created_id ']  = $user_id;
                $ins_data['created_time']= date("Y-m-d H:i:s");
                $new_user_id              = $this->category_model->insert($ins_data,"categories");
                $output['category']        = json_encode($ins_data);            
                $output['status']    = 'success';
                $output['message'] = 'Category Added Successfully';
        }
        catch(Exception $e){
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output); 
    }

     /// Category List ////
     function list_post()
    {

        try
        {
            
            $this->prepare_listing_params();
            $output = $this->category_model->list_category();
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
