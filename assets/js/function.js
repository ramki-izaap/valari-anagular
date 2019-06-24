
function add_to_cart()
{
  form = $("form#add_to_cart").serialize();
  $.ajax({
    type:'POST',
    url:base_url+'cart/add_to_cart',
    data:form,
    dataType:'json',
    success:function(data)
    {
      console.log(data);
      $.fancybox({content: data.html});
    },
    error:function(err)
    {
      console.log(err);
    }
  });
} 


function remove_cart_item(rowid,method='')
{
  $.ajax({
    type:'POST',
    url:base_url+'cart/remove_cart_item',
    data:{rowid:rowid},
    dataType:'json',
    success:function(data)
    {
      console.log(data);
      if(method=='ajax')
        $.fancybox({content: data.html});
      else
        location.reload();
    },
    error:function(err)
    {
      console.log(err);
    }
  });
}

function update_cart_item()
{
  form = $("form#cartform").serialize();
  $.ajax({
    type:'POST',
    url:base_url+'cart/update_cart_item',
    data:form,
    dataType:'json',
    success:function(data)
    {
      console.log(data);
      if(data.status=='success')
        location.reload();
    },
    error:function(err)
    {
      console.log(err);
    }
  });
}


function apply_coupon()
{
  $(".coupon_err_msg").html("");
  // $(".coupon_success_msg").html("");
  var data = {};
  // data.shipping_country = $("#shipping_country").val();
  if($("#coupon_input").val()=='')
  {
    $(".coupon_err_msg").html("Please enter coupon");
    return false;
  }
  $(".coupon-btn").html("<img src='"+base_url+"/assets/images/loading.gif'>");
  $.ajax({
    url:base_url+'cart/apply_coupon/'+$("#coupon_input").val(),
    type : "POST",
    data:data,
    dataType:"json",
    success : function(rdata) {
      console.log(rdata);
      $(".coupon-btn").html("Apply");
      if(rdata.status == 'error')
      {
        $(".coupon_err_msg").html(rdata.message);
      }
      else if(rdata.status == 'success')
      {
        $("#coupon_input").val('');
        $(".total-line.total-line--discount span.discount").html(rdata.response.coupon_amt_text);
        $(".total-line.total-line--total span.payment-due__price").html(rdata.response.total_text);
        $(".coupon_success_msg").html(rdata.response.success_msg);
        // cart_information();
      }
      
    },
    error : function(rdata) {
      console.log(rdata);
    }
  });
}
  
function remove_coupon(id='')
{
  $(".coupon_err_msg").html("");
  $.ajax({
    type:"POST",
    url:base_url+'cart/remove_coupon',
    data:{id:id},
    dataType:'json',
    success:function(data)
    {
      console.log(data);
      if(data.status=='success')
        $(".coupon_success_msg").html("");
      $(".total-line.total-line--discount span.discount").html("$0");
        $(".total-line.total-line--total span.payment-due__price").html(data.total_text);
    },
    error:function(data)
    {
      console.log(data);
    }
  });
}

$(document).ready(function(){

});