<?php  if (!defined('BASEPATH')) exit('No direct script access allowed');

require_once(COREPATH.'libraries/models/App_model.php');

class Vendor_products_model extends App_model
{
  function __construct()
  {
    parent::__construct();
    $this->_table = 'vendor_products';
  }
  
  function list_orders($fields='*') 
  {

    $fields = "po.id,po.vendor_id,po.order_status,po.total_amount,po.created_date,v.store_name";

    $this->db->select($fields, FALSE); 

    $this->db->from('vendor_products vp');
    $this->db->join("users u","u.id=vp.vendor_id");
    $this->db->join("vendor_info v","v.user_id=u.id");

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
        case 'store_name': 
        case 'order_status':        
          $this->db->like($key, $value);
        break;
        case 'id':       
          $this->db->where('po.id', $value);
        break;
        case 'type':       
          $this->db->where('po.type', $value);
        break;
        case 'is_paid':       
          $this->db->where('po.is_paid', $value);
        break;
        case 'date':
          $this->db->where('po.created_date', date( 'Y-m-d H:i:s', strtotime( "$value 00:00:00" ) ) );
        break;
      }
    }
  }
  
  


}
?>