<?php  if (!defined('BASEPATH')) exit('No direct script access allowed');
//
require_once(COREPATH.'libraries/models/App_model.php');

class Coupons_model extends App_model
{
    function __construct()
    {
      parent::__construct();
    }

    function list_countries_name()
    { 
      $this->db->select('*'); 
      $query = $this->db->get('country'); 
      return $query->result_array();
    }

    function list_states_name()
    {

      $this->db->select('*');
      $this->db->from('states');
      // $this->db->where('country_code', 'US');
      $query = $this->db->get();
      return $query->result_array();
    }


    function list_coupons($fields='*')
    {
       $fields = "cd.id as id,cd.type,cd.benefit_amt,cd.start_date,cd.end_date,cd.created_time,c.code,c.vendor_id,c.title,cd.discount_type, IF(cd.discount_type='flat', CONCAT('$',cd.benefit_amt), CONCAT(ROUND(cd.benefit_amt), '%')) as benefit_amt";

      $this->db->select($fields, FALSE); 

      $this->db->from('coupon_details cd');
      $this->db->join("coupon c","cd.id=c.coupon_detail_id");

      //for vendor login
      
      if($this->_CI->role == 'V')
      $this->db->where('c.vendor_id',$this->_CI->user_id);

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
          case 'title':
          case 'code':
          case 'type':
          case 'benefit_amt':
          case 'start_date':
          case 'end_date':
          case 'created_time':
            $this->db->like($key, $value);
          break;
        }
      }
    }


    function edit_coupons($id)
    {

      $this->db->select('*,DATE_FORMAT(coupon_details.start_date,"%Y-%m-%d") as c_start_date,DATE_FORMAT(coupon_details.end_date,"%Y-%m-%d") as e_start_date');
      $this->db->from('coupon_details');
      $this->db->join('coupon', 'coupon_details.id = coupon.coupon_detail_id');
      //$this->db->join('country', 'coupon_details.valid_countries = country.id');
      // $this->db->join('states', 'coupon_details.valid_states = states.id');
      $this->db->where('coupon_details.id', $id);
      $query = $this->db->get();
      return $query->row_array();
    }

    function getCouponDetails($code,$state)
    {
      $this->db->select('a.*,b.*');
      $this->db->from('coupon a');
      $this->db->join('coupon_details b','a.coupon_detail_id=b.id');
      // $this->db->join('states c','b.valid_states=c.id');
      $this->db->where('a.code',$code);
      $query = $this->db->get();
      return $query->row_array();
    }
  
}
?>
