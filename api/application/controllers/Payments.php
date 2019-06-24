<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require COREPATH.'libraries/Paypal/vendor/autoload.php';
/*
 * Example usage of Authorize.net's
 * Advanced Integration Method (AIM)
 */
class Payments extends CI_Controller
{
	function __construct(){
		parent::__construct();
		$this->_bucket = 'inventory-clara';
		
	}
	// Example auth & capture of a credit card
	public function index()
	{
		// $s3_credentials = array('keyId'=>'AKIAIQB53INZZQIIXQVA','secretKey'=>'jP5gm6yDm0codoIFgTylcCKobwkB8D2Xu1YzTnTL');
		// $this->s3->listBuckets();
		/*$this->s3->putBucket($this->_bucket);
		$file_name = "bottom.jpg";
		$filename = "product-images/2/".$file_name;
		$path = "docs/bottom.jpg";
		$contents = file_get_contents($path);
		$this->s3->putObject($contents, $this->_bucket,$filename);*/
		$a = $this->s3->getBucket($this->_bucket);
		echo "<pre>";
		foreach($a as $object)
		{
			print_r($object);
		}
		// Authorize.net lib
		echo "hi";
	}

 public function uu(){
	$apiContext = new PayPal\Rest\ApiContext(
		new \PayPal\Auth\OAuthTokenCredential(
				'AbXclOoeeFZadTlP3TKLTedipqK7Nuj9BwyT2q1eZXwxFn-cpdkvXX7v6d8S7oPHwRKwuZvOvVOdLpPf',     // ClientID
				'EHant6gC0TmNiC_Wg2Q6fQ93YX9jCeW7cas5s1bQa5TSlHFycgEMp2qt3Bgk7EPv5wxgczgGBp0aiVOS'      // ClientSecret
		)
	);
 }

 public function ipn()
 {

	 $ipn_response = $this->input->post();

	 $ipn_response = json_encode($ipn_response);

	 $this->db->query("insert into ipn_response set ipn_response='".$ipn_response."'");
 }

	
}
?>