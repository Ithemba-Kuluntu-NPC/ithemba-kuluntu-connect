const requests = [
  ["live_config", "https://ithembakuluntu.org/api/paypal/config", undefined],
  ["live_notification", "https://ithembakuluntu.org/api/paypal/ipn", "txn_id=invalid&payment_status=Completed&mc_currency=EUR&mc_gross=1.00"],
  ["paypal_validation", "https://ipnpb.paypal.com/cgi-bin/webscr", "cmd=_notify-validate&txn_id=invalid&payment_status=Completed&mc_currency=EUR&mc_gross=1.00"],
];
for (const [name, url, body] of requests) {
  try {
    const res = await fetch(url, {method:body?"POST":"GET", headers:{"Content-Type":"application/x-www-form-urlencoded", "User-Agent":"iThemba-Kuluntu-IPN-Verification/1.0"}, ...(body?{body}:{}),redirect:"error", signal:AbortSignal.timeout(30000)});
    const text = await res.text();
    console.log(JSON.stringify({name,status:res.status,verificationReply:["VERIFIED","INVALID"].includes(text.trim())?text.trim():undefined,knownError: text.includes("paypal_unavailable")?"paypal_unavailable":undefined,configProduction:text.includes('"mode":"production"'),contentType:res.headers.get("content-type")}));
  } catch (e) { console.log(JSON.stringify({name,failed:true,errorClass:e.name})); }
}
