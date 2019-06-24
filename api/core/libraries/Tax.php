<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Tax
{

    public function __construct()
	{
			
	}

    public function calculate( $data = array() )
    {

        $data      = json_encode($data);
        //echo $data;
        $curl_init = curl_init();
        curl_setopt($curl_init, CURLOPT_URL, "https://api.taxjar.com/v2/taxes");
        curl_setopt($curl_init, CURLOPT_POST, 1);
        curl_setopt($curl_init, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl_init, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl_init, CURLOPT_POSTFIELDS, $data);
        curl_setopt($curl_init, CURLOPT_HTTPHEADER, array("Authorization: Bearer 9ae095dd3308f5affdbb0473869b762c",
                                                          "Content-Type: application/json",
                                                          "Content-length: ".strlen($data))
                                                        );
        $response = curl_exec($curl_init);

        if(!curl_errno($curl_init)){
         $response = json_decode($response,true);
         //print_r($response);
            //$info = curl_getinfo($curl_init); 
            if (isset($response['tax']) && isset($response['tax']['amount_to_collect'])) {
                $result = array('status' => 'success', 'tax_amount' => $response['tax']['amount_to_collect']);
            } else {
                $result = array('status' => 'error', 'error' => $response['error']);
            }
            
             
        } 
        else 
        {
            $result = array('status' => 'error', 'error' => curl_error($curl_init));               
        }
          
        return $result;
        curl_close($curl_init);
        

    }    

}


