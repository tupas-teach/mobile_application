import { useEffect, useState } from 'react';
export function useLocation() {
  const [location,setLocation]=useState<{lat:number;lng:number}|null>(null);
  useEffect(()=>{setLocation({lat:10.3739,lng:123.9594});},[]);
  return {location,error:null};
}
