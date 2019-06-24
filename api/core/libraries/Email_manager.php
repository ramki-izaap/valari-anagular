<?php
if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Email_manager
{
    private $_CI;
    private $_cc = array();
    private $_bcc = array();
    
    public function __construct($options = array())
    {
        $this->_CI =& get_instance();
        $this->_CI->error_message = '';
        $this->_CI->load->helper('email_config');
        $this->_CI->load->model('sales_order_model', 'som');
        $this->_CI->load->model('purchase_model', 'po_model');
        foreach ($options as $key => $value) {
            $key = "_{$key}";
            if (isset($this->$key))
                $this->$key = $value;
        }
        
        ini_set("max_execution_time", 60);
    }
    
    public function initialize($params = array())
    {
        if (!count($params))
            return FALSE;
        
        foreach ($params as $key => $val) {
            $key = "_{$key}";
            if (isset($this->$key))
                $this->$key = $val;
        }
    }
    
    public function send_order_email($order_id = '')
    {
        
        if ($order_id == '')
            return false;
        $order    = $this->_CI->som->getData($order_id);
        $products = $this->_CI->som->get_sales_item($order_id);
        $vendor   = $this->_CI->som->get_vendor_details($order['vendor_id']);
        $vars     = array();
        
        $sub_total             = $order['total_amount'] - $order['tax'] - $order['total_shipping'] + $order['total_discount'];
        $vars['order_details'] = array(
            'order_id' => $order_id,
            'placed_on' => date('l F d, y', strtotime($order['created_time'])),
            'sub_total' => $sub_total,
            'shipping_fee' => $order['total_shipping'],
            'discount' => $order['total_discount'],
            'tax' => $order['tax'],
            'total' => $order['total_amount']
        );
        
        $vars['order_details']['line_items'] = $products;
        
        $vars['customer_details'] = array(
            "c_id" => $order['customer_id'],
            "c_name" => $order['first_name'] . " " . $order['last_name'],
            "c_email" => $order['email'],
            'c_address' => str_replace(PHP_EOL, '', $order['address']),
            'c_address2' => '',
            'c_city' => $order['city'],
            'c_state' => $order['state'],
            'c_country' => $order['country'],
            'c_zipcode' => $order['zip']
        );
        
        $vars['store_details'] = array(
            "s_id" => $vendor['id'],
            "s_name" => $vendor['store_name'],
            "s_email" => $vendor['email'],
            "s_img" => $vendor['logo']
        );
        $mail_title            = "Order Info - #{$order_id}";
        $this->data['vars']    = $vars;
        $email                 = $order['email'];
        $from_email            = $vars['store_details']['s_email'];
        $from_name             = $vars['store_details']['s_name'];
        $attachments           = '';
        $subject               = $vars['store_details']['s_name'] . " " . $mail_title;
        $msg                   = $this->_CI->load->view('email/templates/confirmation_template', $this->data, true);
        
        $this->send_email($email, $from_email, $from_name, '', $subject, $msg, '');
        // $this->send_email('ramkumar.izaap@gmail.com','ramkumar@izaapech.in', 'Ram','',$subject, $msg,'');
    }
    
    public function send_po_order_mail($order_id = '')
    {
        if ($order_id == '')
            return false;
        $order                 = $this->_CI->po_model->get_order_data($order_id);
        $products              = $this->_CI->po_model->get_order_items($order_id);
        $vars                  = array();
        $vars['order_details'] = array(
            'order_id' => $order_id,
            'placed_on' => date('l F d, y', strtotime($order['created_date'])),
            'sub_total' => $order['total_amount'],
            'shipping_fee' => '0',
            'discount' => '0',
            'total' => $order['total_amount']
        );
        
        
        $vars['order_details']['line_items'] = $products;
        
        $vars['customer_details'] = array(
            "c_id" => $order['customer_id'],
            "c_name" => $order['name'],
            "c_email" => $order['email'],
            'c_address' => str_replace(PHP_EOL, '', $order['store_address']),
            'c_address2' => '',
            'c_city' => $order['city'],
            'c_state' => $order['state'],
            'c_country' => $order['country'],
            'c_zipcode' => $order['zip']
        );
        $vars['store_details']    = array(
            "s_id" => '1',
            "s_name" => 'Clara Sunwoo',
            "s_email" => "cs@clara-sunwoo.com",
            "s_img" => "../assets/images/logo.png"
        );
        $mail_title               = "Order Info - #{$order_id}";
        $this->data['vars']       = $vars;
        $email                    = $order['email'];
        $from_email               = $vars['store_details']['s_email'];
        $from_name                = $vars['store_details']['s_name'];
        $attachments              = '';
        $subject                  = $vars['store_details']['s_name'] . " " . $mail_title;
        $msg                      = $this->_CI->load->view('email/templates/confirmation_template', $this->data, true);
        $this->send_email($email, $from_email, $from_name, '', $subject, $msg, '');
        // $this->send_email('ramkumar.izaap@gmail.com','ramkumar@izaapech.in', 'Ram','',$subject, $msg,'');
    }
    
    function send_forgot_password_mail($mail = '', $link = '')
    {
        
        if ($mail == '') {
            return false;
        }
        
        $subject    = "Reset Password";
        $from_name  = "Vendor Name";
        $from_email = "vendor@email.com";
        
        $this->_CI->load->model('users_model');
        
        $user = $this->_CI->users_model->get_where(array(
            "email" => $mail
        ), "*", "users")->row_array();
        
        if (count($user) <= 0) {
            return false;
        }
        
        $this->data['vars'] = $user;
        //$this->data['link'] = base_url()."forgot_password_reset";
        $this->data['link'] = $link;
        $msg                = $this->_CI->load->view('email/templates/forgot_password', $this->data, true);
        
        //echo $msg; exit;
        
        $this->send_email($mail, $from_email, $from_name, '', $subject, $msg, '');
    }
    
    function send_order_cancellation_mail($order_id = '')
    {
        if ($order_id == '')
            return false;
        $mail_title                          = "Order Info - #{$order_id}";
        $vars                                = array();
        $vars['customer_details']            = array(
            "c_id" => 1,
            "c_name" => 'Ramkumar',
            "c_email" => 'ramkumar.izaap@gmail.com',
            'c_address' => 'SVS Nagar',
            'c_address2' => 'Valasaravakkam',
            'c_city' => 'Chennai',
            'c_state' => 'Tamilnadu',
            'c_country' => 'India',
            'c_zipcode' => '600087'
        );
        $vars['store_details']               = array(
            "s_id" => 1,
            "s_name" => 'ClaraSunwoo',
            "s_email" => 'vendor@gmail.com',
            "s_img" => 'vendor.png'
        );
        $vars['order_details']               = array(
            "order_id" => $order_id,
            "placed_on" => 'Thursday, April 26, 2018',
            "cancel_reason" => 'Customer Cancelled'
        );
        $vars['order_details']['line_items'] = array(
            '0' => array(
                'product_name' => 'Lenovo',
                'product_img' => 'order_img.jpg',
                'quantity' => '2',
                'price' => '20000'
            )
        );
        $subject                             = $vars['store_details']['s_id'] . " " . $mail_title;
        $this->data['vars']                  = $vars;
        $mail                                = $vars['customer_details']['c_email'];
        $from_email                          = $vars['store_details']['s_email'];
        $from_name                           = $vars['store_details']['s_name'];
        $msg                                 = $this->_CI->load->view('frontend/email/templates/order_cancellation', $this->data, true);
        $this->send_email($mail, $from_email, $from_name, '', $subject, $msg, '');
    }
    
    function send_order_refund_mail($order_id = '')
    {
        $order    = $this->_CI->som->get_data($order_id);
        $products = $this->_CI->som->get_sales_item($order_id);
        $vendor   = $this->_CI->som->get_vendor_details($order['vendor_id']);
        // print_r($order);
        // print_r($vendor);
        // print_r($products);
        // exit;
        if ($order_id == '')
            return false;
        $vars = array();
        
        // Thursday, April 26, 2018
        $vars['order_details']    = array(
            'order_id' => $order_id,
            'placed_on' => date("l, F d, Y", strtotime($order['created_time']))
        );
        $vars['customer_details'] = array(
            "c_id" => $order['customer_id'],
            "c_name" => $order['first_name'] . " " . $order['last_name'],
            "c_email" => $order['email'],
            'c_address' => str_replace(PHP_EOL, '', $order['address']),
            // 'c_address2'=>$order['email'],
            'c_city' => $order['city'],
            'c_state' => $order['state'],
            'c_country' => $order['country'],
            'c_zipcode' => $order['zip']
        );
        
        $vars['store_details'] = array(
            "s_id" => $vendor['id'],
            "s_name" => $vendor['store_name'],
            "s_email" => $vendor['email'],
            "s_img" => $vendor['logo']
        );
        
        $vars['order_details']['line_items'] = $products;
        $this->data['vars']                  = $vars;
        $msg                                 = $this->_CI->load->view('frontend/email/templates/order_refund', $this->data, true);
        $mail_title                          = "Refund Order - #{$order_id}";
        $subject                             = $vars['store_details']['s_id'] . " " . $mail_title;
        $this->data['vars']                  = $vars;
        $mail                                = $vars['customer_details']['c_email'];
        $from_email                          = $vars['store_details']['s_email'];
        $from_name                           = $vars['store_details']['s_name'];
        $this->send_email($mail, $from_email, $from_name, '', $subject, $msg, '');
    }
    
    function send_email($to = '', $from = '', $from_name = '', $cc = '', $subject = '', $message = '', $attachment = '')
    {
        $CI =& get_instance();
        $CI->load->library('email');
        
        $config['protocol'] = 'sendmail';
        $config['mailpath'] = '/usr/sbin/sendmail';
        $config['charset']  = 'iso-8859-1';
        $config['wordwrap'] = TRUE;
        
        $CI->email->initialize($config);
        
        $CI->email->set_mailtype("html");
        $CI->email->from($from, $from_name);
        $CI->email->to($to);
        
        if (!empty($cc)) {
            $CI->email->cc($cc);
        }
        
        $CI->email->subject($subject);
        $CI->email->message($message);
        
        if ($attachment) {
            $CI->email->attach($attachment);
        }
        
        if ($CI->email->send())
            return true;
        else
            return false;
    }
}
?>