<table width=100% cellpadding=0 cellspacing=0 border=0 class="message">
	<tr>
		<td align=right>
			<tr>
				<td>
					<tr>
						<td colspan=2>
							<table width=100% cellpadding=12 cellspacing=0 border=0>
								<tr>
									<td>
										<div style="overflow: hidden;">
											<font size=-1>
												<div style="margin:0;font-size:13px;line-height:18px;font-family:Arial,sans-serif">
													<table cellpadding="0" style="width:655px;color:rgb(51,51,51);margin:0 auto;border-collapse:collapse">
														<tbody>
															<tr>
																<td style="padding:0 20px 20px 20px;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif">
																	<table cellpadding="0" style="width:100%;border-collapse:collapse">
																		<tbody>
																			<tr>
																				<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif">
																					<table cellpadding="0" style="width:100%;border-collapse:collapse">
																						<tbody>
																							<tr>
																								<td rowspan="2" style="width:115px;padding:18px 0 0 0;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif">
																									<a href="" title="Visit Amazon.in" style="text-decoration:none;color:rgb(0,102,153);font-size:13px;line-height:18px;font-family:Arial,sans-serif" target="_blank" >
																										<img alt="ClaraSunwoo" src="<?=base_url();?>assets/images/<?=$vars['store_details']['s_img'];?>" style="border:0"></a>
																								</td>
																								<td style="text-align:right;padding:5px 0;border-bottom:1px solid rgb(204,204,204);white-space:nowrap;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif">
																									<a href="" style="border-right:0px solid rgb(204,204,204);margin-right:0px;padding-right:0px;text-decoration:none;color:rgb(0,102,153);font-size:13px;line-height:18px;font-family:Arial,sans-serif" target="_blank" >Your Orders</a><span style="text-decoration:none;color:rgb(204,204,204);font-size:15px;font-family:Arial,sans-serif">|</span>
																									<a href="" style="border-right:0px solid rgb(204,204,204);margin-right:0px;padding-right:0px;text-decoration:none;color:rgb(0,102,153);font-size:13px;line-height:18px;font-family:Arial,sans-serif" target="_blank" >Your Account</a> <span style="text-decoration:none;color:rgb(204,204,204);font-size:15px;font-family:Arial,sans-serif">|</span>
																									<a href="" style="border-right:0px solid rgb(204,204,204);margin-right:0px;padding-right:0px;text-decoration:none;color:rgb(0,102,153);font-size:13px;line-height:18px;font-family:Arial,sans-serif" target="_blank" >ClaraSunwoo</a> </td>
																							</tr>
																							<tr>
																								<td style="text-align:right;padding:7px 0 5px 0;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> <h2 style="font-size:20px;line-height:24px;margin:0;padding:0;font-weight:normal;color:rgb(0,0,0)">Order Cancellation</h2> Order # <a href="" style="text-decoration:none;color:rgb(0,102,153);font-size:13px;line-height:18px;font-family:Arial,sans-serif" target="_blank" ><?=$vars['order_details']['order_id'];?></a>
																								</td>
																							</tr>
																						</tbody>
																					</table>
																				</td>
																			</tr>
																			<tr>
																				<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif">
																					<table cellpadding="0" style="width:100%;border-collapse:collapse">
																						<tbody>
																							<tr>
																								<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> <h3 style="font-size:18px;color:rgb(204,102,0);margin:15px 0 0 0;font-weight:normal">Hello <?=$vars['customer_details']['c_name'];?>,</h3> <p style="margin:4px 0 18px 0;font-size:13px;line-height:18px;font-family:Arial,sans-serif">We&#39;re writing to let you know that your order has been successfully cancelled.</p>
																								</td>
																							</tr>
																						</tbody>
																					</table>
																				</td>
																			</tr>
																			<tr>
																				<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif">
																					<table cellpadding="0" style="width:100%;border-collapse:collapse">
																						<tbody>
																							<tr>
																								<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> <h3 style="border-bottom:1px solid rgb(204,204,204);margin:0 0 3px 0;padding:0 0 3px 0;font-size:18px;color:rgb(204,102,0);font-weight:normal">Order Details</h3>
																								</td>
																							</tr>
																							<tr>
																								<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> <h4 style="font-size:14px;margin:0;font-weight:normal">Order # <a href="" style="text-decoration:none;color:rgb(0,102,153);font-size:13px;line-height:18px;font-family:Arial,sans-serif" target="_blank" ><?=$vars['order_details']['order_id'];?></a> </h4> <span style="color:rgb(102,102,102);font-size:12px">Placed on <?=$vars['order_details']['placed_on'];?></span>
																								</td>
																							</tr>
																							<tr>
																								<td style="padding:16px 20px 6px 20px;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif">
																									<table cellpadding="0" style="width:100%;border-collapse:collapse">
																										<tbody>
																											<?php
																			                if($vars['order_details']['line_items'])
																			                {
																			                  foreach ($vars['order_details']['line_items'] as $p_key => $p_value)
																			                  {
																			                    ?>
																														<tr>
																															<td style="width:150px;text-align:center;padding:0 0 30px 0;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"><a href="" style="text-decoration:none;color:rgb(0,102,153);font-size:13px;line-height:18px;font-family:Arial,sans-serif" target="_blank"></a>
																																<img height="115" src="<?=base_url();?>assets/images/<?=$p_value['product_img'];?>">
																															</td>
																															<td style="color:rgb(102,102,102);padding:10px 10px 30px 10px;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif">
																																<ul style="margin:0;padding:0">
																																	<li style="list-style-type:none;line-height:14px;padding:0 0 4px 0">
																																		<a href="" style="font-size:14px;text-decoration:none;color:rgb(0,102,153);line-height:18px;font-family:Arial,sans-serif" target="_blank">
																																		<?=$p_value['product_name'];?></a>
																																	</li>
																																</ul>
																															</td>
																														</tr>
																													<?php
																												}
																											}
																											?>
																											<tr>
																												<td colspan="2">
																													<p style="margin:0;font-size:12px;line-height:16px;font-family:Arial,sans-serif"><b>Reason for Cancellation:
																														</b><?=$vars['order_details']['cancel_reason'];?>
																													</p>
																												</td>
																											</tr>
																										</tbody>
																									</table>
																								</td>
																							</tr>
																						</tbody>
																					</table>
																				</td>
																			</tr>
																			<tr>
																				<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif">
																					<table cellpadding="0" style="width:100%;border-collapse:collapse">
																						<tbody>
																							<tr>
																								<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"></td>
																							</tr>
																							<tr>
																								<td style="border-top:1px solid rgb(204,204,204);vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif;padding-bottom: 20px;"></td>
																							</tr>
																						</tbody>
																					</table>
																					<table cellpadding="0" style="width:100%;border-collapse:collapse">
																						<tbody>
																							<tr>
																								<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> <p style="padding:0 0 20px 0;border-bottom:1px solid rgb(234,234,234);margin:0;font-size:13px;line-height:18px;font-family:Arial,sans-serif">We hope to see you again soon.</p>
																								</td>
																							</tr>
																						</tbody>
																					</table>
																				</td>
																			</tr>
																			<tr>
																				<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif">
																					<table style="width:100%;margin:20px 0 0 0;border-collapse:collapse">
																						<tbody>
																							<tr>
																								<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> <p style="font-size:11px;color:rgb(102,102,102);line-height:16px;margin:0 0 10px 0;font-family:Arial,sans-serif">This e-mail was sent from a notification-only address that can&#39;t accept incoming e-mail. Please don&#39;t reply to this message.</p>
																								</td>
																							</tr>
																						</tbody>
																					</table>
																				</td>
																			</tr>
																		</tbody>
																	</table>
																</td>
															</tr>
														</tbody>
													</table>
												</div>
											</font>
										</div>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</td>
			</tr>
		</td>
	</tr>
</table>