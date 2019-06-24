<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
require_once(COREPATH.'libraries/models/App_model.php');
class Coupon_model extends App_model
{
	protected $_table = 'coupon';
	
	
    public function search(Criteria $criteria = null, $search_type = null)
    {
        //set the escape flag true.
        $this->escape = FALSE;
        $criteria->fields("coupon_details.*,coupon.id,coupon.code,coupon.title,IF(coupon_details.discount_type='percentage', concat(coupon_details.benefit_amt,'%'), concat('$',coupon_details.benefit_amt)) as benefit_amount,sales_channel.name as sales_channel_name",false);
        return parent::search($criteria);
    }

    protected function _prepare_from()
    {
        parent::_prepare_from();
        $this->db->join('coupon_details', 'coupon.coupon_detail_id = coupon_details.id');
        $this->db->join('sales_channel', 'sales_channel.id = coupon.vendor_id'); 
    }
    
    protected function _prepare_where($criteria=null)
    {
        parent::_prepare_where($criteria);
    }

    protected function _prepare_spec_where(Criteria $criteria = null)
    {
        //echo '<pre>';print_r($criteria->spec_where());
        foreach ($criteria->spec_where() as $key => $value)
        {
            if( !is_array($value) && strcmp($value, '') === 0 )
                continue;
            
            switch ($key)
            {
              case 'title':
                  $this->db->like('coupon.title', $value);
                  break;
              case 'code':
                  $this->db->like('coupon.code', $value);
                  break;
              case 'sales_channel':
                  $this->db->where_in('sales_channel.id', $value);
                  break;
              case 'start_date':
                  $this->db->where( 'coupon_details.created_time >=', date( 'Y-m-d H:i:s', local_to_gmt( strtotime( "$value 00:00:00" ) ) ) );
                  break;
              case 'end_date':
                  $this->db->where( 'coupon_details.created_time <=', date( 'Y-m-d H:i:s', local_to_gmt( strtotime( "$value 23:59:59" ) ) ) );
                  break;                   
            }
        }
    }

    public function get_view_coupon($coupon_id = 0){

        $this->db->select('d.*,d.start_date,d.end_date,c.*,p.*');
        $this->db->from("coupon c");
        $this->db->join('coupon_details d', 'c.coupon_detail_id=d.id');
        $this->db->join('coupon_products p', 'p.coupon_detail_id=d.id','left');
        $this->db->where('c.id', $coupon_id);
        $this->db->group_by('d.id');

        return $this->db->get()->row_array();
    }

    public function find_code($code, $sales_channel_id = 0)
	{
        $db = & $this->db;
        $db->select("d.*,d.id as detail_id,c.*", false);
        $this->db->from("coupon_details d");
        $this->db->join('coupon c', 'c.coupon_detail_id=d.id');
        $db->where('c.code', $code);
        $db->where('c.vendor_id', $sales_channel_id);
        $result = $db->get($this->_table)->row_array();
        if (!$result) 
        {
            return false;
        }

        return $result;
	}

    public function get_coupon_products($detail_id = 0)
    {
        $db = & $this->db;
        $db->select("coupon_products.*");        
        $db->where('coupon_detail_id', $detail_id);
        //$db->join('product', 'product.id=coupon_products.product_id');
        return $db->get('coupon_products')->row();        
    }
	
    public function get_products_details($list){
        $db = & $this->db;
        $db->select("id as product_id,name");        
        $db->where_in('id', $list);
        return $db->get('product')->result_array(); 
    }
   
    function get_coupons_by_users($where = array()){
        
        $this->db->select("coupon_details.benefit_amt,coupon.code,coupon.title,coupon_details.discount_type,coupon_users.*",false);
        $this->db->from("coupon_users");        
        $this->db->join("coupon","coupon.id = coupon_users.coupon_id");
        $this->db->join("coupon_details","coupon_details.id = coupon.coupon_detail_id");
        $this->db->where($where);
        return $this->db->get();
    }

    function get_products_sku($channel_id,$search){

        $this->db->select("p.sku,p.id");
        $this->db->from("product p");
        $this->db->join("category_has_product cp","cp.product_id = p.id");
        $this->db->join("category c","c.id = cp.category_id");
        $this->db->where('c.sales_channel_id',$channel_id);
        $this->db->like('p.sku',$search);
        $this->db->group_by('p.id');

        return $this->db->get()->result_array();
    }

    function get_category_names($channel_id,$search){
        
        $this->db->select("name,id");
        $this->db->from("category");
        $this->db->where('sales_channel_id',$channel_id);
        $this->db->like('name',$search);
        $this->db->group_by('id');

        return $this->db->get()->result_array();
    }

    function get_coupon_codes($coupon_id,$channel_id,$search){

        $this->db->select("d.id,c.code");
        $this->db->from("coupon_details d");
        $this->db->join("coupon c","c.coupon_detail_id = d.id");       
        $this->db->where_not_in('d.id',$coupon_id);
        $this->db->like('c.code',$search);
        $this->db->where('c.vendor_id',$channel_id);
        $this->db->group_by('d.id');

        return $this->db->get()->result_array();
    } 
	

    function get_products( $ids = array())
    {
        $this->db->select('id,sku');
        $this->db->from('product');
        $this->db->where_in('id', $ids);
        $result = $this->db->get()->result_array();

        $opt = array();
        foreach ($result as $row) 
        {
            $opt[] = array('id' => $row['id'], 'name' => $row['sku']);
        }

        return json_encode($opt);
    }

    function get_coupon_summary($coupon_id = '')
    {
        
        $sql = " SELECT t.code, count(t.sales_order_id) as usage_count, ROUND(SUM( t.total_amount), 2) as total_amount, ROUND(SUM( t.total_discount), 2) as total_discount 
                FROM (SELECT coupon.code, cu.sales_order_id, so.total_amount, so.total_discount
                        FROM (coupon)
                        JOIN coupon_users cu ON coupon.id=cu.coupon_id
                        JOIN sales_order so ON cu.sales_order_id=so.id
                        WHERE coupon.id = '$coupon_id'
                        AND (so.order_status!= 'FAILED' 
                         AND so.order_status != 'CANCELLED' 
                         AND so.order_status!= 'HOLD' 
                         AND so.order_status!= 'PENDING' 
                         AND so.order_status!= 'REFUNDING' 
                         AND so.order_status!= 'REFUNDED' 
                         AND so.order_status != 'PARTIALLY_REFUNDED')
                        GROUP BY so.id
                    ) t  ";
        
        return $this->db->query($sql)->row_array();

        

    }
}

?>
