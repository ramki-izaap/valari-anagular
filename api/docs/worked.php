<?php
echo "<pre>";
$csv = array_map('str_getcsv', file('product-import.csv'));
$errors = array();$products = array();$i=0;$j=0;
$row = 1;$err=array();
$columns = array('sku','parent_sku','name','description','qty','price','images','featured_image','category','size','colors','materials','is_active');
try
{
	/*CHECK ALL COLUMN HEADERS ARE PRESENT*/
	$diff = array_diff($columns, $csv[0]);
	if(count($diff))
	{
		throw new Exception("Columns #".implode(",#",$diff)." are not found or mismatch.");
		return false;
	}
	// print_r($csv);

	foreach ($csv as $p_key => $p_value)
	{
		foreach ($p_value as $c_key => $c_value)
		{
			$products[$i][$csv[0][$c_key]] = nl2br($c_value);				
		}
		$i++;
	}

	foreach ($products as $key => $value)
	{
		if($value['sku']!='sku' && $value['sku']=='')
			$errors[] = "Column #sku is null or empty in row #$key.";

		if($value['parent_sku']!='parent_sku' && $value['parent_sku']=='')
			$errors[] = "Column #sku is null or empty in row #$key.";
	}
	if(count($errors))
			throw new Exception('Some Errors occured.', 1);
	// echo count($csv);

}
catch(Exception $e)
{
	$err['status'] = $e->getMessage(); 
}


// print_r($products);
print_r($err);
?>
