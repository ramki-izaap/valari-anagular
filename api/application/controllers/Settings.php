<?php

defined('BASEPATH') OR exit('No direct script access allowed');

require_once(APPPATH."controllers/AppController.php");

Class Settings extends AppController {


	function __construct()
    {
        parent::__construct();
        $this->load->model('inventory_model');
       
    }
    
    //get all value
    function all_get()
    {
        try
        {
            $output['variants']  = $this->inventory_model->get_variants();
            $output['categories'] = $this->inventory_model->categories_new();
            $output['countries'] = $this->inventory_model->get_countries();
            $output['states']    = $this->inventory_model->get_states();
            $output['status']    = 'success';
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }

}

