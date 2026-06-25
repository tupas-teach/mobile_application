import type { PaymentMethod } from '../types';
import { PAYMONGO_KEY } from './config';
const BASE = 'https://api.paymongo.com/v1';
const hdrs = ():Record<string,string> => ({'Content-Type':'application/json', Authorization:`Basic ${btoa(PAYMONGO_KEY+':')}`});
export async function createPaymentIntent(amountPHP:number,description:string):Promise<unknown> {
  const r = await fetch(`${BASE}/payment_intents`,{method:'POST',headers:hdrs(),body:JSON.stringify({data:{attributes:{amount:amountPHP*100,payment_method_allowed:['gcash','paymaya','card'],payment_method_options:{card:{request_three_d_secure:'any'}},currency:'PHP',capture_type:'automatic',description}}})});
  return r.json();
}
export async function createGCashSource(amountPHP:number,name:string,email:string,phone:string):Promise<unknown> {
  const r = await fetch(`${BASE}/sources`,{method:'POST',headers:hdrs(),body:JSON.stringify({data:{attributes:{amount:amountPHP*100,currency:'PHP',type:'gcash',redirect:{success:'flexzone://payment/success',failed:'flexzone://payment/failed'},billing:{name,email,phone}}}})});
  return r.json();
}
export async function createMayaSource(amountPHP:number,name:string,email:string):Promise<unknown> {
  const r = await fetch(`${BASE}/sources`,{method:'POST',headers:hdrs(),body:JSON.stringify({data:{attributes:{amount:amountPHP*100,currency:'PHP',type:'paymaya',redirect:{success:'flexzone://payment/success',failed:'flexzone://payment/failed'},billing:{name,email}}}})});
  return r.json();
}
export function generateReference():string { return `FZ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2,6).toUpperCase()}`; }
export async function mockPayment(_a:number,_m:PaymentMethod):Promise<{success:boolean;reference:string}> {
  await new Promise<void>((r)=>setTimeout(r,1800));
  return {success:true,reference:generateReference()};
}
