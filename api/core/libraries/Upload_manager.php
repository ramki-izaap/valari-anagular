<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Upload_manager
{
	private $_CI;
	private $s3_bucket = "inventory-clara";
	private $error_message = '';
	private $sucess_message = '';
	private $upload_errors = array();
	private $valid_image_extensions = array('jpg', 'jpeg', 'png');
	private $valid_video_extensions = array('mp4');
	private $variants = array();
	private $images_dir = './uploads/product_images/';

	public function __construct($options = array())
	{
		$this->_CI = & get_instance();
		$this->_CI->load->model('inventory_model');
		$this->_CI->load->model('variants_model');

		$this->variants = $this->_CI->variants_model->get_variant_shortcodes();
	}

	function processImagesAndVideos() {


		try {
			if (!is_dir($this->images_dir)) {
				throw new Exception("Invalid Directoty.");				
			}

			$dh = opendir($this->images_dir);

			if (!$dh) {
				throw new Exception("Error in opening Directoty.");
			}

			$this->upload_errors = array();

			$uploaded_files_count = 0;
			while (($file = readdir($dh)) !== false) {				

				$segments = explode('.', $file);
				$extension = end($segments);
				
				if (!$this->checkIfValidImage($extension) && !$this->checkIfValidVideo($extension)) {
					continue;
				}

				

				if ($this->checkIfValidImage($extension)) {
					$result = $this->imageUpload($file);
					if ($result === FALSE) {
						$this->upload_errors[] = $file.":".$this->getErrorMessage();
						continue;
					}
				}

				if ($this->checkIfValidVideo($extension)) {
					$result = $this->videoUpload($file);
					if ($result === FALSE) {
						$this->upload_errors[] = $file.":".$this->getErrorMessage();
						continue;
					}
				}

				$uploaded_files_count++;				
			}

			if ($uploaded_files_count) {
				$this->sucess_message = 'Uploaded Successfully';
			}			

			return TRUE;

		} catch (Exception $e) {
			$this->error_message = $e->getMessage();
			return FALSE;
		}
	}

	function imageUpload($file = '') {
		try {
			$segments = explode('.', $file);
			$extension = end($segments);

			if(count($segments) !== 2) {
				throw new Exception("Invalid file name.");				
			}

			$fname = $segments[0];

			$segments = explode('-', $fname);

			if(count($segments) !== 2) {
				throw new Exception("Invalid file name.");				
			}

			$style = $segments[0];
			$colorValue = $segments[1];
			$colorCode = $this->getVariantCode($colorValue);

			if ($colorCode === '') {
				throw new Exception("Invalid color.");
			}

			$result  = $this->_CI->inventory_model->get_where( array('sku'=> $style),"*","products")->row_array();

			if (!count($result)) {
				throw new Exception("Style does not exists.");
			}

			$product_id = $result['id'];

			$file_path 	= $this->images_dir.$file;
			$sku 		= $style.'-'.$colorValue;
			$uri       	= "product-images/" . $product_id . "/" . $sku.'.'.$extension;
			

			$this->s3_upload($uri, $file_path);

			$result = $this->_CI->inventory_model->get_products_variant_ids($product_id, $sku);
			
			if (!count($result) || ($result['variants_ids'] == '' || $result['variants_ids'] == NULL)) {
				throw new Exception("Variant: $colorValue is not available.");
			}

			$variant_ids = $result['variants_ids'];

			$ins = array();
			$ins['file_name']          = $sku.'.'.$extension;
			$ins['product_id']         = $product_id;
			$ins['product_variant_id'] = $variant_ids;
	        $ins['type']               = 'I';

	        $where = array();
	        $where['product_id'] = $product_id;
	        $where['file_name'] = $ins['file_name'];

	        $check_record = $this->_CI->inventory_model->get_where($where,'*','product_images')->row_array();
            if(count($check_record) > 0 ){
                  
            	$update_img = $this->_CI->inventory_model->update($where,$ins,"product_images");
             	
             }else{

             	$ins_img = $this->_CI->inventory_model->insert($ins,"product_images");
             }

	        $this->resize_image_array($sku, $file_path, $product_id, $extension, 'bulk');

	        @unlink($file_path);

			return TRUE;

		} catch (Exception $e) {
			$this->error_message = $e->getMessage();
			return FALSE;
		}
	}

	function videoUpload($file = '') {
		try {
			$segments = explode('.', $file);

			if(count($segments) !== 2) {
				throw new Exception("Invalid file name.");				
			}

			$style = $segments[0];

			if ($style === '') {
				throw new Exception("Invalid file name.");
			}

			$result  = $this->_CI->inventory_model->get_where( array('sku'=> $style),"*","products")->row_array();

			if (!count($result)) {
				throw new Exception("Style does not exists.");
			}

			$product_id = $result['id'];

			$file_path = $this->images_dir.$file;
			$uri       = "product-images/" . $product_id . "/" . $file;

			$this->s3_upload($uri, $file_path);

			$ins = array();
			$ins['file_name']          = $file;
			$ins['product_id']         = $product_id;
			$ins['type']               = 'V';

			$where = array();
	        $where['product_id'] = $product_id;
	        $where['file_name'] = $ins['file_name'];

	        $check_record = $this->_CI->inventory_model->get_where($where,'*','product_images')->row_array();
            if(count($check_record) > 0 ){
                  
            	$update_img = $this->_CI->inventory_model->update($where,$ins,"product_images");
             	
             }else{

             	$ins_img = $this->_CI->inventory_model->insert($ins,"product_images");
             }
	        
	       // $ins_img = $this->_CI->inventory_model->insert($ins,"product_images");

	        @unlink($file_path);
	        
			return TRUE;

		} catch (Exception $e) {
			$this->error_message = $e->getMessage();
			return FALSE;
		}
	}


	function resize_image_array($sku = '', $filepath = '', $product_id = '', $ext = '', $type = '') {
		$resize_image_path = "./assets/images/products/";  

		$large  = $resize_image_path.$sku."_"."large".".".$ext;
		$medium = $resize_image_path.$sku."_"."medium".".".$ext;
		$small  = $resize_image_path.$sku."_"."small".".".$ext;
		$xtra_sm= $resize_image_path.$sku."_"."xtra_small".".".$ext;

		$uri   = "product-images/".$product_id."/";
		$large_image_uri      = $uri.$sku."_"."large".".".$ext;
		$medium_image_uri     = $uri.$sku."_"."medium".".".$ext;
		$small_image_uri      = $uri.$sku."_"."small".".".$ext;
		$xtra_small_image_uri = $uri.$sku."_"."xtra_small".".".$ext;

		//resize images sizes
		$image_sizes[] = array('uri' => $large_image_uri, 'maxwidth' => 1092, 'maxheight' => 2048, 'name' => $large, 'file' => $filepath , 'type' => $type );
		$image_sizes[] = array('uri' => $medium_image_uri, 'maxwidth' => 546, 'maxheight' => 1024, 'name' => $medium, 'file' => $filepath, 'type' => $type );
		$image_sizes[] = array('uri' => $small_image_uri, 'maxwidth' => 128, 'maxheight' => 240, 'name' => $small, 'file' => $filepath, 'type' => $type );                
		$image_sizes[] = array('uri' => $xtra_small_image_uri, 'maxwidth' => 85, 'maxheight' => 159, 'name' => $xtra_sm, 'file' => $filepath, 'type' => $type );

		$this->resize($image_sizes);

	}

	public function resize( $imageData = array() ) {

        $this->_CI->load->library('images');
      
        
        foreach($imageData as $imkey => $imvalue) {
          
          $filepath = ($imvalue['type'] == 'bulk')?$imvalue['name']:$imvalue['file'];

          $this->_CI->images->resize($imvalue['file'], $imvalue['maxwidth'], $imvalue['maxheight'],$imvalue['name'],false);

           if(file_exists($imvalue['name'])){
              
              $this->s3_upload($imvalue['uri'], $imvalue['name']);
           } 
           else
           {
             //return $this->response(array("status" => 'error', 'msg' => "Doesn't exists file to upload s3"));
           }
        }

    }

	public function s3_upload($uri='', $path='')
    {
        $this->_CI->load->library('s3');
        $this->_CI->s3->putBucket($this->s3_bucket);
        $contents = file_get_contents($path);
        $this->_CI->s3->putObject($contents, $this->s3_bucket, $uri);
    }

	function getVariantCode($colorValue = '') {
		
		if (isset($this->variants[$colorValue])) {
			return $this->variants[$colorValue]['short_code'];
		}

		return '';
	}


	function checkIfValidImage($ext = '') {
		if (in_array($ext, $this->valid_image_extensions)) {
			return TRUE;
		}

		return FALSE;
	}

	function checkIfValidVideo($ext = '') {
		if (in_array($ext, $this->valid_video_extensions)) {
			return TRUE;
		}

		return FALSE;
	}

	function getSuccessMessage() {
		return $this->sucess_message;
	}

	function getErrorMessage() {
		return $this->error_message;
	}

	function getUploadErrors() {
		return $this->upload_errors;
	}

	
}
?>