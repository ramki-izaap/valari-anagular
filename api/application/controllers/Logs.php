<?php

defined('BASEPATH') OR exit('No direct script access allowed');

require_once(APPPATH."controllers/AppController.php");

Class Logs extends AppController {
	function __construct()
    {
        parent::__construct();
        $this->load->model('logs_model');
    }
	
    function get_logs_post()
    {
        $output['status'] = "success";
        $id = $this->post('id');
        $type = $this->post('type');
        $fields = "CONCAT(log_type,':',log) as description,created_time as createdTime";
        $output['msg'] = $this->logs_model->get_where(array('log_id'=>$id,'method_type'=>$type),$fields)->result_array();
        $this->response($output);
    }

}

    
