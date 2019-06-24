<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Order_manager
{
	private $_CI;
	private $_cc = array();
	private $_bcc = array();

	public function __construct($options = array())
	{
		$this->_CI = & get_instance();
		$this->_CI->error_message = '';	

		$this->_CI->load->model('sales_order_model');
		$this->_CI->load->model('refunds_model');
		$this->_CI->load->model('vendors_model');

		$this->_CI->load->model('purchase_model');	
		$this->_CI->load->model('vendor_products_model');	
	}

	function updateStockByPO($po_id = 0) {

		

		try {
			// Check if valid PO ID
			if (!(int)$po_id) {
				throw new Exception("Invalid PO ID.");				
			}

			// get PO Data
			$po_data = $this->_CI->purchase_model->get_order_data($po_id);

			

			if (!count($po_data)) {
				throw new Exception("Invalid PO ID.");	
			}

			$vendor_id = $po_data['vendor_id'];

			// get PO Items
			$po_items = $this->_CI->purchase_model->get_order_items_with_vendor_stock($po_id);
			$get_price_config = $this->_CI->purchase_model->get_price_config($vendor_id);

			//print_r($po_items);die;
			// Start Transaction
            $this->_CI->db->trans_begin();

			foreach ($po_items as $po_item) {
				if ($po_item['vendor_stock'] !== '' && $po_item['vendor_stock'] !== 'NULL') {
					
					$where = array(
						'vendor_id' => $po_item['vendor_id'],
						'product_variant_id' => $po_item['product_variant_id']
					);

					$updated_stock = (int)$po_item['vendor_stock'] + $po_item['quantity'];
					$data = array('quantity' => $updated_stock);
					$data['price'] = ($get_price_config * $po_item['unit_price']);

					$this->_CI->vendor_products_model->update($where, $data);
				} else {
					
					$data = array(
						'vendor_id' => $po_item['vendor_id'],
						'product_variant_id' => $po_item['product_variant_id'],
						'quantity' => $po_item['quantity'],
						'price' => ($get_price_config * $po_item['unit_price']),
						'is_active' => '1'
					);
					$this->_CI->vendor_products_model->insert($data);
				}
			}

			if ($this->_CI->db->trans_status() === FALSE) {
                throw new Exception("DB_ERROR"); 
            }

            $this->_CI->db->trans_commit();

            return TRUE;

		} catch (Exception $e) {
			$this->_CI->error_message = $e->getMessage();
			return FALSE;
		}
	}

	function refund($so_id = 0, $type = 'partial', $amount = 0) {


		$output = array();

		try {

			if (!(int)$so_id) {
				throw new Exception("Invalid Sales Order");				
			}

			if ($type !== 'partial' && $type !== 'full') {
				throw new Exception("Invalid Refund Type");	
			}

			if (!(float)$amount) {
				throw new Exception("Refund amount should be a valid number.");
			}

			$so_details = $this->_CI->sales_order_model->get_where(array('id'=>$so_id))->row_array();

			if (!count($so_details)) {
				throw new Exception("Invalid Sales Order");
			}

			$txn_details = $this->_CI->sales_order_model->get_where(array('order_id'=>$so_id), '*', 'payment_master')->row_array();
			
			if (!count($txn_details)) {
				throw new Exception("Txn details not found.");
			}

			$paymentType 	= $txn_details['payment_type'];
			$txn_id 		= $txn_details['trans_id'];

			if ($txn_id === '' && ($paymentType === 'paypal' || $paymentType === 'authorize')) {
				throw new Exception("Invalid Refund Type");	
			}

			if ((float)$amount > (float)$so_details['total_amount']) {
				throw new Exception("Refund amount exceeds order amount.");	
			}

			switch ($paymentType) {
				case 'paypal':
					
					// get API credentials
			        $paypal_info = $this->_CI->vendors_model->get_paypal_data($so_details['vendor_id']);
			        if (!count($paypal_info)) {
			        	throw new Exception("Paypal configuration is not found.");
			        }

			        if (!isset($paypal_info['username']) || !isset($paypal_info['password']) || !isset($paypal_info['signature'])) {
			        	throw new Exception("Paypal configuration is invalid.");
			        }

			        $paypal_config = array();
			        $paypal_config['API_UserName'] = $paypal_info['username'];
			        $paypal_config['API_Password'] = $paypal_info['password'];
			        $paypal_config['API_Signature'] = $paypal_info['signature'];
			        $paypal_config['environment'] = isset($paypal_info['payment_mode']) ? $paypal_info['payment_mode']: 'sandbox';

			        // $output['paypal_info'] = $paypal_config;

			        $this->_CI->load->library('paypal');
			        $this->_CI->paypal->initialize($paypal_config);
			        $response = $this->_CI->paypal->refund($txn_id, $type, $amount);
			        // $output['txn_id'] = $txn_id;
			        if ($response['status'] === 'error') {
			        	throw new Exception($response['message']);			        	
			        }

			        $output['response'] = $response;
					break;
				case 'authorize':
					// get API credentials
					$authorize_info = $this->_CI->vendors_model->get_authorize_data($so_details['vendor_id']);

					if (!count($authorize_info)) {
			        	throw new Exception("Authorize configuration is not found.");
			        }

			        if (!isset($authorize_info['api_login_id']) || !isset($authorize_info['api_transaction_key'])) {
			        	throw new Exception("Authorize configuration is invalid.");
			        }

					$this->_CI->load->library('authorize_net');

					$authorize_config = array();
					$authorize_config['api_login_id'] 			= $authorize_info['api_login_id'];
			        $authorize_config['api_transaction_key'] 	= $authorize_info['api_transaction_key'];
			        $this->_CI->authorize_net->initialize($authorize_config);

			        $authorize_config = array();
			        $authorize_config['x_amount'] 	= $amount;
			        $authorize_config['x_trans_id'] = $txn_id;
			        $authorize_config['x_card_num'] = $txn_details['cc_last_digits'];
			        $this->_CI->authorize_net->setData($authorize_config);

			        $auth_refund = $this->_CI->authorize_net->refundOrder();
			        // print_r($auth_refund);
			        $response = $this->_CI->authorize_net->parseRefundResponse($auth_refund);

			        if ($response['status'] === 'error') {
			        	throw new Exception($response['message']);			        	
			        }

			        $output['response'] = $response;
					break;
				case 'cash':
					# code...
					break;
				
			}

			$output['status'] = 'success';
			// $output['so_details'] = $so_details;

			// insert refund entry
			$refunds_data = array();
            $refunds_data['sales_id'] = $so_id;
            $refunds_data['amount'] = $amount;
            $refunds_data['created_date'] = date('Y-m-d H:i:s');
            $this->_CI->refunds_model->insert($refunds_data);

            $log_message = "SO#$so_id:  Refund processed with the amount of " .$amount.' on '.$type;
            action_logs($so_id,'SO',$log_message);

			
		} catch (Exception $e) {
			$output['status'] = 'error';
			$output['message'] = $e->getMessage();
		}

		return $output;
	}

	
}
?>