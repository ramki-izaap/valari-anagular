<?php  if (!defined('BASEPATH')) exit('No direct script access allowed');

require_once(COREPATH.'libraries/models/App_model.php');

class Vendors_model extends App_model
{
  function __construct()
  {
    parent::__construct();
    $this->_table = 'vendor_info';
  }
  
  function get_data($id = 0)
  { 

    $fields = "u.email,a.*,v.shipping_rate,
                v.*, 
                pi.api_credentials as paypal_credentials, 
                pi.payment_mode as paypal_payment_mode,
                IF(ad.api_credentials != '', '1', '0') as is_authorize_enabled
                ";
    $this->db->select($fields); 
    $this->db->from('vendor_info v');
    $this->db->join("users u","u.id=v.user_id");
    $this->db->join("address a","a.id=v.address_id");
    $this->db->join("payment_information pi","u.id=pi.vendor_id AND pi.payment_type='paypal'", 'left');
    $this->db->join("payment_information ad","u.id=ad.vendor_id AND ad.payment_type='authorize'", 'left');
    $this->db->where("v.user_id", $id);

    $result = $this->db->get($this->_table)->row_array();
    return $result;
  }

  function get_store_details($store_name = '')
  { 
    $fields = "u.email,a.*,v.shipping_rate,
                v.*, 
                pi.api_credentials as paypal_credentials, 
                pi.payment_mode as paypal_payment_mode,
                IF(ad.api_credentials != '', '1', '0') as is_authorize_enabled
                ";
    $this->db->select($fields); 
    $this->db->from('vendor_info v');
    $this->db->join("users u","u.id=v.user_id");
    $this->db->join("address a","a.id=v.address_id");
    $this->db->join("payment_information pi","u.id=pi.vendor_id AND pi.payment_type='paypal'", 'left');
    $this->db->join("payment_information ad","u.id=ad.vendor_id AND ad.payment_type='authorize'", 'left');
    $this->db->where("v.store_name",$store_name);
    $this->db->where("v.status","Enable");
    $result = $this->db->get($this->_table)->row_array();
    
    return $result;
  }

  function list_vendors($fields='*') 
  {

    $fields = "v.*,u.email, CONCAT(u.first_name, '', u.last_name) as vendor_name,a.state,a.country,v.phone_number";

    $this->db->select($fields, FALSE); 

    $this->db->from('vendor_info v');

    $this->db->join("users u","u.id=v.user_id");
    $this->db->join("address a","v.address_id=a.id");

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
        case 'vendor_name':
          $this->db->like("CONCAT(u.first_name, '',u.last_name)", $value, false);
        break;
        case 'store_name':
        case 'phone_number':
        case 'email':
          $this->db->like($key, $value);
        break;
        case 'date':
          $this->db->where( 'cities.created_time >=', date( 'Y-m-d H:i:s', strtotime( "$value 00:00:00" ) ) );
        break;
      }
    }
  }

  function get_vendor_details($id = 0) {
    $this->db->select("u.email, CONCAT(u.first_name, '', u.last_name) as vendor_name, a.*, v.*"); 
    $this->db->from('vendor_info v');
    $this->db->join("users u","u.id=v.user_id");
    $this->db->join("address a","v.address_id=a.id");
    $this->db->where("v.user_id",$id);

    $result = $this->db->get($this->_table)->row_array();
    return $result;
  }

  function get_customer_details($id = 0) {
    $this->db->select("u.email, CONCAT(u.first_name, '', u.last_name) as vendor_name, a.*"); 
    $this->db->from("users u");
    $this->db->join("address a",".address_id=a.id");
    $this->db->where("u.id",$id);

    $result = $this->db->get($this->_table)->row_array();
    return $result;
  }

  function list_price_config()
  { 
      $this->db->select('*'); 
      $query = $this->db->get('vendor_price_config'); 
      return $query->result_array();
  }


  function get_authorize_data($id = 0) {
    $this->db->select("*"); 
    $this->db->from("payment_information pi");
    $this->db->where("pi.payment_type", 'authorize');
    $this->db->where("pi.vendor_id",$id);

    $result = $this->db->get()->row_array();

    $authorize_data = array();

    if (count($result)) {
      $authorize_data = json_decode($result['api_credentials'], TRUE);
      $authorize_data['payment_mode'] = $result['payment_mode'];
    }

    return $authorize_data;
  }

  function get_paypal_data($id = 0) {
    $this->db->select("*"); 
    $this->db->from("payment_information pi");
    $this->db->where("pi.payment_type", 'paypal');
    $this->db->where("pi.vendor_id",$id);

    $result = $this->db->get()->row_array();

    $authorize_data = array();

    if (count($result)) {
      $authorize_data = json_decode($result['api_credentials'], TRUE);
      $authorize_data['payment_mode'] = $result['payment_mode'];
    }

    return $authorize_data;
  }

  function get_variants_by_skus($v_id = 0, $skus = array())
  {
    $this->db->select('vendor_products.*, pv.sku, pv.product_id');
    $this->db->join("product_variants pv","pv.id=vendor_products.product_variant_id");
    $this->db->where('vendor_id',$v_id);
    $this->db->where_in('pv.sku',$skus);    
    $q = $this->db->get('vendor_products');
    return $q->result_array();
  }

  //
  function get_vendor($id = 0)
  { 

    $this->db->select("u.email, CONCAT(u.first_name, '', u.last_name) as vendor_name, a.*, v.*"); 
    $this->db->from('vendor_info v');
    $this->db->join("users u","u.id=v.user_id");
    $this->db->join("address a","v.address_id=a.id");
    $this->db->where("v.id",$id);
    $result = $this->db->get($this->_table)->row_array();
    return $result;
  }
  
    
}
?>