<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

// ------------------------------------------------------------------------

/**
 * Email Helpers
 * Inspiration from PHP Cookbook by David Sklar and Adam Trachtenberg
 * 
 * @author		Sivanesan
 * 
 */

// ------------------------------------------------------------------------

/**
 * Email Config
 *
 *
 */
if ( ! function_exists('email_config'))
{
	function email_config()
	{
	  
/*	working
		  $config['protocol'] = 'smtp';
		  $config['smtp_host'] = 'ssl://smtp.gmail.com';
		  $config['smtp_port'] = 465;
		  $config['smtp_user'] = 'siva.vivid@gmail.com';
		  $config['smtp_pass'] = 'siva1234';
		  $config['mailtype'] = 'html';
*/
		  
		  
		  //testing
		  
		  $config['protocol'] = 'mail';
		  //$config['smtp_host'] = 'ssl://smtp.gmail.com';
		  //$config['smtp_port'] = 465;
		  //$config['smtp_user'] = 'siva.vivid@gmail.com';
		  //$config['smtp_pass'] = 'siva1234';
		  $config['mailtype'] = 'html';
		  
		  
		  return $config;		 
	}
}

if ( ! function_exists('get_email_details_by_channel'))
{
	function get_email_details_by_channel($channel_id = 1)
	{
		$CI =& get_instance();
		//get email config details of the channel in which the order takes place
		$CI->config->load('email_config');
		$channel_details = $CI->config->item('channel_details', 'email');
		if(is_array($channel_details) && isset($channel_details[$channel_id]))
			return $channel_details[$channel_id];
		else
			return false;
	}
}

/* End of file email_helper.php */
/* Location: ./system/helpers/email_helper.php */
