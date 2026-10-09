'use strict';
// Transparent, local rule-based heuristics. This is NOT a trained ML model or URL reputation service.
const $ = id => document.getElementById(id);
let activeMode = 'message';
let lastReport = '';
const baseAdvice = [
  'Do not click unexpected links or open unfamiliar attachments.',
  'Verify the claim using an official app, or a contact number you already trust.',
  'Never share passwords, payment card details, or one-time verification codes.'
];
const messageRules = [
  {id:'urgency',title:'Pressure or urgency',weight:18,re:/\b(urgent|immediately|act now|last chance|within (?:\d+|one|two) (?:hours?|minutes?|days?)|expires? today|final warning|right now)\b/i,detail:'Scammers often pressure people to act before checking a claim.'},
  {id:'threat',title:'Threat or account suspension',weight:19,re:/\b(account (?:will be |has been )?(?:closed|locked|suspended|disabled)|legal action|arrest|penalty|pay a fine|service (?:will be )?terminated)\b/i,detail:'Unexpected threats can be used to force a quick response.'},
  {id:'secrets',title:'Request for sensitive information',weight:28,re:/\b(otp|one.time (?:password|code)|verification code|password|pin number|cvv|card number|bank details|seed phrase|recovery phrase|login credentials)\b/i,detail:'Never send secret codes, passwords, or financial information in response to an unsolicited message.'},
  {id:'prize',title:'Unexpected reward or prize',weight:19,re:/\b(congratulations.{0,50}(?:won|winner)|claim your (?:prize|reward)|free (?:gift|iphone|money)|lottery winner|cash prize|guaranteed profit)\b/i,detail:'Surprise rewards can be bait to collect information or money.'},
  {id:'payment',title:'Unusual payment request',weight:22,re:/\b(gift card|crypto(?:currency)?|bitcoin|wire transfer|send money|advance fee|processing fee|pay to unlock|pay (?:a )?deposit)\b/i,detail:'Scammers frequently demand payments through methods that can be difficult to reverse.'},
  {id:'delivery',title:'Delivery or verification pretext',weight:12,re:/\b(package (?:is )?(?:held|on hold)|delivery failed|re.deliver|verify your account|confirm your identity|update your payment)\b/i,detail:'Unexpected delivery and account notices should be checked through the official service.'},
  {id:'offplatform',title:'Move communication elsewhere',weight:10,re:/\b(contact (?:me|us) on (?:telegram|whatsapp)|move (?:to|over to) telegram|keep this secret|do not tell anyone)\b/i,detail:'Requests to keep things secret or shift platforms can be a warning sign.'}
];
const suspiciousTlds = new Set(['zip','mov','click','top','xyz','work','support']); // weak signal only
const brands = ['paypal','amazon','apple','microsoft','google','netflix','instagram','facebook','whatsapp','binance'];
function analyzeUrl(raw){
  const findings=[];
  const add=(title,detail,weight)=>findings.push({title,detail,weight});
  let url;
  try { url = new URL(/^https?:\/\//i.test(raw) ? raw : 'https://'+raw); }
  catch { return {invalid:true,reason:'This does not look like a valid web address.'}; }
  if (!['http:','https:'].includes(url.protocol))return {invalid:true,reason:'Only HTTP and HTTPS website links can be checked.'};
  const host=url.hostname.toLowerCase();
  if (!host || !host.includes('.') || /\s/.test(raw))return {invalid:true,reason:'Enter a complete website domain or URL.'};
  if(url.username || url.password)add('Hidden user information in link','The URL contains user information before the host, which can obscure the destination.',28);
  if(url.protocol==='http:')add('Unencrypted HTTP link','HTTP does not encrypt traffic. HTTPS alone still does not prove a website is legitimate.',15);
  if(/(?:^|\.)xn--/.test(host))add('Internationalized domain encoding','This domain uses punycode. Check for lookalike letters and spelling.',18);
  if(/^(?:\d{1,3}\.){3}\d{1,3}$/.test(host))add('IP address instead of a domain','Unexpected numeric destinations deserve extra scrutiny.',16);
  const labels=host.split('.');
  if(labels.length>=5)add('Many subdomain levels','Long chains of subdomains can disguise the actual domain.',13);
  if(host.length>45)add('Very long hostname','Long domain names are harder to verify at a glance.',11);
  if((host.match(/-/g)||[]).length>=3)add('Many hyphens in the domain','Multiple hyphens may be used to imitate trusted brands.',10);
  const tld=labels[labels.length-1];
  if(suspiciousTlds.has(tld))add('Domain extension deserves a closer look','This extension can be legitimate; it is only a weak warning sign.',6);
  if(/(?:login|secure|verify|wallet|reset|billing|account)/i.test(url.pathname))add('Sensitive-looking URL path','This link refers to login or account actions. Independently verify the site.',8);
  // Compare known brand strings with the registered-looking ending (not a PSL-based check).
  for (const brand of brands){
    if(host.includes(brand) && !new RegExp('(^|\\.)'+brand+'\\.com$').test(host)){
      add('Possible brand imitation','This domain includes “'+brand+'” but is not '+brand+'.com. Brand domains can vary; verify independently.',19);
      break;
    }
  }
  if(url.port && !['80','443'].includes(url.port))add('Unusual port','This URL uses a nonstandard network port.',8);
  return {findings,displayHost:host};
}
function analyzeMessage(text){
  const findings=[];
  for(const rule of messageRules)if(rule.re.test(text))findings.push({...rule});
  const urls=(text.match(/https?:\/\/[^\s<>"']+|\b(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s<>"']*)?/gi)||[]).slice(0,5);
  if(urls.length){findings.push({title:'Link included in message',detail:'Avoid opening unexpected links. We also checked common URL warning signs.',weight:8});for(const raw of urls){const r=analyzeUrl(raw.replace(/[.,!?;:]+$/,''));if(!r.invalid)for(const f of r.findings)findings.push({...f,title:'Link: '+f.title});}}
  return {findings};
}
function renderResult(input){
  let analysis=activeMode==='message'?analyzeMessage(input):analyzeUrl(input.trim());
  if(analysis.invalid){alert(analysis.reason);return;}
  const found=analysis.findings;
  const score=Math.min(100,found.reduce((n,f)=>n+f.weight,0));
  const level=score>=55?'High':score>=25?'Moderate':'Low';
  const theme=level.toLowerCase();
  const summary=level==='High'?'Several warning signs detected. Treat this as potentially suspicious and verify independently.':level==='Moderate'?'Some warning signs detected. Be cautious and verify before acting.':'Few common warning signs detected. This does NOT mean the content is safe.';
  $('emptyState').hidden=true;$('resultContent').hidden=false;
  $('riskLabel').textContent=level+' warning signs';$('riskSummary').textContent=summary;
  $('scoreValue').textContent=score;$('scoreCircle').style.borderColor=theme==='high'?'#ed8585':theme==='moderate'?'#efc775':'#55bf95';
  $('statusPill').textContent='Analyzed';$('statusPill').className='pill '+theme;
  const list=$('findingsList');list.replaceChildren();
  const shown=found.length?found:[{title:'No common rule matches',detail:'Our basic checks found no obvious patterns. New scams and cleverly crafted messages may evade these rules.'}];
  for(const f of shown){const li=document.createElement('li'),strong=document.createElement('strong'),p=document.createElement('p');strong.textContent=f.title;p.textContent=f.detail;li.append(strong,p);list.append(li);}
  $('actionsList').replaceChildren();for(const s of baseAdvice){const li=document.createElement('li');li.textContent=s;$('actionsList').append(li);}
  lastReport='ScamShield AI\n'+level+' warning signs ('+score+'/100 heuristic score)\n'+summary+'\nFindings:\n'+shown.map(f=>'- '+f.title+': '+f.detail).join('\n')+'\nReminder: Not a safety guarantee.';
}
function switchMode(mode){activeMode=mode;for(const m of ['message','link']){$(m+'Panel').hidden=m!==mode;$(m+'Tab').classList.toggle('active',m===mode);$(m+'Tab').setAttribute('aria-selected',String(m===mode));}}
$('messageTab').addEventListener('click',()=>switchMode('message'));
$('linkTab').addEventListener('click',()=>switchMode('link'));
$('checkButton').addEventListener('click',()=>{const input=$(activeMode+'Input').value.trim();if(!input){$(activeMode+'Input').focus();return;}renderResult(input);});
$('sampleButton').addEventListener('click',()=>{$(activeMode+'Input').value=activeMode==='message'?'URGENT! Your account will be suspended today. Verify your password and OTP at https://paypal-login-security.example.com now!':'http://paypal-login-security.example.com/verify';renderResult($(activeMode+'Input').value);});
$('clearButton').addEventListener('click',()=>{$('messageInput').value='';$('linkInput').value='';$('resultContent').hidden=true;$('emptyState').hidden=false;$('statusPill').textContent='Ready';$('statusPill').className='pill neutral';lastReport='';});
$('downloadButton').addEventListener('click',()=>{if(!lastReport)return;const blob=new Blob([lastReport],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='scamshield-report.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('year').textContent=new Date().getFullYear();
$('copyButton').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(lastReport);$('copyButton').textContent='Copied!';setTimeout(()=>$('copyButton').textContent='Copy summary',1500);}catch{$('copyButton').textContent='Copy unavailable';}});
