export function useMembership(_userId:string) {
  const tiers={basic:{price:599,classes:4,label:'Basic'},premium:{price:1299,classes:Infinity,label:'Premium'},vip:{price:2499,classes:Infinity,label:'VIP Elite'}};
  const upgrade=async(_tier:keyof typeof tiers):Promise<{success:boolean}>=>{await new Promise<void>((r)=>setTimeout(r,1000));return {success:true};};
  return {tiers,upgrade};
}
