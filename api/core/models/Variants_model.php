<?php  if (!defined('BASEPATH')) exit('No direct script access allowed');

require_once(COREPATH.'libraries/models/App_model.php');

class Variants_model extends App_model
{
  function __construct()
  {
    parent::__construct();
    $this->_table = 'variants';
  }

  function list_variants_name()
  { 
    $this->db->select('*'); 
    $query = $this->db->get('variants'); 
    return $query->result_array();
  }
  
  function list_variants($fields='*') 
  {

    $fields = "v.id,v.variant,vv.value,vv.short_code,vv.id as vvid";
    
    $this->db->select($fields, FALSE); 

    $this->db->from('variants v');
    
    $this->db->join('variant_value vv','vv.variant_id = v.id');
    
    $this->db->order_by('v.id','desc');
    $this->db->order_by('vv.id','desc');

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
        case 'variant':
        case 'value':
        case 'short_code':
          $this->db->like($key, $value);
        break;
      }
    }
  }

  function list_variants_value($fields='*')
  {
  	 $fields = "vv.id,vv.variant_id as variant_id,vv.value,vv.short_code,v.variant";

    $this->db->select($fields, FALSE); 

    $this->db->from('variant_value vv');
    $this->db->join("variants v","vv.variant_id=v.id");

    $this->prepare_searchs();
    
    $this->db->order_by($this->_CI->order_by);
    
    $this->db->limit($this->_CI->per_page, $this->get_offset());

    $query = $this->db->get_compiled_select();

    return $this->get_lisitng_result($query);
  }

  function prepare_searchs() 
  {
    foreach ($this->criteria as $key => $value)
    {
      if( strcmp($value, '') === 0 ) continue;

      switch ($key)
      {
        case 'variant':
        case 'value':
        case 'short_code':
          $this->db->like($key, $value);
        break;
      }
    }
  }

  function get_variant_shortcodes() {
    $rows = $this->db->get('variant_value')->result_array();
    $variants = array();
    foreach ($rows as $key => $row) {
      $variants[$row['value']] = $row;
    }

    return $variants;
  }

  function get_variant_value_by_shotcode($shotcode){

        $this->db->select("value");
        $this->db->from("variant_value");
        $this->db->where('short_code',$shotcode);
        return $this->db->get()->row_array();
  }

}
?>