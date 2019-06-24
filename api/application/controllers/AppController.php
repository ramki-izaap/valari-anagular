<?php

defined('BASEPATH') OR exit('No direct script access allowed');

require_once(APPPATH."libraries/REST_Controller.php");

Class AppController extends REST_Controller {

    public $error_message   = '';
    public $data           =    array();

    //Listing properties
    public $criteria       =    array();
    public $current_page   =    1;
	public $per_page       =    10;
    public $offset         =    array();
    public $order_by       =    array();
    public $items_count    =    0;
    public $pages_count    =    0;
    public $role           = '';
    public $user_id        = 0;

    function __construct()
    {
        parent::__construct();
    }

    function prepare_listing_params() 
    {
        $this->current_page = (int)$this->post('currentPage');
        $this->per_page     = (int)$this->post('perPage');
        $this->order_by     = $this->post('orderBy');

        $this->role         = $this->post('role');
        $this->user_id      = (int)$this->post('userId');

        $simpleSearch = $this->post('simpleSearch');
        if($simpleSearch)
        {
            if(isset($simpleSearch['selected']) && isset($simpleSearch['value']))
            {
                $this->criteria[$simpleSearch['selected']] = $simpleSearch['value'];
            }
        }
    }




    
	
}
