<?php  if (!defined('BASEPATH')) exit('No direct script access allowed');

require_once(COREPATH.'libraries/models/App_model.php');

class Purchase_model extends App_model
{
  function __construct()
  {
    parent::__construct();
    $this->_table = 'purchase_order';
  }
  
  function list_orders($fields='*') 
  {

    $fields = "po.id,po.vendor_id,po.order_status,po.total_amount,po.created_date,v.store_name";

    $this->db->select($fields, FALSE); 

    $this->db->from('purchase_order po');
    $this->db->join("users u","u.id=po.vendor_id");
    $this->db->join("vendor_info v","v.user_id=u.id");

    //for vendor login
    if($this->_CI->role == 'V')
      $this->db->where('po.vendor_id',$this->_CI->user_id);

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
  
  function get_order_data($order_id){

    $this->db->select("po.*,u.id as customer_id,u.email,CONCAT(u.first_name, ' ', u.last_name) as name,v.store_name,a.address1 store_address,v.phone_number,a.city,a.state,a.country,a.zip"); 
    $this->db->from('purchase_order po');
    $this->db->join("vendor_info v","v.user_id=po.vendor_id");
    $this->db->join("users u","v.user_id=u.id");
    $this->db->join("address a","v.address_id=a.id");
    $this->db->where("po.id",$order_id);

    return $this->db->get()->row_array();

  }

  

  function get_product_variants($products,$order_id){

    $this->db->select('p.id,p.name,p.sku,p.price as prod_price,pi.file_name as product_image,poi.id as poi_id,IF(poi.quantity IS NOT NULL,poi.quantity,"") as quantity,IF(poi.unit_price IS NOT NULL,poi.unit_price,pv.price) as price,pv.id as variant_id,pv.sku as variant_sku,vv.value,vv.short_code,v.variant,v.priority',FALSE); 
    $this->db->from('products p');
    $this->db->join('product_images pi','p.id=pi.product_id','left');
    $this->db->join('product_variants pv','p.id=pv.product_id');
    $this->db->join('purchase_order_item poi','poi.product_id=pv.id AND poi.po_id='.$order_id,'left');
    $this->db->join("product_details pd","pv.id=pd.product_variants_id");
    $this->db->join("variant_value vv","vv.id=pd.variant_value_id");
    $this->db->join("variants v","v.id=vv.variant_id");
    $this->db->where_in("pv.product_id",$products);

    return $this->db->get()->result_array();

  }

  function get_first_level_attributes(){

    $this->db->select('vv.id,vv.value,vv.short_code'); 
    $this->db->from('variants v');
    $this->db->join("variant_value vv","v.id=vv.variant_id");
    $this->db->where("v.priority", 1);
    $this->db->group_by("vv.id");

    return $this->db->get()->result_array();
  }
  
  function product_by_category($where=array()){

    $this->db->select('a.sku as value,a.sku as label'); 
    $this->db->from('products a');
    $this->db->join("category_products b","a.id=b.product_id");
    $this->db->where($where);
    $this->db->group_by("a.id");
    return $this->db->get()->result_array();
  }
  function get_vendors()
  {
    
    $this->db->select('*');
    $this->db->from('users');
    $this->db->where('role=','V');
    $result = $this->db->get()->result_array();
    return $result;
  }

  function get_order_items($id)
  {
    $this->db->select('poi.*,pv.*,pg.file_name,poi.quantity as ordered_qty,poi.unit_price as ordered_price, pv.sku as product_variant_sku'); 
    $this->db->from('purchase_order_item poi');
    $this->db->join('product_variants pv', 'poi.product_variant_id=pv.id');
    $this->db->join('product_images pg','pv.product_id=pg.product_id and FIND_IN_SET(pv.id, pg.product_variant_id) and pg.type="I"','left');
    $this->db->where(array("po_id" => $id));
    $result = $this->db->get()->result_array();
    
    return $result;
  }

  //Delete purchase order where not in 
  function delete_duplicate_items($ids){
      
    $this->db->where_not_in('product_variant_id', $ids);
    $this->db->delete('purchase_order_item');

  }

  function get_order_items_with_vendor_stock($po_id = 0)
  {
    $this->db->select('poi.*,po.vendor_id, IF(vp.quantity <> "NULL",vp.quantity,"NULL") as vendor_stock');
    $this->db->from('purchase_order po'); 
    $this->db->join('purchase_order_item poi', 'po.id=poi.po_id AND po.id='.$po_id);
    $this->db->join('product_variants pv', 'poi.product_variant_id=pv.id');
    $this->db->join('vendor_products vp', 'vp.product_variant_id=pv.id AND vp.vendor_id=po.vendor_id', 'left');
    $result = $this->db->get()->result_array();
    //echo $this->db->last_query();die;
    return $result;
  }


  function get_price_config($vendor_id='')
  {
    $this->db->where('a.user_id',$vendor_id);
    $this->db->select('b.price');
    $this->db->from('vendor_info a');
    $this->db->join('vendor_price_config b','b.id=a.vendor_price_config_id');
    $q = $this->db->get()->row_array();
    return $q['price'];
  }

  function getAllOrderDetails() 
  {
   
      
      $fields = "po.id,po.total_amount,po.order_status,po.created_date";

      $this->db->select($fields, FALSE); 

      $this->db->from('purchase_order po');

      $this->db->join("purchase_order_item poi","poi.po_id=po.id");

      $this->db->join("product_variants pv","pv.id=poi.product_variant_id");

      $this->db->order_by("po.id", "desc");

      $this->db->group_by('poi.po_id');

      $this->db->limit(5);

      $query = $this->db->get();

      return $query->result_array();
  }

  function get_vendor_items($id)
  {
    $this->db->select('vp.*,pv.*,pg.file_name,vp.quantity as ordered_qty,vp.price as ordered_price, pv.sku as product_variant_sku'); 
    $this->db->from('vendor_products vp');
    $this->db->join('product_variants pv', 'vp.product_variant_id=pv.id');
    $this->db->join('product_images pg','pv.product_id=pg.product_id and FIND_IN_SET(pv.id, pg.product_variant_id) and pg.type="I"','left');
    $this->db->where(array("vendor_id" => $id));
    $result = $this->db->get()->result_array();
    
    return $result;
  }

  function product_variants_price($product_variant_id){
    $this->db->select('price'); 
    $this->db->from('product_variants');
    $this->db->where('id',$product_variant_id);
    return $this->db->get()->row_array();
  }

}
?>