<?php  if (!defined('BASEPATH')) exit('No direct script access allowed');

require_once(COREPATH.'libraries/models/App_model.php');

class Inventory_model extends App_model
{
  function __construct()
  {
    parent::__construct();
    $this->_table = 'products';
  }


  function list_products($role,$fields='*') 
  {

    
   
      $fields = "p.name,p.sku,p.price,,p.is_active,p.created_time,p.description,p.id";

      $this->db->select($fields, FALSE); 

      $this->db->from('products p');

      //$this->db->where('is_active',1);

      $this->prepare_search($role);
      
      $this->db->order_by($this->_CI->order_by);
      
      $this->db->limit($this->_CI->per_page, $this->get_offset());

      $query = $this->db->get_compiled_select();
      //die($query);
      return $this->get_lisitng_result($query);
  }

  function list_vendor_products($user_id='',$role='',$fields='*') 
  {

    
      $fields = "p.product_variant_name as name,p.sku,vp.price,vp.quantity,p.created_time,p.id";

      $this->db->select($fields, FALSE); 
      $this->db->where('vendor_id',$user_id);
      $this->db->from('vendor_products vp');
      $this->db->join('product_variants p','p.id=vp.product_variant_id');

      $this->prepare_search($role);
      
      $this->db->order_by($this->_CI->order_by);
      
      $this->db->limit($this->_CI->per_page, $this->get_offset());

      $query = $this->db->get_compiled_select();
      //die($query);
      return $this->get_lisitng_result($query);

    

  }

  function prepare_search($role = '') 
  {
    foreach ($this->criteria as $key => $value)
    {
      if( strcmp($value, '') === 0 ) continue;

      switch ($key)
      {
        case 'product_variant_name':
        case 'name':
        case 'price':
        case 'sku':
        case 'price':
        case 'quantity':
          $key = ($role == 'V' && $key!='sku' && $key !='product_variant_name')?'vp.'.$key:'p.'.$key;
          $this->db->like($key, $value);
        break;
        case 'date':
          $this->db->where( 'products.created_time >=', date( 'Y-m-d H:i:s', strtotime( "$value 00:00:00" ) ) );
        break;
      }
    }
  }

  function get_data()
  {
    $this->db->select('*'); 
    $result = $this->db->get($this->_table);
    
    return $result;
  }
  
  function list_variants()
  {

    $this->db->select('v.id,v.variant as type,vv.value,vv.id as variant_value_id,vv.short_code'); 
    $this->db->from("variants v");
    $this->db->join("variant_value vv","vv.variant_id=v.id");
    $result = $this->db->get()->result_array();
    
    return $result;
  }

  public function get_products($where='')
  {
    if($where)
      $this->db->where($where);
    $this->db->select("a.*,b.image_name,b.featured,b.type,c.category_id");
    $this->db->from("products a");
    $this->db->join("product_image b","a.id=b.product_id");
    $this->db->join("category_products c","a.id=c.product_id");
    $this->db->group_by("a.id");
    $q = $this->db->get();
    return $q->result_array();
  }

  function categories($product_id)
  {

    // $this->db->select('c.*,cp.product_id'); 
    // $this->db->from("categories c");
    // $this->db->join('category_products cp','cp.category_id=c.id','left');
    //$this->db->where(array("cp.product_id" => $product_id));
    // $this->db->group_by('cp.category_id'); 
    $result = $this->db->get('categories')->result_array();
    return $result;
  }

  function categoriesByProduct($product_id)
  {

    $this->db->select('c.*,cp.product_id'); 
    $this->db->from("categories c");
    $this->db->join('category_products cp','cp.category_id=c.id','left');
    $this->db->where(array("cp.product_id" => $product_id));
    $this->db->group_by('cp.category_id'); 
    $result = $this->db->get()->result_array();
    return $result;
  }

  function vendors_by_product($product_id)
  {
    $this->db->select("CONCAT(u.first_name,' ',u.last_name) name,vi.store_name as storeName,u.email "); 
    $this->db->from("users u");
    $this->db->join('vendor_info vi','vi.user_id=u.id','left');
    $this->db->join('vendor_products vp','vp.vendor_id=u.id','left');
    $this->db->join('product_variants pv','pv.id=vp.product_variant_id','left');
    $this->db->where(array("pv.product_id" => $product_id));
    $this->db->group_by('u.id'); 
    $result = $this->db->get()->result_array();
    return $result;
  }

  function categories_new()
  {
      $this->db->select('*'); 
      $this->db->from("categories");
      $result = $this->db->get()->result_array();
      return $result;
  }

  function get_categories_by_search_key($search_key)
  {

    $this->db->select('*'); 
    $this->db->from("categories");
    $this->db->like("name",$search_key,'both');
    $result = $this->db->get()->result_array();
    return $result;

  }  

  function get_product_by_id($id)
  {
    $this->db->select('*'); 
    $this->db->from($this->_table);
    $this->db->where(array("id" => $id));
    $result = $this->db->get()->row_array();
    return $result;
  }

  function get_vendors()
  {
    
    $this->db->select('*');
    $this->db->from('users');
    $this->db->where('role','V');
    $result = $this->db->get()->result_array();
    return $result;
  }
  // function get_customers()
  // {
    
  //   $this->db->select('*');
  //   $this->db->from('users');
  //   $this->db->where('role=','U');
  //   $result = $this->db->get()->result_array();
  //   return $result;
  // }


 function select_customers($vendor_id)
  {
    // $this->db->select('u.*'); 
    // $this->db->from('users u');
    // $this->db->join('sales_order so', 'so.customer_id=u.id');
    // $this->db->where('so.vendor_id',$vendor_id);
    // $this->db->group_by('so.customer_id');
    // $result = $this->db->get()->result_array();

    // $this->db->select('u.*'); 
    // $this->db->from('users u');
    // $this->db->join('sales_order so', 'so.customer_id!=u.id');
    // $this->db->where('so.vendor_id',$vendor_id);
    // $this->db->where('u.created_id',$vendor_id);
    // $this->db->group_by('u.id');
    // $result1 = $this->db->get()->result_array();

    // $result = array_merge($result1,$result);

    $sql = "SELECT * from (SELECT `u`.*
              FROM `users` `u`
              JOIN `sales_order` `so` ON `so`.`customer_id`=`u`.`id`
              WHERE `so`.`vendor_id` = '{$vendor_id}'
              GROUP BY `so`.`customer_id`

              UNION

              SELECT `u`.*
              FROM `users` `u`
              JOIN `sales_order` `so` ON `so`.`customer_id`!=`u`.`id`
              WHERE `so`.`vendor_id` = '{$vendor_id}' AND u.created_id = '{$vendor_id}' 
              GROUP BY u.id) t ORDER BY t.id DESC";
    
    $result = $this->db->query($sql)->result_array();

    return $result;
  }


  // RAMAKRISHNAN

  function get_variants() {
    
    $fields = "v.id as variant_id, 
                v.variant, 
                vv.id as variant_value_id, 
                vv.short_code, 
                v.priority, 
                vv.value";
    
    $this->db->select($fields);
    $this->db->from("variants v");
    $this->db->join('variant_value vv','v.id=vv.variant_id');
    
    return $this->db->get()->result_array();
  }

  function products_by_category($vendor_id = 0, $type = 'SO'){

    $query = "SELECT c.name as category_name, 
                    cp.category_id, 
                    cp.product_id,
                    p.name as product_name,
                    p.price as price,
                    pg.file_name as image,
                    p.sku as sku 
                FROM categories c
                JOIN category_products cp ON(c.id=cp.category_id)
                JOIN products p ON(p.id=cp.product_id)
                LEFT JOIN product_images pg ON(pg.product_id=p.id and pg.is_featured = 1)

              ";


    if ((int)$vendor_id && $type == 'SO') {
      $query .= " JOIN 
                    (SELECT pv.product_id 
                        FROM vendor_products vp 
                        JOIN product_variants pv ON(pv.id=vp.product_variant_id) 
                        WHERE vendor_id= $vendor_id group by pv.product_id
                    ) t 
                    ON(t.product_id=p.id)";
    }
    
    if ($type == 'PO') {
       $query .= "WHERE p.is_active=1";
    }
    
    return $this->db->query($query)->result_array();
  }
  function products_by_vendor($vendor_id='',$variant_value_id='', $category = array()){

    $sub_query = 'SELECT pv1.product_id, vp.price 
                        FROM vendor_products vp 
                        JOIN product_variants pv1 ON(pv1.id=vp.product_variant_id)';

    if (is_array($category) && count($category)) {
      $where = '';
      foreach ($category as $val) {
        $temp = "cp.category_id=$val";
        if ($where == '') {
          $where .= $temp;
        } else {
          $where .= ' OR ' . $temp;
        }        
      }      

      $sub_query .= " JOIN category_products cp ON(pv1.product_id=cp.product_id AND ($where)) ";
      $sub_query .= " WHERE vp.vendor_id=$vendor_id GROUP BY pv1.product_id";
    } else if ($variant_value_id) {
      $sub_query .= " JOIN product_details pd ON(pd.product_variants_id=pv1.id)";
      $sub_query .= " WHERE vp.vendor_id=$vendor_id 
                        AND pd.variant_value_id=$variant_value_id
                      GROUP BY pv1.product_id";
    } else {
      $sub_query .= " WHERE vp.vendor_id=$vendor_id GROUP BY pv1.product_id";
    }

    

    $query = "SELECT c.name as category_name, 
                    cp.category_id, 
                    cp.product_id,
                    p.name as product_name,
                    pv.price as original_price,
                    t.price as price,
                    pg.file_name as image,
                    p.sku as sku ,
                    p.created_time as created
                FROM categories c
                JOIN category_products cp ON(c.id=cp.category_id)
                JOIN products p ON(p.id=cp.product_id)
                JOIN product_variants pv ON(p.id=pv.product_id and pv.is_featured = 1)
                JOIN ($sub_query) t ON(t.product_id=p.id) ";

    // if($variant_value_id != '')
    // {
    //   $query .= "JOIN product_details pd ON(pd.variant_value_id=".$variant_value_id.")";
    // }

    $query .= "LEFT JOIN product_images pg 
                  ON(pg.product_id=p.id and FIND_IN_SET(pv.id, pg.product_variant_id))";
    // echo $query;die;              
    return $this->db->query($query)->result_array();
  }

  function product_details( $product_ids = array(), $type = 'PO', $vendor_id = 0) {
    $fields = "p.id as product_id,
                p.sku as product_sku,
                p.made_in_usa as product_made_in_usa,
                p.wrinkle_free_knit as product_wrinkle_free_knit,
                p.regular_fit as product_regular_fit,
                p.slim_fit as product_slim_fit,
                p.loose_fit as product_loose_fit,
                p.material_content as material_content,
                p.care_instructions as care_instructions, 
                pv.id as product_variant_id,
                pv.sku as variant_sku,
                p.name as parent_product_name,
                p.description as product_description,
                pv.product_variant_name as product_variant_name,
                pv.price,
                pg.is_featured as featured,                
                pg.file_name as p_img,
                pg.product_variant_id as img_variant_id,
                pgv.file_name as p_video,
                cp.category_id as category_id,
                cat.name as category_name,
                GROUP_CONCAT(cp.category_id) as category_ids,
                pv.quantity,
                p.is_active as parent_status,
                pv.is_active as variant_status,
                GROUP_CONCAT(vv.variant_id) as variant_ids,
                GROUP_CONCAT(pd.variant_value_id) as variant_value_ids";

    if ($type === 'SO') {
      $fields .= ",vp.price as variant_price, vp.price,vp.quantity as vendor_quantity";
    }
    
    $this->db->select($fields);
    $this->db->from("products p");
    $this->db->join('category_products cp','p.id=cp.product_id');
    $this->db->join('categories cat','cat.id=cp.category_id');
    $this->db->join('product_variants pv','p.id=pv.product_id');
    $this->db->join('product_details pd','pv.id=pd.product_variants_id');

    if ($type === 'SO') {
      $this->db->join('vendor_products vp',"vp.product_variant_id=pv.id AND vp.vendor_id=$vendor_id");
    } else {
      // $this->db->where('pv.is_active', '1');
    }
    
    $this->db->join('variant_value vv','vv.id=pd.variant_value_id');
    $this->db->join('product_images pg','p.id=pg.product_id and FIND_IN_SET(pv.id, pg.product_variant_id) and pg.type="I"','left');
    $this->db->join('product_images pgv','p.id=pgv.product_id and pgv.type="V"','left');

    if(count($product_ids)) {
      $this->db->where_in('p.id', $product_ids);
    }

    $this->db->group_by('pv.id');
    $this->db->order_by('pg.is_featured desc,pv.is_featured desc');
    
    return $this->db->get()->result_array();
  }

  function get_product_variants( $product_ids = array(), $vendor_id = 0) {
    $fields = "pv.*";
    if ($vendor_id) {
      $fields .= ', vp.price';
    }

    $this->db->select($fields);
    $this->db->from("product_variants pv");   
   
    if ($vendor_id) {
      $this->db->join('vendor_products vp','vp.product_variant_id=pv.id');
      $this->db->where('vp.vendor_id', $vendor_id);
    }

    if(count($product_ids)) {
      $this->db->where_in('pv.id', $product_ids);
    }

    return $this->db->get()->result_array();
  }
  function get_countries()
  {
    $this->db->select('*');
    $this->db->from('country');
    $result = $this->db->get()->result_array();
    return $result;
  }
  function get_states()
  {
    $this->db->select('*');
    $this->db->from('states');
    $result = $this->db->get()->result_array();
    return $result;
  }
  function refined_product_details()
  {
    
  }

  function get_colors_by_id($p_id)
  {
    $q = $this->db->query("SELECT c.value,c.short_code FROM product_variants a,product_details b,variant_value c
     where a.product_id = ".$p_id." and b.product_variants_id = a.id and b.variant_value_id = c.id and
      c.variant_id=1 group by c.short_code ");
    return $q->result_array();
  }
  function get_variant_ids($p_id,$v_id)
  {
    $this->db->where('product_id',$p_id);
    $this->db->like('sku',$v_id);
    $this->db->select('GROUP_CONCAT(id) as variants_ids');
    $q = $this->db->get('product_variants');
    return $q->row_array();
  }
 
  function get_products_variant_ids($product_id = '', $sku = '')
  {
    
     $query = "SELECT GROUP_CONCAT(id) as variants_ids 
                FROM product_variants
                 WHERE product_id='".$product_id."' AND sku LIKE '%".$sku."%'
                 ";
     $res   = $this->db->query($query);
     return $res->row_array();
    
  }

  function get_product_images($product_id)
  {

    $this->db->select('pi.*,p.sku'); 
    $this->db->from("product_images pi");
    $this->db->join("products p","p.id=pi.product_id");
    $this->db->where('pi.product_id', $product_id);
    $result = $this->db->get()->result_array();
    return $result;
  }

  function update_variants_status($sku, $product_id = 0){

    $query = "UPDATE product_variants SET is_active = 0 where sku NOT IN ('". implode("', '" , $sku) . "') AND product_id = $product_id";
     return  $this->db->query($query);
  }

  function disableAllProducts() {
    $query = "UPDATE `products` p 
                JOIN product_variants pv ON(p.id=pv.product_id) 
                set p.is_active='0', pv.is_active='0'";
                
    return  $this->db->query($query);
  }

    function get_variants_sku($vv_id){
       $this->db->select('pv.sku');
       $this->db->from('product_variants pv');
       $this->db->join('product_details pd', 'pd.product_variants_id = pv.id');
       $this->db->where('pd.variant_value_id',$vv_id);
       $result = $this->db->get()->result_array();
       return $result;
    }

    function unsetFavoriteFlag($sku=''){

      $query = "UPDATE `product_variants` 
                set `is_featured`='0' WHERE sku LIKE '%".$sku."%' ";
                
      return  $this->db->query($query);
    }
}
?>