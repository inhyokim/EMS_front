"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage(){
  const [u,setU]=useState(""); 
  const [p,setP]=useState(""); 
  const r=useRouter();
  
  return (
    <main className="max-w-sm mx-auto p-6 space-y-4 mt-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">EMS 로그인</h1>
        <p className="text-sm text-gray-500">관리자 인증이 필요합니다</p>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">사용자명</label>
          <input 
            className="input w-full" 
            placeholder="username" 
            value={u} 
            onChange={e=>setU(e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">비밀번호</label>
          <input 
            className="input w-full" 
            type="password" 
            placeholder="password" 
            value={p} 
            onChange={e=>setP(e.target.value)} 
          />
        </div>
      </div>
      
      <button 
        className="btn w-full bg-black text-white" 
        onClick={()=>{
          if(u && p){ 
            localStorage.setItem("ems_token","demo-"+u); 
            r.push("/dashboard"); 
          } else { 
            alert("사용자명과 비밀번호를 입력해주세요"); 
          }
        }}
      >
        로그인
      </button>
    </main>
  );
}
