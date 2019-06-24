<?php

defined('BASEPATH') OR exit('No direct script access allowed');

require_once(APPPATH."controllers/AppController.php");

Class Dashboard extends AppController {

	function __construct()
    {
        parent::__construct();
        $this->load->model('dashboard_model');
    }

    //Get chart report
    function get_chart_report_get()
    {
        $output = array();
        try
        {
            $user_role = $this->get('user_role');

            if ($user_role === 'A') {
                $output = $this->get_admin_dashboard_report();
            } else {
                $output = $this->get_vendor_dashboard_report();
            }           
            
            
            $output['status']        = 'success';
        }
        catch(Exception $e)
        {
            $output['status']   = 'error';
            $output['message']  = $e->getMessage();
        }
        $this->response($output);
    }

    function get_admin_dashboard_report()
    {
        $output = array();
        try
        {
            
            $total =0;

            $output['daily']  = $this->dashboard_model->get_daily_purchase_report();

            $output['weekly']   = $this->dashboard_model->get_weekly_purchase_report();

            $output['monthly']  = $this->dashboard_model->get_monthly_purchase_report();

            $output['yearly']   = $this->dashboard_model->get_yearly_purchase_report();

            $output['most_products']  = $this->dashboard_model->get_most_sold_purchase_ordres();
            
        }
        catch(Exception $e)
        {
            
        }

        return $output;
    }

    function get_vendor_dashboard_report()
    {
        $output = array();
        try
        {
            $vendor_id = $this->get('user_id');

            $total =0;

            $output['daily']  = $this->dashboard_model->get_daily_sales_report($vendor_id);

            $output['weekly']   = $this->dashboard_model->get_weekly_sales_report($vendor_id);

            $output['monthly']  = $this->dashboard_model->get_monthly_sales_report($vendor_id);

            $output['yearly']   = $this->dashboard_model->get_yearly_sales_report($vendor_id);

            $output['most_products']  = $this->dashboard_model->get_most_sold_salers_ordres($vendor_id);
        }
        catch(Exception $e)
        {
            
        }

        return $output;
    }

}

