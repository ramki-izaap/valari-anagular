<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */
	public function index()
	{
		//$this->load->view('welcome_message');
		// $arr = array('name' => 'ram', 'age' => 25, 'baseUrl' => base_url(), 'siteUrl' => site_url());
		// echo json_encode($arr);die;
		// echo base64_encode('14');die;

		$a= array();
		$a['api_login_id'] = '4kT8ddW4vQ';
		$a['api_transaction_key'] = '4cA7XzZM8z735E99';
		$a['api_url'] = 'https://test.authorize.net/gateway/transact.dll';

		echo json_encode($a);
	}

	
}
