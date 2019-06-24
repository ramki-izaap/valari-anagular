<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require 'Paypal/vendor/autoload.php';
class Paypal {

    private $API_UserName = '';
    private $API_Password = '';
    private $API_Signature = '';
    private $API_version = '94.0';
    private $environment = 'sandbox';

    public function __construct()   
    {
        
    }

    // Initialize the lib
	public function initialize( $config )
	{
		foreach( $config as $key => $value )
		{
			if( isset($this->$key) )
			{
				$this->$key = $value;
			}
		}
	}

    function refund($txn_id = '', $type = '', $amount = 0)
	{
		$output = array('status' => 'success');

        $this->API_UserName  = urlencode($this->API_UserName);
        $this->API_Password  = urlencode($this->API_Password);
        $this->API_Signature = urlencode($this->API_Signature);
        $this->API_version 		 = urlencode($this->API_version);
		// return urlencode($this->API_UserName).'~~'.urlencode($this->API_Password).'~~'.urlencode($this->API_Signature);
		try 
		{
			if ($this->API_UserName === '' || $this->API_Password === '' || $this->API_Signature === '') {
				throw new Exception('Invalid configuration.');
			}
			
			if(strcmp($txn_id, '') === 0) {
				throw new Exception('Invalid txn ID.');
			}

			if ($type !== 'partial' && $type !== 'full') {
				throw new Exception("Invalid Refund Type");	
			}

			if (!(int)$amount) {
				throw new Exception("Refund amount should be a valid number.");
			}

			$refundType = 'Partial';
			if ($type === 'full') {
				$refundType = 'Full';
			}
			
			// Build Query parameters
			$params = array();
			$params['USER']			= $this->API_UserName;
			$params['PWD']			= $this->API_Password;
			$params['SIGNATURE']	= $this->API_Signature;
			$params['METHOD']		= 'RefundTransaction';
			$params['VERSION']		= $this->API_version;
			$params['TRANSACTIONID']= $txn_id;
			$params['REFUNDTYPE'] 	= $refundType;
			$params['CURRENCYCODE'] = 'USD';
			$params['NOTE'] 		= 'refund:'.$txn_id;
			$params['AMT'] 			=  $amount;
		
			$query_string = http_build_query($params);
			
			// prepare API Endpoint
            $this->environment = "sandbox";
			$API_Endpoint = "https://api-3t.paypal.com/nvp";
			if("sandbox" === $this->environment || "beta-sandbox" === $this->environment) {
				$API_Endpoint = "https://api-3t.".$this->environment.".paypal.com/nvp";
			}
			
			// Set the curl parameters.
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $API_Endpoint);
			curl_setopt($ch, CURLOPT_VERBOSE, 1);
			
			// Turn off the server and peer verification (TrustManager Concept).
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
			curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
			
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_POST, 1);
			
			// Set the request as a POST FIELD for curl.
			curl_setopt($ch, CURLOPT_POSTFIELDS, $query_string);
			
			// Get response from the server.
			$result = curl_exec($ch);
			
			if (!$result) {
				throw new Exception("{$params['METHOD']}_ failed: ".curl_error($ch).'('.curl_errno($ch).')');
			}
			
			
			// Extract the response details.
			parse_str($result, $response);

            $aryResponse = array();
            $httpResponseAr = explode("&",$result);
            foreach ($httpResponseAr as $i => $value){
                $tmpAr = explode("=", $value);
                if(sizeof($tmpAr) > 1)   {
                    $aryResponse[$tmpAr[0]] = urldecode($tmpAr[1]);
                }
            }
            
			if ((0 == count($response)) || !array_key_exists('ACK', $response)) {
				throw new Exception("Invalid HTTP Response for POST request to $API_Endpoint.");
			}
			
            if( strcmp("SUCCESS", strtoupper($response["ACK"])) === 0 || strcmp("SUCCESSWITHWARNING", strtoupper($response["ACK"])) === 0 )
            {
                $output['data'] 	= $aryResponse;
            } else {
			    throw new Exception($aryResponse['L_LONGMESSAGE0']);
            }
			
		} catch(Exception $e) {
            $output['status'] = "error";
            $output['message'] = $e->getMessage();
        }

        
		return $output;
	}

   
}

?>
