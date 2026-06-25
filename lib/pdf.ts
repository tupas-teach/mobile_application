import type { Booking, PaymentTransaction } from '../types';
let Print:any=null; let Sharing:any=null;
try { Print=require('expo-print'); Sharing=require('expo-sharing'); } catch { console.warn('expo-print not installed'); }
async function share(html:string,title:string):Promise<void> {
  if(!Print||!Sharing){console.warn('PDF not available');return;}
  const {uri}=await Print.printToFileAsync({html});
  await Sharing.shareAsync(uri,{mimeType:'application/pdf',dialogTitle:title});
}
function wrap(title:string,body:string):string { return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><style>body{font-family:Arial,sans-serif;margin:40px;color:#111}.hdr{text-align:center;border-bottom:3px solid #1D9E75;padding-bottom:20px;margin-bottom:24px}.logo{font-size:28px;font-weight:900;color:#1D9E75}table{width:100%;border-collapse:collapse;margin:20px 0}th{background:#F3F4F6;text-align:left;padding:10px;font-size:13px}td{padding:10px;border-bottom:1px solid #E5E7EB;font-size:13px}.tot{font-size:18px;font-weight:700;color:#1D9E75;text-align:right;margin-top:12px}.bdg{display:inline-block;background:#E1F5EE;color:#0F6E56;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:700}.foot{text-align:center;font-size:12px;color:#9CA3AF;margin-top:40px;border-top:1px solid #E5E7EB;padding-top:20px}</style></head><body><div class="hdr"><div class="logo">FLEXZONE</div><p style="color:#6B7280;font-size:12px;">SmartGym & Sports Complex · Consolacion, Cebu</p><h2>${title}</h2></div>${body}<div class="foot">FlexZone · +63 32 888 1234 · hello@flexzone.ph<br/>Generated ${new Date().toLocaleDateString('en-PH',{dateStyle:'long'})}.</div></body></html>`; }
export async function generateBookingReceipt(b:Booking):Promise<void> {
  await share(wrap('Court Booking Receipt',`<p><strong>Ref:</strong> ${b.id.toUpperCase()}</p><table><tr><th colspan="2">Booking Details</th></tr><tr><td>Court</td><td>${b.courtName}</td></tr><tr><td>Date</td><td>${b.date}</td></tr><tr><td>Time</td><td>${b.timeSlots.join(', ')}</td></tr><tr><td>Duration</td><td>${b.duration} hr(s)</td></tr><tr><td>Status</td><td><span class="bdg">${b.status.toUpperCase()}</span></td></tr><tr><td>Payment</td><td>${(b.paymentMethod??'N/A').toUpperCase()}</td></tr></table><div class="tot">Total: ₱${b.totalAmount.toLocaleString()}</div>`),'FlexZone Receipt');
}
export async function generatePaymentReceipt(tx:PaymentTransaction):Promise<void> {
  const items=tx.items?.map(i=>`<tr><td>${i.name} ×${i.qty}</td><td>₱${(i.price*i.qty).toLocaleString()}</td></tr>`).join('')??'';
  await share(wrap('Payment Receipt',`<p><strong>Ref:</strong> ${tx.reference}</p><table><tr><th colspan="2">Details</th></tr><tr><td>Description</td><td>${tx.description}</td></tr><tr><td>Method</td><td>${tx.method.replace('_',' ').toUpperCase()}</td></tr><tr><td>Status</td><td><span class="bdg">${tx.status.toUpperCase()}</span></td></tr>${items}</table><div class="tot">₱${tx.amount.toLocaleString()}</div>`),'FlexZone Receipt');
}
export async function generateMembershipCertificate(u:{name:string;membership:string;expiry:string}):Promise<void> {
  await share(wrap('Membership Certificate',`<div style="text-align:center;padding:40px 0"><div style="font-size:60px">🏆</div><h2 style="color:#1D9E75">Certificate of Membership</h2><p style="color:#6B7280">This certifies that</p><h1>${u.name}</h1><p>is a registered <strong style="color:#1D9E75">${u.membership.toUpperCase()}</strong> member of FlexZone SmartGym</p><p style="color:#6B7280;font-size:13px;margin-top:24px">Valid until: <strong>${u.expiry}</strong></p></div>`),'FlexZone Certificate');
}
