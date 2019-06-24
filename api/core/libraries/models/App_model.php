<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
 
abstract class App_model extends CI_Model
{
    protected $db;

    protected $_CI;
    protected $_table;

    protected $_primary = array(
        'id'
    );
    
    protected $_debug = FALSE;

    public function __construct()
    {
        parent::__construct();
        
        $this->_CI = get_instance();

        if (!$this->_table) {
            $this->_table = $this->getTableName();
        }

        $this->db = $this->_CI->db;
    }

    

    public function get_where($where = array(), $fields = '*',$table = NULL, $order_by = NULL)
    {
    	if(!is_array($where)) return FALSE;
    	
    	$this->db->select($fields);
    	
    	$this->db->where($where);
   		
        if( !is_null($order_by) )
            $this->db->order_by($order_by); 
        
        $table = ($table)?$table:$this->_table;
    	
        return $this->db->get($table);
    }
    
    
    public function insert($data,$table = NULL)
    { 
        $table = ($table)?$table:$this->_table;
        
    	$this->db->insert($table, $data);
    
    	if ($this->_debug){
    		log_message('debug', $this->db->last_query());
    	}
    
    	return $this->get_last_id();
    }
    
    public function update($where = array(), $data,$table = NULL)
    {
    	if(!is_array($where)) return FALSE;
        
    	$table = ($table)?$table:$this->_table;
        
        foreach ($where as $f => $v)
        {
        	if(is_array($v))
        		$this->db->where_in($f, $v);
        	else
        		$this->db->where($f, $v);
        }
    	
    
    	$this->db->update($table, $data);
    
    	if ($this->_debug){
    		log_message('debug', $this->db->last_query());
    	}
    
    	return $this->db->affected_rows();
    }
    
    
    public function delete($where = array(),$table = NULL)
    {
    	if(!is_array($where)) return FALSE;
    	
        $table = ($table)?$table:$this->_table;
        
    	foreach ($where as $f => $v)
        {
        	if(is_array($v))
        		$this->db->where_in($f, $v);
        	else
        		$this->db->where($f, $v);
        }
    
    	return $this->db->delete($table);
    }
    
    public function get_by_id($id)
    {
        if (!$this->_where_primary($id)) {
            return null;
        }

        $this->_prepare_fields(new Criteria());
        $this->_prepare_from();
		
		$res = $this->db->get();
		
		if( is_object($res) && $res->num_rows()){
			return $res->row_array();
		} else {
			return false;
		}
		
    }

    public function get_by_ids($ids)
    {
        if (count($this->_primary) > 1) {
            throw new Exception("get_by_ids() can't be used for a table with a composite primary key");
        }

        if (!count($ids)) {
            return array();
        }

        $primary = current($this->_primary);

        $this->_prepare_fields(new Criteria());
        $this->_prepare_from();

        $this->db->where_in($primary, $ids);

        return $this->db->get()->result_array();
    }
    
    
    
    
    
    public function get_last_id()
    {
        return $this->db->insert_id();
    }

    
    
    function getTableName()
    {
    	$class = strtolower(get_class($this));
    	return substr($class, 0, strlen($class) - 6);
    }
    
    
    
    public function update_table($table,$where = array(), $data)
    {
    	if(!is_array($where)) return FALSE;
    	
    	$this->db->where($where);
    
    	$this->db->update($table, $data);
    
    	if ($this->_debug){
    		log_message('debug', $this->db->last_query());
    	}
    
    	return $this->db->affected_rows();
    }
    
    public function insert_table($table,$data)
    {
    	$this->db->insert($table, $data);
    
    	if ($this->_debug){
    		log_message('debug', $this->db->last_query());
    	}
    
    	return $this->get_last_id();
    }
    
    public function empty_table( $table )
    {
        $table = ($table)?$table:$this->_table;
        
    	$qry = $this->db->empty( $table );
            
    	if ($this->_debug){
    		log_message('debug', $this->db->last_query());
    	}
    
    	return $qry;
    }
    
    protected function _before_save($data) {}
    
    protected function _after_save($last_id) {}



    /* Listing */

    public function get_offset()
    {
        return ($this->_CI->current_page-1)*$this->_CI->per_page;
    }

    public function get_lisitng_result($query = '')
    {
        if(strpos('SQL_CALC_FOUND_ROWS', $query) === FALSE)
        {
            $query = str_ireplace("select", "SELECT SQL_CALC_FOUND_ROWS ", $query);
        }
        //echo ($this->_CI->current_page-1).'::'.$this->get_offset().':::';die($query);
        $items = $this->db->query($query)->result_array();
        $this->_CI->items_count = $this->db->query("select FOUND_ROWS() as count")->row()->count;

        
        if($this->_CI->items_count) 
        {
            $this->_CI->pages_count = ceil($this->_CI->items_count/$this->_CI->per_page);
        }

        $output = array();
        $output['itemsCount']  = $this->_CI->items_count;
        $output['pagesCount']     = $this->_CI->pages_count;
        $output['currentPage']     = $this->_CI->current_page;
        $output['perPage']           = $this->_CI->per_page;
        $output['items']           = $items;
        $output['get_offset']          = $this->get_offset();

        return $output;
    }
    
}

?>
