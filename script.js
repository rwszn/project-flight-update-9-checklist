const C=window.PROJECT_FLIGHT_CONFIG||{};
const sb=(window.supabase&&C.supabasePublishableKey&&C.supabasePublishableKey!=="PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE")
 ? window.supabase.createClient(C.supabaseUrl,C.supabasePublishableKey):null;

const sections={
"PREFLIGHT / FLIGHT SETUP":["Flight information entered","Aircraft selected","Server confirmed","Gate confirmed","Date confirmed","Aircraft ready for flight"],
"STARTUP":["Aircraft powered on","Systems started","Engines started","Flight controls checked"],
"PUSHBACK":["Pushback clearance confirmed","Parking brake released when ready","Pushback started","Pushback completed","Engines stable"],
"BEFORE TAXI":["Parking brake released","Flight controls checked","Lights set as required","Taxi route confirmed"],
"TAXI":["Taxi started","Taxi speed controlled","Turns controlled","Runway entry area checked"],
"BEFORE TAKEOFF":["Takeoff runway confirmed","Takeoff configuration checked","Flight controls checked","Lights set as required","Takeoff clearance confirmed"],
"TAKEOFF":["Takeoff roll started","Throttle set as required","Rotate using pitch control","Positive climb established","Landing gear retracted"],
"AFTER TAKEOFF":["Landing gear confirmed up","Climb established","Lights adjusted as required","Aircraft configuration checked"],
"CLIMB":["Climb established","Climb speed controlled","Autopilot engaged if used","Monitor autopilot operation while in use"],
"CRUISE":["Cruise altitude established","Cruise speed established","Autopilot operation checked if used","Flight path monitored","Systems monitored"],
"DESCENT":["Descent started","Descent speed controlled","Altitude controlled","Autopilot adjusted or disengaged as required"],
"APPROACH":["Approach established","Approach speed controlled","Landing configuration prepared","Landing gear extended when required","Landing lights set as required"],
"FINAL APPROACH":["Final approach established","Approach path stable","Speed controlled","Landing configuration confirmed","Runway confirmed"],
"LANDING":["Landing clearance confirmed","Touchdown completed","Braking applied as required","Landing gear confirmed down"],
"AFTER LANDING":["Aircraft slowed","Runway vacated","Landing lights adjusted","Taxi lights set as required"],
"TAXI TO GATE":["Taxi to gate started","Taxi route followed","Taxi speed controlled","Gate confirmed"],
"AT GATE / PARKING":["Aircraft positioned at gate","Parking brake set","Engines shut down","Ground services completed if used","Lights set as required"],
"SHUTDOWN / FLIGHT COMPLETE":["Aircraft systems shut down","Final flight information checked","Flight complete","Checklist complete"]};
const advanced=["Throttle responds correctly","Pitch responds correctly","Roll responds correctly","Yaw responds correctly","Braking responds correctly","Ground handling checked","Pitch - checked","Roll - checked","Yaw - checked","Throttle - checked","Brakes - checked","Control pitch","Control roll","Control yaw","Adjust throttle as required"];
let user=null,guest=false,advancedOpen=false,state={checks:{},advanced:{},info:{}};

const $=id=>document.getElementById(id);
const key=()=>`pf9-${user?user.id:"guest"}`;
function save(){localStorage.setItem(key(),JSON.stringify(state))}
function load(){try{state=JSON.parse(localStorage.getItem(key()))||state}catch{};render()}
function msg(id,t){$(id).textContent=t}
function screens(id){["auth","registerScreen","forgotScreen","recoveryScreen"].forEach(x=>$(x).classList.toggle("hidden",x!==id))}
function app(){screens("");$("app").classList.remove("hidden");load()}
function guestCookie(){return document.cookie.includes("pf9_guest=1")}
function setGuest(){document.cookie="pf9_guest=1; Max-Age=31536000; Path=/; SameSite=Lax"}

function render(){
 $("checklist").innerHTML="";
 Object.entries(sections).forEach(([title,items])=>{
   const s=document.createElement("section");s.className="panel";
   s.innerHTML=`<h2>${title}</h2>`;
   const list=document.createElement("div");
   items.forEach((text,i)=>list.appendChild(item(text,`${title}-${i}`,false)));
   s.appendChild(list);$("checklist").appendChild(s);
 });
 $("advancedList").innerHTML="";
 advanced.forEach((text,i)=>$("advancedList").appendChild(item(text,`a-${i}`,true)));
 ["aircraft","flight","server","gate","date"].forEach(id=>$(id).value=state.info[id]||"");
 progress();
}
function item(text,id,isAdvanced){
 const l=document.createElement("label");l.className="item";
 const c=document.createElement("input");c.type="checkbox";c.checked=!!(isAdvanced?state.advanced[id]:state.checks[id]);
 c.onchange=()=>{(isAdvanced?state.advanced:state.checks)[id]=c.checked;save();progress()};
 l.append(c,document.createTextNode(text));return l;
}
function progress(){
 let total=0,done=0;
 Object.entries(sections).forEach(([t,a])=>a.forEach((_,i)=>{total++;if(state.checks[`${t}-${i}`])done++}));
 if(advancedOpen){total+=advanced.length;done+=advanced.filter((_,i)=>state.advanced[`a-${i}`]).length}
 let p=total?Math.round(done/total*100):0;
 $("percent").textContent=p+"%";$("bar").style.width=p+"%";$("count").textContent=`${done} of ${total} complete`;
}
async function startUser(u){user=u;guest=false;$("account").textContent=u.email||"Account";app()}
async function startGuest(){if(sb)await sb.auth.signOut();user=null;guest=true;setGuest();$("account").textContent="Guest";app()}

$("login").onsubmit=async e=>{e.preventDefault();if(!sb)return msg("message","Add your Supabase publishable key in config.js first.");msg("message","Logging in...");const{error}=await sb.auth.signInWithPassword({email:$("email").value.trim(),password:$("password").value});if(error)msg("message",error.message)}
$("register").onclick=()=>screens("registerScreen");
$("forgot").onclick=()=>screens("forgotScreen");
$("guest").onclick=startGuest;
$("backRegister").onclick=()=>screens("auth");
$("backForgot").onclick=()=>screens("auth");

$("registerForm").onsubmit=async e=>{
 e.preventDefault();if(!sb)return msg("registerMessage","Supabase is not configured yet.");
 if($("regPassword").value!==$("regConfirm").value)return msg("registerMessage","Passwords do not match.");
 const{data,error}=await sb.auth.signUp({email:$("regEmail").value.trim(),password:$("regPassword").value,options:{emailRedirectTo:location.origin+location.pathname}});
 if(error)return msg("registerMessage",error.message);
 if(data.session)startUser(data.session.user);else msg("registerMessage","Account created. Check your email to confirm your account.");
};
$("forgotForm").onsubmit=async e=>{
 e.preventDefault();if(!sb)return msg("forgotMessage","Supabase is not configured yet.");
 const{error}=await sb.auth.resetPasswordForEmail($("forgotEmail").value.trim(),{redirectTo:location.origin+location.pathname});
 msg("forgotMessage",error?error.message:"Reset email sent. Check your inbox.");
};
$("recoveryForm").onsubmit=async e=>{
 e.preventDefault();if(!sb)return;
 if($("newPassword").value!==$("newConfirm").value)return msg("recoveryMessage","Passwords do not match.");
 const{error}=await sb.auth.updateUser({password:$("newPassword").value});
 if(error)return msg("recoveryMessage",error.message);
 msg("recoveryMessage","Password updated.");setTimeout(()=>app(),700);
};

$("advanced").onclick=()=>{advancedOpen=!advancedOpen;$("advancedPanel").classList.toggle("hidden",!advancedOpen);$("advanced").textContent=advancedOpen?"Hide Advanced":"Advanced";progress()};
$("logout").onclick=async()=>{if(sb)await sb.auth.signOut();user=null;guest=false;$("app").classList.add("hidden");screens("auth")};
["aircraft","flight","server","gate","date"].forEach(id=>$(id).oninput=()=>{state.info[id]=$(id).value;save()});
$("reset").onclick=()=>$("dialog").showModal();
$("cancel").onclick=()=>$("dialog").close();
$("confirm").onclick=()=>{state={checks:{},advanced:{},info:{}};save();render();advancedOpen=false;$("advancedPanel").classList.add("hidden");$("dialog").close()};

async function init(){
 if(!sb){msg("message","Add your Supabase publishable key in config.js first.");return}
 const{data:{session}}=await sb.auth.getSession();
 if(session?.user)startUser(session.user);else if(guestCookie())startGuest();else screens("auth");
 sb.auth.onAuthStateChange((event,session)=>{if(event==="PASSWORD_RECOVERY")screens("recoveryScreen");else if(session?.user)startUser(session.user)});
}
init();
