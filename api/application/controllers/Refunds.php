<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once(APPPATH."controllers/AppController.php");

Class Refunds extends AppController {

	function __construct()
    {
        parent::__construct();
        $this->load->model('refunds_model');
    }
	
    //get vendors 
    function list_post()
    {
        try
        {
            
            $this->prepare_listing_params();
            $output = $this->refunds_model->list_refunds();
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

    


