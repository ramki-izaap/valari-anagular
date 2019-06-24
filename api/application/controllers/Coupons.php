<?php

defined('BASEPATH') OR exit('No direct script access allowed');

require_once(APPPATH."controllers/AppController.php");

Class Coupons extends AppController {
	public $passed_rows = array();
  public $failed_rows = array();
	public $required_columns = array('code','title');
	public $columns  = array('code','title');
	function __construct()
    {
        parent::__construct();
        $this->load->model('coupons_model','cm');
    }

   /// Countries Name List ////
    function list_countries_post()
    {

        $output = array(); 
        try{
            
            $output['countries']  = $this->cm->list_countries_name();
            $output['status']   = 'success';

        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }

 /// States Name List ////
    function list_states_get()
    {
         
         $output = array(); 
         try{
            // $countries = $this->get('countries');
            $output['states']  = $this->cm->list_states_name();
            $output['status']   = 'success';

        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }

   /// Coupons Create //// 

    function create_put(){
        
        $output = array();

        try
        {
            $output['files'] = $_FILES;
            $off_for = $this->put('off_for');
            $trigger_amount = $this->put('amount');
            $benefit_amount = $this->put('amount_percentage');
            $discount_type = $this->put('amount_type');
            $total_usage = $this->put('discount_used');
            $user_usage = $this->put('discount_used_one_user');
            $countries = $this->put('countries');
						$state = $this->put('state');
						$csv_file = $this->put('csv_file');
            $addons = $this->put('coupon_documents');
            $start_date = date('Y-m-d H:i:s',strtotime($this->put('discount_begins')));
            $end_date = date('Y-m-d H:i:s',strtotime($this->put('discount_expires')));
            $created_id = $this->put('user_id');
            $created_time = date('Y-m-d H:i:s');
            
            $ins_data = array();
            $ins_data['type']  = $off_for;
            $ins_data['trigger_amt']  = $trigger_amount;
            $ins_data['benefit_amt']  = $benefit_amount;
            $ins_data['discount_type']  = $discount_type;
            $ins_data['total_usage_limit']  = $total_usage;
            $ins_data['user_usage_limit']  = $user_usage;
            $ins_data['valid_countries']  = $countries;
            $ins_data['valid_states']  = $state;
            $ins_data['add_ons']  = $addons;
            $ins_data['start_date']  = $start_date;
            $ins_data['end_date']  = $end_date;
            $ins_data['created_id']= $created_id;
						$ins_data['created_time']= date("Y-m-d H:i:s");
						if($csv_file!='')
							$this->coupon_import($csv_file,$ins_data,'update');
						else
						{
	            $new_id = $this->cm->insert($ins_data,"coupon_details");            
							$vendor_id = $this->put('user_id');
							$code = $this->put('discount_details');
							$title = $this->put('title');
							$coupon_detail_id = $new_id;

							$ins_data1['vendor_id']  = $vendor_id;
							$ins_data1['code']  = $code;
							$ins_data1['title']  = $title;
							$ins_data1['coupon_detail_id']  = $coupon_detail_id;
							$new_id1 = $this->cm->insert($ins_data1,"coupon");
						}
 
           // $output['coupons']   = json_encode($ins_data);            
            $output['status']     = 'success';
            $output['message']    = 'Coupons Added Successfully';
        }
        catch(Exception $e){
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output); 
    }


    function couponslist_post()
    {

        try{
            
            $this->prepare_listing_params();
            $output = $this->cm->list_coupons();
            $output['status']   = 'success';

        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }

    function edit_coupons_post()
    {
         
         $output = array(); 
         try{
            $id = $this->post('id');
            $output['edit_coupons']  = $this->cm->edit_coupons($id);
            $output['status']   = 'success';
            $output['id']   = $id;

        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }


    function update_post()
    {

         $output = array();

        try
        {
            $edit_id = $this->post('id');
            $off_for = $this->post('off_for');
            $trigger_amount = $this->post('amount');
            $benefit_amount = $this->post('amount_percentage');
            $discount_type = $this->post('amount_type');
            $total_usage = $this->post('discount_used');
            $user_usage = $this->post('discount_used_one_user');
						$countries = $this->post('countries');
            $state = $this->post('state');
            $addons = $this->post('coupon_documents');
            $start_date = date('Y-m-d H:i:s',strtotime($this->post('discount_begins')));
            $end_date = date('Y-m-d H:i:s',strtotime($this->post('discount_expires')));
            $updated_id = $this->post('user_id');
            $created_time = date('Y-m-d H:i:s');
            
            $update_data = array();
            $update_data['type']  = $off_for;
            $update_data['trigger_amt']  = $trigger_amount;
            $update_data['benefit_amt']  = $benefit_amount;
            $update_data['discount_type']  = $discount_type;
            $update_data['total_usage_limit']  = $total_usage;
            $update_data['user_usage_limit']  = $user_usage;
            $update_data['valid_countries']  = $countries;
            $update_data['valid_states']  = $state;
            $update_data['add_ons']  = $addons;
            $update_data['start_date']  = $start_date;
            $update_data['end_date']  = $end_date;
            $update_data['updated_id']= $updated_id;
            $update_data['updated_time']= date("Y-m-d H:i:s");
            $update = $this->cm->update(array("id" => $edit_id),$update_data,"coupon_details"); 
            
            $vendor_id = $this->post('user_id');
            $code = $this->post('discount_details');
            $title = $this->post('title');
            $coupon_detail_id = $edit_id;

            $update_data1['vendor_id']  = $vendor_id;
            $update_data1['code']  = $code;
            $update_data1['title']  = $title;
            $update_data1['coupon_detail_id']  = $coupon_detail_id;
            $update = $this->cm->update(array("coupon_detail_id" => $edit_id),$update_data1,"coupon");         
            $output['status']     = 'success';
            $output['message']    = 'Coupons Updated Successfully';
        }
        catch(Exception $e){
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output); 
    }


    function remove_delete($id)
    {
        $output['status']    = 'success';

        try
        {
            $data = $this->cm->delete(array("id" => $id),"coupon_details");
            $data1 = $this->cm->delete(array("coupon_detail_id" => $id),"coupon");
            $output['message'] = 'Coupons removed successfully';
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }

    function coupon_import_post()
    {
			$output['res_status'] = 'success';
			$output['vars'] = $_FILES['fileKey'];
			$file_upload = $this->do_upload();
			if($file_upload['status'] === 'error')
      {
				$output['res_status'] = 'error';
        $output['msg'] = $file_upload['msg'];
			}
			else
			{
				$file_path = "docs/uploads/".$file_upload['msg']['file_name'];
				$output['file_path'] = $file_path;
				$output['response'] = $this->coupon_import($file_path);
			}
			$this->response($output);
		}
	public function do_upload()
  {
    $config['upload_path']          = 'docs/uploads/';
    $config['allowed_types']        = 'xls|xlsx|csv';
    $config['max_size']             = 100000;
    $config['max_width']            = 280;
    $config['max_height']           = 425;
    $this->load->library('upload');
    $this->upload->initialize($config);
    if ( ! $this->upload->do_upload('fileKey'))
    {
      $data = array('status' =>'error','msg'=> $this->upload->display_errors());
    }
    else
    {
      $data = array('status' =>'success','msg'=> $this->upload->data());
    }
    return $data;
  }
		
	function coupon_import($file_path='',$ins_data=array(),$type='')
	{
		try
		{
			$output['status'] = 'success';
			$this->session->unset_userdata('passed_rows');
	    $this->session->unset_userdata('failed_rows');
	    $csv = array_map('str_getcsv', file($file_path));
	    $excel_columns = is_array($csv) && count($csv) ? $csv[0]: array();
	    $diff = array_diff($this->columns, $excel_columns);
	    $errors = array();
      if(count($diff))
      {
				$output['err_type'] = 'columns';
				$errors[] = "Columns #".implode(",#",$diff)." are not found or mismatch.";
				throw new Exception("Errors Found.");
      }


      foreach ($csv as $index => $row)
      {
        if($index === 0) continue;
        $merged_row = array_combine($excel_columns, $row);
        $coupons[] = $merged_row;
      }

      // print_r($coupons);

      foreach ($coupons as $key => $row)
      {
      	$validation_result = $this->check_required_fields($row,$this->required_columns,$key);
      	if($validation_result['status'] === 'error')
      	{
      		$errors[] = $validation_result['error'];
      		$this->failed_rows[] =  $row;
      	}
      	else
      		$this->passed_rows[] =  $row;
      }

			if(count($errors))
			{
				$output['err_type'] = 'rows';
				throw new Exception("Errors Found.");
			}
      	
	  }
	  catch(Exception $e)
	  {
	  	$output['status'] = 'error';
	  	$output['msg'] = $e->getMessage();
	  	$output['errors'] = $errors;
	  }

	  // if($output['status'] === 'error')
	  	// print_r($output);
	  $this->session->set_userdata('passed_rows',$this->passed_rows);
    $this->session->set_userdata('failed_rows',$this->failed_rows);
		if($type === 'update')
		{
			$output['msg'] = "Coupons imported successfully.";
			$this->prepare_insert_coupons($this->passed_rows,$ins_data);
		}
		return $output;
	}

	function prepare_insert_coupons($coupons=array(),$ins_data=array())
	{
		foreach ($coupons as $key => $value)
    {
    	/*Insert Coupon Table*/
    	$coupon_id = $this->coupon_insert($value,$ins_data);
    	
    	/*Insert Coupon Details Table*/
			$coupon_detail_id = $this->coupon_details_insert($value,$coupon_id,$ins_data);

    	/*Update Coupon Detail Id in Coupon Table*/
    	$up['coupon_detail_id']  = $coupon_detail_id;
    	$up_id = $this->cm->update(array('id'=>$coupon_id),$up,'coupon');
    	/*Insert Coupon Products*/
    	$co_product_id = $this->coupon_products_insert($value,$coupon_detail_id,$coupon_id);
    }
	}

	function coupon_insert($row=array(),$ins_data=array())
	{
		$vendor_id = 1;
		$ins['code'] = $row['code'];
		$ins['title'] = $row['title'];
		$ins['vendor_id'] = $vendor_id;
		$chk = $this->check_if_record_exists(array('code'=>$row['code'],'vendor_id'=>$vendor_id),'coupon');
		if($chk['status']==='success')
		{
			$coupon_id = $this->cm->insert($ins,'coupon');
		}
		else
		{
			$update = $this->cm->update(array('code'=>$row['code'],'vendor_id'=>$vendor_id),$ins,'coupon');
			$coupon_id = $this->cm->get_where(array('code'=>$row['code'],'vendor_id'=>$vendor_id),'id','coupon')->row_array()['id'];
		}
		return $coupon_id;
	}

	function coupon_details_insert($row=array(),$coupon_id='',$ins_data=array())
	{
		/*$ins['type'] = "total";
		$ins['trigger_amt'] = "100.00";
		$ins['benefit_amt'] = "10.00";
		$ins['discount_type'] = "flat";
		$ins['total_usage_limit'] = "10";
		$ins['user_usage_limit'] = "10";
		$ins['valid_countries'] = "";
		$ins['valid_states'] = "";
		$ins['add_ons'] = "";
		$ins['shipping_methods'] = "";
		$ins['start_date'] = "2018-05-01";
		$ins['end_date'] = "2018-05-30";*/
		$chk = $this->cm->get_where(array('id'=>$coupon_id),'*','coupon')->row_array();
		if( $chk['coupon_detail_id'] == 0)
		{
			$coupon_detail_id = $this->cm->insert($ins_data,"coupon_details");
		}
		else
		{
			$coupon_detail_id = $chk['coupon_detail_id'];
			$update = $this->cm->update(array('id'=>$chk['coupon_detail_id']),$ins_data,"coupon_details");
		}
		return $coupon_detail_id;
	}

	function coupon_products_insert($row=array(),$coupon_detail_id='',$coupon_id='')
	{
		$ins['coupon_detail_id'] = $coupon_detail_id;
		$ins['product_ids'] = '1,3';
		$ins['trigger_qty'] = 10;
		$ins['apply_qty'] = 10;
		$ins['apply_products_count'] = 20;
		$chk = $this->check_if_record_exists(array('coupon_detail_id'=>$coupon_detail_id),'coupon_products');
		if( $chk['status'] === 'success')
			$coupon_product_id = $this->cm->insert($ins,"coupon_products");
		else
			$update = $this->cm->update(array('coupon_detail_id'=>$coupon_detail_id),$ins,"coupon_products");
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
        $message = 'Column: '.implode(',', $error_fields) .' is required in row #'.($line+2);
      }
      else if(count($error_fields) > 1){
        $message = 'Columns: '.implode(',', $error_fields) .' are required in row #'.($line+2);
      }
      $output['error'] = $message;     
    }
    
    return $output;
  }

  function check_if_record_exists($where=array(),$table='')
  {
    $output = array('status'=>'success');
    $chk = $this->cm->get_where($where,'*',$table)->row_array();
    if(count($chk))
      $output = array('status'=>'error','msg'=>'Record already exists.');

    return $output;
  }


  public function applyCoupon_post()
  {
    $output = array('status'=>'success');
    try
    {
      $form = $this->post('params');
      $code = $form['code'];
      $state = $form['state'];
      $order_total = $form['total'];

      if( !isset($code) || $code === ''){
        throw new Exception('Please Enter Coupon Code.');
      }
      

      $coupon = $this->prepareCouponApply($code,$state,$order_total);
      
      if($coupon['status'] === 'success'){
        $output['msg'] = $coupon['msg'];
        $output['data'] = $coupon['data'];
      }
      else if($coupon['status'] === 'error'){
        throw new Exception($coupon['msg']);
      }
    }
    catch(Exception $e)
    {
      $output['status'] = 'error';
      $output['msg'] = $e->getMessage();
    }
    $output['post'] = $this->post();
    $this->response($output);
  }

  public function prepareCouponApply($code='',$state='',$order_total=''){
    try
    {
      $output = array('status'=>'success');
      $chk = $this->cm->getCouponDetails($code,$state);

      if( $chk )
      {
        $tot_usage = $this->cm->get_where(array("coupon_id"),"count(id) as total_usage","coupon_users")->row_array();
        $cur_date = strtotime(date('Y-m-d H:i:s'));
        $coupon_start_date = strtotime(date('Y-m-d H:i:s',strtotime($chk['start_date'])));
        $coupon_end_date = strtotime(date('Y-m-d H:i:s',strtotime($chk['end_date'])));
        // if($chk['valid_states'] !== $state)
        //   throw New Exception('Coupon is not applicable in this State.');

        if($cur_date < $coupon_start_date)
          throw New Exception('Coupon is invalid2.');

        if($cur_date > $coupon_end_date)
          throw New Exception('Coupon is expired.');

        if( (int)$tot_usage['total_usage'] 
            && (int)$tot_usage['total_usage_limit'] 
            && $tot_usage['total_usage'] >= $chk['total_usage_limit'] ) {          
          throw New Exception('Coupon reached the usage limit.');
        }

        if( $order_total < $chk['trigger_amt'] )
          throw New Exception('Order total should be greater than $'.$chk['trigger_amt']);
        
        $output['msg'] = "Coupon Applied Successfully.";
        $output['data'] = $chk;

        if($chk['discount_type'] === 'percentage')
        {
          $output['data']['benefit_amt'] = number_format(($order_total / 100) * $chk['benefit_amt'],2);
        } else {
          $output['data']['benefit_amt'] = number_format($chk['benefit_amt'],2);
        }
        
      }
      else{
        throw new Exception('This code did not match any active gift card or discount. Was it entered correctly?');
      }
    }
    catch(Exception $e){
      $output['status'] = 'error';
      $output['msg'] = $e->getMessage();
    }
    return $output;
  }

}
