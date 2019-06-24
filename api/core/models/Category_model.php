<?php  if (!defined('BASEPATH')) exit('No direct script access allowed');

require_once(COREPATH.'libraries/models/App_model.php');

class Category_model extends App_model
{
  function __construct()
  {
    parent::__construct();
    $this->_table = 'categories';
  }
  

  function list_category($fields='*') 
  {

    $fields = "c.id,c.name";

    $this->db->select($fields, FALSE); 

    $this->db->from('categories c');
   
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
        case 'name':
          $this->db->like($key, $value);
        break;
      }
    }
  }

  function get_categories()
  {
    $this->db->select('*'); 
    $query = $this->db->get('categories'); 
    return $query->result_array();
  }

}
?>