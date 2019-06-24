<div style="margin:0;font:12px/16px Arial,sans-serif"> 
  <table style="width:640px;color:rgb(51,51,51);margin:0 auto;border-collapse:collapse"> 
   <tbody>
    <tr> 
     <td style="padding:0 20px 20px 20px;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> 
      <table style="width:100%;border-collapse:collapse"> 
       <tbody>
        <tr> 
         <td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> 
          <table style="width:100%;border-collapse:collapse"> 
           <tbody>
            <tr> 
             <td rowspan="2" style="width:115px;padding:20px 20px 0 0;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> <a href="" title="" style="text-decoration:none;color:rgb(0,102,153);font:12px/16px Arial,sans-serif" target="_blank">
              <img alt="" src="<?=base_url();?>assets/images/<?=$vars['store_details']['s_img'];?>"> </a> </td> 
             <td style="text-align:right;padding:5px 0;border-bottom:1px solid rgb(204,204,204);white-space:nowrap;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> </td>
             <td style="width:100%;padding:7px 5px 0;text-align:right;border-bottom:1px solid rgb(204,204,204);white-space:nowrap;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> <a href="" style="border-right:0px solid rgb(204,204,204);margin-right:0px;padding-right:0px;text-decoration:none;color:rgb(0,102,153);font:12px/16px Arial,sans-serif" target="_blank" >Your Orders</a> </td> 
             <td style="text-align:right;padding:5px 0;border-bottom:1px solid rgb(204,204,204);white-space:nowrap;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> <span style="text-decoration:none;color:rgb(204,204,204);font-size:15px;font-family:Arial,sans-serif">&nbsp;|&nbsp;</span> <a href="" style="border-right:0px solid rgb(204,204,204);margin-right:0px;padding-right:0px;text-decoration:none;color:rgb(0,102,153);font:12px/16px Arial,sans-serif" target="_blank" >Your Account</a> <span style="text-decoration:none;color:rgb(204,204,204);font-size:15px;font-family:Arial,sans-serif">&nbsp;|&nbsp;</span> <a href="" style="border:0;margin:0;padding:0;border-right:0px solid rgb(204,204,204);margin-right:0px;padding-right:0px;text-decoration:none;color:rgb(0,102,153);font:12px/16px Arial,sans-serif" target="_blank" >ClaraSunwoo</a> </td>  
            </tr> 
            <tr> 
             <td colspan="3" style="text-align:right;padding:7px 0 5px 0;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> <h2 style="font-size:20px;line-height:24px;margin:0;padding:0;font-weight:normal;color:rgb(0,0,0)!important">Refund Order Confirmation</h2> Order #<a href="" style="text-decoration:none;color:rgb(0,102,153);font:12px/16px Arial,sans-serif" target="_blank" ><?=$vars['order_details']['order_id'];?></a> <br> </td> 
            </tr> 
           </tbody>
          </table> </td> 
        </tr> 
        <tr> 
         <td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> 
          <table style="width:100%;border-collapse:collapse"> 
           <tbody>
            <tr> 
             <td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> <h3 style="font-size:18px;color:rgb(204,102,0);margin:15px 0 0 0;font-weight:normal">Hello <?=$vars['customer_details']['c_name'];?>,</h3> <p style="margin:0 0 4px 0;font:12px/16px Arial,sans-serif"> We have initiated the refund for your below products. You'll get refund with 2-6 business days.</p></td> 
            </tr>
            <tr> 
             <td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> </td> 
            </tr> 
           </tbody>
          </table> </td> 
        </tr> 
        <tr> 
         <td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> 
          <table style="border-collapse:collapse"> 
          </table> </td> 
        </tr>
        <tr> 
         <td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> </td> 
        </tr> 
        <tr> 
         <td style="border-bottom:1px solid rgb(204,204,204);vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> <h3 style="font-size:18px;color:rgb(204,102,0);margin:15px 0 0 0;font-weight:normal">Order Details</h3> </td> 
        </tr> 
        <tr> 
         <td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> 
          <table style="width:100%;border-collapse:collapse"> 
           <tbody>
            <tr> 
             <td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> Order #<a href="" style="text-decoration:none;color:rgb(0,102,153);font:12px/16px Arial,sans-serif" target="_blank" ><?=$vars['order_details']['order_id'];?></a> <br> <span style="font-size:12px;color:rgb(102,102,102)">Placed on <?=$vars['order_details']['placed_on'];?></span> </td> 
            </tr> 
           </tbody>
          </table> </td> 
        </tr> 
        <tr> 
          <td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> 
            <table style="width:95%;border-collapse:collapse">
              <thead>
                  <th width="100" align="left">Name</th>
                  <th width="100" align="left">&nbsp;</th>
                  <th width="100"  align="center">Quantity</th>
                  <th width="100"  align="right">Price</th>
                </thead>
             <tbody>
              <?php
                if($vars['order_details']['line_items'])
                {
                  foreach ($vars['order_details']['line_items'] as $p_key => $p_value)
                  {
                    ?>
                      <tr>
                        <td colspan="1" style="width:100px;text-align:left;padding:0 0 30px 0;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"><a href="" style="text-decoration:none;color:rgb(0,102,153);font-size:13px;line-height:18px;font-family:Arial,sans-serif" target="_blank"></a>
                          <img height="115" src="<?=base_url();?>assets/images/<?=$p_value['product_img'];?>">
                        </td>
                        <td colspan="1" style="color:rgb(102,102,102);padding:10px 10px 30px 10px;vertical-align:middle;font-size:13px;line-height:18px;font-family:Arial,sans-serif">
                          <ul style="margin:0;padding:0">
                            <li style="list-style-type:none;line-height:14px;padding:0 0 4px 0">
                              <a href="" style="font-size:14px;text-decoration:none;color:rgb(0,102,153);line-height:18px;font-family:Arial,sans-serif" target="_blank">
                              <?=$p_value['product_name'];?></a>
                            </li>
                          </ul>
                        </td>
                        <td style="font-family:Arial,sans-serif;text-align:center;"><?=$p_value['quantity'];?></td>
                        <td style="width:110px;text-align:right;font-size:14px;padding:10px 10px 0 0;vertical-align:middle;line-height:18px;font-family:Arial,sans-serif"><strong><?=displayData($p_value['price'],'money');?></strong></td>
                      </tr>
                    <?php
                  }
                }
                ?>
             </tbody>
            </table>
          </td> 
        </tr> 
        <tr> 
          <td style="padding-bottom:10px;border-top:1px solid #ccc;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> 
          </td> 
        </tr> 
        <tr> 
         <td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> 
          <table style="width:100%;border-collapse:collapse"> 
           <tbody>
            <tr> 
             <td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> <p style="margin:0 0 4px 0;font:12px/16px Arial,sans-serif"> Need to make changes to your order? Visit our <a href="" target="_blank" >Help Page</a> for more information.<br> </p> </td> 
            </tr> 
           </tbody>
          </table> </td> 
        </tr> 
        <tr> 
         <td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> 
          <table style="width:100%;padding:0 0 0 0;border-collapse:none"> 
           <tbody>
            <tr> 
             <td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> <p style="padding:0 0 20px 0;border-bottom:1px solid rgb(234,234,234);margin:10px 0 0 0;font:12px/16px Arial,sans-serif">Some products have a limited quantity available for purchase. Please see the product’s Detail Page for the available quantity. Any orders which exceed this quantity will be automatically canceled.<br><br> We hope to see you again soon.</p> </td> 
            </tr> 
           </tbody>
          </table> </td> 
        </tr> 
        <tr> 
          <td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> 
            <table id="m_9063481474867901779m_-4033182648892048643legalCopy" style="width:100%;margin:20px 0 0 0;border-collapse:collapse"> 
              <tbody>
                <tr> 
                  <td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> <p style="font-size:10px;color:rgb(102,102,102);line-height:16px;margin:0 0 10px 0;font:10px"> This email was sent from a notification-only address that cannot accept incoming email. Please do not reply to this message. </p> </td> 
                  </tr> 
                <tr>  
                  </tr> 
                </tbody>
              </table> </td> 
        </tr> 
       </tbody>
      </table> </td> 
    </tr> 
   </tbody>
  </table>  
 </div>