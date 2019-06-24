<?php

defined('BASEPATH') OR exit('No direct script access allowed');

require_once(APPPATH."controllers/AppController.php");

Class Purchase extends AppController {
    function __construct()
    {
        parent::__construct();
        $this->load->model('purchase_model');
        $this->load->model('inventory_model');
        $this->load->model('vendors_model');
        $this->load->model('logs_model');
        $this->load->library('order_manager');
        $this->load->library('email_manager');

    }

    //get purchase orders 
    function list_post()
    {
        try{
            
            $this->prepare_listing_params();
            $output = $this->purchase_model->list_orders();
            $output['status']   = 'success';

        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }

    function orderinfo_get($id = "")
    {
        try
        {
            if(!(int)$id)
                throw exception("Order ID required!");

            $output['order_data']  = $this->purchase_model->get_order_data($id);

            $prod = $this->purchase_model->get_where(array('po_id'=>$id),'group_concat(DISTINCT(parent_product_id)) as products','purchase_order_item')->row();
            
            $parent_prods=explode(',',$prod->products);

            $parent_prods=array_unique($parent_prods);

            $prod_variants = $this->purchase_model->get_product_variants($parent_prods,$id);

            $output['headercol'] = $this->purchase_model->get_first_level_attributes();

            $output['products'] = $prod_variants;

            $shipping_address = get_address_format( $output['order_data']['shipping_address_id'],'shipping');
            $store_address    = "Clara Sunwoo <br> 34 34th Street, Floor 3A <br>  Brooklyn <br> NY 11232 <br> Ph: 212.564.0736";

            $output['address'] = array('shipping'=>$shipping_address,'billing'=>$store_address);

            $output['status']   = 'success';
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }

    function updatepo_post(){

        $output = array();

        try
        {
            $order_id = $this->post('order_id');
            $products = $this->post('cart');
            $total    = $this->post('total');
            $status   = $this->post('status');

            if(!(int)$order_id)
                throw new Exception("Invalid Order");

            $get_orderdet = $this->purchase_model->get_where(array('id'=>$order_id),'vendor_id','purchase_order')->row_array(); 

            if(!count($get_orderdet))
                throw new Exception("This PO#".$order_id." not exists!"); 

            if(!count($products))
                throw new Exception("Not found any order items");          
            
            $updata = array();
            $updata['order_status'] = $status;


            if($status == 'APPROVED'){
               
                $total = 0;

                $updata['is_stock_updated'] = 'yes';

                foreach($products as $key => $prod){

                    foreach($prod['variants'] as $var){

                        if($var['qty'] != ''){

                            $total = $total + ($var['qty']*$var['price']);                            

                            $item_data['quantity'] = $var['qty'];
                            $item_data['unit_price'] = $var['price'];
                            $item_data['received_qty'] = $var['qty'];

                            if(!empty($var['poi_id']))                              
                                $this->purchase_model->update(array('id'=>$var['poi_id'],'po_id'=>$order_id),$item_data,'purchase_order_item');      
                            else
                            {
                                $item_data['po_id'] = $order_id;
                                $item_data['product_id'] = $var['id'];
                                $item_data['parent_product_id'] = $key;
                                $item_data['created_date'] =  date('Y-m-d H:i:s');

                                $this->purchase_model->insert($item_data,'purchase_order_item');

                                $purchase_order_item_log_message = 'Purchase Order Item Has Been Created. Order ID: '.$po_id.' Product ID: '.$var['id'];

                                action_logs($order_id,'Purchase Order Item', $purchase_order_item_log_message);
                    
                            }

                            //update stock
                            $this->update_stock_items($var,$key,$get_orderdet['vendor_id']);
                            
                        } //delete order item
                        elseif(!empty($var['poi_id'])){                 
                            $this->purchase_model->delete(array('id'=>$var['poi_id']),'purchase_order_item');   
                            
                            $purchase_order_item_log_message = 'Purchase Order Item Has Been Deleted. Order ID: '.$var['poi_id'];

                            action_logs($order_id,'Purchase Order Item', $purchase_order_item_log_message);

                        }    
                        
                    }
                }

                $updata['total_amount'] = round($total,2);
            }    

            $this->purchase_model->update(array('id'=>$order_id),$updata,'purchase_order');  
            
            $output['status']   = 'success';
            
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }  
        
        $this->response($output);
    }

    //Update
     function update_post() {

        $output = array();

        try
        {
            $vendorID = $this->post('vendorID');
            $products = $this->post('cart');
            //$action   = $this->post('action')?$this->post('action'):"PROCESSING";
            $action   = $this->post('action');
            $order_id = $this->post('OrderId');
            $role     = $this->post('role');
            
            if(empty($order_id)) {                
                throw new Exception("Invalid input.");     
            }

            if(empty($vendorID)) {                
                throw new Exception("Please select vendor.");     
            }

            $vendor_data = $this->vendors_model->get_vendor_details($vendorID);

            if(!count($vendorID)) {                
                throw new Exception("Please select valid vendor.");     
            }

            if(!count($products)) {
                throw new Exception("Please select atleast one product.");          
            }


            // get product details to get original price form Table
            $selected_product_details = array();
            foreach($products as $product) {
                $selected_product_details[$product['id']] = $product;
            }
            
            $result = $this->inventory_model->get_product_variants(array_keys($selected_product_details));


            $order_total = 0;
            foreach ($result as $item) {
                
                $selected_product_details[$item['id']]['price'] = $item['price'];
                $order_total += ($selected_product_details[$item['id']]['orderedQuantity']*$selected_product_details[$item['id']]['price']);
            }

            $po_data = array();
            $po_data['total_amount'] = $order_total;
            $po_data['order_status'] = $action;

            $po_id = $this->purchase_model->update(array('id'=>$order_id),$po_data);
            
            
            if(!(int)$order_id) {
                throw new Exception("DB_ERROR");          
            }

            foreach ($selected_product_details as $product) {

                $po_item_data = array();
                $po_item_data['unit_price']         = $product['price'];
                $po_item_data['quantity']           = $product['orderedQuantity'];

                if(isset($action) && $action==='APPROVED')
                {
                    $this->reduceStock($product['id'],$product['orderedQuantity']);
                }
                
                $where = array('po_id'=>$order_id,'product_variant_id'=>$product['id']);

                $result = $this->purchase_model->get_where($where, '*', 'purchase_order_item')->row_array();

                 if(count($result)) {
                    
                    // $log_data[''] = 
                     $this->purchase_model->update($where,$po_item_data,'purchase_order_item'); 
                 } else{
                   
                    $po_item_data = array();
                    $po_item_data['po_id']              = $order_id;
                    $po_item_data['product_variant_id'] = $product['id'];
                    $po_item_data['unit_price']         = $product['price'];
                    $po_item_data['quantity']           = $product['orderedQuantity'];
                    $po_item_data['created_date']       =  date('Y-m-d H:i:s');
                    $po_item_data['updated_date']       =  date('Y-m-d H:i:s');
                    $this->purchase_model->insert($po_item_data,'purchase_order_item');

                    $purchase_order_item_update_log_message = 'Purchase Order Item Has Been Updated. Order ID: '.$order_id.' Product ID: '.$product['id'].' Quantity: '.$product['orderedQuantity'];

                    action_logs($order_id,'PO', $purchase_order_item_update_log_message);
                 }
                 
            }
            
            
            //log
            $purchase_order_update_log_message = 'Purchase Order Has Been Updated. Order ID: '.$order_id;

            action_logs($order_id,'PO', $purchase_order_update_log_message);

            $this->purchase_model->delete_duplicate_items(array_keys($selected_product_details));

            if($role=='A') {
                $stock_by_po = $this->order_manager->updateStockByPO($po_id);
                if($stock_by_po){
                    $stack_status['is_stock_updated'] = "yes";
                    $this->purchase_model->update(array('id'=>$po_id),$stack_status);
                }
             }

            $output['status']   = 'success';
            $output['po_id']    = $po_id;
            
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }  
        
        $this->response($output);
    }


    function update_stock_items($item,$parent_product_id,$vendor_id){

         //Stock decrease from products                
        $get_variant = $this->purchase_model->get_where(array('id'=>$item['id'],'sku'=>$item['sku']),'product_variant_name,quantity','product_variants')->row_array(); 

        if(count($get_variant)>0){
            $stockcount = ($get_variant['quantity'] - $item['qty']);
            $this->purchase_model->update(array('id'=>$item['id'],'sku'=>$item['sku']),array('quantity'=>$stockcount),'product_variants'); 
        }

        //vandor products stock update        
        $vendorvarchk = $this->purchase_model->get_where(array('variant_id'=>$item['id'],'vendor_id'=>$vendor_id),'*','vendor_products')->num_rows(); 

        if($vendorvarchk > 0){

            $vendorprod = $this->purchase_model->get_where(array('variant_id'=>$item['id'],'vendor_id'=>$vendor_id),'quantity','vendor_products')->row_array(); 
            
            $stockup = ($vendorprod['quantity'] + $item['qty']);
            $this->purchase_model->update(array('variant_id'=>$item['id'],'vendor_id'=>$vendor_id),array('quantity'=>$stockup),'vendor_products'); 
        
        }else{

            $venprod['vendor_id'] = $vendor_id;
            $venprod['variant_id'] = $item['id'];
            $venprod['parent_product_id'] = $parent_product_id;
            $venprod['name'] = $get_variant['product_variant_name'];
            $venprod['sku'] = $item['sku'];
            $venprod['price'] = $item['price'];
            $venprod['quantity'] = $item['qty'];
            $venprod['status'] = 'yes';
            $venprod['created_date'] =date('Y-m-d H:i:s');

            $this->purchase_model->insert($venprod,'vendor_products');

            
            $stock_update_log_message = 'Vendor Product Stock Update Vendor ID: '.$vendor_id.' Sku: '. $item['sku'];

            action_logs($order_id,'Vendor Stock Update', $stock_update_log_message);
        }

        return true;

    }

    //Ramkumar Reduce Stock
    function reduceStock($product_id='',$qty='')
    {
        $res = $this->purchase_model->get_where(array("id"=>$product_id),"quantity","product_variants")->row_array();
        $up['quantity'] = $res['quantity'] - $qty;
        $this->purchase_model->update(array("id"=>$product_id),$up,"product_variants");
    }

    public function product_by_categories_get()
    {
        $output['status'] = 'success';        
        $output['products']['tops'] = $this->purchase_model->product_by_category(array('b.category_id'=>'1'));
        $output['products']['jackets'] = $this->purchase_model->product_by_category(array('b.category_id'=>'2'));
        $output['products']['tanks'] = $this->purchase_model->product_by_category(array('b.category_id'=>'3'));
        $output['products']['dresses'] = $this->purchase_model->product_by_category(array('b.category_id'=>'4'));
        $output['products']['bottoms'] = $this->purchase_model->product_by_category(array('b.category_id'=>'5'));
        
        $this->response($output);
    }

    // RAMAKRISHNAN

    function order_get($id = 0) {
        $output = array();
        try
        {
            if(!(int)$id)
                throw exception("Order ID required!");

            $output['data']  = $this->purchase_model->get_order_data($id);

            $output['status']   = 'success';
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }

    function create_post() {

        $output = array();

        try
        {
            $vendorID = $this->post('vendorID');
            $products = $this->post('cart');
            
            if(empty($vendorID)) {                
                throw new Exception("Please select vendor.");     
            }

            $vendor_data = $this->vendors_model->get_vendor_details($vendorID);

            if(!count($vendorID)) {                
                throw new Exception("Please select valid vendor.");     
            }

            if(!count($products)) {
                throw new Exception("Please select atleast one product.");          
            }

            // get product details to get original price form Table
            $selected_product_details = array();
            foreach($products as $product) {
                $selected_product_details[$product['id']] = $product;
                
            }
            
            $result = $this->inventory_model->get_product_variants(array_keys($selected_product_details));

            $order_total = 0;
            foreach ($result as $item) {
                // echo $item['id'].'<pre>';print_r($selected_product_details);die;
                $selected_product_details[$item['id']]['price'] = $item['price'];
                $order_total += ($selected_product_details[$item['id']]['orderedQuantity']*$selected_product_details[$item['id']]['price']);

            }

            $po_data = array();
            $po_data['vendor_id'] = $vendorID;
            $po_data['order_status'] = 'APPROVED'; //'PENDING';
            $po_data['total_amount'] = $order_total;
            $po_data['shipping_address_id'] = $vendor_data['address_id'];
            $po_data['is_stock_updated'] = 'N';
            $po_data['created_date'] =  date('Y-m-d H:i:s');
            $po_data['updated_date'] =  date('Y-m-d H:i:s');
            $po_id = $this->purchase_model->insert($po_data);
           

            $purchase_order_log_message = 'Purchase Order Has Been Created. Order ID: '.$po_id;

            action_logs($po_id,'PO', $purchase_order_log_message);


            if(!(int)$po_id) {
                throw new Exception("DB_ERROR");          
            }
            //print_r(count($selected_product_details));
            foreach ($selected_product_details as $product) {
                $po_item_data = array();
                $po_item_data['po_id']              = $po_id;
                $po_item_data['product_variant_id'] = $product['id'];
                $po_item_data['unit_price']         = $product['price'];
                $po_item_data['quantity']           = $product['orderedQuantity'];
                $po_item_data['created_date']       =  date('Y-m-d H:i:s');
                $po_item_data['updated_date']       =  date('Y-m-d H:i:s');
                //echo '<pre>';print_r($product);
                $this->purchase_model->insert($po_item_data, 'purchase_order_item');

                $purchase_order_item_log_message = 'Purchase Order Item  Has Been Created. Order ID: '.$po_id.' Product ID: '.$product['id'];
                action_logs($po_id,'PO', $purchase_order_item_log_message);
            }
            $stock_by_po = $this->order_manager->updateStockByPO($po_id);

            
            $eend_po_email = $this->email_manager->send_po_order_mail($po_id);
            $output['status']   = 'success';
            $output['po_id']    = $po_id;
            
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }  
        
        $this->response($output);
    }

    //Sathish

    function purchase_order_items_get($id = "")
    {
        try
        {
            if(!(int)$id)
                throw exception("Order ID required!");

            $output['data']  = $this->purchase_model->get_order_items($id);

            $output['status']   = 'success';
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }

    //get Purchase orders 
    function get_purchase_orders_post()
    {   
      
     try{

            $output['items'] = $this->purchase_model->getAllOrderDetails();
            
            $output['status']   = 'success';

        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }
        $this->response($output);

    }

    function update_quantity_post()
    {
        $output = array();

        try
        {
            $id          = $this->post('id');
            $quantity    = $this->post('quantity');

            $update_data = array();
            $update_data['quantity']                = $quantity;
            $update_data['updated_time']        = date("Y-m-d H:i:s");
            $this->inventory_model->update(array("product_variant_id" => $id),$update_data,"vendor_products");
           
            $output['status']   = 'success';
            $output['message']  = 'Product quantity updated successfully';
        }
        catch(Exception $e){
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }


    function vendor_product_items_get($id = "")
    {
        try
        {
            if(!(int)$id)
                throw exception("VENDOR ID required!");

            $output['data']  = $this->purchase_model->get_vendor_items($id);

            $output['status']   = 'success';
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }

        $this->response($output);
    }


    function vendor_products_post() {

        $output = array();

        try
        {
            $vendorID = $this->post('vendorID');
            $products = $this->post('cart');
            
            if(empty($vendorID)) {                
                throw new Exception("Please select vendor.");     
            }

            if(!count($products)) {
                throw new Exception("Please select atleast one product.");          
            }

            
            foreach ($products as $vendor_products) {

                $product_variant_id = $vendor_products['id'];

                $data = array();
                $data['quantity']      = $vendor_products['orderedQuantity']; 
            
                  $get_price_config = $this->purchase_model->get_price_config($vendorID);

                $product_variants_price = $this->purchase_model->product_variants_price($product_variant_id);

                $data['price']  = ($get_price_config * $product_variants_price['price']);

                $vendorvarchk = $this->purchase_model->get_where(array('product_variant_id'=>$product_variant_id,'vendor_id'=>$vendorID),'*','vendor_products')->num_rows();

              if($vendorvarchk > 0){

                     if($vendor_products['orderedQuantity'] == 0){

                       $remove_vendor_products = $this->purchase_model->delete(array('vendor_id'=>$vendorID,'product_variant_id'=>$product_variant_id),'vendor_products');
                     }else{

                          $data['updated_time']  = date("Y-m-d H:i:s");
                        $this->purchase_model->update(array('product_variant_id'=>$product_variant_id,'vendor_id'=>$vendorID),$data,'vendor_products');

                     }

              }else{


                    //  if($vendor_products['orderedQuantity'] == 0){

                    //    $remove_vendor_products = $this->purchase_model->delete(array('vendor_id'=>$vendorID,'product_variant_id'=>$product_variant_id),'vendor_products');
                    //  }else{

                    //  $data['vendor_id'] = $vendorID;
                    //  $data['product_variant_id'] = $product_variant_id;
                    //  $data['is_active']     = "1";
                    //  $data['created_time']  = date("Y-m-d H:i:s");
                    //  $this->purchase_model->insert($data,'vendor_products');
                    // }

                     if($vendor_products['orderedQuantity'] != 0){
                     $data['vendor_id'] = $vendorID;
                     $data['product_variant_id'] = $product_variant_id;
                     $data['is_active']     = "1";
                     $data['created_time']  = date("Y-m-d H:i:s");
                     $this->purchase_model->insert($data,'vendor_products');
                    }
              }

                $output['status']   = 'success';
                $output['message']  = 'Vendor products created';
            }
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }  
        
        $this->response($output);
    }

}