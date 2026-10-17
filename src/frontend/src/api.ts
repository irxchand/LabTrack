import type {components} from './generated/api';
export type User = components['schemas']['UserView'];
export type Item = components['schemas']['ItemView'];
export type Project = components['schemas']['ProjectView'];
export type RequestRecord = components['schemas']['RequestView'];
export type Reservation = components['schemas']['ReservationView'];
export type Notification = components['schemas']['NotificationView'];
export type LoginView = components['schemas']['LoginView'];
let token = sessionStorage.getItem('labtrack-token') || '';
export function setToken(value:string){ token=value; value?sessionStorage.setItem('labtrack-token',value):sessionStorage.removeItem('labtrack-token'); }
export class ApiError extends Error {
  constructor(message:string,public status:number){super(message);this.name='ApiError';}
}
export async function api<T>(path:string, body?:unknown, method?:string):Promise<T>{
  const key=crypto.randomUUID();
  const headers:Record<string,string>={Authorization:`Bearer ${token}`};
  if(body!==undefined){headers['Content-Type']='application/json';headers['Idempotency-Key']=key;}
  const invoke=()=>fetch(`/api${path}`,{method:method||(body===undefined?'GET':'POST'),headers,body:body===undefined?undefined:JSON.stringify(body)});
  let response=await invoke();
  // Retry transient transaction failures with the SAME key and exact payload.
  if(response.status===503 && body!==undefined){await new Promise(r=>setTimeout(r,250));response=await invoke();}
  const result=await response.json();
  if(!response.ok)throw new ApiError(result.error?.message||'The request could not be completed.',response.status);
  return result as T;
}
export async function upload(requestId:number,file:File):Promise<{id:string}>{
  const body=new FormData();body.append('file',file);
  const response=await fetch(`/api/requests/${requestId}/evidence`,{method:'POST',headers:{Authorization:`Bearer ${token}`},body});
  const result=await response.json();if(!response.ok)throw new Error(result.error?.message||'Upload failed');return result;
}
