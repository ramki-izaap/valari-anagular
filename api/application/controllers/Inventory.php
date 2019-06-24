<?php

defined('BASEPATH') OR exit('No direct script access allowed');

require_once(APPPATH."controllers/AppController.php");

Class Inventory extends AppController {

  public $passed_rows = array();
  public $failed_rows = array();
  public $db_parent_sku = array();
  public $parent_required_columns = array('Style','Description','Category','Color','Wholesale Price','Size');
  public $child_required_columns  = array('sku', 'parent_sku','price','qty','size','colors');
  public $product_upload_columns  = array('Style','Name','Description','Category','Color','Wholesale Price','Size','Quantity','Is Active','Clearance','made in usa','wrinkle free knit','regular fit','slim fit','loose fit','Material Content','Care Instructions');
  public $format_field_columns = array('Wholesale Price');
  public $pro_update_columns = array('sku','qty','price');
  public $pro_update_required_columns = array('sku','qty','price');

	function __construct()
    {
        parent::__construct();
        $this->_bucket = "inventory-clara";
        $this->load->library('session');
        $this->load->model('inventory_model');
        $this->load->model('coupon_model','cm');

        $this->load->library('upload_manager');

        $this->getAllUploadedImages();
        $this->_UploadedImgs = array();
        $this->db_parent_sku = $this->cm->get_where(array(),'sku','products')->result_array();
      $this->db_child_sku = $this->cm->get_where(array(),'sku','product_variants')->result_array();
       $this->db_category = $this->cm->get_where(array(),'name','categories')->result_array();
       $this->db_variants = $this->cm->get_where(array(),'short_code, value','variant_value')->result_array();
      ini_set('max_execution_time', 0);
    }

    function product_post()
    {
        $output = array();

        try
        {
          	$product_type          = $this->post('product_type');
            $name                  = $this->post('name');
            $sku                   = $this->post('sku');
            $description           = $this->post('description');
            $quantity              = $this->post('quantity');
            $price                 = $this->post('price');
            $is_active             = $this->post('isActive');
            $made_in_usa           = $this->post('madeInusa');
            $wrinkle_free_knit     = $this->post('wrinkleFreeknit');
            $regular_fit           = $this->post('regularFit');
            $slim_fit              = $this->post('slimFit');
            $loose_fit             = $this->post('looseFit');
            $user_id               = $this->post('user_id');
            $product_id            = $this->post('id');
            $material_content      = $this->post('materialContent');
            $care_instructions     = $this->post('careInstructions');
            if(!isset($name)){
                throw new Exception("INVALID Productname");                
            }
            
            if(!isset($sku)){
                throw new Exception("INVALID sku");                
            }

            if(!isset($description)){
                throw new Exception("INVALID Description ");                
            }

            $data = $this->inventory_model->get_where(array("sku" => $sku, "id !=" => $product_id),'*');
            
            if($data->num_rows() > 0 )
            {
              throw new Exception("Sku Already Exists!");
            }
            

            $product_data = array();
            $product_data['type']                = $product_type;
            $product_data['name']                = $name;
            $product_data['sku']                 = trim($sku);
            $product_data['description']         = $description;
            $product_data['quantity']            = $quantity;
            $product_data['price']               = $price;
            $product_data['material_content']    = $material_content;
            $product_data['care_instructions']   = $care_instructions;
            $product_data['is_active']           = $is_active;
            $product_data['made_in_usa']         = $made_in_usa;
            $product_data['wrinkle_free_knit']   = $wrinkle_free_knit;
            $product_data['regular_fit']         = $regular_fit;
            $product_data['slim_fit']            = $slim_fit;
            $product_data['loose_fit']           = $loose_fit;
            $product_data['updated_id']          = $user_id;
            $product_data['updated_time']        = date("Y-m-d H:i:s");

            $product_id = $this->inventory_model->update(array("id" => $product_id),$product_data);

            $output['status']   = 'success';
            $output['message']  = 'Product Updated Successfully';
        }
        catch(Exception $e){
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }

    function deleteProduct_post(){

      $output = array();
      $del_id     = $this->post('id');
      $role       = $this->post('role');
      $vendor_id  = $this->post('vendorID');
     
      if ($role =='A') {
        $update['is_active'] = 0;
        $this->inventory_model->update(array("id" => $del_id),$update);
        $output['message'] ="Product deleted successfuly.";
        $output['status']  = "success";
      } else {
         $access_data = $this->inventory_model->get_where(array("vendor_id"=>$vendor_id),'id','vendor_products')->row_array();
         if(count($access_data) > 0){
           $this->inventory_model->delete(array("product_variant_id"=>$del_id),'vendor_products');
         }
        $output['message'] ="Product deleted successfuly.";
        $output['status']  = "success";
      }
      
      $this->response($output);

      // $access_data = $this->inventory_model->get_where(array("id"=>$del_id),'id')->row_array();

      // $category_data =   $this->inventory_model->get_where(array("product_id"=>$del_id),"id",
      //   "category_products")->result_array();

      // $variant_data = $this->inventory_model->get_where(array("product_id"=>$del_id),"id",
      //   "product_variants")->result_array();

      // $image_data = $this->inventory_model->get_where(array("product_id"=>$del_id),"id",
      //   "product_images")->result_array();

      // if(count($access_data) > 0)
      // {
       
      //   if(count($category_data) > 0){

      //     $this->inventory_model->delete(array("product_id"=>$del_id),'category_products');
      //   }
      //   if(count($variant_data) > 0){

      //      foreach($variant_data as $key => $value) {

      //        $this->inventory_model->delete(array("product_variants_id"=>$value['id']),'product_details');
      //       }
      //   }

      //   $this->inventory_model->delete(array("product_id"=>$del_id),'product_variants');
      //   $this->inventory_model->delete(array("id"=>$del_id));
        
      //   if(count($image_data) > 0){

      //     $this->load->library('s3');
      //     $this->inventory_model->delete(array("product_id"=>$del_id),'product_images');
      //     $uri = "product-images/".$this->post('id');
      //     $del = $this->s3->deleteObject($this->_bucket,$uri);
      //   } 
        
      //   $output['message'] ="Product deleted successfuly.";
      //   $output['status']  = "success";
        
      // }
      // else
      // {
      //   $output['message'] ="This record not matched.";
      //   $output['status']  = "error";
        
      // }

    }
    
  function product_import_post()
  {


    $file_path            = "";
    $output['res_status'] = 'success';
    $type                 = $this->post('type');
    $csv_type             = $this->post('csv_type');

    if($type=='confirm')
    {
        $file_path = $this->post('filepath');
    }
    else
    {
        $output['vars'] = $_FILES['fileKey'];

        $file_upload    = $this->do_upload();

      if($file_upload['status'] === 'error')
      {
          $output['res_status'] = 'error';
          $output['error']      = $file_upload['msg'];
      }
      else
      {
         $file_path = "./uploads/".$file_upload['msg']['file_name'];
      }

    }
 
    $output['file_path'] = $file_path;
    $output['rows']      = []; // $this->session->userdata('passed_rows');

    if($csv_type ==='1' || $csv_type ===1)
      $output['response'] = $this->product_upload($file_path,$type);
    else
      $output['response'] = $this->product_update_upload($file_path,$type);

    $output['type'] = $type;

    $this->response($output);

  }


  public function confirm_upload_post()
  {
    $this->passed_rows = $this->session->userdata('passed_rows');
    // $output['passed_rows'] = $this->session->userdata('passed_rows');
    $output['status'] = 'success';
    $product_id = $this->prepare_insert_products($this->passed_rows);
    $this->response($output);
  }

  public function do_upload()
  {

    $config['upload_path']          = './uploads';
    $config['allowed_types']        = 'xls|xlsx|csv';
    $config['max_size']             = 100000;
    $config['max_width']            = 280;
    $config['max_height']           = 425;

    $this->load->library('upload');

    $this->upload->initialize($config);

    if ( ! $this->upload->do_upload('fileKey'))
    {
      $data = array('status' =>'error','msg'=> $this->upload->display_errors());
      //print_r($data); exit;
    }
    else
    {
      $data = array('status' =>'success','msg'=> $this->upload->data());
    }
    return $data;
  }

  function product_upload($file_path='',$method='')
  {
    
    $this->session->unset_userdata('passed_rows');
    $this->session->unset_userdata('failed_rows');    

    try
    {

      if($file_path=='')
      {
        $errors[] = "File you uploaded doesn't exists";
        throw new Exception("Errors Found.", 1);        
      }

      $csv = array();
      if (($handle = fopen($file_path, "r")) !== FALSE) {
          while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
            $csv[] = $data;
          }
          fclose($handle);
      }
      
      // $csv           = array_map('str_getcsv', file($file_path));
      $excel_columns = is_array($csv) && count($csv) ? $csv[0]: array();
      $parent_sku    = array();
      $errors        = array();
      $err           = array('status'=>'success','msg'=>'File read Successfully.','type'=>'');
      /*CHECK ALL COLUMN HEADERS ARE PRESENT*/
      $diff = array_diff($this->product_upload_columns, $excel_columns);
      if(count($diff))
      {
        $err['type'] = 'columns';
        $errors[]    = "Columns #".implode(",#",$diff)." are not found or mismatch.";
        throw new Exception("Columns #".implode(",#",$diff)." are not found or mismatch.");
      }
      // prepare products and parent sku
      foreach ($csv as $index => $row) {
        if($index === 0) continue;
        $merged_row = array_combine($excel_columns, $row);
        $products[] = $merged_row;
        $parent_sku[] = $merged_row['Style'];
      }
      // print_r($products); exit;

      // return count($products);
      foreach ($products as $key => $row)
      {

        $format_result = $sku_check_result = array('status' => 'success');
        $validation_result = $this->check_required_fields($row, $this->parent_required_columns,$key);
        
       $validation_category_result = $this->check_required_category($row['Category'], $this->db_category,$key); 

       $validation_sku_result      = $this->check_required_sku($row['Style'],$key); 
      
       $validation_variants_result = $this->check_required_variants($row,$this->db_variants,$key);  
      
        if($validation_result['status'] === 'success')
        {
          $sku_check_result = $this->check_sku_fields($row,$parent_sku,$key);
          $format_result    = $this->check_format_fields($row, $this->format_field_columns,$key);
          if($sku_check_result['status'] === 'success' && $format_result['status'] === 'success'){
              $this->passed_rows[] =  $row;
            }        
        }  


        if($validation_result['status'] === 'error')
        {
          $this->failed_rows[] =  $row;
          $errors[] = $validation_result['error'];
        }

        if($validation_category_result['status'] === 'error' && $validation_result['status'] === 'success')
        {
          $this->failed_rows[] =  $row;
          $errors[] = $validation_category_result['error'];
        }

        if($validation_sku_result['status'] === 'error' && $validation_result['status'] === 'success')
        {
          $this->failed_rows[] =  $row;
          $errors[] = $validation_sku_result['error'];
        }

        if($validation_variants_result['status'] === 'error' && $validation_result['status'] === 'success')
        {
          $this->failed_rows[] =  $row;
          $errors[] = $validation_variants_result['error'];
        }

        if( (isset($format_result['status']) && $format_result['status'] === 'error') || 
            (isset($format_result['status']) && $sku_check_result['status'] === 'error'))
        {
          $this->failed_rows[] =  $row;
          $errors[] = (isset($format_result['error']))?$format_result['error']:$sku_check_result['error'];
        }
        
        $this->session->set_userdata('passed_rows',$this->passed_rows);
        $this->session->set_userdata('failed_rows',$this->failed_rows);
      }

      // return 66;

      if(count($errors))
      {
        if($method=='confirm'){
          $err['msg'] = $this->confirm_upload();
        }
        else
        {
          $err['type'] = 'rows';
          throw new Exception("Error Found.", 1);
        }

      }
        

    }
    catch(Exception $e)
    {
      $err['status'] = 'error';
      $err['msg'] = $e->getMessage();
      $err['errors'] = $errors; // json_encode($errors, JSON_UNESCAPED_UNICODE);
    }
    if($err['status'] === 'success')
    {
      $err['msg'] = $this->confirm_upload();
    }
    
    // echo '<pre>';print_r($err);die;
    return $err;

  }

  function product_update_upload($file_path='',$method='')
  {
    try
    {
      $this->session->unset_userdata('passed_rows');
      $this->session->unset_userdata('failed_rows');
      $csv = array_map('str_getcsv', file($file_path));
      $excel_columns = is_array($csv) && count($csv) ? $csv[0]: array();
      $parent_sku = array();
      $errors = array();
      $err = array('status'=>'success');
      $diff = array_diff($this->pro_update_columns, $excel_columns);
      if(count($diff))
      {
        $err['type'] = 'columns';
        $errors[] = "Columns #".implode(",#",$diff)." are not found or mismatch.";
        throw new Exception("Columns #".implode(",#",$diff)." are not found or mismatch.");
      }
      foreach ($csv as $index => $row)
      {
        if($index === 0) continue;
        $merged_row = array_combine($excel_columns, $row);
        $products[] = $merged_row;
          if(trim($merged_row['sku']) === '') {
            $parent_sku[] = $merged_row['sku'];
          }
      }
      // print_r($products);

      foreach ($products as $key => $row)
      {
        $validation_result = $this->check_required_fields($row,$this->pro_update_required_columns,$key);
        if($validation_result['status'] === 'success')
        {

          $sku_check_result = $this->check_sku_fields_update($row,$this->db_child_sku,$key,'update');
          $format_result = $this->check_format_fields($row, $this->format_field_columns,$key);
          
          if($sku_check_result['status'] === 'success' && $format_result['status'] === 'success'){
            $this->passed_rows[] =  $row;
          }
        }
        if($validation_result['status'] === 'error')
        {
          $this->failed_rows[] =  $row;
          $errors[] = $validation_result['error'];
        }
        if( (isset($format_result['status']) && $format_result['status'] === 'error') || 
            (isset($format_result['status']) && $sku_check_result['status'] === 'error'))
        {
          $this->failed_rows[] =  $row;
          $errors[] = (isset($format_result['error']))?$format_result['error']:$sku_check_result['error'];
        }
      }
      $this->session->set_userdata('passed_rows',$this->passed_rows);
      $this->session->set_userdata('failed_rows',$this->failed_rows);

      if(count($errors))
      {
        if($method=='confirm')
          $err['msg'] = $this->confirm_update_upload();
        else
        {
          $err['type'] = 'rows';
          throw new Exception("Error Found.", 1);
        }
      }
    }
    catch(Exception $e)
    {
      $err['status'] = 'error';
      $err['msg'] = $e->getMessage();
      $err['errors'] = $errors;
    }
    if($err['status'] === 'success')
      $err['msg'] = $this->confirm_update_upload();

    return $err;
  }

  function prepare_product_update($products=array())
  {
    foreach ($products as $key => $value)
    {
      if(trim($value['sku']) !== '')
      {
        $up['quantity'] = $value['qty'];
        $up['price'] = $value['price'];
        $update = $this->cm->update(array('sku'=>$value['sku']),$up,'product_variants');
      }
    }
  }
  function confirm_update_upload()
  {
    $this->passed_rows = $this->session->userdata('passed_rows');
    $output['passed_rows'] = $this->passed_rows;
    $output['status'] = 'success';
    $product_id = $this->prepare_product_update($this->passed_rows);
    return $output;
  }

  function confirm_upload()
  {
    $this->passed_rows = $this->session->userdata('passed_rows');
    // echo '<pre>';print_r($this->passed_rows);die;
    // $output['passed_rows'] = $this->passed_rows;
    $output['status'] = 'success';
    $product_id = $this->prepare_insert_products($this->passed_rows);

    return $output;
  }

  function is_parent($row = array())
  {
    if(isset($row) && trim($row['parent_sku']) === '') return true;
    return false;
  }

  function check_required_fields($row = array(), $req_fields = array(),$line='')
  {
    $error_fields = array();
    $message = '';
    $output = array('status' => 'success');

    foreach($req_fields as $fields) {
      if(isset($row[$fields]) && trim($row[$fields]) === '') {
        $error_fields[] = $fields;
      }
    }

    if(count($error_fields)) {
      $output['status'] = 'error';

      if(count($error_fields) === 1) {
        $message = 'Column: '.($line+2).' '.implode(',', $error_fields) .' is required.';
      }
      else if(count($error_fields) > 1){
        $message = 'Column: '.($line+2).' '.implode(',', $error_fields) .' are required.';
      }
      $output['error'] = $message;     
    }
    
    return $output;
  }


 function check_required_category($row = array(), $req_fields = array(),$line=''){


    $error_fields = array();
    $message = '';
    $output = array('status' => 'success');
    
      if(in_array($row, array_column($req_fields,'name'))) {
         
      } else {
          $error_fields[] = $row;
      }
  
    
    if(count($error_fields)) {
      $output['status'] = 'error';
      $message = 'Row: '.($line+2).' Category is not valid.';
      $output['error'] = $message;     
    }
    
    return $output;

 }

 function check_required_sku($row = '',$line=''){

  $error_fields = array();
  $message = '';
  $output = array('status' => 'success');
  
    if($this->is_valid_sku($row)===TRUE) {
       
    } else {
        $error_fields[] = $row;
    }

  
  if(count($error_fields)) {
    $output['status'] = 'error';
    $message = 'Row: '.($line+2).' Sku is not valid.';
    $output['error'] = $message;     
  }
  
  return $output;

}

function is_valid_sku($row){
  $trsku = trim($row);
  if(preg_match('/[^a-z0-9 _]+$/i', $trsku)) {
    return false;
    } else {
      return true;
    }
 }

 function check_required_variants($row = array(), $req_fields = array(),$line=''){

    /* Variants color validations starts */

    $error_fields = array();
    $message = '';
    $output = array('status' => 'success');

    $colors = explode(";",$row['Color']);
    //print_r($req_fields); exit;
    foreach ($colors as $color) {
        if(in_array(trim($color), array_column($req_fields,'value'))){
         
      } else {
          $error_fields[] = $color;
      }
    }

    /* Variants color validations ends */


   /* Variants size validations starts */

    $error_fields1 = array();
    $output = array('status' => 'success');

    $sizes = explode(";",$row['Size']);
    //print_r($req_fields); exit;
    foreach ($sizes as $size) {
        if(in_array(trim($size), array_column($req_fields,'value'))){
         
      } else {
          $error_fields1[] = $size;
      }
    }

    /* Variants size validations ends */
      

   
    // print_r($error_fields); exit;
    
    if(count($error_fields)) {
      $output['status'] = 'error';
      $message = 'Row: '.($line+2).' Color is not valid.';
      $output['error'][] = $message;     
    }


    if(count($error_fields1)) {
      $output['status'] = 'error';
      $message = 'Row: '.($line+2).' Size is not valid.';
      $output['error'][] = $message;     
    }
    
    return $output;

 }


  function check_format_fields($row=array(),$format_fields=array(),$line='')
  {
    $error_fields = array();
    $message = '';
    $output = array('status' => 'success');

    foreach($format_fields as $fields) {
      if(isset($row[$fields]) &&  !is_numeric($row[$fields])) {
        $error_fields[] = $fields;
      }
    }

    if(count($error_fields)) {
      $output['status'] = 'error';

      if(count($error_fields) === 1) {
        $message = 'Column: '.implode(',', $error_fields).' is not in number format in row #'.($line+2);
      }
      else if(count($error_fields) > 1){
        $message = 'Columns: '.implode(',', $error_fields).' are not in number format in row #'.($line+2);
      }
      $output['error'] = $message;     
    }
    return $output;
  }


  function check_sku_fields($row=array(),$parent_sku=array(),$line='',$type='')
  {
    // print_r($parent_sku);die;
    $error_fields = array();$message = '';
    $output = array('status'=>'success');
    if(!in_array($row['Style'],$parent_sku) && !$this->in_array_r($this->db_parent_sku,'Style',$row['Style']))
    {
        $error_fields[] = $row['Style'];
    }
    if(count($error_fields))
    {
      $output['status'] = 'error';
      if(count($error_fields) === 1)
      {
        $message = 'Column: '.implode(',', $error_fields).' is not found or mismatched in row #'.($line+2);
      }
      else if(count($error_fields) > 1)
      {
        $message = 'Columns: '.implode(',', $error_fields).' are not found or mismatched in row #'.($line+2);
      }
      $output['error'] = $message;     
    }
    return $output;
  }

  function check_sku_fields_update($row=array(),$parent_sku=array(),$line='',$type='')
  {
    
    $error_fields = array();$message = '';
    $output = array('status'=>'success');
    if(!in_array($row['sku'],$parent_sku) && !$this->in_array_r($this->db_child_sku,'sku',$row['sku']))
    {
        $error_fields[] = $row['sku'];
    }
    if(count($error_fields))
    {
      $output['status'] = 'error';
      if(count($error_fields) === 1)
      {
        $message = 'Column: '.implode(',', $error_fields).' is not found or mismatched in row #'.($line+2);
      }
      else if(count($error_fields) > 1)
      {
        $message = 'Columns: '.implode(',', $error_fields).' are not found or mismatched in row #'.($line+2);
      }
      $output['error'] = $message;     
    }
    return $output;
  }

  function prepare_insert_products($products=array())
  {
    
    $this->inventory_model->disableAllProducts();

    foreach ($products as $key => $value)
    {
      
      /*Insert Parent Product Tables*/
      $product_id = $this->product_insert($value);
      /*Insert Product Categories*/
      $cat_ins_id = $this->product_category_insert($value,$product_id);

      /*Insert Product Variants*/
      $var_ins_id = $this->product_variants_insert($value);

      /*Images Insert*/
      $img_ins_id = $this->product_image_insert($value,$product_id,$value['Color']);
       
    }
  }

  function product_insert($value=array())
  {

    $ins['name']                = $value['Name'];
    $ins['sku']                 = trim($value['Style']);
    $ins['description']         = $value['Description'];
    $ins['type']                = "C";
    $ins['quantity']            = $value['Quantity'];
    $ins['price']               = $value['Wholesale Price'];
    $ins['made_in_usa']         = $value['made in usa'];
    $ins['wrinkle_free_knit']   = $value['wrinkle free knit'];
    $ins['regular_fit']         = $value['regular fit'];
    $ins['slim_fit']            = $value['slim fit'];
    $ins['loose_fit']           = $value['loose fit'];
    $ins['is_active']           = $value['Is Active'];
    $ins['material_content']    = $value['Material Content'];
    $ins['care_instructions']   = $value['Care Instructions'];

    $chk = $this->check_if_record_exists(array('sku'=>$value['Style']),'products');
    if($chk['status'] === 'success')
      $product_id = $this->cm->insert($ins,"products");
    else
    {
      $up['name']                = $value['Name'];
      $up['description']         = $value['Description'];
      $up['quantity']            = $value['Quantity'];
      $ins['type']               = "C";
      $up['price']               = $value['Wholesale Price'];
      $up['made_in_usa']         = $value['made in usa'];
      $up['wrinkle_free_knit']   = $value['wrinkle free knit'];
      $up['regular_fit']         = $value['regular fit'];
      $up['slim_fit']            = $value['slim fit'];
      $up['loose_fit']           = $value['loose fit'];
      $up['is_active']           = $value['Is Active'];
      $up['material_content']    = $value['Material Content'];
      $up['care_instructions']   = $value['Care Instructions'];
      $update_product = $this->cm->update(array('sku'=>$value['Style']),$up,"products");
      $product_id = $this->cm->get_where(array('sku'=>$value['Style']),'id',"products")->row_array()['id'];
    }
    return $product_id;
  }

  function product_category_insert($value=array(),$product_id='')
  {
    $cat['product_id'] = $product_id;
    $cat['category_id'] = $this->get_product_category_id($value['Category']);
    $chk = $this->check_if_record_exists(array('product_id'=>$product_id),'category_products');
    if($chk['status'] === 'success')
      $cat_ins_id = $this->cm->insert($cat,"category_products");
    else
      $update = $this->cm->update(array('product_id'=>$product_id),$cat,"category_products");
  }

  function product_image_insert($value=array(),$product_id='',$color=array())
  {
    $color = explode(";",$color);
    $this->getAllUploadedImages();
    foreach($color as $clr)
    {
      $f_sku = $value['Style']."-".$clr;
      $col = $this->get_variant_value_by_shortcode(trim($clr));
      $variant_id = $this->inventory_model->get_variant_ids($product_id,$clr);
      $img['product_id'] = $product_id;
      $img['product_variant_id'] = $variant_id['variants_ids'];

     // $featured = explode("-",$value['Featured']);

     // $f_img = $featured[0]."-".$featured[1];

      $img['is_featured'] = 0;

     // if($f_img === $f_sku)
     //   $img['is_featured'] = 1;

      $img['type'] = 'I';
      $file_name = $this->get_fileName($f_sku);

      if($file_name !=='')
      {
        
        $img['file_name'] = $file_name;

        $img_ins_id = $this->cm->insert($img,"product_images");

      }
    }
    /*
    $f_sku = $value['Style']."-".$color;
    $col = $this->get_variant_value_by_shortcode(trim($color));
    $variant_id = $this->inventory_model->get_variant_ids($product_id,$col);
    $img['product_id'] = $product_id;
    $img['product_variant_id'] = $variant_id['variants_ids'];
    $featured = explode("-",$value['Featured']);
    $f_img = $featured[0]."-".$featured[1];
    $img['is_featured'] = 0;
    if($f_img === $f_sku)
      $img['is_featured'] = 1;
    $img['type'] = 'image';
    $img['file_name'] = $f_sku.".jpg";
    if(in_array($f_sku,$this->_UploadedImgs))
      $img_ins_id = $this->cm->insert($img,"product_images");*/

  }

  function get_fileName($sku='')
  {
    $filename = "";
    $file1 = $sku.".jpg";
    $file2 = $sku.".png";
    if(in_array($file1,$this->_UploadedImgs))
      $filename = $file1;
    else if(in_array($file2,$this->_UploadedImgs))
      $filename = $file2;
    
    return $filename;
  }

  function product_variants_insert($value=array())
  {


    $product_id = $this->get_sku_product_id(trim($value['Style']));

    $colorValues = explode(";",$value['Color']);
    $sizeValues = explode(";",$value['Size']);

    $this->load->model('variants_model');
    $variants = $this->variants_model->get_variant_shortcodes();
    

    $color = array();
    $size = array();

    foreach ($colorValues as $colorValue) {
      $colorValue = trim($colorValue);
      if (isset($variants[$colorValue]) && $variants[$colorValue]['variant_id'] == '1') {
        $color[] = $variants[$colorValue]['short_code'];
      }
    }

    foreach ($sizeValues as $sizeValue) {
      $sizeValue = trim($sizeValue);
      if (isset($variants[$sizeValue]) && $variants[$sizeValue]['variant_id'] == '2') {
        $size[] = $variants[$sizeValue]['short_code'];
      }
    }


    $i=0;
    $v_skus = array();
    $var_ins_id = array();

   foreach($color as $vkey => $c_value)
    {
      foreach($size as $skey => $s_value)
      {
       
        $variant = array();

        $vcolor =  $this->variants_model->get_variant_value_by_shotcode($c_value);
        $vsize  =  $this->variants_model->get_variant_value_by_shotcode($s_value);
        
        $sku   = trim($value['Style'])."-".trim($vcolor['value'])."-".trim($s_value);
        
        if($vkey==0 && $skey ==0){
         $variant['is_featured']  = 1;
        } else{
         $variant['is_featured']  = 0;
        }
        
        //$p_name  = $variant['product_variant_name'] = trim($value['Name'])."-".trim($vcolor)."-".trim($vsize);

        $p_name = trim($value['Name'])." ".$vsize['value']."/".$vcolor['value'];
        $variant['product_id'] = $product_id;
        $variant['product_variant_name'] = $p_name;
        $variant['sku'] = $sku;
        $variant['price'] = $value['Wholesale Price'];
        $variant['quantity'] = $value['Quantity'];
        $variant['is_active'] = 1;
        $chk = $this->check_if_record_exists(array('sku'=>$sku),'product_variants');
        if($chk['status'] === 'success')
        {
          if($variant['is_featured']  == 1) {
            //
            $this->inventory_model->unsetFavoriteFlag($value['Style']."-");
          }

          $var_ins_id = $this->cm->insert($variant,"product_variants");
          /*Insert Product Details*/
          $det_ins_id = $this->product_detail_insert($c_value,$s_value,$var_ins_id);
        }
        else
        {
        	
          $up['product_id'] = $product_id;
          $up['product_variant_name'] = $p_name;
          $up['price'] = $value['Wholesale Price'];
          $up['quantity'] = $value['Quantity'];
          $up['is_active'] = 1;
          $update = $this->cm->update(array('sku'=>$sku),$up,"product_variants");
          $var_ins_id = $this->cm->get_where(array('sku'=>$sku),'id',"product_variants")->row_array()['id'];
         // print_r($var_ins_id); exit;

        }
        /*Insert Product Images*/
        $v_skus[] = $sku;
        
      }
    }

    $this->inventory_model->update_variants_status($v_skus, $product_id);

    return $var_ins_id;
  }


  function product_detail_insert($color='',$size='',$var_ins_id='')
  {
    $det1['product_variants_id'] = $var_ins_id;
    $det1['variant_value_id'] = $this->get_variant_value_by_shortcode(trim($color));
    $det1_ins_id = $this->cm->insert($det1,"product_details");

    $det2['product_variants_id'] = $var_ins_id;
    $det2['variant_value_id'] = $this->get_variant_value_by_shortcode(trim($size));
    $det2_ins_id = $this->cm->insert($det2,"product_details");
  }
  function check_if_record_exists($where=array(),$table='')
  {
    $output = array('status'=>'success');
    $chk = $this->cm->get_where($where,'*',$table)->row_array();
    if(count($chk))
      $output = array('status'=>'error','msg'=>'Record already exists.');

    return $output;
  }

  function get_product_category_id($name='')
  {
    $get_id = $this->cm->get_where(array("name"=>$name),"id",'categories')->row_array();
    return $get_id['id'];
  }
  
  function in_array_r($array, $field, $find)
  {
    foreach($array as $item){
        if($item[$field] == $find) return true;
    }
    return false;
  }
  function get_variant_value_by_shortcode($variant='')
  {
    $get_id = $this->cm->get_where(array("short_code"=>$variant),"id",'variant_value')->row_array();
    return $get_id['id'];
  }

  function get_sku_product_id($sku='')
  {
    $get_id = $this->cm->get_where(array("sku"=>$sku),"id",'products')->row_array();
    return $get_id['id'];
  }


    //update userinfo
    function product_put()
    {
        $output = array();

        try
        {
            // $name          = $this->put('name');
            // $sku           = $this->put('sku');
            // $description   = $this->put('description');
            // $quantity      = $this->put('quantity');
            // $price         = $this->put('price');
            // $is_active     = $this->put('isActive');
            // $category      = $this->put('category');
            // $user_id       = $this->put('user_id');
            $variants          = $this->put('variants');
            $variant_color     = $this->put('variant_color');
            $variant_size      = $this->put('variant_size');
            $productData       = $this->put('productData');

            $name              = $productData['name'];
            $sku               = $productData['sku'];
            $description       = $productData['description'];
            $quantity          = $productData['quantity'];
            $price             = $productData['price'];
            $is_active         = $productData['isActive'];
            $made_in_usa       = $productData['madeInusa'];
            $wrinkle_free_knit = $productData['wrinkleFreeknit'];
            $regular_fit       = $productData['regularFit'];
            $slim_fit          = $productData['slimFit'];
            $loose_fit         = $productData['looseFit'];
            $category          = $productData['category'];
            $user_id           = $productData['userId'];
            $product_type      = $productData['productType'];
            $material_content  = $productData['materialContent'];
            $care_instructions  = $productData['careInstructions'];

            if($product_type == 'configurable'){
            	$type = 'C';
            }
            //print_r($variants);exit;
            
            if(!isset($name)){
                throw new Exception("INVALID Productname");                
            }
            
            if(!isset($sku)){
                throw new Exception("INVALID sku");                
            }

            if(!isset($description)){
                throw new Exception("INVALID Description ");                
            }

            $data = $this->inventory_model->get_where(array("sku" => $sku),'*');
            
            if( $data->num_rows() > 0 )
            {
              throw new Exception("Sku Already Exists!");
            }    
            
            // $valid_sku  =  $this->inventory_model->is_valid_sku($sku);
            // if($valid_sku === FALSE){
            //     throw new Exception("Sku should contain letters, numbers, spaces, \"_\" and \"-\".");                
            // }
               
                $ins_data = array();
                $ins_data['name']               = $name;
                $ins_data['sku']                = trim($sku);
                $ins_data['description']        = $description;
                $ins_data['quantity']           = $quantity;
                $ins_data['price']              = $price;
               // $ins_data['category']         = $category;
                $ins_data['material_content']   = $material_content;
                $ins_data['care_instructions']  = $care_instructions;
                $ins_data['is_active']          = $is_active;
                $ins_data['made_in_usa']        = $made_in_usa;
                $ins_data['wrinkle_free_knit']  = $wrinkle_free_knit;
                $ins_data['regular_fit']        = $regular_fit;
                $ins_data['slim_fit']           = $slim_fit;
                $ins_data['loose_fit']          = $loose_fit;

                $ins_data['created_id']         = $user_id;
                $ins_data['type']               = $type;
                $ins_data['created_time']       = date("Y-m-d H:i:s");

                $product_id = $this->inventory_model->insert($ins_data);  

                $category_data = array();
                $category_data['product_id']   = $product_id;
                $category_data['created_time'] = date("Y-m-d H:i:s");
                $category_data['created_id']   = $user_id;
                $category_data['category_id']  = $category;
                $category_product_id = $this->inventory_model->insert($category_data,'category_products');
            
                
                foreach($variants as $vkey => $vvalue){

                	

                    $product_variants = array();

                    
                	if($vkey==0)
                	$product_variants['is_featured ']        = 1;

                    $product_variants['product_id']           = $product_id;
                    $product_variants['product_variant_name'] = $vvalue['product_name']." ".$vvalue['size']."/".$vvalue['color'];
                    $product_variants['quantity']             = $vvalue['quantity'];
                    $product_variants['sku']                  = $vvalue['short_code'];
                    $product_variants['price']                = $vvalue['price'];
                    $product_variants['is_active']            = 1;
                    $product_variants['created_id']           = $user_id;
                    $product_variants['created_time']         = date("Y-m-d H:i:s");
                    
                    $product_variants_id = $this->inventory_model->insert($product_variants,'product_variants');

                    $variants_value_id = explode(",",$vvalue['variant_value_ids']);

                    $product_variants = array();
                    for($i=0; $i<count($variants_value_id); $i++){
                            
                        $product_variants_detail['product_variants_id']  = $product_variants_id;
                        $product_variants_detail['variant_value_id']     = $variants_value_id[$i];
                        $product_variants_detail['created_id']           = $user_id;
                        $product_variants_detail['created_time']         = date("Y-m-d H:i:s");
                        $product_variants_detail_id = $this->inventory_model->insert($product_variants_detail,'product_details');
                        
                    }
                    
                }

            $output['status']    = 'success';
            $output['message']   = 'Product added Succesfully';
        }
        catch(Exception $e){
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);       
    }  
	

    //getproducts
    function product_get()
    {
        
        try
        {
            $product_id = $this->get("id");
            $type       = $this->get("type");

            $output['product_info']  = $this->inventory_model->get_product_by_id($product_id);
            $output['status']        = 'success';
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }


    //getvariants
    function variants_get()
    {
        
        try
        {
            $output['variants'] = $this->inventory_model->list_variants();
            $output['status']   = 'success';
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }
    //getCategories
    function categoriesByProduct_get()
    {
        
        try
        {
            $product_id           = $this->get('product_id');
            $output['categories'] = $this->inventory_model->categories($product_id);
            $output['sel_categories'] = $this->inventory_model->categoriesByProduct($product_id);
            // $output['categories'] = $this->inventory_model->categories_new();
            $output['status']     = 'success';
            //$output['query']      = $this->db->last_query();
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }

    function vendorsByProduct_get()
    {
      try
      {
        $product_id           = $this->get('product_id');
        $output['vendors'] = $this->inventory_model->vendors_by_product($product_id);
        $output['status']     = 'success';
      }
      catch(Exception $e)
      {
        $output['status']   = 'error';
        $output['message']  = $e->getMessage();
      }

      $this->response($output);
    }

    
    //getCategories
    function categories_get()
    {
        
        try
        {
            $product_id           = $this->get('product_id');
            $output['categories'] = $this->inventory_model->categories($product_id);
            // $output['categories'] = $this->inventory_model->categories_new();
            $output['status']     = 'success';
            //$output['query']      = $this->db->last_query();
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }

    function categories_new_get()
    {
        
        try
        {
            $product_id           = $this->get('product_id');
            //$output['categories'] = $this->inventory_model->categories($product_id);
            $output['categories'] = $this->inventory_model->categories_new();
            $output['status']     = 'success';
            //$output['query']      = $this->db->last_query();
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }
 
    //getCategories by searchkey
    
    function categories_by_key_get()
    {
        
        try
        {
            $search_key = $this->get('search_key');

            if(!isset($search_key)){
                throw new Exception("INVALID Search Key");                
            }

            $output['categories'] = $this->inventory_model->get_categories_by_search_key($search_key);
            $output['status']     = 'success';
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }


    function list_post()
    {

        try
        { 
            $this->prepare_listing_params();
            $user_id = $this->post('userId');
            $role = $this->post('role');
            if($role==='V')
              $output = $this->inventory_model->list_vendor_products($user_id, $role);
            else
              $output = $this->inventory_model->list_products($role);
            $output['status']   = 'success';
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }

    //update product categories
    function categories_post()
    {
        try
        {
            $categories           = $this->post('categories');
            $product_id           = $this->post('product_id');
            
            if(!count($categories)){
                throw new Exception("Invalid category select");
            }

            
            if(empty($product_id)){
                throw new Exception("Invalid Product ID");
            }
            //delete all category by product id
            $this->inventory_model->delete(array("product_id" => $product_id),"category_products");
            
            foreach($categories as $category){
                
                $already_category_exists   = $this->inventory_model->get_where(array("category_id" => $category['id'],"product_id" => $product_id),"*","category_products")->row_array();

                if(count($already_category_exists)==0){
                    $ins_data = array();
                    $ins_data['category_id']   = $category['id'];
                    $ins_data['product_id']    = $product_id;
                    $ins_data['created_time']  = date("Y-m-d H:i:s");
                    $this->inventory_model->insert($ins_data,"category_products");
                }
            }

            $output['status']     = 'success';
            //$output['query']      = $this->db->last_query();
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }


    //get product variants
    function variants_by_product_id_get()
    {

      try
      {
        $product_id   = $this->get('product_id');

        if(empty($product_id)){
          throw new Exception("Invalid Product ID");
        }

        $product_variants = $this->inventory_model->get_where(array("product_id" => $product_id),"*","product_variants")->result_array();

        $output['product_variants']  = $product_variants;
        $output['status']            = 'success';
      }
      catch(Exception $e) 
      {
        $output['status']   = 'error';
        $output['message']  = $e->getMessage();
      } 

      $this->response($output);

    }

    function getColorsByProductID_get(){

      $id = $this->get('productID');
      $output['data'] = $this->inventory_model->get_colors_by_id($id);
      $output['status'] = 'success';
      $this->response($output);

    }

   //add new variant
   function add_new_variant_put()  
   {
      try
      {
        $product_id   = $this->put('product_id');
        $size         = $this->put('size');
        $qty          = $this->put('qty');
        $color        = $this->put('color');
        $product_name = $this->put('product_name');

        if(empty($product_id)){
          throw new Exception("Invalid Product ID");
        } 
        
        if(!isset($size) || !isset($color)){
          throw new Exception("Invalid Variant Selected");
        }
        $get_pro = $this->inventory_model->get_where(array("id"=>$product_id),"sku,price",'products')->row_array();
        $pro_sku = $get_pro['sku'];
      
        $ins_data = array();
        $ins_data['sku']                  = $pro_sku."-".$color['short_code']."-".$size['short_code'];
        $ins_data['product_id']           = $product_id;
        $ins_data['quantity']             = $qty;
        $ins_data['price']                = $get_pro['price'];
        $ins_data['product_variant_name'] = $product_name." ".$color['name']." ".$size['name'];
        $ins_data['is_active']            = 1;
        $ins_data['created_time']         = date("Y-m-d H:i:s");
        $product_variants_id              = $this->inventory_model->insert($ins_data,"product_variants");

        $this->add_product_variants($color['variant_value_id'],$product_variants_id);
        $this->add_product_variants($size['variant_value_id'],$product_variants_id);

        $output['product_variants_id']  = $product_variants_id;
        $output['status']               = 'success';
        $output['message']              = 'Variant Added Successfully';
      }
      catch(Exception $e) 
      {
        $output['status']   = 'error';
        $output['message']  = $e->getMessage();
      } 

      $this->response($output); 
   }

   function add_product_variants($variant_value_id, $product_variants_id)
   {
      $product_variants = $this->inventory_model->get_where(array("product_variants_id" => $product_variants_id,"variant_value_id" => $variant_value_id),"*","product_details")->result_array();
      if(!count($product_variants)){
        $ins_data = array();
        $ins_data['variant_value_id']    = $variant_value_id;
        $ins_data['product_variants_id'] = $product_variants_id;
        $product_details_id = $this->inventory_model->insert($ins_data,"product_details");
      }
      
   }

   function variants_post()
   {

        try
        {

          $sku            = $this->post('sku');
          $value          = $this->post('value');
          $type           = $this->post('type');
          
          if(empty($sku)){
            throw new Exception("Invalid Sku");
          } 
          
          if(!isset($value) || !isset($type)){
            throw new Exception("Invalid INPUT");
          }

        
          $ins_data = array();
          if($type == "price"){
            $ins_data['price']                = $value;
          }
          if($type == 'quantity'){
            $ins_data['quantity']             = $value;
          }
          $ins_data['updated_time']         = date("Y-m-d H:i:s");
          $product_variants_id              = $this->inventory_model->update(array("sku" => $sku),$ins_data,"product_variants");

          $output['product_variants_id']  = $product_variants_id;
          $output['status']               = 'success';
          $output['message']              = 'Variant Updated Successfully';
        }
        catch(Exception $e) 
        {
          $output['status']   = 'error';
          $output['message']  = $e->getMessage();
        } 

        $this->response($output);
   }

   // RAMAKRISHNAN

    public function all_variants_get() {
      $output = array();
      $output['status'] = 'success';
      $output['data'] = $this->inventory_model->get_variants();
      $this->response($output);
    }

    public function parentProductsByCategories_get() {

      $output = array();
      $output['status'] = 'success';
      
      $vendor_id = 0;
      $type = 'SO';
      if ($this->get('vendor_id')) {
        $vendor_id = $this->get('vendor_id');
      }
      if ($this->get('order_type')) {
        $type = $this->get('order_type');
      }

      $output['data'] = $this->inventory_model->products_by_category($vendor_id, $type);
      //$output['vendors'] = $this->inventory_model->get_vendors();
      $this->response($output);

    }

    public function productByVendor_get() {

      $vendor_id = $this->get('id');
      $category = array();
      if ($this->get('category')) {
        $category = explode(',', $this->get('category'));
      }
      
      $variant_value_id = $this->get('variant');

      // $variant_value_id = "";
      // if( $variant_value != '' )
      // {
      //   $res = $this->inventory_model->get_where(array("value"=>$category),"id","variant_value")->row_array();
      //   $variant_value_id  = $res['id'];
      // }

      $output = array();
      $output['status'] = 'success';
      $output['val'] = $variant_value_id;
      $output['data'] = $this->inventory_model->products_by_vendor($vendor_id,$variant_value_id, $category);
      //$output['vendors'] = $this->inventory_model->get_vendors();
      $this->response($output);
    }

     public function get_ventors_get() {
      $output = array();
      $output['status'] = 'success';
      $output['data'] = $this->inventory_model->get_vendors();
      $this->response($output);
    }

    public function select_customers_get() {

        try
        {

          $vendor_id            = $this->get('vendor_id');
  
          if(empty($vendor_id)){
            throw new Exception("Invalid vendor_id");
          } 
          
         
         $output['data'] = $this->inventory_model->select_customers($vendor_id);
         $output['status']     = 'success';
        }
        catch(Exception $e) 
        {
          $output['status']   = 'error';
          $output['message']  = $e->getMessage();
        } 

        $this->response($output);
    
    }

    public function productDetails_get() {
      // echo '<pre>'; print_r($this->get('product_ids'));die;
      $product_ids = array();
      if($this->get('product_ids')) {
        $product_ids = $this->get('product_ids');
      }
      $type = $this->get('order_type')?$this->get('order_type'):'PO';
      $vendor_id = $this->get('vendor_id')?$this->get('vendor_id'):'0';

      $output = array();
      $output['status'] = 'success';
      $output['data'] = $this->inventory_model->product_details($product_ids, $type, $vendor_id);
      // echo $this->db->last_query();die;
      $output['query'] = $this->db->last_query();

      $this->response($output);
    }
    public function download_csv_post()
    {
      $header[] = array('name','sku','price','quantity','','');
      $arr = array_merge($header,$this->post('items'));
        // echo "<pre>";print_r($arr);exit;
      $fp = fopen('../docs/file.csv', 'w');
      $file_name = 'file.csv';
      foreach ($arr as $key => $fields)
      {
        array_pop($fields);array_pop($fields);
        fputcsv($fp, $fields);
      }
      fclose($fp);

      $output['status'] = "success";
      $output['url'] = "http://localhost/clara-multi-vendor/docs/".$file_name;
      $output['items'] = $this->post('items');
      $this->response($output);
    }

    function productImgBulkUpload_post()
    {

      $output['status'] = "success";

      try
      {

        $root_path   = "docs/product/";
        $folder_path = "docs/product/temp/";
        $form        = $this->post();

       /* if(!file_exists($folder_path))
        {
          mkdir($root_path,0777);
          mkdir($folder_path,0777);
        }*/

        if( !isset($form) || $form['productID'] === '' || empty($form['productID']))
          throw new Exception('Product is null');

        if(empty($_FILES) || !isset($_FILES))
          throw new Exception('No Images uploaded');

        $where['id'] = $form['productID'];
        $ex = array('jpg','png','jpeg','gif');

        $product = $this->inventory_model->get_where($where,"*","products")->row_array();

        if($form['variantID'] !== 'Video')
          $variant_id = $this->inventory_model->get_variant_ids($form['productID'],$form['variantID']);
        else
          $variant_id['variants_ids'] = 0;

        if($_FILES['fileKey']['tmp_name'] !== '')
        {

          $ext = $this->getFileExtension($_FILES['fileKey']['name']);

          $file_name = $product['sku']."_".$form["variantID"].".".$ext;
          $uri       = "product-images/".$form['productID']."/".$file_name;
          
          $sku       = $product['sku']."_".$form['variantID'];

          if( in_array($ext,$ex) && ( $form['variantID'] !== 'Video') ) {
            $uploaded_image_data = $this->do_upload_image();
            $uploaded_image_data = $uploaded_image_data['upload_data'];
            $this->s3_upload( $uri, $_FILES['fileKey']['tmp_name'] );
            $this->resize_image_array($sku,$uploaded_image_data['full_path'],$form['productID'],$ext);
          }
          else
          {  
             $this->s3_upload( $uri, $_FILES['fileKey']['tmp_name'] );
          }
         
          $ins['file_name']          = $file_name;
          $ins['product_id']         = $form['productID'];
          $ins['product_variant_id'] = $variant_id['variants_ids'];

          if(in_array($ext,$ex) && $form['variantID'] !== 'Video')
            $ins['type'] = 'I';
          else if($form['variantID'] === 'Video')
            $ins['type'] = 'V';

          $ins_img = $this->inventory_model->insert($ins,"product_images");


        }

        $output['files'] = $_FILES;
        $output['msg'] = "Uploaded Successfully.";
      }
      catch(Exception $e)
      {
        $output['status'] = 'error';
        $output['msg'] = $e->getMessage();
      }

      $this->response($output);

    }

    public function resize( $imageData = array() )
    {

        $this->load->library('images');
      
        
        foreach($imageData as $imkey => $imvalue) {

          
          //$path = ($imvalue['type'] == 'bulk')?$_SERVER['SCRIPT_NAME'].$imval
          $filepath = ($imvalue['type'] == 'bulk')?$imvalue['name']:$imvalue['file'];

          $this->images->resize($imvalue['file'], $imvalue['maxwidth'], $imvalue['maxheight'],$imvalue['name'],false);

           if(file_exists($imvalue['name'])){
              
              $this->s3_upload($imvalue['uri'], $imvalue['name']);
           } 
           else
           {
             //return $this->response(array("status" => 'error', 'msg' => "Doesn't exists file to upload s3"));
           }
        }

    }


    public function do_upload_image()
    {

      $config['upload_path']          = './assets/images/products';
      $config['allowed_types']        = 'gif|jpg|png';
    //  $config['max_size']             = 100;
     // $config['max_width']            = 1024;
     // $config['max_height']           = 768;

      $this->load->library('upload', $config);

      if ( ! $this->upload->do_upload('fileKey'))
      {
              $error = array('error' => $this->upload->display_errors());
             // print_r($error);
      }
      else
      {
              $data = array('upload_data' => $this->upload->data());
              return $data;
              //print_r($data);
      }

    }

    public function bulk_upload_images_resize_post() {
      $output = array('status' => 'success');

      $result = $this->upload_manager->processImagesAndVideos();

      if (!$result) {
        $output['status'] = 'error';
        $output['msg'] = $this->upload_manager->getErrorMessage();
      } else {
        $output['msg'] = $this->upload_manager->getSuccessMessage();
      }
      $output['invalid_images'] = $this->upload_manager->getUploadErrors();
      

      $this->response($output);

    }

    public function bulk_upload_images_resize_old_post()
    {

      $output['status'] = 'success'  ;

      $this->load->model('variants_model');
      $variants = $this->variants_model->get_variant_shortcodes();

      try
      {

        $dir = './uploads/product_images/'; 

         $sku = array(); $images = array(); 

         $not_exists_images = array();
         $not_exists_sku    = array();
    
        if (is_dir($dir)) {

          if ($dh = opendir($dir)) {

              $file = '';

              while (($file = readdir($dh)) !== false) {

                if($file !='.' && $file !='..') {
                
                  $sku = explode('.',$file);

                  $get_product_sku = explode("-",$sku[0]);

                  if (count($get_product_sku) > 1 && isset($variants[$get_product_sku[1]])) {
                    $variant = $variants[$get_product_sku[1]];
                    $get_product_sku[1] = $variant['short_code'];

                    $sku[0] = implode('-', $get_product_sku);
                  } else {
                    continue;
                  }
            
                  $get_product_id  = $this->inventory_model->get_where( array('sku'=> $get_product_sku[0]),"*","products")->row_array();

                  //print_r($get_product_id);

                  $filepath = '';

                  if(isset($imvalue)){
                    $filepath       = './uploads/product_images/'.$file;
                  }

                  $variant_id = $this->inventory_model->get_products_variant_ids($get_product_id['id'],$sku[0]);
                  
                  if(count($get_product_id) && (!empty($variant_id['variants_ids']))) {

                    //if(in_array($imvalue,$images) && !empty($filepath)) {

                        $filepath       = './uploads/product_images/'.$file;
                        $file_name      = $file;
                        $uri            = "product-images/". $get_product_id['id']."/".$file_name;

                        $this->s3_upload( $uri, $filepath );

                        $already_exists = $this->inventory_model->get_where(array("file_name" => $file_name, 'product_id' => $get_product_id['id']),"*","product_images")->result_array();

                        if(!count($already_exists)){

                          $ins['file_name']          = $file_name;
                          $ins['product_id']         = $get_product_id['id'];
                          $ins['product_variant_id'] = $variant_id['variants_ids'];
                          $ins['type']               = 'I';
                        
                          $ins_img = $this->inventory_model->insert($ins,"product_images");
                            
                        }

                        $this->resize_image_array($sku[0],$filepath,$get_product_id['id'],$sku[1],'bulk');
                      // }
                      // else
                      // {
                      //      $not_exists_images[] = $imvalue;
                      // }
                  }
                  else
                  {
                      $not_exists_sku[] = $sku[0]; 
                  }
                  
                }

              }

              closedir($dh);

           }

        }
        else
        {
          throw new Exception("Uploads folder doesn't create");
        }
      
        //exit;
        
        $output['invalid_sku']    = $not_exists_sku;
        $output['invalid_images'] = $not_exists_images;
       
        //  $output['invalid_sku']    = (count($not_exists_sku)>0 && !empty($not_exists_sku)) ? $not_exists_sku : "";
    
        // $output['invalid_images'] = (count($not_exists_images)>0 && !empty($not_exists_sku)) ? $not_exists_images : "";
        $output['msg']            = 'Uploaded Successfully';

      }
      catch(Exception $e)  {
        $output['status']         = 'error';
        $output['msg']            = $e->getMessage();
      }

      $this->response($output);

    }


  public function resize_image_array($sku = '', $filepath = '', $product_id = '', $ext = '', $type = '')
  {
      $resize_image_path = "./assets/images/products/";  

      $large  = $resize_image_path.$sku."_"."large".".".$ext;
      $medium = $resize_image_path.$sku."_"."medium".".".$ext;
      $small  = $resize_image_path.$sku."_"."small".".".$ext;
      $xtra_sm= $resize_image_path.$sku."_"."xtra_small".".".$ext;

      $uri   = "product-images/".$product_id."/";
      $large_image_uri      = $uri.$sku."_"."large".".".$ext;
      $medium_image_uri     = $uri.$sku."_"."medium".".".$ext;
      $small_image_uri      = $uri.$sku."_"."small".".".$ext;
      $xtra_small_image_uri = $uri.$sku."_"."xtra_small".".".$ext;

      //resize images sizes
      $image_sizes[] = array('uri' => $large_image_uri, 'maxwidth' => 1092, 'maxheight' => 2048, 'name' => $large, 'file' => $filepath , 'type' => $type );
      $image_sizes[] = array('uri' => $medium_image_uri, 'maxwidth' => 546, 'maxheight' => 1024, 'name' => $medium, 'file' => $filepath, 'type' => $type );
      $image_sizes[] = array('uri' => $small_image_uri, 'maxwidth' => 128, 'maxheight' => 240, 'name' => $small, 'file' => $filepath, 'type' => $type );                
      $image_sizes[] = array('uri' => $xtra_small_image_uri, 'maxwidth' => 85, 'maxheight' => 159, 'name' => $xtra_sm, 'file' => $filepath, 'type' => $type );

      $this->resize($image_sizes);

  }

    public function s3_upload($uri='',$path='')
    {

        $this->load->library('s3');
        $this->s3->putBucket($this->_bucket);
        $contents = file_get_contents($path);
        $this->s3->putObject($contents, $this->_bucket,$uri);
    }

    public function getFileExtension($file_name='')
    {
        $ext =  explode('.', $file_name);
        return end($ext);
    }

    public function getProductImages_get()
    {
        $pro_id = $this->get('productID');
        $output['status'] = "success";
        // $output['data'] = $this->inventory_model->get_where(array('product_id'=>$pro_id),"*","product_images")->result_array();
        $output['data'] = $this->inventory_model->get_product_images($pro_id);  
        $this->response($output);
    }

    public function delImages_post()
    {
        $this->load->library('s3');
        $row_id = $this->post('rowid');
        $this->inventory_model->delete(array("id"=>$row_id),"product_images");
        $uri = "product-images/".$this->post('uri');
        $del = $this->s3->deleteObject($this->_bucket,$uri);
        $output['status'] = 'success';
        $output['msg'] = $del;
        $this->response($output);
    }

    public function setFav_post()
    {
    	

      $sku = $this->post('sku');

      $get = $this->inventory_model->get_where(array('sku'=>$sku),"*","product_variants")->row_array();

      $p_id = $get['product_id'];
      $up1['is_featured'] = 0;
      $up2['is_featured'] = 1;
      $this->inventory_model->update(array("product_id"=>$p_id),$up1,"product_variants");
      $this->inventory_model->update(array("sku"=>$sku),$up2,"product_variants");
      $this->inventory_model->update(array("product_id"=>$p_id),$up1,"product_images");
      // $this->db->query("update product_images set is_featured=1 where FIND_IN_SET (".$get['id'].",product_variant_id)");
      $output['status'] = 'success';
      $output['msg'] = 'Favourite Variant Set Successfully';
      $this->response($output);

    }

    function getAllUploadedImages(){
      $arr = [];
      $files = scandir("./assets/images/uploads/");
      $hideName = array('.','..','.DS_Store'); 
      foreach($files as $filename) {
          if(!in_array($filename, $hideName)){
            /* echo the name of the files */
            $a = explode('.',$filename);
            $arr[] = $a[0];
          }
      }
      $this->_UploadedImgs = $arr;
    }

    //Disable product
    function product_disable_post()
    {
        $output = array();

        try
        {
            $id       = $this->post('id');
            $product_info = array();
            $product_info['is_active'] = 0;
            $product_info['updated_id']  =  "0";
            $product_info['updated_time']= date("Y-m-d H:i:s");
            $this->inventory_model->update(array('id' => $id), $product_info);

            $variant_info = array();
            $variant_info['is_active'] = 0;
            $variant_info['updated_id']  =  "0";
            $variant_info['updated_time']= date("Y-m-d H:i:s");
            $this->inventory_model->update(array('product_id' => $id), $variant_info, 'product_variants');
            
            $output['message'] = 'Product disabled successfully';
            $output['status']    = 'success';           
            
        }
        catch(Exception $e){
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();

        }

        $this->response($output);
    }

    //Enable product
    function product_enable_post()
    {
        $output = array();

        try
        {
            $id       = $this->post('id');
            $product_info = array();
            $product_info['is_active'] = 1;
            $product_info['updated_id']  =  "0";
            $product_info['updated_time']= date("Y-m-d H:i:s");
            $this->inventory_model->update(array('id' => $id), $product_info);

            $variant_info = array();
            $variant_info['is_active'] = 1;
            $variant_info['updated_id']  =  "0";
            $variant_info['updated_time']= date("Y-m-d H:i:s");
            $this->inventory_model->update(array('product_id' => $id), $variant_info, 'product_variants');
            
            $output['message'] = 'Product enabled successfully';
            $output['status']    = 'success';           
            
        }
        catch(Exception $e){
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();

        }

        $this->response($output);
    }

    function variantsValueDelete_post() {
  
      $output = array();
      try {
        $variant_value_id     = $this->post('id');
        
        if (!(int)$variant_value_id) {
          throw new Exception("Invalid ID.");          
        }

        $message = '';
        $data = $this->inventory_model->get_variants_sku($variant_value_id);

        if (count($data)) {
          $skus = array();
          foreach ($data as $row) {
            $skus[] = $row['sku'];
          }
          $message = 'Record can not be deleted as the variant is mapped with the products ';
          $message .= implode(',', $skus).' .';
          throw new Exception($message);

        } else {
          $this->inventory_model->delete(array("id" => $variant_value_id),'variant_value');
          $message = 'Record deleted successfully.';
        }
        
        $output['status'] = 'success';
        $output['message'] = $message; 
      } catch (Exception $e) {
        $output['status'] = 'error';
        $output['message'] = $e->getMessage();
      }
      $this->response($output);
    }
}
//

