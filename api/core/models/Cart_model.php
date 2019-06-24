<?php  if (!defined('BASEPATH')) exit('No direct script access allowed');

require_once(COREPATH.'libraries/models/App_model.php');

class Cart_model extends App_model
{
	protected $table = "";
	 
	function __construct()
	{
	  parent::__construct();
	  $this->_table = "order";
	}

  // function listing()
  // {
	 //  $this->_fields = "c.*,t.business_name,f.city";
	 //  // $this->db->select($this->_fields);
  //   $this->db->from('purchase_order c');
  //   $this->db->join("customer t","c.vendor_id=t.id");
  //   $this->db->join("ordered_address f","c.ordered_address_id=f.id");
  //   $this->db->group_by('c.id');
  //   // $this->db->get();
  //   // echo $this->db->last_query();
  //   // exit;
  //   foreach ($this->criteria as $key => $value)
  //   {
  //     if( !is_array($value) && strcmp($value, '') === 0 )
  //         continue;
  //     switch ($key)
  //     {
  //       case 'vendor_id':
  //         $this->db->where_in("c.vendor_id", $value);
  //       break;
  //       case 'so_id':
  //       	switch ($value)
  //       	{
  //       		case '1':
  //       			$this->db->where("c.so_id", '0');
  //       			break;
  //       		case '2':
  //       			$this->db->where("c.so_id!=", '0');
  //       			break;
  //       	}
  //       break;
  //      case 'date_range':
  //           $splitdate  = explode("|",$value);
  //           $this->db->where( 'c.pickup_date >=', date( 'Y-m-d', strtotime( $splitdate[0] ) )  );
  //           $this->db->where( 'c.pickup_date <=', date( 'Y-m-d', strtotime( $splitdate[1] ) )  );
  //       break;
  //     }
  //   }
  //   return parent::listing();
  // }
	
  // public function get_vendors($where='')
  // {
  //   if($where)
  //     $this->db->where($where);
  //   $this->db->select("a.*,b.state,b.city,b.address1,b.address2,b.zipcode,b.first_name,b.last_name,b.phone,c.name as contact_name,c.contact_value,c.email,b.name as b_name");
  //   $this->db->from("customer a");
  //   $this->db->join("address b","a.address_id=b.id");
  //   $this->db->join("customer_contact c","a.id=c.customer_id");
  //   $this->db->join("vendor_price_list d","a.id=d.vendor_id");
  //   $this->db->group_by("a.id");
  //   $q = $this->db->get();
  //   return $q->result_array();
  // }
  // public function get_customers()
  // {
  // 	$this->db->where("status",1);
  // 	$q = $this->db->get("customer");
  // 	return $q->result_array();
  // }
	public function get_max_id()
	{
		$this->db->select("COALESCE(MAX(id),0) + 1 as po_id");
		$q = $this->db->get("purchase_order");
		return $q->row_array();
	}
	public function insert($data,$table=NULL)
	{
		$this->db->insert($table,$data);
		return $this->db->insert_id();
	}

	public function update($where,$data,$table=NULL)
	{
		$this->db->where($where);
		$this->db->update($table,$data);
	}

	public function select($where,$table=NULL)
	{
		$this->db->where($where);
		$q = $this->db->get($table);
		if($q->num_rows() > 1)
			return $q->result_array();
		else
			return $q->row_array();
	}

	public function select_multiple($where,$table=NULL)
	{
		$this->db->where($where);
		$q = $this->db->get($table);
		return $q->result_array();
	}

	public function delete($where=array(),$table=NULL)
	{
		$this->db->where($where);
		$this->db->delete($table);
	}

	public function get_purchased_products($po_id)
	{
		$this->db->where("a.po_id",$po_id);
		$this->db->select("a.*,a.id as rowid,b.name as p_name,b.sku");
		$this->db->from("purchase_order_item a");
		$this->db->join("product b","a.product_id=b.id");
		$q = $this->db->get();
		return $q->result_array();
	}

	public function get_purchased_order($po_id)
	{
		$this->db->where("a.id",$po_id);
		$this->db->select("a.*,a.id as po_id,b.business_name as vendor_name,c.type as ship_type,d.name as carrier,e.name as credit,f.name as wname,f.*,h.name as state_name,g.name as country_name,j.name as bill_name,j.address1 as b_address1,j.address2 as b_address2,j.city as b_city,j.state as b_state,j.country as b_country,j.zipcode as b_zipcode,j.phone as b_phone");
		$this->db->from("purchase_order a");
		$this->db->join("customer b","a.vendor_id=b.id");
		$this->db->join("shipping_type c","a.ship_type_id=c.id");
		$this->db->join("carrier d","a.carrier_id=d.id");
		$this->db->join("credit_type e","a.credit_type_id=e.id");
		$this->db->join("ordered_address f","a.ordered_address_id=f.id");
		$this->db->join("country g","f.country=g.id");
		$this->db->join("state h","f.state=h.id");
		$this->db->join("address j","j.id=b.address_id");
		$q = $this->db->get();
		// echo $this->db->last_query();exit;
		return $q->row_array();
	}

}