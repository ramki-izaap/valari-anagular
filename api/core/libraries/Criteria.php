<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Criteria {

    private $_where      = array();
    private $_spec_where = array();

    private $_limit  = null;
    private $_offset = 0;                     
    private $_order  = null;
    private $_fields = null;
	private $_applet = null;

    public function __construct()   
    {
    }

    public function where($name = null, $value = null) 
    {
        
        if ($name === null && $value === null) {
            return $this->_where;
        } else if (is_string($name) && $value === null) {
            return array_key_exists($name, $this->_where) ? $this->_where[$name] : null;
        }
        else if(is_string($name) && $value ==='NULL')
        {
            $this->_where[$name] = null;
            return  $this->_where[$name];
        }
        if (is_array($name)) {
            $conditions = $name;            
            foreach ($conditions as $name => $value) {
                $this->where($name, $value);
            }
        } else if ($value !== null) {
            if ($value === 'ISNULL') {
                $this->_where[$name] = NULL;
            } else {
                $this->_where[$name] = $value;
            }
        }
    }

    public function spec_where($name = null, $value = null) 
    {
        if ($name === null && $value === null) {
            return $this->_spec_where;
        } else if (is_string($name) && $value === null) {
            return array_key_exists($name, $this->_spec_where) ? $this->_spec_where[$name] : null;
        }
        if (is_array($name)) {
            $conditions = $name;            
            foreach ($conditions as $name => $value) {
                $this->spec_where($name, $value);
            }
        } else if ($value !== null) {
            $this->_spec_where[$name] = $value;
        }
    }

    public function limit($value = null)
    {
        if ($value) {
            $this->_limit = $value;
        } else {
            return $this->_limit;
        }
    }

    public function offset($value = null)
    {
        if ($value) {
            $this->_offset = $value;
        } else { 
            return $this->_offset;
        }
    }
                            
    public function order($field = null)
    {
        if ($field) {
            $this->_order = $field;
        } else {
            return $this->_order;
        }        
    }

    public function fields($value = null)
    {
        if ($value) {
            $this->_fields = $value;
        } else {
            return $this->_fields;
        }                
    }

    public function clear()
    {
        $this->_limit  = null;
        $this->_offset = 0;                     
        $this->_order  = null;
        $this->_fields = null;

        $this->_where      = array();
        $this->_spec_where = array();
    }
	
	public function applet($value = null)
    {
        if ($value) {
            $this->_applet = $value;
        } else {
            return $this->_applet;
        } 
    }
}

?>
