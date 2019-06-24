<?php  if (!defined('BASEPATH')) exit('No direct script access allowed');
require_once(COREPATH.'libraries/models/App_model.php');

class Refunds_model extends App_model
{
  function __construct()
  {
    parent::__construct();
    $this->_table = 'refunds';
  }


  function list_refunds($fields='*') 
  {

    $fields = "r.sales_id,r.amount,r.created_date,u.first_name";

    $this->db->select($fields, FALSE); 

    $this->db->from('refunds r');

    $this->db->join("sales_order so","so.id=r.sales_id");
    $this->db->join("users u","u.id=so.customer_id");

    $this->prepare_search();
    
    $this->db->order_by($this->_CI->order_by);
    
    $this->db->limit($this->_CI->per_page, $this->get_offset());

    $query = $this->db->get_compiled_select();
    //die($query);
    return $this->get_lisitng_result($query);

  }

  function prepare_search() 
  {
    foreach ($this->criteria as $key => $value)
    {
      if( strcmp($value, '') === 0 ) continue;

      switch ($key)
      {
        case 'sales_id':
        case 'amount':
        case 'first_name':
        case 'created_date':
          $this->db->like($key, $value);
        break;
      }
    }
  }

  
    
}
?>