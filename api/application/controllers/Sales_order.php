<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once(APPPATH."controllers/AppController.php");

Class Sales_order extends AppController {

    function __construct()
    {
        parent::__construct();
        $this->load->library('order_manager');

        $this->load->model('sales_order_model');
        $this->load->model('vendors_model');
        $this->load->model('users_model');
        $this->load->model('inventory_model');
        $this->load->model('logs_model');
        $this->load->model('refunds_model');
        $this->load->library('Email_manager','email_manager');

        $this->API_Username = "";
        $this->API_Password = "";                
        $this->Signature    = "";
        $this->API_Endpoint = "https://api-3t.sandbox.paypal.com/nvp";
        $this->version = "94.0";
    }
    
    //get vendors 
    function list_post()
    {
        try
        {
            
            $this->prepare_listing_params();
            $output = $this->sales_order_model->list_order();
            $output['status']   = 'success';

        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }

    function refund_get() {

        $so_id  = $this->get('so_id');
        $type   = $this->get('type');
        $amount = $this->get('amount');

        $result = $this->order_manager->refund($so_id, $type, $amount);
        
        $this->response($result);
    }
    
    //Create SO
    function create_post() {

        $output = array();

        try
        {
            $shippingID = $this->post('shippingId');
            $vendorID = $this->post('vendorID');
            $userID = $this->post('userID');
            $products = $this->post('cart');
           // print_r($products);exit;
            if(empty($shippingID)) {                
                throw new Exception("Please select Shipping Address.");     
            }
            if(empty($userID)) {                
                throw new Exception("Please select Customer.");     
            }

            if(empty($vendorID)) {                
                throw new Exception("Please select Vendor.");     
            }

            // $vendor_data = $this->vendors_model->get_customer_details($vendorID);

            // if(!count($vendorID)) {                
            //     throw new Exception("Please select valid Customer.");     
            // }

            if(!count($products)) {
                throw new Exception("Please select atleast one product.");          
            }


            // get product details to get original price form Table
            $selected_product_details = array();
            foreach($products as $product) {
                if ((int)$product['orderedQuantity']) {
                    $selected_product_details[$product['id']] = $product;
                }
                
            }
            //echo '<pre>';print_r($selected_product_details);die;
            $result = $this->inventory_model->get_product_variants(array_keys($selected_product_details), $vendorID);
            //echo '<pre>';print_r($result);die;
            $order_total = 0;
            foreach ($result as $item) {
                //echo $item['id'].'<pre>';print_r($selected_product_details);die;
                $selected_product_details[$item['id']]['price'] = $item['price'];
                $order_total += ($selected_product_details[$item['id']]['orderedQuantity']*$selected_product_details[$item['id']]['price']);
            }


            $so_data = array();
            $so_data['customer_id'] = $userID;
            $so_data['order_status'] = 'PENDING';
            $so_data['payment_type'] = 'cash';
            $so_data['vendor_id'] = $vendorID;
            $so_data['total_amount'] = $order_total;
            $so_data['shipping_address_id'] = $shippingID;//$vendor_data['address_id'];
            $so_data['billing_address_id'] = $shippingID;
            // $po_data['is_stock_updated'] = 'N';
            $so_data['created_time'] =  date('Y-m-d H:i:s');
            $so_data['updated_time'] =  date('Y-m-d H:i:s');

            $so_id = $this->sales_order_model->insert($so_data);

            
            $log_message = 'Sales Order Created Order ID: '.$so_id;
            action_logs($so_id,'SO', $log_message);

            if(!(int)$so_id) {
                throw new Exception("DB_ERROR");          
            }

            foreach ($selected_product_details as $product) {
                $so_item_data = array();
                $so_item_data['sales_order_id']     = $so_id;
                $so_item_data['product_variant_id'] = $product['id'];
                $so_item_data['unit_price']         = $product['price'];
                $so_item_data['quantity']           = $product['orderedQuantity'];
                $so_item_data['created_time']       =  date('Y-m-d H:i:s');
                $so_item_data['updated_time']       =  date('Y-m-d H:i:s');

                $this->sales_order_model->insert($so_item_data, 'sales_order_item');

                $vendor_products = $this->sales_order_model->get_where(array('product_variant_id'=>$so_item_data['product_variant_id'],'vendor_id'=>$vendorID),"*","vendor_products")->row_array();
                
                $up_quantity = (int)$vendor_products['quantity'] - (int)$so_item_data['quantity'];

                if($up_quantity == 0){
                    $this->sales_order_model->delete(array('vendor_id'=>$vendor_products["vendor_id"],'product_variant_id'=>$vendor_products["product_variant_id"]),"vendor_products");
                }
                else{
                   $updated_quantity['quantity'] = $up_quantity; 
                    $this->sales_order_model->update(array('vendor_id'=>$vendor_products["vendor_id"],'product_variant_id'=>$vendor_products["product_variant_id"]),$updated_quantity,"vendor_products");
                }

                
                $log_message = 'Sales Order Item Created Order ID: '.$so_id.' Variant ID: '.$product['id'];
                action_logs($so_id,'SO', $log_message);
                
            }

            // Payment info
            $payment_master = array();
            $payment_master['customer_id']    = $userID;
            $payment_master['order_id']       = $so_id;
            $payment_master['payment_type']   = 'cash';
            $payment_master['amount'] = $order_total;
            $payment_master['status'] = 'Completed';
            $payment_master['created_date'] = date('Y-m-d H:i:s');

            $this->sales_order_model->insert($payment_master, 'payment_master');
            
             $sales_order_payment_log_message = 'Sales Order Payment Has been Completed. Order ID'. $so_id. 'Payment Type: ' . $payment_master['payment_type'];
             action_logs($so_id,'SO', $sales_order_payment_log_message);
            
            $this->email_manager->send_order_email($so_id);
            $output['status']   = 'success';
            $output['so_id']    = $so_id;
            
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }  
        
        $this->response($output);
    }


    //get orderInfo 
    function info_get($so_id = "")
    {   
        $output = array('status' => 'success');
        try
        {
            $so_details = $this->sales_order_model->getOrderDetails($so_id);
            $so_items_details = $this->sales_order_model->getOrderItemDetails($so_id);
            $billing_address = $this->sales_order_model->getBillingAddress($so_id);
            $shipping_address = $this->sales_order_model->getShippingAddress($so_id);
            $refund_amount = $this->sales_order_model->getRefundAmount($so_id);

            $output['sub_total'] = array_sum(array_map(function($item) { 
                                return $item['unit_price'] * $item['quantity']; 
                                        }, $so_items_details));

            $output['refund_amount'] = ($refund_amount)?$refund_amount:'';
            $output['so_details'] = $so_details;
            $output['so_items_details'] = $so_items_details;
            $output['billing_address'] = $billing_address;
            $output['shipping_address'] = $shipping_address;
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }

    //get Sales orders 
    function sales_orders_post()
    {   
      
     try{
            
            if($this->post('user_id')) {
                $vendorID = $this->post('user_id');
            }
           
            $output['items'] = $this->sales_order_model->getAllOrderDetails($vendorID);
           
            $output['status']   = 'success';

        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }
        $this->response($output);

    }

    function create_note_put(){
        
        $output = array();
        try
        {
            $notes = $this->put('desc');
            $id = $this->put('id');
            $type = $this->put('type');
            $ins_data = array();
            $ins_data['notes']  = $notes;
            $ins_data['order_id']  = $id;
            $ins_data['type']  = $type;;
            $ins_data['created_id ']  = 1;
            $ins_data['created_time']= date("Y-m-d H:i:s");
            $new_id              = $this->sales_order_model->insert($ins_data,"notes");   
            $notes               = $this->sales_order_model->get_notes($id,$type);
            $output['notes']     = $notes;
            $output['title']    = 'Success';
            $output['status']    = 'success';
            $output['message'] = 'Note Added Successfully';
        }
        catch(Exception $e){
            $output['title']    = 'Error';
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output); 
    }
    
    function update_post(){
        
        $output = array();
        try
        {
            $id = $this->post('id');
            $first_name = $this->post('first_name');
            $last_name = $this->post('last_name');
            $address1 = $this->post('address1');
            $address2 = $this->post('address2');
            $city = $this->post('city');
            $state = $this->post('state');
            $country = $this->post('country');
            $zip = $this->post('zip');
            $phone = $this->post('phone_number');
            $update_data = array();
            $update_data['first_name']  = $first_name;
            $update_data['last_name']  = $last_name;
            $update_data['address1']  = $address1;
            $update_data['address2']  = $address2;
            $update_data['city']  = $city;
            $update_data['state']  = $state;
            $update_data['country']  = $country;
            $update_data['zip']  = $zip;
            $update_data['phone_number']  = $phone;
            $update_data['updated_time']= date("Y-m-d H:i:s");
            
            $so_data = $this->sales_order_model->get_where(array("id"=>$id),'*','sales_order')->row_array();

            if ($so_data['shipping_address_id'] == $so_data['billing_address_id']) {
                $shipping_address_id = $this->sales_order_model->insert($update_data, 'address');
                $this->sales_order_model->update(array('id' => $id), array('shipping_address_id' => $shipping_address_id));
            } else {
                $shipping_id = $so_data['shipping_address_id'];
                $update = $this->sales_order_model->updateShippingAddress($shipping_id,$update_data);  
            }
                
            action_logs($id,'Shipping','Shipping Address Updated');

            
            $output['status']    = 'success';
            $output['message'] = 'Updated Successfully';
        }
        catch(Exception $e){
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output); 
    }
     //get address 
    function shipping_address_get($id ="")
    {
        try
        {
            $shipping_address = $this->sales_order_model->getShippingAddress($id);   
            $output['address']  = $shipping_address;
            $output['status']   = 'success';
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }
    //get Notes 
    function notes_post()
    {
        try
        {
            $id = $this->post('id');
            $type = $this->post('type');
            $notes              = $this->sales_order_model->get_notes($id,$type);
            $output['notes']     = $notes;
            $output['status']   = 'success';
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }
    
    function send_email_order_get($order_id ="")
    {

        try
        {
            //$order_id = $this->get('id');
            $this->email_manager->send_order_email($order_id);
            $output['status'] = "success";
            $output['message'] = "Mail sent successfully.";
        }
        catch(Exception $e){
             $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }
        
        $this->response($output);
    }
    
    //IPN Response
    function authorize_ipn_response()
    {
      $response = $this->input->post();
            if($response['x_response_reason_code'] == 1)
            {
                $trans_id = $response['x_trans_id'];
                $ins['status'] = "Completed";
                $ins['updated_date'] = date("Y-m-d H:i:s");
            }
            else
            {
                $ins['status'] = "Rejected";
            }
            $insert = $this->sales_order_model->update(array("trans_id"=>$trans_id),$ins,"payment_master"); 
    }
    
    function paypal_ipn_response()
    {
            try
            {
                if($_POST)
                {
                    $up = array();
                    $trans_id    = $_POST['txn_id'];
                    if($_POST['payment_status'] === 'Completed')
                    {
                        $up['status']    = "Completed";
                    }
                    else{
                        $up['status']    = "Rejected";
                    }
                    $up['udpated_date']    = date("Y-m-d H:i:s");
                    $this->sales_order_model->update(array("id"=>$trans_id),$up,"payment_master");
                }
            }
            catch(Exception $e){}
    }

    function create_shipping_post()
    {
        $output['status'] = "success";
        $ins['first_name']= $this->post('firstName');
        $ins['last_name']= $this->post('lastName');
        $ins['address1']= $this->post('address1');
        $ins['address2']= $this->post('address2');
        $ins['city']= $this->post('city');
        $ins['state']= $this->post('state');
        $ins['country']= $this->post('country');
        $ins['zip']= $this->post('zipcode');
        $ins['type']= 'V';
        $ins_id = $this->sales_order_model->insert($ins,"address");
        $output['shipping_id'] = $ins_id;
        $output['msg'] = "Shipping address created successfully";

        action_logs($ins_id,'Shipping',$output['msg']);

        $this->response($output);
    }

    function createCustomer_post()
    {
        $output['status'] = "success";
        $ins['first_name']= $this->post('firstName');
        $ins['last_name']= $this->post('lastName');
        $ins['email']= $this->post('email');
        $ins['password']= md5($this->post('password'));
        $ins['role']= 'U';
        $ins['created_time']= date('Y-m-d H:i:s');
        $ins['updated_time']= date('Y-m-d H:i:s');

        if ($this->post('userID')) {
            $ins['created_id']= $this->post('userID');
            $ins['updated_id']= $this->post('userID');
        }
        
        $ins_id = $this->sales_order_model->insert($ins,"users");

        $output['data'] = $this->sales_order_model->get_where(array('role'=>'U'),'*',"users")->result_array();
        $output['msg'] = "Customer created successfully";

         action_logs($ins_id,'Customer',$output['msg']);

        $this->response($output);
    }

    function getCustomerAddress_post()
    {
        $output['status'] = "success";
        $user_id = $this->post('user_id');
        $address = $this->sales_order_model->getCustomerAddress($user_id);

        $output['data'] = $address;
        $this->response($output);
    }


    function create_front_order_post()
    {
        $output = array();
        try
        {
            $vendorId           = $this->post('vendorId');
            $cartItems          = $this->post('cartItems');
            $shippingCost       = $this->post('shippingCost');
            $discount           = $this->post('discount');
            $tax                = $this->post('tax');
            $contactInfo        = $this->post('contactInfo');
            $billingAddreesType = $this->post('billingAddreesType');
            $billingAddrees     = $this->post('billingAddrees');
            $shippingAddress    = $this->post('shippingAddress');
            $couponInfo         = $this->post('couponInfo');
            $paymentInfo        = $this->post('paymentInfo');

            // Vendor validation
            if (!(int)$vendorId) {
                throw new Exception("Invalid Data"); 
            }

            $vendor_data = $this->vendors_model->get_data($vendorId);
            // echo '<pre>'.$this->db->last_query();print_r($vendor_data);die;
            if (!count($vendor_data)) {
                throw new Exception("Invalid Data"); 
            }


            // Cart validation
            if (!isset($cartItems) || !is_array($cartItems)) {
                throw new Exception("Your cart is empty!."); 
            }

            if (empty($contactInfo) || !isset($contactInfo['email'])) {
                throw new Exception("Please enter email."); 
            }

            if (empty($shippingAddress)) {
                throw new Exception("Shipping Address is missing."); 
            }

            if (empty($billingAddreesType)) {
                $billingAddreesType = 'SAS';
            }

            if ($billingAddreesType === 'B' && empty($billingAddrees)) {
                throw new Exception("Billing Address is missing."); 
            }

            if (empty($paymentInfo) || !isset($paymentInfo['paymentMethod'])) {
                throw new Exception("Please choose payment method.");
            }

            if ($paymentInfo['paymentMethod'] == 'credit_card' && !isset($paymentInfo['cardDetails'])) {
                throw new Exception("Please enter card details.");
            }

            if ($paymentInfo['paymentMethod'] == 'paypal' && !isset($paymentInfo['txnId'])) {
                throw new Exception("Invalid transaction.");
            }

            if ($billingAddreesType === 'SAS') {
                $billingAddrees = $shippingAddress;
            }
            
            // Calculate order total
            $ordered_items = array();
            foreach ($cartItems as $item) {
                $ordered_items[$item['sku']] = $item;
            }

            $variants = $this->vendors_model->get_variants_by_skus($vendorId, array_keys($ordered_items));
            
            if (!count($variants)) {
               throw new Exception("Invalid products"); 
            }

            $variants_data = array();
            foreach ($variants as $variant) {
                $variants_data[$variant['sku']] = $variant;
            }

            $cart_total = 0;
            foreach ($ordered_items as $item) {
                $sku = $item['sku'];
                $qty = (int)$item['qty'];
                $price = ($variants_data[$sku]) ? (float)$variants_data[$sku]['price']: 0;
                $cart_total += $qty*$price;
            }

            $order_total = $cart_total + $shippingCost + $tax - $discount;

             $txn_id = '';
             $cc_last_digits = '';
            if ($paymentInfo['paymentMethod'] == 'credit_card') {
               $authorize_data = $this->do_authorize_payment($vendorId, $contactInfo['email'], $paymentInfo['cardDetails'], $order_total, $billingAddrees, $shippingAddress); 

               if ($authorize_data['status'] == 'error') {
                   throw new Exception($authorize_data['resp']);
               }

               $txn_id = $authorize_data['trans_id'];
               $cc_last_digits = substr($paymentInfo['cardDetails']['cardNumber'], -4);
            } else {
                $txn_id = $paymentInfo['txnId'];
                $cc_last_digits = '';
            }

            
            $user_id = 0;
            $user_data = $this->users_model->get_where(array('email' => $contactInfo['email']))->row_array();
            if (!count($user_data)) {
                $insert_user = array();
                $insert_user['first_name']  = $shippingAddress['firstName'];
                $insert_user['last_name']   = $shippingAddress['lastName'];
                $insert_user['email']       = $contactInfo['email'];
                $insert_user['role']        = 'U';
                $insert_user['created_id']  = '0';
                $insert_user['updated_id']  = '0';
                $insert_user['created_time']= date('Y-m-d H:i:s');

                $user_id = $this->users_model->insert($insert_user);

                
                $log_message = "New User #$user_id Created with email:".$contactInfo['email'];
                action_logs($user_id,'User', $log_message);

            } else {
                $user_id = $user_data['id'];
            }

            if (!(int)$user_id) {
                throw new Exception("DB_ERROR"); 
            }


            $shipping_address_id = $this->prepare_shipping_address($shippingAddress);
            $billing_address_id = $this->prepare_billing_address($billingAddrees);

            // SO
            $so_data = array();
            $so_data['customer_id'] = $user_id;
            $so_data['vendor_id'] = $vendorId;
            $so_data['order_status'] = 'ACCEPTED';
            $so_data['total_amount'] = $order_total;
            $so_data['total_discount'] = $discount;
            $so_data['total_shipping'] = $shippingCost;
            $so_data['tax'] = $tax;
            $so_data['total_items'] = count($ordered_items);
            $so_data['payment_type'] = ($paymentInfo['paymentMethod'] == 'credit_card')?'authorize':'paypal';
            $so_data['shipping_address_id'] = $shipping_address_id;
            $so_data['billing_address_id'] = $billing_address_id;
            $so_data['created_id']      = '0';
            $so_data['updated_id']      = '0';
            $so_data['created_time']    = date('Y-m-d H:i:s');

            $so_id = $this->sales_order_model->insert($so_data);

            $log_message = 'Sales Order #'.$so_id.' is created.';

            action_logs($so_id,'SO', $log_message);

            foreach ($ordered_items as $item) {
                $so_item_data = array();
                $so_item_data['sales_order_id'] = $so_id;
                $so_item_data['product_variant_id'] = $variants_data[$sku]['product_variant_id'];
                $so_item_data['unit_price'] = (float)$variants_data[$sku]['price'];
                $so_item_data['quantity'] = (int)$item['qty'];
                $so_item_data['created_id'] = '0';
                $so_item_data['updated_id'] = '0';
                $so_item_data['created_time'] = date('Y-m-d H:i:s');

               $so_item_id = $this->sales_order_model->insert($so_item_data, 'sales_order_item');

               $vendor_products = $this->sales_order_model->get_where(array('product_variant_id'=>$so_item_data['product_variant_id'],'vendor_id'=>$vendorId),"*","vendor_products")->row_array();
                
                $up_quantity = (int)$vendor_products['quantity'] - (int)$so_item_data['quantity'];

                if($up_quantity == 0){
                    $this->sales_order_model->delete(array('vendor_id'=>$vendor_products["vendor_id"],'product_variant_id'=>$vendor_products["product_variant_id"]),"vendor_products");
                }
                else{
                   $updated_quantity['quantity'] = $up_quantity; 
                    $this->sales_order_model->update(array('vendor_id'=>$vendor_products["vendor_id"],'product_variant_id'=>$vendor_products["product_variant_id"]),$updated_quantity,"vendor_products");
                }



               $sales_order_item_log_message = 'Sales Order Item Created Item ID:'.$so_item_id.' Order ID: '.$so_id.' Sku: '.$item['sku']. ' price: '.$so_item_data['unit_price'];
               action_logs($so_id,'SO', $sales_order_item_log_message);
            }

            // Payment info

            $payment_master = array();
            $payment_master['customer_id']    = $user_id;
            $payment_master['order_id']       = $so_id;
            $payment_master['payment_type']   = ($paymentInfo['paymentMethod'] == 'credit_card')?'authorize':'paypal';
            $payment_master['amount'] = $order_total;
            $payment_master['status'] = 'Completed';
            $payment_master['trans_id'] = $txn_id;
            $payment_master['cc_last_digits'] = $cc_last_digits;
            $payment_master['created_date'] = date('Y-m-d H:i:s');

            $this->sales_order_model->insert($payment_master, 'payment_master');
            

             $sales_order_payment_log_message = 'Sales Order Payment Has been Completed. Order ID'. $so_id.' Transaction ID: '.$txn_id . 'Payment Type: ' . $payment_master['payment_type'];
             action_logs($so_id,'SO', $sales_order_payment_log_message);

            $this->email_manager->send_order_email($so_id);

            $output['message'] = "Order Created Successfully.";
            $output['status']   = "success";
        }
        catch(Exception $e)
        {
            $output['status'] = 'error';
            $output['message'] = $e->getMessage();
        }

        $this->response($output);
    }
    function prepare_coupon_insert($form=array(),$sales_id)
    {
        $coupon = array();
        $coupon['coupon_id'] = $form['id'];
        $coupon['sales_order_id'] = $sales_id;
        $copupon_id = $this->sales_order_model->insert($coupon,"coupon_users");
        return $copupon_id;
    }

    function prepare_shipping_address($form=array())
    {
        $contact = array();
        $contact['first_name'] = $form['firstName'];
        $contact['last_name']   = $form['lastName'];
        $contact['address1']    =  $form['address1'];
        $contact['address2']    = $form['address2'];
        $contact['city']        = $form['city'];
        $contact['state']       = $form['state'];
        $contact['country']     = $form['country'];
        $contact['zip']         = $form['zipcode'];
        $contact['phone_number']= $form['phone'];
        $contact['type']        = "S";

        $shipping_id = $this->sales_order_model->insert($contact,"address");
        return $shipping_id;
    }

    function prepare_billing_address($form=array())
    {
        $billing = array();
        $billing['first_name']  = $form['firstName'];
        $billing['last_name']   = $form['lastName'];
        $billing['address1']    = $form['address1'];
        $billing['address2']    = $form['address2'];
        $billing['city']        = $form['city'];
        $billing['state']       = $form['state'];
        $billing['country']     = $form['country'];
        $billing['zip']         = $form['zipcode'];
        $billing['phone_number']= $form['phone'];
        $billing['type']        = "B";

        $billing_id = $this->sales_order_model->insert($billing,"address");
        return $billing_id;
    }

    function prepare_user($form=array())
    {
        $user = array();
        $user['email'] = $form['email'];
        $user['first_name'] = $form['firstName'];
        $user['last_name'] = $form['lastName'];
        $user['role'] = "U";
        $user['password'] = md5('password');
        $customer_id = $this->sales_order_model->insert($user,"users");
        return $customer_id;
    }
    function prepare_sales_order($form=array(),$customer_id='',$shipping_id='',$billing_id='')
    {
        $cart = $form['cart'];
        $sales = array();
        $sales['customer_id'] = $customer_id;
        $sales['vendor_id'] = $form['vendorID'];
        $sales['order_status'] = "ACCEPTED";
        $sales['total_amount'] = $cart['total_price'];
        $sales['total_discount'] = $form['coupon']['discount_amt']?$form['coupon']['discount_amt']:"0.00";
        $sales['total_shipping'] = $cart['shipping_fee'];
        $sales['tax'] = $cart['tax'];
        $sales['total_discount_shipping'] = "0.00";
        $sales['total_items'] = count($form['cart']['product']);
        $sales['payment_type'] = ucfirst(str_replace("_"," ",$form['payment']['payment_method']));
        $sales['shipping_address_id'] = $shipping_id;
        $sales['billing_address_id'] = $billing_id;
        $sales['type'] = "D";
        $sales['created_time'] = date("Y-m-d H:i:s");
        $sales['shipment_method'] = '';//$form['shipping']['label'];
        $sales_order_id = $this->sales_order_model->insert($sales,"sales_order");
        return $sales_order_id;
    }

    function prepare_sales_order_item($cart='',$sales_id='')
    {
        $item = array();
        $cart = $cart['product'];
        for($i=0;$i<count($cart);$i++)
        {
            $item['sales_order_id'] = $sales_id;
            $item['product_variant_id'] = $cart[$i]['pv_id'];
            $item['item_status'] = 'NEW';
            $item['unit_price'] = $cart[$i]['p_price'];
            $item['quantity'] = $cart[$i]['qty'];
            $sales_id = $this->sales_order_model->insert($item,'sales_order_item');
        }

    }
    function prepare_payment_insert($form=array(),$customer_id='',$sales_id='')
    {
        $payment = $form['payment_status'];
        if($form['payment']['payment_method'] === "credit_card")
        {
            $ins['cc_last_digits'] = substr($form['payment']['credit_card']['card_number'],-4);
        }
        $ins['customer_id'] = $customer_id;
        $ins['order_id'] = $sales_id;
        $ins['payment_type'] = ucfirst(str_replace("_"," ",$form['payment']['payment_method']));
        $ins['amount'] = $form['cart']['total_price'];
                $ins['status'] = "Pending";
        $ins['trans_id'] = $payment['paymentID'];
        $ins['updated_date'] = date("Y-m-d H:i:s");
        $ins_payment = $this->sales_order_model->insert($ins,"payment_master");
    }

    function do_authorize_payment($vendor_id, $email, $card_details, $order_total, $billing, $shipping)
    {
        $output = array();

        try
        {
                // Autorize Config
                $this->load->library('authorize_net');
                $authorize_info = $this->vendors_model->get_authorize_data($vendor_id);

                if(isset($authorize_info) && !count($authorize_info)) {
                    throw new Exception("Invalid Payment Gateway Configuration");
                }

                $authorize_config = array();
                $authorize_config['api_login_id']        = $authorize_info['api_login_id'];
                $authorize_config['api_transaction_key'] = $authorize_info['api_transaction_key'];

                if ($authorize_info['payment_mode'] === 'production') {
                    $authorize_config['api_url'] = 'https://secure.authorize.net/gateway/transact.dll';
                } 
                else 
                {
                    $authorize_config['api_url'] = 'https://test.authorize.net/gateway/transact.dll';
                }

                $this->authorize_net->initialize($authorize_config);

                $auth_net = array(
                    'x_card_num'            => $card_details['cardNumber'], // Visa
                    'x_exp_date'            => $card_details['expiry'],
                    'x_card_code'           => $card_details['cvv'],
                    'x_description'         => $card_details['cardHolderName'],
                    'x_amount'              => $order_total,
                    'x_first_name'          => $billing['firstName'],
                    'x_last_name'           => $billing['lastName'],
                    'x_address'             => $billing['address1']." ".$billing['address2'],
                    'x_city'                => $billing['city'],
                    'x_state'               => $billing['state'],
                    'x_zip'                 => $billing['zipcode'],
                    'x_country'             => $billing['country'],
                    'x_phone'               => $billing['phone'],
                    'x_ship_to_first_name'  => $shipping['firstName'],
                    'x_ship_to_last_name'   => $shipping['lastName'],
                    'x_ship_to_address'     => $shipping['address1']." ".$shipping['address2'],
                    'x_ship_to_city'        => $shipping['city'],
                    'x_ship_to_state'       => $shipping['state'],
                    'x_ship_to_zip'         => $shipping['zipcode'],
                    'x_ship_to_country'     => $shipping['country'],
                    'x_email'               => $email,
                    'x_customer_ip'         => $this->input->ip_address(),
                    );

                $this->authorize_net->setData($auth_net);

                if( $this->authorize_net->authorizeAndCapture() )
                {
                    $output['resp']  = $this->authorize_net->getResponse();
                    $output['status'] = 'success';
                    $output['trans_id'] =  $this->authorize_net->getTransactionId();
                    $output['approve_code'] = $this->authorize_net->getApprovalCode();
                }
                else
                {
                  throw new Exception($this->authorize_net->getError());
                }

      }
      catch(Exception $e)
      {
        $output['status'] = 'error';
        $output['resp']   = $e->getMessage();
      }

        return $output;
    }

    function calculate_tax_post()
    {

        try
        {


            $from_country = $this->post('from_country');
            $from_state   = $this->post('from_state');
            $from_zip     = $this->post('from_zip');
            $from_city    = $this->post('from_city');
            $from_street  = $this->post('from_street');
            $to_country   = $this->post('to_country');
            $to_state     = $this->post('to_state');
            $to_zip       = $this->post('to_zip');
            $to_city      = $this->post('to_city');
            $to_street    = $this->post('to_street');
            $amount       = $this->post('amount');
            $shipping     = $this->post('shipping');

            
            $this->load->library('tax');

            $tax_data = array();
            $tax_data['from_country'] = $from_country;
            $tax_data['from_state']   = $from_state;
            $tax_data['from_zip']     = $from_zip;
            $tax_data['from_city']    = $from_city;
            $tax_data['from_street']  = $from_street;
            $tax_data['to_country']   = $to_country;
            $tax_data['to_state']     = $to_state;
            $tax_data['to_zip']       = $to_zip;
            $tax_data['to_city']      = $to_city;
            $tax_data['to_street']    = $to_street;
            $tax_data['amount']       = $amount;
            $tax_data['shipping']     = $shipping;

            $tax_amount = $this->tax->calculate($tax_data);

            if($tax_amount['status'] == 'success'){
                $output['status']     = 'success';
                $output['tax_amount'] = $tax_amount['tax_amount'];
            }
            else
            {
                throw new Exception($tax_amount['error']);
            }

        }
        catch(Exception $e) {
            $output['status'] = 'error';
            $output['message']= $e->getMessage();
        }

        $this->response($output);
    }


    function testTax_get() {
        $this->load->library('tax');
        $tax_data = array();

        $tax_data['from_country'] = 'US';
        $tax_data['from_state']   = 'NY';
        $tax_data['from_zip']     = '11232';

        $tax_data['to_country']   = 'US';
        $tax_data['to_state']     = 'NY';
        $tax_data['to_zip']       = '10037';

        $tax_data['amount']       = 178;
        $tax_data['shipping']     = 5;

        $tax_amount = $this->tax->calculate($tax_data);
        echo '<pre>';print_r($tax_amount);
    }

    //get Notes 
    function update_order_status_post()
    {
        try
        {
            $id = $this->post('id');
            $status = $this->post('status');

            $where = array('id' => $id);
            $data = array('order_status' => $status);
            $this->sales_order_model->update($where, $data);
            $output['status']   = 'success';
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }
    
}