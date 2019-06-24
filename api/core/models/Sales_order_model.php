<?php  if (!defined('BASEPATH')) exit('No direct script access allowed');
require_once(COREPATH.'libraries/models/App_model.php');

class Sales_order_model extends App_model
{
  function __construct()
  {
    parent::__construct();
    $this->_table = 'sales_order';
  }


  function getOrderDetails($so_id = 0) {
    
    $query = "SELECT so.*,u.email
                FROM `sales_order` so 
                JOIN users u ON(u.id=so.customer_id) 
              WHERE so.id=$so_id";

    return $this->db->query($query)->row_array();
  }

  function getOrderItemDetails($so_id = 0)
  { 
    $query = "SELECT soi.*,pv.sku,pv.product_variant_name
                FROM `sales_order` so 
                JOIN sales_order_item soi on(so.id=soi.sales_order_id) 
                JOIN product_variants pv ON(soi.product_variant_id=pv.id)
              WHERE so.id=$so_id";
    return $this->db->query($query)->result_array();
  }

  function getBillingAddress($so_id = 0) {

    $query = "SELECT so.id,a.*
                FROM `sales_order` so 
                JOIN address a ON(a.id=so.billing_address_id) 
              WHERE so.id=$so_id";

    return $this->db->query($query)->row_array();
  }

  function getShippingAddress($so_id = 0) {

    $query = "SELECT so.id,a.*
                FROM `sales_order` so 
                JOIN address a ON(a.id=so.shipping_address_id) 
              WHERE so.id=$so_id";

    return $this->db->query($query)->row_array();
  }

  function updateShippingAddress($so_id = 0, $data='') {

  //  $this->db->join('sales_order', 'address.id = sales_order.shipping_address_id');
  //  $this->db->set($data);
   $this->db->where('id',$so_id);
   $this->db->update('address',$data);
  }
  
  function list_order($fields='*') 
  {
   
   
    $fields = "r.id,r.vendor_id,r.order_status,r.total_amount,r.payment_type,r.created_time,u.first_name";

    $this->db->select($fields, FALSE); 

    $this->db->from('sales_order r');

    $this->db->join("users u","u.id=r.customer_id");

   //for vendor login
   if($this->_CI->role == 'V')
   $this->db->where('r.vendor_id',$this->_CI->user_id);

    $this->prepare_search();

    $this->db->order_by($this->_CI->order_by);
    
    $this->db->limit($this->_CI->per_page, $this->get_offset());

    $query = $this->db->get_compiled_select();

    // die($query);
    return $this->get_lisitng_result($query);

  }

  function prepare_search() 
  {
    foreach ($this->criteria as $key => $value)
    {
      if( strcmp($value, '') === 0 ) continue;

      switch ($key)
      {
        case 'id':
        case 'order_status':
        case 'payment_type':
        case 'first_name':
        case 'created_time':
          $this->db->like($key, $value);
        break;
      }
    }
  }

  public function getData($order_id='')
  {
    $this->db->select("a.*,c.email,b.first_name,b.last_name,b.address1 as address,b.city,b.state,b.country,b.zip");
    $this->db->from('sales_order a');
    $this->db->join('address b','a.shipping_address_id=b.id');
    $this->db->join('users c','a.customer_id=c.id');
    $this->db->where('a.id',$order_id);
    $q = $this->db->get();
    return $q->row_array();
  }

  public function get_sales_item($id){
       $db = & $this->db;
        $db->select("a.*,b.*,pg.file_name,a.quantity as ordered_qty,a.unit_price as ordered_price"); 
        $this->db->from('sales_order_item a');
        $this->db->join('product_variants b','a.product_variant_id=b.id');
        $this->db->join('product_images pg','b.product_id=pg.product_id and FIND_IN_SET(b.id, pg.product_variant_id) and pg.type="I"','left');
        $db->where('a.sales_order_id', $id);
        return $db->get()->result_array(); 
    }

    public function get_vendor_details($id){
      $db = & $this->db;
       $db->select("b.email,a.*");        
       $this->db->from('vendor_info a');
       $this->db->join('users b','a.user_id=b.id');
       $db->where('a.id', $id);
       return $db->get()->row_array(); 
   }

  public function get_address($id){

        $db = & $this->db;
        $db->select("*");        
        $db->where('shipment_id', $id);
        return $db->get('address')->result_array();
    }

    public function get_notes($id,$type){
      $this->db->select('*');
      $this->db->from('notes');
      $this->db->where('order_id', $id);
      $this->db->where('type', $type);
      $this->db->order_by("id", "desc");
      $query = $this->db->get();
      return $query->result_array();
    }
    
  function getAllOrderDetails($vendor_id = 0) 
  {
   
      $fields = "r.id,r.total_amount,r.order_status,r.created_time";

      $this->db->select($fields, FALSE); 

      $this->db->from('sales_order r');

      $this->db->join("sales_order_item s","s.sales_order_id=r.id");

      $this->db->join("product_variants pv","pv.id=s.product_variant_id");

      $this->db->where('r.vendor_id', $vendor_id);

      $this->db->order_by("r.id", "desc");

      $this->db->group_by('s.sales_order_id');

      $this->db->limit(5);  

      $query = $this->db->get();

      return $query->result_array();
  }
  
  
  function getCustomerAddress($customer_id = 0) {
    $fields = 'a.*';
    $this->db->select($fields);
    $this->db->from('sales_order so');
    $this->db->join("address a","a.id=so.shipping_address_id"); 
    $this->db->where('so.customer_id', $customer_id);
    $this->db->group_by('a.id');

    $query = $this->db->get();
    return $query->result_array();
  } 


   function getRefundAmount($so_id = 0) {
    $this->db->select('*');
    $this->db->from('refunds r');
    $this->db->where('r.sales_id', $so_id);
    $query = $this->db->get();
    return $query->row();
  } 

  
    
}
?>