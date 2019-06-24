<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class App_Controller extends CI_Controller
{
    public $logged_in                  = FALSE;
    public $error_message              =    '';
    public $data                       =    array();
    public $role                       =    0;
    public $init_scripts               = array();
    public $criteria                   = array(); 
    
    
    public function __construct()
    {
        parent::__construct(); 
    
        $this->load->library("form_validation"); 

        $this->load->library("layout");

        $this->data['img_url']=$this->layout->get_img_dir();  

        $this->data['vendor']=$this->db->query("select * from vendors where id='".$this->config->item('vendor_id')."'")->row_array();

        $this->_init_layout();    

    }
    
    protected function _init_layout()
    {
        
        $this->layout->initialize($this->config->item('default', 'layout'));
               
    }


    public function index()
    {
       
    }
    
    public function _ajax_output($data, $json_format = FALSE)
    {
        if(is_array($data) && $json_format)
            echo json_encode($data);
        else 
            echo $data;
        
        exit();
    }
    
    
  
}

?>
