<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require_once(COREPATH.'libraries/models/App_model.php');
class Coupon_users_model extends App_model
{
  protected $_table = "coupon_users";	
	public function get_count($coupon_id, $user_id = null)
	{
    $db = & $this->db;
    $db->select();
    $db->where('coupon_id', $coupon_id);
    if (is_numeric($user_id)) {
        $db->where('user_id', $user_id);
    }
    $db->from($this->_table);
    return $db->count_all_results();
	}
	public function insert($data, $table = null)
	{
    $this->db->insert($this->_table, $data);
	}
  public function get_applied_coupon($user_id, $sales_order_id)
  {
    $this->db->select('c.code');
    $this->db->from("coupon_users u");
    $this->db->join('coupon c', 'c.id=u.coupon_id');
    $this->db->where('u.user_id', $user_id);
    $this->db->where('u.sales_order_id', $sales_order_id);
    //$this->db->group_by('u.sales_order_id');

    return $this->db->get()->row_array();
  }
	
}

?>
