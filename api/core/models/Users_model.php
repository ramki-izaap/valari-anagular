  <?php  if (!defined('BASEPATH')) exit('No direct script access allowed');

require_once(COREPATH.'libraries/models/App_model.php');

class Users_model extends App_model
{
  function __construct()
  {
    parent::__construct();
    $this->_table = 'users';
  }
  
  function get_data($id = 0)
  { 
    
    $this->db->select('*'); 
    $this->db->where("id",$id);
    $result = $this->db->get($this->_table)->row_array();
    
    return $result;
  }

  function list_users($fields='*') 
  {

    $fields = "u.id,u.first_name,u.last_name,u.email,u.created_time";

    $this->db->select($fields, FALSE); 

    $this->db->from('users u');

    $this->db->join('sales_order so','so.customer_id=u.id');

    $this->db->join('vendor_info v','v.user_id=so.vendor_id');

    // $this->db->where('u.role','U');
    $this->db->where('v.user_id',$this->_CI->user_id);

    $this->db->group_by('u.id');

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
        case 'first_name': 
        case 'last_name':
        case 'email':        
          $this->db->like($key, $value);
        break;
        case 'date':
          $this->db->where('u.created_time', date( 'Y-m-d H:i:s', strtotime( "$value 00:00:00" ) ) );
        break;
      }
    }
  }

  //get uesrs
  function get_users($role)
  { 
    
    $this->db->select('*'); 
    
    if($role=="A")
      $this->db->where('role','V');
    if($role=="V")
      $this->db->where('role','U');
    
    $this->db->order_by("id", "desc");
    $this->db->limit(5);
    $query = $this->db->get($this->_table);

    return $query->result_array();
   
  }

  function get_users_by_vendor($vendor_id) {

    $sql = "SELECT * from (SELECT `u`.*
              FROM `users` `u`
              JOIN `sales_order` `so` ON `so`.`customer_id`=`u`.`id`
              WHERE `so`.`vendor_id` = '3'
              GROUP BY `so`.`customer_id`

              UNION

              SELECT `u`.*
              FROM `users` `u`
              JOIN `sales_order` `so` ON `so`.`customer_id`!=`u`.`id`
              WHERE `so`.`vendor_id` = '{$vendor_id}' AND u.created_id = '{$vendor_id}' 
              GROUP BY u.id) t ORDER BY t.id DESC";
    
    $result = $this->db->query($sql)->result_array();
    // echo $this->db->last_query();
    return $result;
  }
  
  
    
}
?>