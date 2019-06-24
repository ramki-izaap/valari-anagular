<?php
/**
* This method handles to get all category 
**/
function get_categories()
{

 $CI = & get_instance();
 
 $result = $CI->db->get('categories')->result_array();
 
 return $result;
}

/**
* This method handles to get all product size
**/
function get_product_size()
{

 $CI = & get_instance();
 //$CI->db->where('variant_id','2');
 $result = $CI->db->get('variant_value')->result_array();
 return $result;
}


function displayData($data = null, $type = 'string', $row = array(), $wrap_tag_open = '', $wrap_tag_close = '')
{
  $CI = & get_instance();
  if(is_null($data) || is_array($data) || (strcmp($data, '') === 0 && !count($row)) )
    return $data;
  switch ($type)
  {
    case 'string':
        break;
    case 'uppercase':
      $data = strtoupper($data);
    break;
    case 'humanize':
    $CI->load->helper("inflector");
        $data = humanize($data);
        break;
    case 'date':
        if($data!='0000-00-00')
            $data = str2USDate($data);
        else
            $data="";
        break;
    case "desc";
      $data = "<div style='white-space:nowrap;overflow:hidden;height:40px;width:300px;text-overflow:ellipsis'>".$data."</div>";
    break;
    case 'datetime':
        $data = str2USDate($data);
        break;
    case 'money':
        $data = '$'.number_format((float)$data, 2);
        break;    
  }
  return $wrap_tag_open.$data.$wrap_tag_close;
}

function get_address_format($address_id=0,$type='shipping',$format=TRUE){

    $CI = & get_instance();

    $CI->db->where('id',$address_id);
    $CI->db->where('type',$type);
    $result = $CI->db->get('address')->row_array();

    if($format){

        $str = $result['first_name'].' '.$result['last_name'];
        $str .= '<br>'.$result['address'].' '.$result['address2'];
        $str .= '<br>'.$result['city'].' '.$result['state'];
        $str .= '<br>'.$result['country'].' '.$result['zip'];
        $str .= '<br> Ph:'.$result['phone'];

        return $str;
    }

    return $result;
}

function action_logs( $log_id = '', $method_type = '', $log = '' )
{
    $CI = & get_instance();

    $CI->load->model('logs_model');

    $logs_data = array();
    $logs_data['log_id ']       = $log_id;
    $logs_data['method_type ']  = $method_type;
    $logs_data['log']           = $log;
    $logs_data['created_time']  = date('Y-m-d H:i:s');
    
    $CI->logs_model->insert($logs_data);

}

?>