<?php  if (!defined('BASEPATH')) exit('No direct script access allowed');
require_once(COREPATH.'libraries/models/App_model.php');

class Dashboard_model extends App_model
{
  function __construct()
  {
    parent::__construct();
    $this->_table = 'sales_order';
  }

  
  function get_daily_purchase_report()
  { 
    
    $query = "SELECT DATE_FORMAT(created_date, '%d')  AS createddate, 
                      SUM(total_amount) AS total, COUNT(*) AS orders 
                FROM purchase_order 
                WHERE YEARweek(created_date) = YEARweek(CURRENT_DATE) 
                GROUP BY createddate 
                ORDER BY createddate";  
      return $this->db->query($query)->result_array();
  }

  function get_daily_sales_report($vendor_id = 0 )
  { 
  	
	  $query = "SELECT DATE_FORMAT(created_time, '%d')  AS createddate, 
                      SUM(total_amount) AS total, COUNT(*) AS orders 
                FROM sales_order 
                WHERE vendor_id=$vendor_id 
                      AND 
                      YEARweek(created_time) = YEARweek(CURRENT_DATE) 
                GROUP BY createddate 
                ORDER BY createddate";  
      return $this->db->query($query)->result_array();
  }


  function get_weekly_sales_report($vendor_id = 0)
  { 
    $query = "SELECT
                WEEK(created_time) week,
                SUM(total_amount) AS total,
                COUNT(*) AS orders
              FROM  sales_order 
              WHERE vendor_id=$vendor_id 
                    AND 
                    DATE_FORMAT(created_time, '%Y%m') = DATE_FORMAT(CURRENT_DATE, '%Y%m')
              GROUP BY week
              ORDER BY week";

        return $this->db->query($query)->result_array();
  }

  function get_weekly_purchase_report()
  { 
    $query = "SELECT
                WEEK(created_date) week,
                SUM(total_amount) AS total,
                COUNT(*) AS orders
              FROM  purchase_order 
              WHERE DATE_FORMAT(created_date, '%Y%m') = DATE_FORMAT(CURRENT_DATE, '%Y%m')
              GROUP BY week
              ORDER BY week";
              
        return $this->db->query($query)->result_array();
  }


  function get_monthly_sales_report($vendor_id = 0)
  { 
    
    $query = "SELECT 
                MONTH(created_time) AS `month`,
                count(*) AS orders,
                SUM(total_amount) AS `total`
            FROM sales_order
            WHERE vendor_id=$vendor_id AND YEAR(created_time)=YEAR(CURRENT_DATE)
            GROUP BY YEAR(created_time), MONTH(created_time)";

    return $this->db->query($query)->result_array();
  }

  function get_monthly_purchase_report()
  { 
    $query = "SELECT 
                MONTH(created_date) AS `month`,
                count(*) AS orders,
                SUM(total_amount) AS `total`
              FROM purchase_order
              WHERE YEAR(created_date)=YEAR(CURRENT_DATE)
              GROUP BY YEAR(created_date), MONTH(created_date)";

    return $this->db->query($query)->result_array();
  }

  function get_yearly_sales_report($vendor_id = 0)
  { 
  	
    $query = "SELECT
                DATE_FORMAT(created_time, '%y') AS year,
                COUNT(*) AS orders,
                SUM(total_amount) AS `total`
        	    FROM  sales_order 
        	    WHERE vendor_id=$vendor_id AND  created_time BETWEEN created_time AND NOW()
        	    GROUP BY year
        	    ORDER BY year";

    return $this->db->query($query)->result_array();
  }

  function get_yearly_purchase_report()
  { 
    
    $query = "SELECT
        DATE_FORMAT(created_date, '%y') AS year,
        COUNT(*) AS orders,
        SUM(total_amount) AS `total`
      FROM  purchase_order 
      WHERE created_date BETWEEN created_date AND NOW()
      GROUP BY year
      ORDER BY year";
        return $this->db->query($query)->result_array();
  }

  function get_most_sold_salers_ordres($vendor_id=0){

    $query = "SELECT 
                  soi.*,
                  so.*,
                  pv.sku,
                  pv.product_variant_name,
                  MONTHNAME(so.created_time) AS month,
                  COUNT(*) 
                FROM sales_order_item soi 
                JOIN sales_order so 
                  ON(so.id = soi.sales_order_id 
                        AND so.order_status!='CANCELLED'
                        AND so.vendor_id=$vendor_id
                    ) 
                JOIN product_variants pv ON(soi.product_variant_id=pv.id) 
                WHERE so.created_time >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) 
                GROUP BY soi.product_variant_id 
                LIMIT 5";

    return $this->db->query($query)->result_array();
  }

  function get_most_sold_purchase_ordres(){

    $query = "SELECT 
                  poi.*,
                  po.*,
                  pv.sku,
                  pv.product_variant_name,
                  MONTHNAME(po.created_date) AS month,
                  COUNT(*) 
                FROM purchase_order_item poi 
                JOIN purchase_order po 
                  ON(po.id = poi.po_id 
                        AND po.order_status!='CANCELLED'
                    ) 
                JOIN product_variants pv ON(poi.product_variant_id=pv.id) 
                WHERE po.created_date  >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) 
                GROUP BY poi.product_variant_id 
                LIMIT 5";

    return $this->db->query($query)->result_array();
  }

}
?>