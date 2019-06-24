<?php

defined('BASEPATH') OR exit('No direct script access allowed');

require_once(APPPATH."controllers/AppController.php");

Class Stores extends AppController {
    
	function __construct()
    {
        parent::__construct();
        $this->load->model(array('vendors_model','inventory_model','category_model'));
    }

    
    function index_get($store_name) {

        $output = array('status' => 'success');

        try 
        {
            
            if(!isset($store_name)) {
                throw new Exception('Invalid Input.');                
            }
            
            $store_name = urldecode($store_name);
            
            $data       = $this->vendors_model->get_store_details($store_name);
 
            $categories = $this->category_model->get_categories();

            $variants   = $this->inventory_model->list_variants();

            if(!is_array($data)) {
                throw new Exception('Store does not exist.'); 
            }

            $output['data']       = $data;
            $output['categories'] = $categories;
            $output['variants']   = $variants;

        } 
        catch(Exception $e) {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }
        

        $this->response($output);
    }

    


    

}
