<?php  if (!defined('BASEPATH')) exit('No direct script access allowed');

require_once(COREPATH.'libraries/models/App_model.php');

class Shipping_charge_model extends App_model
{
  function __construct()
  {
    parent::__construct();
    $this->_table = 'shipping_charge';
  }
  

  function list_shipping($fields='*') 
  {

    $fields = "s.id,s.shipping_type,s.shipping_cost,s.shipping_name";

    $this->db->select($fields, FALSE); 

    $this->db->from('shipping_charge s');
   
    $this->prepare_search();
    
    $this->db->order_by($this->_CI->order_by);
    
    $this->db->limit($this->_CI->per_page, $this->get_offset());

    $query = $this->db->get_compiled_select();

    return $this->get_lisitng_result($query);

  }  

  function prepare_search() 
  {
    foreach ($this->criteria as $key => $value)
    {
      if( strcmp($value, '') === 0 ) continue;

      switch ($key)
      {
        case 'shipping_type':
          $this->db->like($key, $value);
        break;
      }
    }
  }


  function get_data($id = 0)
  { 
    
    $this->db->select('*'); 
    $this->db->where("id",$id);
    $result = $this->db->get($this->_table)->row_array();
    
    return $result;
  }
}
?>