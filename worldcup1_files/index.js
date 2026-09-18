var __defProp=Object.defineProperty,__defNormalProp=(t,e,r)=>e in t?__defProp(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,__publicField=(t,e,r)=>__defNormalProp(t,"symbol"!=typeof e?e+"":e,r);!function(){"use strict";var t,e="ColorModeScript_colorSchemaDark__1h2xye80";const r="account",i="account/email",o="account/loginid",n="account/password",s="account/phone-number",l="account/region",a="account/spare-email",c="account/authcode/email",h="account/authcode/sms",d="account/authcode/verification",u="account/device/homedevice",p="account/device/items",g="account/device/revocation",f="idp/profile",m="idp/profile/all",_="idp/token/revoke",b="idp/token/revoke/all",y="idp/profile",v="activity",w="follow",C="heartbeat",k="keep",S="playbackstate",$="search",x="api/status-management",E={accessToken:"z_at",type:"authz_type"},I={accessToken:"n_at"},A="consentToUse",M="nextStatusUpdateTime",T="showRevokedMessage",L={temporary:"area_temporary",permanent:"area_permanent"},z="customAppName",P="efm",B={authZ:{at:"exp_z_at",rt:"exp_z_rt"},authN:{at:"exp_n_at",rt:"exp_n_rt"}},F={accountlessAuthZ:"r-alaz",accountlessAuthZAbroad:"a-alaz",accountlessAuthZEmergency:"d-alaz",accountAuthZ:"acaz"},R={accountlessAuthZ:"r-alaz",accountlessAuthZAbroad:"a-alaz",accountlessAuthZEmergency:"d-alaz",accountAuthN:"acan",accountAuthZ:"acaz"},N={PUT:{"/api/v1/account/email":{400:{invalid_request:["400 不正なリクエストパラメータ / invalid_request:Json不正、必須項目不足、入力規則違反","メールアドレスを正しく入力してください。"],duplicate_email_address:["400 不正なリクエストパラメータ / duplicate_email_address:メールアドレスの重複","入力されたメールアドレスは他のアカウントで既に使われています。"]},401:["401 不正、または有効期限が切れたアクセストークン","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"],404:["404 アカウントIDの不正。（account not found)","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"],500:["500 未知のシステムエラー","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"]},"/api/v1/account/spare-email":{400:{invalid_request:["400 不正なリクエストパラメータ / invalid_request:Json不正、必須項目不足、入力規則違反","復旧用メールアドレスを正しく入力してください。"],duplicate_email_address:["400 不正なリクエストパラメータ / duplicate_email_address:メールアドレスの重複","入力された復旧用メールアドレスは他のアカウントで既に使われています。"]},401:["401 不正、または有効期限が切れたアクセストークン","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"],404:["404 アカウントIDの不正。（account not found)","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"],500:["500 未知のシステムエラー","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"]},"/api/v1/account/password":{400:["400 不正なリクエストパラメータ","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"],401:["401 不正、または有効期限が切れたアクセストークン","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"],404:["404 アカウントIDの不正。（account not found）","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"],500:["500 未知のシステムエラー","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"]},"/api/v1/account/loginid":{400:{invalid_request:["400 不正なリクエストパラメータ / invalid_request:バリデーションエラー","ログインIDを正しく入力してください。"],duplicate_login_id:["400 不正なリクエストパラメータ / duplicate_login_id:ログインIDの重複","入力されたログインIDは他のアカウントで既に使われています。"]},401:["401 不正、または有効期限が切れたアクセストークン","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"],404:["404 アカウントIDの不正。（account not found）","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"],500:["500 未知のシステムエラー","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"]},"/api/v1/account/phone-number":{400:{invalid_request:["400 不正なリクエストパラメータ","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"],duplicate_phone_number:["400 不正なリクエストパラメータ / duplicate_phone_number:電話番号の重複","入力された電話番号は他のアカウントで既に使われています。"]},401:["401 不正、または有効期限が切れたアクセストークン","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"],404:["404 アカウントIDの不正。（account not found）","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"],500:["500 未知のシステムエラー","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"]}},POST:{"/api/v1/account/email":{400:["400 不正なリクエストパラメータ","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"],401:["401 不正、または有効期限が切れたアクセストークン","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"],404:["404 アカウントIDの不正。（account not found）","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"],429:{too_many_attempts:["429 認証コードの送信制限 / too_many_attempts:一定期間の認証コード送信ロック中","一時的な制限により認証コードの送信ができません。時間を置いて再度お試しください。"],request_too_soon:["429 認証コードの送信制限 / request_too_soon:送信頻度が早すぎる","一時的な制限により認証コードの送信ができません。時間を置いて再度お試しください。"]},500:["500 未知のシステムエラー","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"]},"/api/v1/account/authcode/email":{400:["400 不正なリクエストパラメータ","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"],401:["401 不正、または有効期限が切れたアクセストークン","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"],429:{too_many_attempts:["429 認証コードの送信制限 / too_many_attempts:一定期間の認証コード送信ロック中","一時的な制限により認証コードの送信ができません。時間を置いて再度お試しください。"],request_too_soon:["429 認証コードの送信制限 / request_too_soon:送信頻度が早すぎる","一時的な制限により認証コードの送信ができません。時間を置いて再度お試しください。"]},500:["500 未知のシステムエラー","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"]},"/api/v1/account/authcode/sms":{400:["400 不正なリクエストパラメータ","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"],401:["401 不正、または有効期限が切れたアクセストークン","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"],404:["404 電話番号の不正。（tel not found）","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"],429:{too_many_attempts:["429 認証コードの送信制限 / too_many_attempts:一定期間の認証コード送信ロック中","一時的な制限により認証コードの送信ができません。時間を置いて再度お試しください。"],request_too_soon:["429 認証コードの送信制限 / request_too_soon:送信頻度が早すぎる","一時的な制限により認証コードの送信ができません。時間を置いて再度お試しください。"]},500:["500 未知のシステムエラー","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"]},"/api/v1/account/authcode/verification":{400:["400 不正なリクエストパラメータ","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"],401:["401 認証コードの有効期限切れ。または、不正なトークン","認証コードの有効期限が切れました。認証コードを再送して新しい認証コードを入力してください。"],404:["404 アカウントIDの不正。（account not found）","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"],500:["500 未知のシステムエラー","エラーが発生しました。時間を置いて再試行、またはログインし直してください。"]}}};var Z=Object.defineProperty,O=(t,e,r)=>((t,e,r)=>e in t?Z(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r)(t,"symbol"!=typeof e?e+"":e,r);const D=(t,e,r,i)=>{var o;const n=(t=>{try{return new URL(t).pathname.replace(/\/+$/,"")}catch{return null}})(e);if(!n)return null;const s=null==(o=N[t])?void 0:o[n];if(!s)return null;const l=s[r];if(!l)return null;if(Array.isArray(l))return{code:l[0],message:l[1]};{if(!i)return null;if("string"!=typeof i.error)return null;const t=l[i.error];return t?{code:t[0],message:t[1]}:null}};class H extends Error{constructor(t,e,r=null,i,o){super(t),O(this,"statusCode"),O(this,"rawError",null),O(this,"localization",null),this.name="AuthError",this.statusCode=e,this.rawError=r,this.localization=D(i,o,e,r)}}var j,U,q=Object.defineProperty,W=t=>{throw TypeError(t)},V=(t,e,r)=>((t,e,r)=>e in t?q(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r)(t,e+"",r),J=(t,e,r)=>(((t,e,r)=>{e.has(t)||W("Cannot "+r)})(t,e,"access private method"),r);class X{constructor(t,e,r){var i,o,n;i=this,(o=j).has(i)?W("Cannot add the same private member more than once"):o instanceof WeakSet?o.add(i):o.set(i,n),V(this,"getTokenBFFEndpoint",t=>`${window.location.origin}/tix/${t}`),this.cookie=t,this.config=e,this.logger=r}getCookie(t){const e=this.cookie.get(t);return e?decodeURIComponent(e):null}getAuthZType(){return this.getCookie(E.type)}getTokens(){const t=this.getCookie(E.accessToken)??"",e=this.getCookie(E.type)??"";return{accountAuthN:{accessToken:this.getCookie(I.accessToken)??""},accountlessAuthZ:{accessToken:[F.accountlessAuthZ,F.accountlessAuthZAbroad,F.accountlessAuthZEmergency].includes(e)?t:""},accountAuthZ:{accessToken:e===F.accountAuthZ?t:""}}}getConsentToUse(){return this.getCookie(A)}getConsentToUseData(){const t=this.getConsentToUse();if(!t)return null;const e=(t=>{try{return JSON.parse(t)}catch{return null}})(t);return"object"==typeof(r=e)&&r&&"status"in r&&"entity"in r&&"area"in r&&"string"==typeof r.status&&"string"==typeof r.entity&&["household","business","school","none"].includes(r.entity)&&"object"==typeof r.area&&r.area&&"areaId"in r.area&&"jisx0402"in r.area&&"postal"in r.area&&"pref"in r.area&&"string"==typeof r.area.areaId&&"string"==typeof r.area.jisx0402&&"string"==typeof r.area.postal&&"string"==typeof r.area.pref?e:null;var r}deleteConsentToUse(){return this.cookie.delete(A)}getAuthType(){const t=this.getTokens();return t.accountAuthZ.accessToken?"accountAuthZ":t.accountAuthN.accessToken?"accountAuthN":t.accountlessAuthZ.accessToken?"accountlessAuthZ":null}async refreshToken(t){const e=this.getTokenBFFEndpoint("token/refresh");try{const r=await fetch(e,{method:"POST",credentials:"include",headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},body:new URLSearchParams({idp:R[t]})});if(!r.ok){const t=await r.text(),i=await(()=>{try{return JSON.parse(t)}catch{return null}})();throw new H(` ${t}`,r.status,i,"POST",e)}}catch(r){if(r instanceof H)throw r;throw new H("Failed to refresh token",500,null,"POST",e)}}getNextAction(){const t=this.getTokens(),e=this.getConsentToUseData();return t.accountlessAuthZ.accessToken||t.accountAuthN.accessToken||t.accountAuthZ.accessToken?t.accountAuthN.accessToken&&!t.accountAuthZ.accessToken?"profileSelect":"asRequest":e?"refetchAccountlessAuthZToken":"confirmView"}getTokenData(){const t=this.getTokens();return{accountAuthN:J(this,j,U).call(this,t.accountAuthN.accessToken),accountAuthZ:J(this,j,U).call(this,t.accountAuthZ.accessToken),accountlessAuthZ:J(this,j,U).call(this,t.accountlessAuthZ.accessToken)}}deleteAuthZCookie(){this.cookie.delete(E.type),this.cookie.delete(E.accessToken),this.cookie.delete(B.authZ.at),this.cookie.delete(B.authZ.rt)}}j=new WeakSet,U=function(t){try{const[,e]=t.split(".");if(!e)return null;const r=atob(e.replace(/-/g,"+").replace(/_/g,"/"));return JSON.parse(r)}catch(e){return null}};const G=async t=>{const e=await fetch(t);if(!e.ok)throw new Error(`Failed to fetch ${t}: ${e.status} ${e.statusText}`);return await e.json()},K=async()=>G("/assets/conf/dms/v1/default.json");var Y,Q,tt,et,rt,it,ot,nt,st=t=>{throw TypeError(t)},lt=(t,e,r)=>e.has(t)||st("Cannot "+r),at=(t,e,r)=>(lt(t,e,"read from private field"),r?r.call(t):e.get(t)),ct=(t,e,r)=>e.has(t)?st("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r),ht=(t,e,r)=>(lt(t,e,"access private method"),r);class dt extends X{constructor(){super(...arguments),ct(this,Y),ct(this,et,async(t,e)=>{if(!this.canRefreshToken("accountAuthN"))return void this.loginAccount();try{await this.refreshToken("accountAuthN")}catch{return void this.loginAccount()}let r=!0;try{const t=await K();r=await ht(this,Y,Q).call(this,t)}catch{}if(!r)return this.deleteAuthZCookie(),void window.location.reload();if(this.canRefreshToken("accountAuthZ"))try{return await this.refreshToken("accountAuthZ"),void(e||window.location.reload())}catch{}if(t.accountAuthZ){if("string"!=typeof t.accountAuthZ.profileId)return this.deleteAuthZCookie(),void window.location.reload();try{await this.selectAccountProfile({profileId:t.accountAuthZ.profileId,disableReload:e})}catch{this.deleteAuthZCookie(),window.location.reload()}}else window.location.reload()}),ct(this,rt,async(t,e)=>{var r;let i=!0,o=null;try{o=await K(),i=await ht(this,Y,Q).call(this,o)}catch{}const n=async()=>{const t=this.getConsentToUseData();t?i?this.loginAccountless({area:t.area.areaId,entity:t.entity,jisx0402:t.area.jisx0402,postal:t.area.postal,pref:t.area.pref}):this.loginAccountlessAbroad():(this.deleteConsentToUse(),this.deleteAuthZCookie(),window.location.reload())};if(!this.canRefreshToken("accountlessAuthZ"))return void(await n());const s=null==(r=t.accountlessAuthZ)?void 0:r.profileType;if("string"==typeof s&&s)if(i&&"abroad"===s||!i&&"abroad"!==s)await n();else{if("emergency"===s){let t=!1;o&&(t=await ht(this,Y,tt).call(this,o)),t||await this.signout()}try{await this.refreshToken("accountlessAuthZ"),e||window.location.reload()}catch{await n()}}else await n()})}createHeaders(t){if(!t)return{"Content-Type":"application/json"};return{Authorization:`Bearer ${this.getTokens()[t].accessToken}`,"Content-Type":"application/json"}}async fetch(t,e,r,i=!1){var o,n;const s=e.method||"GET";if(r){if(!this.getTokens()[r].accessToken)throw new H("No access token",401,null,s,t)}try{const n=await fetch(t,e);if(401===n.status&&r&&!i){try{await this.refreshToken(r)}catch(l){if(null==(o=this.logger)||o.error(l),"undefined"==typeof window)throw new H("Failed to refresh token",401,null,s,t);return this.handleRefreshToken(),new Promise(()=>{})}const i={...e,headers:this.createHeaders(r)};return await this.fetch(t,i,r,!0)}const a=await n.text();if(n.ok)return a?JSON.parse(a):void 0;{let e;try{e=JSON.parse(a)}catch(l){e=null}throw new H("Failed to fetch data",n.status,e,s,t)}}catch(l){if(null==(n=this.logger)||n.error(l),l instanceof H)throw l;throw new H("Failed to fetch data",500,null,s,t)}}getTokenBFFError(){const t=new URLSearchParams(window.location.search),e=t.get("error"),r=t.get("error_description"),i=t.get("idp_type");return e&&r&&i?{error:e,errorDescription:r,idpType:i}:null}async handleRefreshToken(t){if(this.getTokenBFFError())return{isSuccessful:!1,failureReason:"tokenBFFError"};if("undefined"!=typeof window&&(null!==navigator.userAgent.match(/\bNHK[\w ]+\/\d/)||"true"===new URLSearchParams(window.location.search).get("app")||window.isAppWebView))return{isSuccessful:!1,failureReason:"notAvailableInAppWebView"};const e=this.getTokenData();return e.accountAuthN&&await at(this,et).call(this,e,t),e.accountAuthN||await at(this,rt).call(this,e,t),{isSuccessful:!0}}getTokenExp(){return{authN:{at:Number(this.getCookie(B.authN.at)??"NaN"),rt:Number(this.getCookie(B.authN.rt)??"NaN")},authZ:{at:Number(this.getCookie(B.authZ.at)??"NaN"),rt:Number(this.getCookie(B.authZ.rt)??"NaN")}}}isAccessTokenValid(t){const e=this.getTokenExp()[t].at;if(isNaN(e))return!1;return!(e-Math.floor(Date.now()/1e3)<=0)}canRefreshToken(t){const e=this.getTokenExp()["accountAuthN"===t?"authN":"authZ"].rt;if(isNaN(e))return!1;return!(e-Math.floor(Date.now()/1e3)<=0)}checkTokenExp(t){const e=this.getTokenExp(),r=this.getAuthZType(),i=Math.floor(Date.now()/1e3);if(isNaN(e.authN.at)||e.authN.at-i<18e3&&this.canRefreshToken("accountAuthN")&&this.refreshToken("accountAuthN").catch(()=>{}),!isNaN(e.authZ.at)){const o=r===F.accountAuthZ?"accountAuthZ":"accountlessAuthZ";e.authZ.at-i<18e3&&this.canRefreshToken(o)&&(r===F.accountlessAuthZ&&t&&this.refreshToken("accountlessAuthZ").catch(()=>{}),r===F.accountAuthZ&&t&&this.refreshToken("accountAuthZ").catch(()=>{}),r===F.accountlessAuthZEmergency&&t&&this.refreshToken("accountlessAuthZEmergency").catch(()=>{}),r!==F.accountlessAuthZAbroad||t||this.refreshToken("accountlessAuthZAbroad").catch(()=>{}))}}register(t){const e=new URL(this.getTokenBFFEndpoint("build_authorize"));e.searchParams.set("idp",R.accountAuthN),e.searchParams.set("redirect_uri",(null==t?void 0:t.redirectUri)??window.location.href),e.searchParams.set("prompt","create"),(null==t?void 0:t.queryParams)&&Object.entries(t.queryParams).forEach(([t,r])=>{e.searchParams.set(t,r)}),this.deleteAreaTemporary(),window.location.href=e.toString()}loginAccount(t){const e=new URL(this.getTokenBFFEndpoint("build_authorize"));e.searchParams.set("idp",R.accountAuthN),e.searchParams.set("redirect_uri",(null==t?void 0:t.redirectUri)??window.location.href),e.searchParams.set("prompt","login"),(null==t?void 0:t.queryParams)&&Object.entries(t.queryParams).forEach(([t,r])=>{e.searchParams.set(t,r)}),this.deleteAreaTemporary(),window.location.href=e.toString()}loginAccountless(t){let e="unknown";if(!this.getNextStatusUpdateTime()){e="anonymous";const r=JSON.stringify({status:"optedin",entity:t.entity,area:{areaId:t.area,jisx0402:t.jisx0402,postal:t.postal,pref:t.pref}});this.cookie.set(A,r)}this.deleteAreaTemporary();const r=new URL(this.getTokenBFFEndpoint("build_authorize"));r.searchParams.set("idp",R.accountlessAuthZ),r.searchParams.set("profileType",e),r.searchParams.set("redirect_uri",t.redirectUri??window.location.href),t.queryParams&&Object.entries(t.queryParams).forEach(([t,e])=>{r.searchParams.set(t,e)}),window.location.href=r.toString()}loginAccountlessAbroad(){const t=new URL(this.getTokenBFFEndpoint("build_authorize"));t.searchParams.set("idp",R.accountlessAuthZAbroad),t.searchParams.set("profileType","abroad"),t.searchParams.set("redirect_uri",window.location.href),t.searchParams.set("entity","none"),t.searchParams.set("area","130"),t.searchParams.set("pref","13"),t.searchParams.set("jisx0402","13101"),t.searchParams.set("postal","1000001"),window.location.href=t.toString()}loginAccountlessEmergency(){const t=new URL(this.getTokenBFFEndpoint("build_authorize"));t.searchParams.set("idp",R.accountlessAuthZEmergency),t.searchParams.set("profileType","emergency"),t.searchParams.set("redirect_uri",window.location.href),t.searchParams.set("entity","none"),t.searchParams.set("area","130"),t.searchParams.set("pref","13"),t.searchParams.set("jisx0402","13101"),t.searchParams.set("postal","1000001"),window.location.href=t.toString()}refetchAccountless(){const t=this.getConsentToUseData();if(!t)return this.cookie.delete(A),void location.reload();this.loginAccountless({entity:t.entity,area:t.area.areaId,jisx0402:t.area.jisx0402,postal:t.area.postal,pref:t.area.pref})}async selectAccountProfile(t){const{profileId:e,disableReload:r,redirectUri:i}=t,o=this.getTokens();if(await fetch(this.getTokenBFFEndpoint("token"),{method:"POST",credentials:"include",headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},body:new URLSearchParams({idp:R.accountAuthZ,grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer",assertion:o.accountAuthN.accessToken,profileId:e})}),i)try{if(new URL(i).href!==window.location.href)return void(window.location.href=i)}catch{}r||window.location.reload()}async signout(t){const{redirectUri:e}=t??{};try{await fetch(`${this.getTokenBFFEndpoint("signout")}`,{credentials:"include"})}catch{this.cookie.delete(I.accessToken),this.cookie.delete(E.accessToken),this.cookie.delete(E.type),this.cookie.delete(B.authN.at),this.cookie.delete(B.authN.rt),this.cookie.delete(B.authZ.at),this.cookie.delete(B.authZ.rt)}this.deleteAreaTemporary();const r=this.getConsentToUseData();if(r)return this.loginAccountless({area:r.area.areaId,jisx0402:r.area.jisx0402,postal:r.area.postal,pref:r.area.pref,entity:r.entity,redirectUri:e}),new Promise(()=>{});if(e)try{if(new URL(e).href!==window.location.href)return window.location.href=e,new Promise(()=>{})}catch{}return window.location.reload(),new Promise(()=>{})}async cancelAccountless(t,e){this.deleteAreaTemporary(),await ht(this,Y,nt).call(this,e)}async deleteAccount(){return this.fetch(ht(this,Y,it).call(this,"accountAuthN",r),{method:"DELETE",headers:this.createHeaders("accountAuthN"),body:"{}"},"accountAuthN")}async getAccount(){try{return await this.fetch(ht(this,Y,it).call(this,"accountAuthN",r),{method:"GET",headers:this.createHeaders("accountAuthN")},"accountAuthN")}catch(t){throw t instanceof H&&404===t.statusCode&&await this.signout(),t}}async updateAccount(t){return this.fetch(ht(this,Y,it).call(this,"accountAuthN",r),{method:"PUT",headers:this.createHeaders("accountAuthN"),body:JSON.stringify(t)},"accountAuthN")}async updateAccountTerms(t){return this.updateAccount({consentToTermsOfService:t})}async updateAccountPolicy(t){return this.updateAccount({consentToPrivacyPolicy:t})}async updateAccountEmail(t){return this.fetch(ht(this,Y,it).call(this,"accountAuthN",i),{method:"PUT",headers:this.createHeaders("accountAuthN"),body:JSON.stringify(t)},"accountAuthN")}async updateAccountLoginId(t){return this.fetch(ht(this,Y,it).call(this,"accountAuthN",o),{method:"PUT",headers:this.createHeaders("accountAuthN"),body:JSON.stringify(t)},"accountAuthN")}async updateAccountPassword(t){return this.fetch(ht(this,Y,it).call(this,"accountAuthN",n),{method:"PUT",headers:this.createHeaders("accountAuthN"),body:JSON.stringify(t)},"accountAuthN")}async updateAccountPhoneNumber(t){return this.fetch(ht(this,Y,it).call(this,"accountAuthN",s),{method:"PUT",headers:this.createHeaders("accountAuthN"),body:JSON.stringify(t)},"accountAuthN")}async updateAccountRegion(t){return this.fetch(ht(this,Y,it).call(this,"accountAuthN",l),{method:"PUT",headers:this.createHeaders("accountAuthN"),body:JSON.stringify(t)},"accountAuthN")}async updateAccountSpareEmail(t){return this.fetch(ht(this,Y,it).call(this,"accountAuthN",a),{method:"PUT",headers:this.createHeaders("accountAuthN"),body:JSON.stringify(t)},"accountAuthN")}async sendAuthCodeEmail(t){return this.fetch(ht(this,Y,it).call(this,"accountAuthN",c),{method:"POST",headers:this.createHeaders("accountAuthN"),body:JSON.stringify(t)},"accountAuthN")}async sendAuthCodeSMS(t){return this.fetch(ht(this,Y,it).call(this,"accountAuthN",h),{method:"POST",headers:this.createHeaders("accountAuthN"),body:JSON.stringify(t)},"accountAuthN")}async verifyAuthCode(t){return this.fetch(ht(this,Y,it).call(this,"accountAuthN",d),{method:"POST",headers:this.createHeaders("accountAuthN"),body:JSON.stringify(t)},"accountAuthN")}async updateAccountDeviceHomedevice(t){return this.fetch(ht(this,Y,it).call(this,"accountAuthN",u),{method:"PUT",headers:this.createHeaders("accountAuthN"),body:JSON.stringify(t)},"accountAuthN")}async getAccountDeviceList(){return this.fetch(ht(this,Y,it).call(this,"accountAuthN",p),{method:"GET",headers:this.createHeaders("accountAuthN")},"accountAuthN")}async revokeAccountDeviceToken(t){const{clientId:e,clientSecret:r,...i}=t,o=this.createHeaders("accountAuthN");return e&&r&&(o.Authorization=`Basic ${btoa(`${e}:${r}`)}, ${o.Authorization}`),this.fetch(ht(this,Y,it).call(this,"accountAuthN",g),{method:"POST",headers:o,body:JSON.stringify(i)},"accountAuthN")}async sendAccountEmail(t){const e=ht(this,Y,it).call(this,"accountAuthN",i),r={method:"POST",headers:this.createHeaders("accountAuthN"),body:JSON.stringify(t)};let o=0,n=null;for(let i=1;i<=5;i++){try{return await this.fetch(e,r,"accountAuthN")}catch(s){s instanceof H&&(o=s.statusCode,n=s.rawError)}if(i<5){const t=1e3*i;await new Promise(e=>setTimeout(e,t))}}throw new H("メール送信が5回連続で失敗しました",o,n,"POST",e)}async createAccountProfile(t){return this.fetch(ht(this,Y,it).call(this,"accountAuthZ",f),{method:"POST",headers:this.createHeaders("accountAuthN"),body:JSON.stringify(t)},"accountAuthN")}async getAccountProfileList(){return this.fetch(ht(this,Y,it).call(this,"accountAuthZ",m),{method:"GET",headers:this.createHeaders("accountAuthN")},"accountAuthN")}async deleteAllAccountProfiles(){return this.fetch(ht(this,Y,it).call(this,"accountAuthZ",m),{method:"DELETE",headers:this.createHeaders("accountAuthN"),body:"{}"},"accountAuthN")}async getAccountProfileById(t){const{profileId:e,pin:r}=t;return this.fetch(ht(this,Y,it).call(this,"accountAuthZ",`${f}/${e}`),{method:"GET",headers:{...this.createHeaders("accountAuthN"),...r&&{pin:r}}},"accountAuthN")}async getAccountProfile(){var t;const e=this.getTokenData().accountAuthZ;if(!e||!("profileId"in e)||"string"!=typeof e.profileId)return null;try{return await this.getAccountProfileById({profileId:e.profileId})}catch(r){if(r instanceof H&&400===r.statusCode&&"invalid_grant"===(null==(t=r.rawError)?void 0:t.error))return this.deleteAuthZCookie(),window.location.reload(),new Promise(()=>{});throw r}}async updateAccountProfile(t){const{profileId:e,profile:r,pin:i}=t;return this.fetch(ht(this,Y,it).call(this,"accountAuthZ",`${f}/${e}`),{method:"PUT",headers:{...this.createHeaders("accountAuthN"),...i&&{pin:i}},body:JSON.stringify(r)},"accountAuthN")}async deleteAccountProfile(t){const{profileId:e,pin:r}=t;return this.fetch(ht(this,Y,it).call(this,"accountAuthZ",`${f}/${e}`),{method:"DELETE",headers:{...this.createHeaders("accountAuthN"),...r&&{pin:r}},body:"{}"},"accountAuthN")}async updateAccountProfilePin(t){const{profileId:e,...r}=t;return this.fetch(ht(this,Y,it).call(this,"accountAuthZ",`${f}/${e}/pin`),{method:"PUT",headers:this.createHeaders("accountAuthN"),body:JSON.stringify(r)},"accountAuthN")}async revoke(t){return this.fetch(ht(this,Y,it).call(this,"accountAuthZ",_),{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},body:new URLSearchParams({token:t.token,token_type_hint:"refresh_token"})},"accountAuthZ")}async revokeAll(){return this.fetch(ht(this,Y,it).call(this,"accountAuthZ",b),{method:"POST",headers:this.createHeaders("accountAuthN")},"accountAuthN")}async getAccountlessProfile(){var t;try{return await this.fetch(ht(this,Y,it).call(this,"accountlessAuthZ",y),{method:"GET",headers:this.createHeaders("accountlessAuthZ")},"accountlessAuthZ")}catch(e){if(e instanceof H&&400===e.statusCode&&"invalid_grant"===(null==(t=e.rawError)?void 0:t.error))return this.deleteAuthZCookie(),window.location.reload(),new Promise(()=>{});throw e}}async updateAccountlessProfile(t){return this.fetch(ht(this,Y,it).call(this,"accountlessAuthZ",y),{method:"PUT",headers:this.createHeaders("accountlessAuthZ"),body:JSON.stringify(t)},"accountlessAuthZ")}getEfm(){return this.getCookie(P)}async setEfm(t){this.cookie.set(P,t),await this.setCookiePlain(P)}deleteEfm(){this.cookie.delete(P)}getNextStatusUpdateTime(){return this.getCookie(M)}async setNextStatusUpdateTime(t){this.cookie.set(M,t),await this.setCookiePlain(M)}deleteNextStatusUpdateTime(){this.cookie.delete(M)}getShowRevokedMessage(){return this.getCookie(T)}setShowRevokedMessage(t){this.cookie.set(T,t)}deleteShowRevokedMessage(){this.cookie.delete(T)}async setCookiePlain(t){await fetch(ht(this,Y,ot).call(this,"plain")+"?key="+t,{method:"PUT",credentials:"include",headers:{"Content-Type":"application/json","Content-Length":"0"}})}getAreaTemporary(){return this.getCookie(L.temporary)}setAreaTemporary(t){this.cookie.set(L.temporary,t,!0)}deleteAreaTemporary(){this.cookie.delete(L.temporary)}getAreaPermanent(){return this.getCookie(L.permanent)}setAreaPermanent(t){this.cookie.set(L.permanent,t)}deleteAreaPermanent(){this.cookie.delete(L.permanent)}getCustomAppName(){return this.getCookie(z)}}Y=new WeakSet,Q=async function(t){try{return"Japan"===(await G(t.endpoint.location)).country_name}catch{return!0}},tt=async function(t){try{const e=t.endpoint.opsManagementIndex,r=(await G(e)).items.find(t=>"emergencyMode"===t.id);if(!r)return!1;const i=new URL(e);i.pathname=r.path;const o=i.toString();return(await G(o)).isEmergencyMode}catch{return!1}},et=new WeakMap,rt=new WeakMap,it=function(t,e){let r=this.config[t].authServerUrl;return r.endsWith("/")||(r+="/"),`${r}${e}`},ot=function(t){let e=this.config.setCookieServerUrl;return e.endsWith("/")||(e+="/"),`${e}${t}`},nt=async function(t){const e=t.endsWith("/")?t:`${t}/`,r=new URL(`${e}erpc/unset`),i=await fetch(r.toString(),{method:"GET",credentials:"include",headers:{"Content-Type":"application/json"}});if(200!==i.status){const t=await i.text();throw new Error(`Failed to fetch data: ${t}`)}};var ut,pt,gt=t=>{throw TypeError(t)},ft=(t,e,r)=>(((t,e,r)=>{e.has(t)||gt("Cannot "+r)})(t,e,"access private method"),r);class mt extends dt{constructor(t,e,r,i){var o,n,s;super(t,e,i),o=this,(n=ut).has(o)?gt("Cannot add the same private member more than once"):n instanceof WeakSet?n.add(o):n.set(o,s),this.cookie=t,this.config=e,this.profileConfig=r,this.logger=i}async deleteAllActivity(){return this.fetch(ft(this,ut,pt).call(this,"accountProfile",v),{method:"DELETE",headers:this.createHeaders("accountAuthZ"),body:"{}"},"accountAuthZ")}async deleteActivityByModeOfItemAndTypeOfItem(t){const{modeOfItem:e,typeOfItem:r}=t,i=new URL(ft(this,ut,pt).call(this,"accountProfile",`${v}/item/${e}/${r}`));return this.fetch(i.toString(),{method:"DELETE",headers:this.createHeaders("accountAuthZ"),body:"{}"},"accountAuthZ")}async deleteActivityById(t){const{modeOfItem:e,typeOfItem:r,itemId:i}=t,o=new URL(ft(this,ut,pt).call(this,"accountProfile",`${v}/item/${e}/${r}/id/${i}`));return this.fetch(o.toString(),{method:"DELETE",headers:this.createHeaders("accountAuthZ"),body:"{}"},"accountAuthZ")}async deleteActivityByIdAndMediaAction(t){const{modeOfItem:e,typeOfItem:r,itemId:i,mediaAction:o}=t,n=new URL(ft(this,ut,pt).call(this,"accountProfile",`${v}/item/${e}/${r}/id/${i}/${o}`));return this.fetch(n.toString(),{method:"DELETE",headers:this.createHeaders("accountAuthZ"),body:"{}"},"accountAuthZ")}async getActivityListByIdAndMediaAction(t){const{mediaAction:e,modeOfItem:r,typeOfItem:i,itemId:o,allActions:n,cursor:s,order:l,size:a}=t,c=new URL(ft(this,ut,pt).call(this,"accountProfile",`${v}/item/${r}/${i}/id/${o}/${e}`));return n&&c.searchParams.append("allActions","true"),Object.entries({cursor:s,order:l,size:a}).forEach(([t,e])=>{e&&c.searchParams.append(t,`${e}`)}),this.fetch(c.toString(),{method:"GET",headers:this.createHeaders("accountAuthZ")},"accountAuthZ")}async getActivity(t){let e;if("itemId"in t){const{itemId:r,modeOfItem:i,typeOfItem:o}=t;e=ft(this,ut,pt).call(this,"accountProfile",`${v}/item/${i}/${o}/id/${r}`)}else{const{mediaAction:r,mediaActionValue:i,modeOfItem:o,typeOfItem:n}=t;e=ft(this,ut,pt).call(this,"accountProfile",`${v}/item/${o}/${n}/${r}/${i}`)}const{allActions:r,cursor:i,order:o,size:n}=t,s=new URL(e);return r&&s.searchParams.append("allActions","true"),Object.entries({cursor:i,order:o,size:n}).forEach(([t,e])=>{e&&s.searchParams.append(t,`${e}`)}),this.fetch(e,{method:"GET",headers:this.createHeaders("accountAuthZ")},"accountAuthZ")}async getActivityByMediaAction(t){const{mediaAction:e,modeOfItem:r,typeOfItem:i,allActions:o,cursor:n,order:s,size:l}=t,a=new URL(ft(this,ut,pt).call(this,"accountProfile",`${v}/item/${r}/${i}/${e}`));return o&&a.searchParams.append("allActions","true"),Object.entries({cursor:n,order:s,size:l}).forEach(([t,e])=>{e&&a.searchParams.append(t,`${e}`)}),this.fetch(a.toString(),{method:"GET",headers:this.createHeaders("accountAuthZ")},"accountAuthZ")}async cleanup(t){const{type:e="async"}=t,r=new URL(ft(this,ut,pt).call(this,"accountProfile","all"));return r.searchParams.append("type",e),this.fetch(r.toString(),{method:"DELETE",headers:this.createHeaders("accountAuthZ"),body:"{}"},"accountAuthZ")}async deleteAllFollow(){const t=ft(this,ut,pt).call(this,"accountProfile",w);return this.fetch(t,{method:"DELETE",headers:this.createHeaders("accountAuthZ"),body:"{}"},"accountAuthZ")}async getFollowList(t){const{size:e,cursor:r,order:i}=t??{},o=new URL(ft(this,ut,pt).call(this,"accountProfile",w));return Object.entries({size:e,cursor:r,order:i}).forEach(([t,e])=>{e&&o.searchParams.append(t,`${e}`)}),this.fetch(o.toString(),{method:"GET",headers:this.createHeaders("accountAuthZ")},"accountAuthZ")}async createFollow(t){return this.fetch(ft(this,ut,pt).call(this,"accountProfile",w),{method:"POST",headers:this.createHeaders("accountAuthZ"),body:JSON.stringify(t)},"accountAuthZ")}async deleteFollowByIds(t){const{playlistUIds:e}=t,r=new URL(ft(this,ut,pt).call(this,"accountProfile",`${w}/bulk`));return e.length>0&&r.searchParams.append("id",e.join(",")),this.fetch(r.toString(),{method:"DELETE",headers:this.createHeaders("accountAuthZ"),body:"{}"},"accountAuthZ")}async getFollowByIds(t){const{playlistUIds:e}=t,r=new URL(ft(this,ut,pt).call(this,"accountProfile",`${w}/bulk`));return e.length>0&&r.searchParams.append("id",e.join(",")),this.fetch(r.toString(),{method:"GET",headers:this.createHeaders("accountAuthZ")},"accountAuthZ")}async deleteFollowById(t){const e=new URL(ft(this,ut,pt).call(this,"accountProfile",`${w}/id/${t.playlistUId}`));return this.fetch(e.toString(),{method:"DELETE",headers:this.createHeaders("accountAuthZ"),body:"{}"},"accountAuthZ")}async getFollowById(t){const e=new URL(ft(this,ut,pt).call(this,"accountProfile",`${w}/id/${t.playlistUId}`));return this.fetch(e.toString(),{method:"GET",headers:this.createHeaders("accountAuthZ")},"accountAuthZ")}async updateFollowById(t){const e=new URL(ft(this,ut,pt).call(this,"accountProfile",`${w}/id/${t.playlistUId}`));return this.fetch(e.toString(),{method:"PUT",headers:this.createHeaders("accountAuthZ"),body:JSON.stringify({smartDownload:t.smartDownload})},"accountAuthZ")}async deleteFollowByModeOfItem(t){const e=new URL(ft(this,ut,pt).call(this,"accountProfile",`${w}/${t.modeOfItem}`));return this.fetch(e.toString(),{method:"DELETE",headers:this.createHeaders("accountAuthZ"),body:"{}"},"accountAuthZ")}async getFollowByModeOfItem(t){const e=new URL(ft(this,ut,pt).call(this,"accountProfile",`${w}/${t.modeOfItem}`));return Object.entries({size:t.size,cursor:t.cursor,order:t.order}).forEach(([t,r])=>{r&&e.searchParams.append(t,`${r}`)}),this.fetch(e.toString(),{method:"GET",headers:this.createHeaders("accountAuthZ")},"accountAuthZ")}async deleteFollowByModeOfItemAndTypeOfList(t){const e=new URL(ft(this,ut,pt).call(this,"accountProfile",`${w}/${t.modeOfItem}/${t.typeOfList}`));return this.fetch(e.toString(),{method:"DELETE",headers:this.createHeaders("accountAuthZ"),body:"{}"},"accountAuthZ")}async getFollowByModeOfItemAndTypeOfList(t){const e=new URL(ft(this,ut,pt).call(this,"accountProfile",`${w}/${t.modeOfItem}/${t.typeOfList}`));return Object.entries({size:t.size,cursor:t.cursor,order:t.order}).forEach(([t,r])=>{r&&e.searchParams.append(t,`${r}`)}),this.fetch(e.toString(),{method:"GET",headers:this.createHeaders("accountAuthZ")},"accountAuthZ")}async createHeartbeat(t){const e=this.getAuthType();if(!e||"accountAuthN"===e)return;const r="accountAuthZ"===e?"accountProfile":"accountlessProfile",i=ft(this,ut,pt).call(this,r,C);return this.fetch(i,{method:"POST",headers:this.createHeaders(e),body:JSON.stringify(t)},e)}async deleteAllKeep(){return this.fetch(ft(this,ut,pt).call(this,"accountProfile",k),{method:"DELETE",headers:this.createHeaders("accountAuthZ"),body:"{}"},"accountAuthZ")}async getKeepList(t){const{cursor:e,order:r,size:i}=t||{},o=new URL(ft(this,ut,pt).call(this,"accountProfile",k));return Object.entries({size:i,order:r,cursor:e}).forEach(([t,e])=>{e&&o.searchParams.append(t,`${e}`)}),this.fetch(o.toString(),{method:"GET",headers:this.createHeaders("accountAuthZ")},"accountAuthZ")}async createKeep(t){return this.fetch(ft(this,ut,pt).call(this,"accountProfile",k),{method:"POST",headers:this.createHeaders("accountAuthZ"),body:JSON.stringify(t)},"accountAuthZ")}async deleteKeepByIds(t){const{itemIds:e}=t,r=new URL(ft(this,ut,pt).call(this,"accountProfile",`${k}/bulk`));return e.length>0&&r.searchParams.append("id",e.join(",")),this.fetch(r.toString(),{method:"DELETE",headers:this.createHeaders("accountAuthZ"),body:"{}"},"accountAuthZ")}async getKeepByIds(t){const{itemIds:e}=t,r=new URL(ft(this,ut,pt).call(this,"accountProfile",`${k}/bulk`));return e.length>0&&r.searchParams.append("id",e.join(",")),this.fetch(r.toString(),{method:"GET",headers:this.createHeaders("accountAuthZ")},"accountAuthZ")}async deleteKeepById(t){const{itemId:e}=t;return this.fetch(ft(this,ut,pt).call(this,"accountProfile",`${k}/id/${e}`),{method:"DELETE",headers:this.createHeaders("accountAuthZ"),body:"{}"},"accountAuthZ")}async getKeepById(t){const{itemId:e}=t;return this.fetch(ft(this,ut,pt).call(this,"accountProfile",`${k}/id/${e}`),{method:"GET",headers:this.createHeaders("accountAuthZ")},"accountAuthZ")}async deleteKeepByModeOfItem(t){const{modeOfItem:e}=t,r=new URL(ft(this,ut,pt).call(this,"accountProfile",`${k}/${e}`));return this.fetch(r.toString(),{method:"DELETE",headers:this.createHeaders("accountAuthZ"),body:"{}"},"accountAuthZ")}async getKeepByModeOfItem(t){const{modeOfItem:e,cursor:r,order:i,size:o}=t,n=new URL(ft(this,ut,pt).call(this,"accountProfile",`${k}/${e}`));return Object.entries({size:o,order:i,cursor:r}).forEach(([t,e])=>{e&&n.searchParams.append(t,`${e}`)}),this.fetch(n.toString(),{method:"GET",headers:this.createHeaders("accountAuthZ")},"accountAuthZ")}async deleteKeepByModeOfItemAndTypeOfItem(t){const{modeOfItem:e,typeOfItem:r}=t,i=new URL(ft(this,ut,pt).call(this,"accountProfile",`${k}/${e}/${r}`));return this.fetch(i.toString(),{method:"DELETE",headers:this.createHeaders("accountAuthZ"),body:"{}"},"accountAuthZ")}async getKeepByModeOfItemAndTypeOfItem(t){const{modeOfItem:e,typeOfItem:r,cursor:i,order:o,size:n}=t,s=new URL(ft(this,ut,pt).call(this,"accountProfile",`${k}/${e}/${r}`));return Object.entries({size:n,order:o,cursor:i}).forEach(([t,e])=>{e&&s.searchParams.append(t,`${e}`)}),this.fetch(s.toString(),{method:"GET",headers:this.createHeaders("accountAuthZ")},"accountAuthZ")}async deleteAllPlaybackState(){return this.fetch(ft(this,ut,pt).call(this,"accountProfile",S),{method:"DELETE",headers:this.createHeaders("accountAuthZ"),body:"{}"},"accountAuthZ")}async getPlaybackStateList(t){const{cursor:e,order:r,size:i}=t||{},o=new URL(ft(this,ut,pt).call(this,"accountProfile",S));return Object.entries({size:i,order:r,cursor:e}).forEach(([t,e])=>{e&&o.searchParams.append(t,`${e}`)}),this.fetch(o.toString(),{method:"GET",headers:this.createHeaders("accountAuthZ")},"accountAuthZ")}async createPlaybackState(t){return this.fetch(ft(this,ut,pt).call(this,"accountProfile",S),{method:"POST",headers:this.createHeaders("accountAuthZ"),body:JSON.stringify(t)},"accountAuthZ")}async deletePlaybackStateByIds(t){const{itemIds:e}=t,r=new URL(ft(this,ut,pt).call(this,"accountProfile",`${S}/bulk`));return e.length>0&&r.searchParams.append("id",e.join(",")),this.fetch(r.toString(),{method:"DELETE",headers:this.createHeaders("accountAuthZ"),body:"{}"},"accountAuthZ")}async getPlaybackStateByIds(t){const{itemIds:e}=t,r=new URL(ft(this,ut,pt).call(this,"accountProfile",`${S}/bulk`));return e.length>0&&r.searchParams.append("id",e.join(",")),this.fetch(r.toString(),{method:"GET",headers:this.createHeaders("accountAuthZ")},"accountAuthZ")}async deletePlaybackStateByModeOfItem(t){const{modeOfItem:e}=t,r=new URL(ft(this,ut,pt).call(this,"accountProfile",`${S}/${e}`));return this.fetch(r.toString(),{method:"DELETE",headers:this.createHeaders("accountAuthZ"),body:"{}"},"accountAuthZ")}async getPlaybackStateByModeOfItem(t){const{modeOfItem:e,cursor:r,order:i,size:o}=t,n=new URL(ft(this,ut,pt).call(this,"accountProfile",`${S}/${e}`));return Object.entries({cursor:r,order:i,size:o}).forEach(([t,e])=>{e&&n.searchParams.append(t,`${e}`)}),this.fetch(n.toString(),{method:"GET",headers:this.createHeaders("accountAuthZ")},"accountAuthZ")}async deletePlaybackStateByModeOfItemAndTypeOfItem(t){const{modeOfItem:e,typeOfItem:r}=t,i=new URL(ft(this,ut,pt).call(this,"accountProfile",`${S}/${e}/${r}`));return this.fetch(i.toString(),{method:"DELETE",headers:this.createHeaders("accountAuthZ"),body:"{}"},"accountAuthZ")}async getPlaybackStateByModeOfItemAndTypeOfItem(t){const{modeOfItem:e,typeOfItem:r,cursor:i,order:o,size:n}=t,s=new URL(ft(this,ut,pt).call(this,"accountProfile",`${S}/${e}/${r}`));return Object.entries({cursor:i,order:o,size:n}).forEach(([t,e])=>{e&&s.searchParams.append(t,`${e}`)}),this.fetch(s.toString(),{method:"GET",headers:this.createHeaders("accountAuthZ")},"accountAuthZ")}async getPlaybackStateByModeOfItemAndTypeOfItemAndMediaAction(t){const{modeOfItem:e,typeOfItem:r,mediaAction:i,allActions:o,cursor:n,order:s,size:l}=t,a=new URL(ft(this,ut,pt).call(this,"accountProfile",`${S}/${e}/${r}/${i}`));return o&&a.searchParams.append("allActions","true"),Object.entries({cursor:n,order:s,size:l}).forEach(([t,e])=>{e&&a.searchParams.append(t,`${e}`)}),this.fetch(a.toString(),{method:"GET",headers:this.createHeaders("accountAuthZ")},"accountAuthZ")}async deleteAllSearch(){return this.fetch(ft(this,ut,pt).call(this,"accountProfile",$),{method:"DELETE",headers:this.createHeaders("accountAuthZ"),body:"{}"},"accountAuthZ")}async getSearchList(t){const{cursor:e,order:r,size:i}=t??{},o=new URL(ft(this,ut,pt).call(this,"accountProfile",$));return Object.entries({size:i,order:r,cursor:e}).forEach(([t,e])=>{e&&o.searchParams.append(t,`${e}`)}),this.fetch(o.toString(),{method:"GET",headers:this.createHeaders("accountAuthZ")},"accountAuthZ")}async createSearch(t){return this.fetch(ft(this,ut,pt).call(this,"accountProfile",$),{method:"POST",headers:this.createHeaders("accountAuthZ"),body:JSON.stringify(t)},"accountAuthZ")}async deleteSearchById(t){const{searchId:e}=t;return this.fetch(ft(this,ut,pt).call(this,"accountProfile",`${$}/id/${e}`),{method:"DELETE",headers:this.createHeaders("accountAuthZ"),body:"{}"},"accountAuthZ")}async deleteSearchByKeywordId(t){const{keywordId:e}=t;return this.fetch(ft(this,ut,pt).call(this,"accountProfile",`${$}/kw/${e}`),{method:"DELETE",headers:this.createHeaders("accountAuthZ"),body:"{}"},"accountAuthZ")}async deleteSearchByCategory(t){const{category:e}=t;return this.fetch(ft(this,ut,pt).call(this,"accountProfile",`${$}/${e}`),{method:"DELETE",headers:this.createHeaders("accountAuthZ"),body:"{}"},"accountAuthZ")}async getSearchByCategory(t){const{category:e,cursor:r,order:i,size:o}=t,n=new URL(ft(this,ut,pt).call(this,"accountProfile",`${$}/${e}`));return Object.entries({cursor:r,order:i,size:o}).forEach(([t,e])=>{e&&n.searchParams.append(t,`${e}`)}),this.fetch(n.toString(),{method:"GET",headers:this.createHeaders("accountAuthZ")},"accountAuthZ")}}ut=new WeakSet,pt=function(t,e){let r=this.profileConfig[t].serverUrl;return r.endsWith("/")||(r+="/"),`${r}${e}`};var _t,bt,yt=t=>{throw TypeError(t)},vt=(t,e,r)=>(((t,e,r)=>{e.has(t)||yt("Cannot "+r)})(t,e,"access private method"),r);class wt extends dt{constructor(t,e,r,i){var o,n,s;super(t,e,i),o=this,(n=_t).has(o)?yt("Cannot add the same private member more than once"):n instanceof WeakSet?n.add(o):n.set(o,s),this.cookie=t,this.config=e,this.statusManagementConfig=r,this.logger=i}async createStatusManagement(t){return this.fetch(vt(this,_t,bt).call(this,x),{method:"POST",headers:this.createHeaders("accountAuthN"),body:JSON.stringify(t)},"accountAuthN")}async getStatusManagement(){return this.fetch(vt(this,_t,bt).call(this,x),{method:"GET",headers:this.createHeaders("accountAuthN")},"accountAuthN")}async createStatusManagementReset(){return this.fetch(vt(this,_t,bt).call(this,`${x}/reset`),{method:"POST",headers:this.createHeaders("accountAuthN")},"accountAuthN")}async createStatusManagementReservation(t){return this.fetch(vt(this,_t,bt).call(this,`${x}/reservation`),{method:"POST",headers:this.createHeaders("accountAuthN"),body:JSON.stringify(t)},"accountAuthN")}async createStatusManagementRevoke(){return this.fetch(vt(this,_t,bt).call(this,`${x}/revoke`),{method:"POST",headers:this.createHeaders("accountAuthN")},"accountAuthN")}async createStatusManagementUnlink(){return this.fetch(vt(this,_t,bt).call(this,`${x}/unlink`),{method:"POST",headers:this.createHeaders("accountAuthN")},"accountAuthN")}async createStatusManagementStatus(t){const e=this.getAuthType();if(!e||"accountAuthN"===e)throw new Error("最初からやり直してください");return this.fetch(vt(this,_t,bt).call(this,`${x}/status`),{method:"POST",credentials:"include",headers:this.createHeaders(e),body:JSON.stringify(t)},e)}async getStatusManagementStatus(t){const e=this.getAuthType();if(!e||"accountAuthN"===e)throw new Error("最初からやり直してください");return this.fetch(vt(this,_t,bt).call(this,`${x}/status${(null==t?void 0:t.token)?`?token=${t.token}`:""}`),{method:"GET",credentials:"include",headers:this.createHeaders(e)},e)}async getStatusManagementInitialize(){return this.fetch(vt(this,_t,bt).call(this,`${x}/initialize`),{method:"GET",credentials:"include",headers:this.createHeaders()})}async createStatusManagementVerify(t){return this.fetch(vt(this,_t,bt).call(this,`${x}/verify`),{method:"POST",headers:this.createHeaders(),body:JSON.stringify(t)})}}_t=new WeakSet,bt=function(t){let e=this.statusManagementConfig.serverUrl;return e.endsWith("/")||(e+="/"),`${e}${t}`};const Ct=t=>({get(t){var e;return(null==(e=document.cookie.split("; ").find(e=>e.startsWith(`${t}=`)))?void 0:e.split("=")[1])||null},set(e,r,i){document.cookie=`${e}=${r}; ${i?"":"max-age=2147483647;"} ${t?`domain=${t}; `:""}path=/`},delete(e){document.cookie=`${e}=; max-age=0; ${t?`domain=${t}; `:""}path=/`}}),kt={areaStateChange:"areaStateChange",authStateChange:"authStateChange",consentToUseDataChange:"consentToUseDataChange",defaultConfigChange:"defaultConfigChange",deviceIdChange:"deviceIdChange",emergencyModeChange:"emergencyModeChange",enforcementChange:"enforcementChange",flashNewsChange:"flashNewsChange",isInJapanChange:"isInJapanChange",nhkProviderStateChange:"nhkProviderStateChange",opsManagementChange:"opsManagementChange",profileStateChange:"profileStateChange",searchStateChange:"searchStateChange",themeChange:"themeChange",registrationEnforcementChange:"registrationEnforcementChange",bindEnforcementChange:"bindEnforcementChange",collationEnforcementChange:"collationEnforcementChange",heartbeatConfigChange:"heartbeatConfigChange",modalListChange:"modalListChange"},St="deviceId",$t=/iPhone|iPad|iPod/,xt=/android/i,Et=/Silk/i,It={prd:"https://www.web.nhk/search",pre:"https://pre-www.web.nhk/search",pvw:"https://pvw-www.web.nhk/search",bxprd:"https://www.bx.nhk/search",stg:"https://stg-www.bx.nhk/search",dev:"https://dev-www.bx.nhk/search"},At={prd:"https://www.nhk.jp/search/",pre:"https://pre-www.nhk.jp/search/",pvw:"https://pvw-www.nhk.jp/search/",bxprd:"https://www.nhk.jp/search/",stg:"https://stg-www.nhk.jp/search/",dev:"https://dev-www.nhk.jp/search/"},Mt={dms:It,ms:It,promotion:At,corporate:At},Tt={dms:"query",ms:"query",promotion:"q",corporate:"q"},Lt={id:"130",name:"首都圏局",areaName:"東京",pref:"13",prefName:"東京都",block:"130",blockName:"関東・甲信越",postalCode:"1508001",jisx0401:"13",jisx0402:"13113"},zt=15e3,Pt="nhk-one-header",Bt="nhk-one-header-top-bar",Ft="erpc-half-modal",Rt=[];for(let nd=0;nd<256;++nd)Rt.push((nd+256).toString(16).slice(1));let Nt;const Zt=new Uint8Array(16);const Ot={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};function Dt(t,e,r){var i;const o=(t=t||{}).random??(null==(i=t.rng)?void 0:i.call(t))??function(){if(!Nt){if("undefined"==typeof crypto||!crypto.getRandomValues)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");Nt=crypto.getRandomValues.bind(crypto)}return Nt(Zt)}();if(o.length<16)throw new Error("Random bytes length must be >= 16");return o[6]=15&o[6]|64,o[8]=63&o[8]|128,function(t,e=0){return(Rt[t[e+0]]+Rt[t[e+1]]+Rt[t[e+2]]+Rt[t[e+3]]+"-"+Rt[t[e+4]]+Rt[t[e+5]]+"-"+Rt[t[e+6]]+Rt[t[e+7]]+"-"+Rt[t[e+8]]+Rt[t[e+9]]+"-"+Rt[t[e+10]]+Rt[t[e+11]]+Rt[t[e+12]]+Rt[t[e+13]]+Rt[t[e+14]]+Rt[t[e+15]]).toLowerCase()}(o)}function Ht(t,e,r){return Ot.randomUUID&&!t?Ot.randomUUID():Dt(t)}
// istanbul ignore next @preserve 型定義上必須である
const jt=(t={})=>{var e,r,i,o,n,s,l,a,c,h;const{onChange:d}=t,u=d?()=>{var t,e,r,i,o,n,s,l,a,c;d({defaultConfig:(null==(e=null==(t=window.nhkLib)?void 0:t.defaultConfigProvider)?void 0:e.defaultConfig)??null,defaultConfigError:(null==(i=null==(r=window.nhkLib)?void 0:r.defaultConfigProvider)?void 0:i.defaultConfigError)??null,hamburgerMenu:(null==(n=null==(o=window.nhkLib)?void 0:o.defaultConfigProvider)?void 0:n.hamburgerMenu)??null,serviceMenu:(null==(l=null==(s=window.nhkLib)?void 0:s.defaultConfigProvider)?void 0:l.serviceMenu)??null,constJson:(null==(c=null==(a=window.nhkLib)?void 0:a.defaultConfigProvider)?void 0:c.constJson)??null})}:null;return u&&(window.addEventListener(kt.defaultConfigChange,u),setTimeout(u)),{current:{defaultConfig:(null==(r=null==(e=window.nhkLib)?void 0:e.defaultConfigProvider)?void 0:r.defaultConfig)??null,defaultConfigError:(null==(o=null==(i=window.nhkLib)?void 0:i.defaultConfigProvider)?void 0:o.defaultConfigError)??null,hamburgerMenu:(null==(s=null==(n=window.nhkLib)?void 0:n.defaultConfigProvider)?void 0:s.hamburgerMenu)??null,serviceMenu:(null==(a=null==(l=window.nhkLib)?void 0:l.defaultConfigProvider)?void 0:a.serviceMenu)??null,constJson:(null==(h=null==(c=window.nhkLib)?void 0:c.defaultConfigProvider)?void 0:h.constJson)??null},dispose:()=>{u&&window.removeEventListener(kt.defaultConfigChange,u)}}};function Ut(t){var e=t.match(/^var\((.*)\)$/);return e?e[1]:t}function qt(t,e){var r={},i=t;for(var o in i){var n=i[o];null!=n&&(r[Ut(o)]=n)}return Object.defineProperty(r,"toString",{value:function(){return Object.keys(this).map(t=>"".concat(t,":").concat(this[t])).join(";")},writable:!1}),r}function Wt(t,e,r){t.style.setProperty(Ut(e),r)}function Vt(t,e,r){var i=e;for(var o in i){null!=i[o]&&Wt(t,o,i[o])}}var Jt="var(--fontSize__1b3icje0)",Xt="var(--lightColor__1b3icje1)",Gt="var(--darkColor__1b3icje2)",Kt="icons_container__1b3icje3";class Yt{constructor(){__publicField(this,"props",null)}}function Qt(t){return(e,r)=>(new t).render(e,r)}const te=async(t,e)=>{const r=await fetch(t,e);if(!r.ok)throw new Error(`Failed to fetch ${t}: ${r.status} ${r.statusText}`);return await r.json()},ee=(t,...e)=>{const r=document.createElement("template"),i=new Map;r.innerHTML=String.raw({raw:t},...e.map(t=>(Array.isArray(t)?t:[t]).map(t=>{if(t instanceof Node||t instanceof HTMLCollection||t instanceof NodeList){const e=(()=>{let t;do{t=we()}while(i.has(t));return t})();return i.set(e,t),`<template data-dummy-element="${e}"></template>`}return!1===t||null==t?"":t}).join("")));const o=r.content.firstElementChild instanceof HTMLTemplateElement;if(r.content.querySelectorAll("template:not([data-dummy-element])").forEach(t=>{t.replaceWith(t.content)}),i.forEach((t,e)=>{const i=r.content.querySelector(`[data-dummy-element="${e}"]`);i&&(t instanceof DocumentFragment?i.replaceWith(...t.children):t instanceof HTMLTemplateElement?i.replaceWith(t.content):t instanceof HTMLCollection||t instanceof NodeList?i.replaceWith(...Array.from(t)):i.replaceWith(t))}),o)return[...r.content.childNodes];if(r.content.childNodes.length>1)throw new Error("テンプレートリテラル内に複数のルート要素が存在する場合、<template>タグで囲む必要があります");return r.content.firstElementChild};function re(t){return{current:t}}function ie(t,e){return t.current=e,e}function oe(t,e){for(const[r,i]of Object.entries(t))i&&e.addEventListener(r,i);return e}const ne=t=>"object"==typeof t&&null!==t&&"current"in t,se=t=>ne(t)?t.current:t,le=t=>ne(t)&&"addUpdateListener"in t&&"removeUpdateListener"in t&&"dispose"in t;function ae(t){let e=t;const r=[],i=[];let o,n=e;return[{get current(){return e},get dispose(){return()=>{i.forEach(t=>t()),r.length=0,i.length=0}},get addUpdateListener(){return t=>{r.includes(t)||r.push(t)}},get removeUpdateListener(){return t=>{const e=r.indexOf(t);-1!==e&&r.splice(e,1)}},get addDisposeListener(){return t=>{i.includes(t)||i.push(t)}},get removeDisposeListener(){return t=>{const e=i.indexOf(t);-1!==e&&i.splice(e,1)}}},t=>{const i="function"==typeof t?t(e):t;n=i,clearTimeout(o),o=setTimeout(()=>{e!==n&&(e=n,r.forEach(t=>t()))})}]}function ce(t,e){const r=Array.isArray(t)?t:[t],i=Array.isArray(e)?e.map(t=>null==t?document.createComment("PlaceHolder"):t):[e];return Array.from({length:Math.max(r.length,i.length)},(t,e)=>({current:r[e],next:i[e]})).forEach(({current:t,next:e},r)=>{var o;t&&e?t.replaceWith(e):t&&!e?t.remove():!t&&e&&(null==(o=i[r-1])||o.after(e))}),e}function he(t){const e={};for(const r in t)e[r]=se(t[r].current);return e}function de(t,e,r={}){const i=t=>{const r=e(t);return null==r||Array.isArray(r)&&(0===r.length||r.every(t=>t instanceof Comment||null==t))?document.createComment("PlaceHolder"):r},o=r.ref??re(null);{const e=i(he(t));r.target&&ce(r.target,e),o.current=e}return ue(t,t=>{const e=i(t);ce(o.current,e),o.current=e},{...r,skipInitialEvaluation:!0}),o.current}function ue(t,e,r={skipInitialEvaluation:!1}){const{abortSignal:i,skipInitialEvaluation:o}=r;let n,s=null;const l=()=>{clearTimeout(n),n=setTimeout(()=>{s instanceof Function&&s(),s=e(function(t){const e={};for(const r in t)e[r]=se(t[r].current);return e}(t))})};for(const c in t)le(t[c])&&t[c].addUpdateListener(l);o||l();const a=()=>{s instanceof Function&&s();for(const e in t)le(t[e])&&t[e].removeUpdateListener(l)};return null==i||i.addEventListener("abort",a),{dispose:a}}function pe(t,e,r={skipInitialEvaluation:!1}){const[i,o]=ae(e(he(t),r.abortSignal));return ue(t,t=>{o(()=>e(t,r.abortSignal))},r),i}function ge(t,...e){const r={};return e.forEach(e=>{r[e]=function(t,e){return pe({source:t},()=>e(t.current))}(t,t=>t?t[e]:null)}),r}function fe(t,e){let r;const i=[],o=t({...e,onChange:t=>{n=t,clearTimeout(r),r=setTimeout(()=>{i.forEach(t=>t())})}});let n=o.current;const s={get current(){return n},get dispose(){return()=>{var t;null==(t=o.dispose)||t.call(o),i.length=0}},get addUpdateListener(){return t=>{i.includes(t)||i.push(t)}},get removeUpdateListener(){return t=>{const e=i.indexOf(t);-1!==e&&i.splice(e,1)}},get addDisposeListener(){return t=>{}},get removeDisposeListener(){return t=>{}}};return[s,s.dispose]}const me=t=>ne(t)?t.current:t;function _e(t,e){return new Promise((r,i)=>{var o;const n=new MutationObserver(()=>{var e;(null==(e=me(t))?void 0:e.isConnected)&&(n.disconnect(),r())});n.observe(document,{childList:!0,subtree:!0}),null==e||e.addEventListener("abort",()=>{n.disconnect(),i(new Error("AbortError"))}),(null==(o=me(t))?void 0:o.isConnected)&&(n.disconnect(),r()),(null==e?void 0:e.aborted)&&(n.disconnect(),i(new Error("AbortError")))})}function be(t,e){return(async()=>new Promise((r,i)=>{_e(t,e).then(()=>{var o;const n=new MutationObserver(()=>{var e;(null==(e=me(t))?void 0:e.isConnected)||(n.disconnect(),r())});n.observe(document,{childList:!0,subtree:!0}),null==e||e.addEventListener("abort",()=>{n.disconnect(),i(new Error("AbortError"))}),(null==(o=me(t))?void 0:o.isConnected)||(n.disconnect(),r()),(null==e?void 0:e.aborted)&&(n.disconnect(),i(new Error("AbortError")))})}))()}function ye(t,e){return Object.entries(t).reduce((t,[r,i])=>{const o=r;return e[o]!==i&&(t[o]=!0),t},{})}function ve(t,...e){const r=Object.keys(t),i=new Set(e);return r.every(t=>i.has(t))}const we=()=>Math.random().toString(32).substring(2),Ce=t=>{if(!t)return"";const{hours:e,minutes:r}=Se(t);return`${e.toString().padStart(2,"0")}:${r.toString().padStart(2,"0")}`},ke=Intl.DateTimeFormat("ja-JP",{timeZone:"Asia/Tokyo",year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric",weekday:"short"}),Se=t=>{var e,r,i,o,n,s,l;const a=(()=>{switch(typeof t){case"string":case"number":return new Date(t);case"object":return t;case"undefined":return new Date}})(),c=ke.formatToParts(a);return{year:parseInt((null==(e=c.find(t=>"year"===t.type))?void 0:e.value)??""),month:parseInt((null==(r=c.find(t=>"month"===t.type))?void 0:r.value)??""),day:parseInt((null==(i=c.find(t=>"day"===t.type))?void 0:i.value)??""),weekday:(null==(o=c.find(t=>"weekday"===t.type))?void 0:o.value)??"",hours:parseInt((null==(n=c.find(t=>"hour"===t.type))?void 0:n.value)??""),minutes:parseInt((null==(s=c.find(t=>"minute"===t.type))?void 0:s.value)??""),second:parseInt((null==(l=c.find(t=>"second"===t.type))?void 0:l.value)??"")}},$e=()=>{if("undefined"==typeof window)return!1;if(window.self===window.parent)return!1;try{const t=new URL(document.referrer).hostname;return!!(t.endsWith(".nhk")||t.endsWith(".nhk.or.jp")||t.endsWith(".nhk.jp")||"www.nhk-ondemand.jp"===t||"www.nhk-cs.jp"===t)}catch{return!1}},xe=()=>{if("undefined"==typeof window)return!1;if(null!==navigator.userAgent.match(/\bNHK[\w ]+\/\d/))return!0;return"true"===new URLSearchParams(window.location.search).get("app")||!!window.isAppWebView},Ee=()=>{const t=location.host;return["dev-","stg-","pre-","local-"].some(e=>t.startsWith(e))},Ie=()=>"1"===new URLSearchParams(location.search).get("debug_header")&&Ee(),Ae=()=>"1"===new URLSearchParams(location.search).get("debug_em")&&Ee();const Me=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="AccountFilledIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<path
fill="currentColor"
d="M17.371,6.886c-.405-.957-.991-1.819-1.714-2.543-.181-.181-.37-.353-.568-.516-1.383-1.141-3.156-1.827-5.089-1.827-3.314,0-6.157,2.015-7.371,4.886-.405.957-.629,2.009-.629,3.114,0,.39.037.769.091,1.144.011.076.021.151.034.226.065.374.151.741.266,1.095.003.01.008.02.011.03.121.369.271.725.443,1.068.009.018.017.037.027.056,1.322,2.598,4.014,4.381,7.128,4.381s5.807-1.783,7.128-4.381c.01-.018.018-.037.027-.056.171-.343.322-.699.443-1.068.003-.01.008-.02.011-.03.115-.354.201-.721.266-1.095.013-.075.023-.15.034-.226.054-.375.091-.755.091-1.144,0-1.105-.224-2.157-.629-3.114ZM10,5.1c1.712,0,3.1,1.388,3.1,3.1s-1.388,3.1-3.1,3.1-3.1-1.388-3.1-3.1,1.388-3.1,3.1-3.1ZM10,16.7c-2.201,0-4.152-1.072-5.374-2.716,1.617-.815,3.439-1.284,5.374-1.284s3.756.469,5.374,1.284c-1.222,1.644-3.173,2.716-5.374,2.716Z"
></path>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Te=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="AccountIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<g>
<path
fill="currentColor"
d="M10,4.8c-1.823,0-3.3,1.477-3.3,3.3s1.477,3.3,3.3,3.3,3.3-1.477,3.3-3.3-1.477-3.3-3.3-3.3ZM10,10.1c-1.103,0-2-.897-2-2s.897-2,2-2,2,.897,2,2-.897,2-2,2Z"
></path>
<path
fill="currentColor"
d="M10,2C5.582,2,2,5.582,2,10s3.582,8,8,8c2.216,0,4.221-.902,5.67-2.358,0,0,0,0,0,0,1.439-1.447,2.33-3.44,2.33-5.642,0-4.418-3.582-8-8-8ZM10,16.7c-1.713,0-3.273-.652-4.458-1.713,1.358-.63,2.866-.987,4.458-.987s3.101.358,4.458.987c-1.186,1.061-2.746,1.713-4.458,1.713ZM15.374,13.984c-1.617-.815-3.439-1.284-5.374-1.284s-3.756.469-5.374,1.284c-.829-1.115-1.326-2.491-1.326-3.984,0-3.694,3.006-6.7,6.7-6.7s6.7,3.006,6.7,6.7c0,1.493-.497,2.869-1.326,3.984Z"
></path>
</g>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Le=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="AddFilledIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<path
fill="currentColor"
fill-rule="evenodd"
d="M10,2C5.582,2,2,5.582,2,10s3.582,8,8,8,8-3.582,8-8S14.418,2,10,2ZM14.35,10.65h-3.7v3.7c0,.359-.291.65-.65.65s-.65-.291-.65-.65v-3.7h-3.7c-.359,0-.65-.291-.65-.65s.291-.65.65-.65h3.7v-3.7c0-.359.291-.65.65-.65s.65.291.65.65v3.7h3.7c.359,0,.65.291.65.65s-.291.65-.65.65Z"
></path>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const ze=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="AddIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<g>
<path
fill="currentColor"
d="M10,2C5.582,2,2,5.582,2,10s3.582,8,8,8,8-3.582,8-8S14.418,2,10,2ZM10,16.7c-3.694,0-6.7-3.006-6.7-6.7s3.006-6.7,6.7-6.7,6.7,3.006,6.7,6.7-3.006,6.7-6.7,6.7Z"
></path>
<path
fill="currentColor"
d="M14.35,9.35h-3.7v-3.7c0-.359-.291-.65-.65-.65s-.65.291-.65.65v3.7h-3.7c-.359,0-.65.291-.65.65s.291.65.65.65h3.7v3.7c0,.359.291.65.65.65s.65-.291.65-.65v-3.7h3.7c.359,0,.65-.291.65-.65s-.291-.65-.65-.65Z"
></path>
</g>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Pe=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="ArrowDownIcon"
>
<defs></defs>
<g>
<g>
<path
fill="currentColor"
d="M10.468,12.071c-.26.26-.663.26-.923,0l-3.965-3.965c-.247-.247-.078-.663.273-.663h8.294c.351,0,.52.416.273.663l-3.952,3.965Z"
></path>
<rect fill="none" width="20" height="20"></rect>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Be=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="ArrowLeftIcon"
>
<defs></defs>
<g>
<g>
<path fill="currentColor" d="M7.928,10.468c-.26-.26-.26-.663,0-.923l3.965-3.965c.247-.247.663-.078.663.273v8.294c0,.351-.416.52-.663.273l-3.965-3.952Z"></path>
<rect fill="none" width="20" height="20"></rect>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Fe=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="ArrowRightIcon"
>
<defs></defs>
<g>
<g>
<path fill="currentColor" d="M12.071,9.532c.26.26.26.663,0,.923l-3.965,3.965c-.247.247-.663.078-.663-.273V5.853c0-.351.416-.52.663-.273l3.965,3.952Z"></path>
<rect fill="none" width="20" height="20"></rect>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Re=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="ArrowUpIcon"
>
<defs></defs>
<g>
<g>
<path fill="currentColor" d="M9.532,7.928c.26-.26.663-.26.923,0l3.965,3.965c.247.247.078.663-.273.663H5.853c-.351,0-.52-.416-.273-.663l3.952-3.965Z"></path>
<rect fill="none" width="20" height="20"></rect>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Ne=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="BlankIcon"
>
<defs></defs>
<g>
<g>
<path
fill="none"
stroke-width="0px"
d="m4.0937,5.3918v9.8082c0,.3859.314.7.7.7h9.8115c.386,0,.7-.314.7-.7v-4.1325h-6.379v-6.3757h-4.1325c-.386,0-.7.314-.7.7Z"
></path>
<path
stroke-width="0px"
fill="currentColor"
d="m15.3053,15.2c0,.3859-.314.7-.7.7H4.7937c-.386,0-.7-.314-.7-.7V5.3918c0-.386.314-.7.7-.7h4.1325v-1.3h-4.1325c-1.1046,0-2,.8954-2,2v9.8082c0,1.1046.8954,2,2,2h9.8115c1.1046,0,2-.8954,2-2v-4.1325h-1.3v4.1325Z"
></path>
<path
stroke-width="0px"
fill="currentColor"
d="m17.9928,2.645c-.0007-.0829-.017-.1655-.0491-.2433-.0659-.1589-.1924-.2856-.3514-.3516-.0794-.0329-.1638-.0502-.2484-.0502h-4.7227c-.3589,0-.6499.291-.6499.6499s.291.6499.6499.6499h3.1536l-6.7464,6.7451c-.2539.2534-.2539.665,0,.9189.127.127.293.1904.4595.1904s.3325-.0635.4595-.1904l6.7466-6.7453v3.1618c0,.3589.291.6499.6499.6499s.6499-.291.6499-.6499V2.6499c0-.0017-.001-.0032-.001-.0049Z"
></path>
<rect fill="none" stroke-width="0px" width="20" height="20"></rect>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Ze=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="BookmarkIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<path
fill="currentColor"
d="M14.405,2H5.595c-1.1,0-1.995.895-1.995,1.995v12.703c0,.494.274.938.715,1.161.187.094.387.141.587.141.271,0,.541-.086.769-.254l4.329-3.19,4.329,3.189c.397.294.918.336,1.356.114.44-.222.715-.667.715-1.161V3.995c0-1.1-.895-1.995-1.995-1.995ZM15.1,16.699h0s-4.715-3.475-4.715-3.475c-.115-.084-.25-.126-.386-.126s-.27.042-.386.126l-4.714,3.474V3.995c0-.383.312-.695.694-.695h8.81c.383,0,.694.312.694.695l.005,12.706-.004-.002Z"
></path>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Oe=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
width="${c}"
height="${c}"
viewBox="0 0 20 20"
fill="none"
xmlns="http://www.w3.org/2000/svg"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="CheckCircleFilledIcon"
>
<path
fillRule="evenodd"
clipRule="evenodd"
d="M10 2C5.58173 2 2 5.58179 2 10C2 14.4182 5.58173 18 10 18C14.4183 18 18 14.4182 18 10C18 5.58179 14.4183 2 10 2ZM14.2163 8.66406L9.41992 13.46C9.29297 13.5869 9.12695 13.6504 8.96045 13.6504C8.79395 13.6504 8.62793 13.5869 8.50098 13.46L5.79736 10.7559C5.54346 10.502 5.54346 10.0898 5.79736 9.83594C6.05127 9.58203 6.4624 9.58203 6.71631 9.83594L8.96051 12.0806L13.2974 7.74414C13.5513 7.49023 13.9624 7.49023 14.2163 7.74414C14.4702 7.99805 14.4702 8.41016 14.2163 8.66406Z"
fill="currentColor"
></path>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const De=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="CheckCircleIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<g>
<path
fill="currentColor"
d="M9.995,2C5.577,2,1.995,5.582,1.995,10s3.582,8,8,8,8-3.582,8-8S14.413,2,9.995,2ZM9.995,16.7c-3.694,0-6.7-3.006-6.7-6.7s3.006-6.7,6.7-6.7,6.7,3.006,6.7,6.7-3.006,6.7-6.7,6.7Z"
></path>
<path
fill="currentColor"
d="M13.292,7.745l-4.336,4.336-2.244-2.244c-.254-.254-.666-.254-.92,0s-.254.666,0,.919l2.704,2.704c.127.127.294.19.46.19s.333-.063.46-.19l4.796-4.796c.254-.254.254-.665,0-.919s-.666-.254-.92,0Z"
></path>
</g>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const He=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="CheckIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<path
fill="currentColor"
d="M17.807,4.709c-.254-.254-.666-.254-.92,0L7.946,13.649l-4.84-4.84c-.254-.254-.666-.254-.92,0s-.254.665,0,.919l5.3,5.3c.127.127.294.19.46.19s.333-.063.46-.19l9.4-9.4c.254-.254.254-.665,0-.919Z"
></path>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const je=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="ChevronDownIcon"
>
<defs></defs>
<g>
<g>
<path
stroke-width="0px"
fill="currentColor"
d="m17.0561,6.2407c-.2539-.2539-.666-.2539-.9199,0l-6.1396,6.1396L3.8569,6.2407c-.2539-.2539-.666-.2539-.9199,0s-.2539.665,0,.9189l6.5996,6.5996c.127.127.2939.1904.46.1904s.333-.0635.46-.1904l6.5996-6.5996c.2539-.2539.2539-.665,0-.9189Z"
></path>
<rect fill="none" stroke-width="0px" width="20" height="20"></rect>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Ue=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="ChevronLeftIcon"
>
<defs></defs>
<g>
<g>
<path
stroke-width="0px"
fill="currentColor"
d="m7.6141,10l6.1402-6.1406c.2539-.2539.2539-.665,0-.9189s-.666-.2539-.9199,0l-6.5996,6.6001c-.2539.2539-.2539.665,0,.9189l6.5996,6.6001c.127.127.2939.1904.46.1904s.333-.0635.46-.1904c.2539-.2539.2539-.665,0-.9189l-6.1402-6.1406Z"
></path>
<rect fill="none" stroke-width="0px" width="20" height="20"></rect>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const qe=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="ChevronRightIcon"
>
<defs></defs>
<g>
<g>
<path
stroke-width="0px"
fill="currentColor"
d="m13.7538,9.5405L7.1532,2.9404c-.2539-.2539-.666-.2539-.9199,0s-.2539.665,0,.9189l6.1411,6.1406-6.1411,6.1406c-.2539.2539-.2539.665,0,.9189.127.127.2939.1904.46.1904s.333-.0635.46-.1904l6.6006-6.6001c.2539-.2539.2539-.665,0-.9189Z"
></path>
<rect fill="none" stroke-width="0px" width="20" height="20"></rect>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const We=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
width="${c}"
height="${c}"
viewBox="0 0 20 20"
fill="none"
xmlns="http://www.w3.org/2000/svg"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="ChevronSmallDownIcon"
>
<path
d="M14.5689 8.03999C14.5689 7.86999 14.5089 7.70999 14.3789 7.57999C14.1289 7.32999 13.7089 7.32999 13.4589 7.57999L9.9989 11.04L6.5389 7.57999C6.2889 7.32999 5.8689 7.32999 5.6189 7.57999C5.3689 7.82999 5.3689 8.24999 5.6189 8.49999L9.5389 12.42C9.7889 12.67 10.2089 12.67 10.4589 12.42L14.3789 8.49999C14.5089 8.36999 14.5689 8.20999 14.5689 8.03999Z"
fill="currentColor"
></path>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Ve=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
width="${c}"
height="${c}"
viewBox="0 0 20 20"
fill="none"
xmlns="http://www.w3.org/2000/svg"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="ChevronSmallLeftIcon"
>
<path
d="M11.9601 14.569C12.1301 14.569 12.2901 14.509 12.4201 14.379C12.6701 14.129 12.6701 13.709 12.4201 13.459L8.96008 9.99899L12.4201 6.53899C12.6701 6.28899 12.6701 5.86899 12.4201 5.61899C12.1701 5.36899 11.7501 5.36899 11.5001 5.61899L7.58008 9.53899C7.33008 9.78899 7.33008 10.209 7.58008 10.459L11.5001 14.379C11.6301 14.509 11.7901 14.569 11.9601 14.569Z"
fill="currentColor"
></path>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Je=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
width="${c}"
height="${c}"
viewBox="0 0 20 20"
fill="none"
xmlns="http://www.w3.org/2000/svg"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="ChevronSmallRightIcon"
>
<path
d="M8.04008 14.569C7.87008 14.569 7.71008 14.509 7.58008 14.379C7.33008 14.129 7.33008 13.709 7.58008 13.459L11.0401 9.99899L7.58008 6.53899C7.33008 6.28899 7.33008 5.86899 7.58008 5.61899C7.83008 5.36899 8.25008 5.36899 8.50008 5.61899L12.4201 9.53899C12.6701 9.78899 12.6701 10.209 12.4201 10.459L8.50008 14.379C8.37008 14.509 8.21008 14.569 8.04008 14.569Z"
fill="currentColor"
></path>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Xe=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
width="${c}"
height="${c}"
viewBox="0 0 20 20"
fill="none"
xmlns="http://www.w3.org/2000/svg"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="ChevronSmallUpIcon"
>
<path
d="M5.43091 11.96C5.43091 12.13 5.49091 12.29 5.62091 12.42C5.87091 12.67 6.29091 12.67 6.54091 12.42L10.0009 8.95999L13.4609 12.42C13.7109 12.67 14.1309 12.67 14.3809 12.42C14.6309 12.17 14.6309 11.75 14.3809 11.5L10.4609 7.57999C10.2109 7.32999 9.79091 7.32999 9.54091 7.57999L5.62091 11.5C5.49091 11.63 5.43091 11.79 5.43091 11.96Z"
fill="currentColor"
></path>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Ge=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="ChevronUpIcon"
>
<defs></defs>
<g>
<g>
<path
stroke-width="0px"
fill="currentColor"
d="m17.0556,12.8403l-6.6006-6.5996c-.2539-.2539-.666-.2539-.9199,0l-6.5996,6.5996c-.2539.2539-.2539.665,0,.9189.127.127.2939.1904.46.1904s.333-.0635.46-.1904l6.1396-6.1397,6.1406,6.1397c.127.127.2939.1904.46.1904s.333-.0635.46-.1904c.2539-.2539.2539-.6655,0-.9189Z"
></path>
<rect fill="none" stroke-width="0px" width="20" height="20"></rect>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Ke=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="CloseIcon"
>
<defs></defs>
<g>
<g>
<path
stroke-width="0px"
fill="currentColor"
d="m10.9093,10.0001l5.7408-5.7408c.2539-.2539.2539-.665,0-.9189s-.665-.2539-.9189,0l-5.7408,5.7408L4.2498,3.3403c-.2539-.2539-.665-.2539-.9189,0s-.2539.665,0,.9189l5.7406,5.7408-5.7406,5.7406c-.2539.2539-.2539.665,0,.9189.127.127.293.1904.4595.1904s.3325-.0635.4595-.1904l5.7406-5.7406,5.7404,5.7406c.127.127.293.1904.4595.1904s.3325-.0635.4595-.1904c.2539-.2539.2539-.665,0-.9189l-5.7404-5.7406Z"
></path>
<rect fill="none" stroke-width="0px" width="20" height="20"></rect>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Ye=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="CompanyIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<g>
<path
fill="currentColor"
d="M16.55,16.699h-.149V3.3c0-.717-.584-1.3-1.301-1.3H4.901c-.717,0-1.301.583-1.301,1.3v13.399h-.149c-.359,0-.65.291-.65.65s.291.65.65.65h13.099c.359,0,.65-.291.65-.65s-.291-.65-.65-.65ZM7.851,16.699v-2.499h1.499v2.499h-1.499ZM10.65,16.699v-2.499h1.499v2.499h-1.499ZM13.45,16.699v-3.149c0-.359-.291-.65-.65-.65h-5.599c-.359,0-.65.291-.65.65v3.149h-1.649V3.301h10.199s0,13.398,0,13.398h-1.649Z"
></path>
<path fill="currentColor" d="M10,4.85c-.359,0-.65.291-.65.65s.291.65.65.65.65-.291.65-.65-.291-.65-.65-.65Z"></path>
<path fill="currentColor" d="M7.4,4.85c-.359,0-.65.291-.65.65s.291.65.65.65.65-.291.65-.65-.291-.65-.65-.65Z"></path>
<path fill="currentColor" d="M12.6,4.85c-.359,0-.65.291-.65.65s.291.65.65.65.65-.291.65-.65-.291-.65-.65-.65Z"></path>
<path fill="currentColor" d="M10,7.45c-.359,0-.65.291-.65.65s.291.65.65.65.65-.291.65-.65-.291-.65-.65-.65Z"></path>
<path fill="currentColor" d="M7.4,7.45c-.359,0-.65.291-.65.65s.291.65.65.65.65-.291.65-.65-.291-.65-.65-.65Z"></path>
<path fill="currentColor" d="M12.6,7.45c-.359,0-.65.291-.65.65s.291.65.65.65.65-.291.65-.65-.291-.65-.65-.65Z"></path>
<path fill="currentColor" d="M10,10.05c-.359,0-.65.291-.65.65s.291.65.65.65.65-.291.65-.65-.291-.65-.65-.65Z"></path>
<path fill="currentColor" d="M7.4,10.05c-.359,0-.65.291-.65.65s.291.65.65.65.65-.291.65-.65-.291-.65-.65-.65Z"></path>
<path fill="currentColor" d="M12.6,10.05c-.359,0-.65.291-.65.65s.291.65.65.65.65-.291.65-.65-.291-.65-.65-.65Z"></path>
</g>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Qe=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="CopyIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<path
fill="currentColor"
d="M14.405,5.5h-1.255v-1.505c0-1.1-.896-1.995-1.995-1.995h-5.561c-1.1,0-1.995.895-1.995,1.995v8.51c0,1.1.896,1.995,1.995,1.995h1.255v1.505c0,1.1.896,1.995,1.995,1.995h5.561c1.1,0,1.995-.895,1.995-1.995V7.495c0-1.1-.896-1.995-1.995-1.995ZM5.595,13.2c-.383,0-.694-.312-.694-.695V3.995c0-.383.312-.695.694-.695h5.561c.383,0,.694.312.694.695v1.505h-3.005c-1.1,0-1.995.895-1.995,1.995v5.705h-1.255ZM15.1,16.005c0,.383-.312.695-.694.695h-5.561c-.383,0-.694-.312-.694-.695V7.495c0-.383.312-.695.694-.695h5.561c.383,0,.694.312.694.695v8.51Z"
></path>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const tr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="DeleteIcon"
>
<defs></defs>
<g>
<g>
<rect stroke-width="0px" fill="currentColor" x="7.4066" y="7.5" width="1.3" height="7" rx=".65" ry=".65"></rect>
<rect stroke-width="0px" fill="currentColor" x="11.3066" y="7.5" width="1.3" height="7" rx=".65" ry=".65"></rect>
<rect fill="none" stroke-width="0px" width="20" height="20"></rect>
<path
stroke-width="0px"
fill="currentColor"
d="m15.0947,16c0,.386-.314.7-.7.7H5.5946c-.386,0-.7-.314-.7-.7V5.3h-1.3v10.7c0,1.1046.8954,2,2,2h8.8c1.1046,0,2-.8954,2-2V5.3h-1.3v10.7Z"
></path>
<path
stroke-width="0px"
fill="currentColor"
d="m17.3566,4h-2.85v-.6127c0-.7662-.6212-1.3873-1.3873-1.3873h-6.2254c-.7662,0-1.3873.6211-1.3873,1.3873v.6127h-2.85c-.3589,0-.65.291-.65.65s.291.65.65.65h14.7c.359,0,.65-.291.65-.65s-.291-.65-.65-.65Z"
></path>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const er=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="EditIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" stroke-width="0px" width="20" height="20"></rect>
<path
fill="none"
stroke-width="0px"
d="m5.0886,12.4529c-.0394.0918-.0836.1865-.11.2695l-.7839,2.4584c-.1045.3277.1487.6393.4642.6393.0493,0,.1-.0076.1512-.0239l2.4586-.7839c.0829-.0264.1778-.0706.2697-.11l-2.4498-2.4493Z"
></path>
<path
fill="none"
stroke-width="0px"
d="m14.9571,7.8916l-2.8574-2.8574c-.0144-.0144-.0197-.0334-.0325-.0488l-6.0776,6.0771c-.0694.0694-.1415.1606-.213.2495.0083.0075.0192.0101.0272.0181l2.8574,2.8569c.0081.0081.0106.0189.0181.0272.0887-.0715.18-.1435.2493-.2128l6.0776-6.0771c-.0154-.0128-.0346-.0181-.0491-.0327Z"
></path>
<path
fill="none"
stroke-width="0px"
d="m14.5249,3.5017c-.1345-.1345-.3107-.2017-.4869-.2017s-.3525.0673-.487.2017l-.5812.5811c.0154.0128.0344.018.0488.0324l2.8574,2.8574c.0145.0145.0198.0336.0327.0491l.5813-.5812c.2679-.2678.2679-.7061,0-.9739l-1.9651-1.965Z"
></path>
<path
stroke-width="0px"
fill="currentColor"
d="m17.4091,4.5473l-1.965-1.9649c-.3755-.3755-.8749-.5824-1.4061-.5824s-1.0306.2068-1.4062.5824l-7.5613,7.5609c-.5392.5392-1.0987,1.4578-1.3303,2.1842l-.7839,2.4583c-.1729.5424-.0761,1.1399.259,1.5984.3367.4608.8764.7358,1.4437.7358.1848,0,.3685-.0287.5461-.0853l2.4586-.7839c.7264-.2316,1.645-.791,2.1841-1.3301l7.5613-7.5609c.3751-.375.5817-.8745.5817-1.4062s-.2066-1.0312-.5818-1.4063ZM4.8101,15.7961c-.0511.0164-.1019.0239-.1512.0239-.3155,0-.5687-.3116-.4642-.6393l.7839-2.4584c.0264-.0829.0706-.1777.11-.2695l2.4498,2.4493c-.0919.0395-.1867.0836-.2697.11l-2.4586.7839Zm4.1185-1.7947c-.0693.0693-.1606.1414-.2493.2128-.0075-.0084-.0101-.0192-.0181-.0272l-2.8574-2.8569c-.008-.008-.0189-.0106-.0272-.0181.0715-.0889.1436-.1801.213-.2495l6.0776-6.0771c.0128.0154.0181.0344.0325.0488l2.8574,2.8574c.0145.0145.0337.0198.0491.0327l-6.0776,6.0771Zm7.5613-7.5609l-.5813.5812c-.0129-.0155-.0181-.0346-.0327-.0491l-2.8574-2.8574c-.0144-.0144-.0334-.0197-.0488-.0324l.5812-.5811c.1345-.1345.3107-.2017.487-.2017s.3525.0673.4869.2017l1.9651,1.965c.2679.2678.2679.7061,0,.9739Z"
></path>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const rr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="ErrorFilledIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<path
fill="currentColor"
fill-rule="evenodd"
d="M10,2C5.582,2,2,5.582,2,10s3.582,8,8,8,8-3.582,8-8S14.418,2,10,2ZM9.349,6c0-.359.291-.65.65-.65s.65.291.65.65v4.7c0,.359-.291.65-.65.65s-.65-.291-.65-.65v-4.7ZM10,14.65c-.552,0-1-.448-1-1s.448-1,1-1,1,.448,1,1-.448,1-1,1Z"
></path>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const ir=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="ErrorIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<g>
<path
fill="currentColor"
d="M10,2C5.582,2,2,5.582,2,10s3.582,8,8,8,8-3.582,8-8S14.418,2,10,2ZM10,16.7c-3.694,0-6.7-3.006-6.7-6.7s3.006-6.7,6.7-6.7,6.7,3.006,6.7,6.7-3.006,6.7-6.7,6.7Z"
></path>
<path fill="currentColor" d="M10,11.35c.359,0,.65-.291.65-.65v-4.7c0-.359-.291-.65-.65-.65s-.65.291-.65.65v4.7c0,.359.291.65.65.65Z"></path>
<circle fill="currentColor" cx="10" cy="13.65" r="1"></circle>
</g>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const or=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="FastForwardIcon"
>
<defs></defs>
<g>
<g>
<g>
<g>
<path
fill="currentColor"
d="M10.907,15.75c-.099,0-.257-.068-.257-.252V4.501c0-.183.158-.251.257-.251.065,0,.122.025.172.078l5.411,5.568c.057.059.057.15,0,.209l-5.411,5.568c-.05.052-.107.078-.172.078Z"
></path>
<path
fill="currentColor"
d="M11.3,5.487l4.386,4.513-4.386,4.513V5.487M10.907,3.6c-.462,0-.907.358-.907.902v10.997c0,.543.445.902.907.902.225,0,.454-.085.638-.274l5.411-5.568c.302-.31.302-.805,0-1.115l-5.411-5.568c-.184-.19-.414-.275-.639-.275h0Z"
></path>
</g>
<g>
<path
fill="currentColor"
d="M3.713,15.75c-.099,0-.257-.068-.257-.252V4.501c0-.183.158-.251.257-.251.065,0,.122.025.172.078l5.411,5.568c.057.059.057.15,0,.209l-5.411,5.568c-.05.052-.107.078-.172.078Z"
></path>
<path
fill="currentColor"
d="M4.107,5.487l4.386,4.513-4.386,4.513V5.487M3.713,3.6c-.462,0-.907.358-.907.902v10.997c0,.543.445.902.907.902.225,0,.454-.085.638-.274l5.411-5.568c.302-.31.302-.805,0-1.115L4.352,3.874c-.184-.19-.414-.275-.639-.275h0Z"
></path>
</g>
</g>
<g>
<rect fill="none" x="0" y="0" width="20" height="20"></rect>
</g>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const nr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="FastReplayIcon"
>
<defs></defs>
<g>
<g>
<g>
<g>
<path
fill="currentColor"
d="M9.093,15.75c-.065,0-.122-.025-.172-.078l-5.411-5.568c-.057-.059-.057-.15,0-.209l5.411-5.568c.05-.052.107-.078.172-.078.099,0,.257.068.257.252v10.997c0,.075-.024.133-.073.179-.049.045-.117.072-.184.072Z"
></path>
<path
fill="currentColor"
d="M9.387,4.78h.005-.005M8.7,5.487v9.026l-4.386-4.513,4.386-4.513M9.093,3.6c-.225,0-.454.085-.639.275l-5.411,5.568c-.302.311-.302.805,0,1.115l5.411,5.568c.184.19.414.275.639.275.462,0,.907-.358.907-.902V4.501c0-.543-.444-.902-.907-.902h0Z"
></path>
</g>
<g>
<path
fill="currentColor"
d="M16.287,15.75c-.065,0-.122-.025-.172-.078l-5.411-5.568c-.057-.059-.057-.15,0-.209l5.411-5.568c.05-.052.107-.078.172-.078.099,0,.257.068.257.252v10.997c0,.075-.024.133-.073.179-.049.045-.117.072-.184.072Z"
></path>
<path
fill="currentColor"
d="M16.58,4.78h.005-.005M15.893,5.487v9.026l-4.386-4.513,4.386-4.513M16.287,3.6c-.225,0-.454.085-.639.275l-5.411,5.568c-.302.311-.302.805,0,1.115l5.411,5.568c.184.19.414.275.639.275.462,0,.907-.358.907-.902V4.501c0-.543-.444-.902-.907-.902h0Z"
></path>
</g>
</g>
<g>
<rect fill="none" x="0" y="0" width="20" height="20"></rect>
</g>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const sr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="HelpIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<g>
<path
fill="currentColor"
d="M10,2C5.582,2,2,5.582,2,10s3.582,8,8,8,8-3.582,8-8S14.418,2,10,2ZM10,16.7c-3.694,0-6.7-3.006-6.7-6.7s3.006-6.7,6.7-6.7,6.7,3.006,6.7,6.7-3.006,6.7-6.7,6.7Z"
></path>
<path fill="currentColor" d="M9.998,13.4c-.442,0-.8.358-.8.8s.358.8.8.8.8-.358.8-.8-.358-.8-.8-.8Z"></path>
<path
fill="currentColor"
d="M10,5.3c-1.594,0-2.735.9-3.13,2.47-.088.348.123.701.471.789.356.086.701-.124.789-.472.249-.987.878-1.488,1.87-1.488,1.658,0,1.85.759,1.85,1.329,0,.411-.254.622-.877,1.04-.685.459-1.623,1.088-1.623,2.481,0,.359.291.65.65.65s.65-.291.65-.65c0-.667.378-.953,1.046-1.401.647-.434,1.454-.975,1.454-2.12,0-.617-.228-2.629-3.15-2.629Z"
></path>
</g>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const lr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="HomeIcon"
>
<defs></defs>
<g>
<g>
<path
fill="currentColor"
d="M17.091,7.709c-.049-.652-.37-1.242-.892-1.631l-4.859-3.633c-.794-.594-1.902-.592-2.695,0l-4.845,3.622c-.522.39-.843.98-.892,1.632-.007.04-.011.081-.011.123v8.174c0,1.106.9,2.005,2.005,2.005h3.218c.359,0,.65-.291.65-.65v-4.961h2.46v4.961c0,.359.291.65.65.65h3.218c1.106,0,2.005-.9,2.005-2.005V7.832c0-.042-.004-.083-.011-.123ZM15.803,15.995c0,.389-.316.705-.705.705h-2.567v-4.311c0-.717-.583-1.3-1.3-1.3h-2.46c-.717,0-1.3.583-1.3,1.3v4.311h-2.567c-.389,0-.705-.316-.705-.705V7.908c.003-.022.005-.045.006-.068.009-.294.146-.56.376-.732l4.845-3.622c.335-.25.803-.25,1.138,0l4.86,3.634c.23.171.366.438.375.732,0,.023.003.045.006.067v8.076Z"
></path>
<rect fill="none" width="20" height="20"></rect>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const ar=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="ImageIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<rect fill="none" width="20" height="20"></rect>
<g>
<path
fill="currentColor"
d="M16.005,3.598H3.995c-1.1,0-1.995.896-1.995,1.995v8.811c0,1.1.896,1.995,1.995,1.995h12.01c1.1,0,1.995-.896,1.995-1.995V5.593c0-1.1-.896-1.995-1.995-1.995ZM3.995,4.898h12.01c.383,0,.694.312.694.694v6.44l-1.669-1.269c-.693-.525-1.663-.527-2.36,0l-.789.6c-.231.177-.557.175-.786,0l-2.564-1.949c-.694-.526-1.664-.527-2.36,0l-2.869,2.18v-6.002c0-.383.312-.694.694-.694ZM16.005,15.098H3.995c-.383,0-.694-.312-.694-.694v-1.176l3.656-2.778c.231-.177.557-.175.786,0l2.564,1.949c.695.526,1.665.528,2.36,0l.789-.6c.231-.177.557-.175.786,0l2.456,1.867v.737c0,.383-.312.694-.694.694Z"
></path>
<path fill="currentColor" d="M13.704,8.8c.718,0,1.3-.582,1.3-1.3s-.582-1.3-1.3-1.3-1.3.582-1.3,1.3.582,1.3,1.3,1.3Z"></path>
</g>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const cr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="InfoIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<g>
<path
fill="currentColor"
d="M10,2C5.582,2,2,5.582,2,10s3.582,8,8,8,8-3.582,8-8S14.418,2,10,2ZM10,16.7c-3.694,0-6.7-3.006-6.7-6.7s3.006-6.7,6.7-6.7,6.7,3.006,6.7,6.7-3.006,6.7-6.7,6.7Z"
></path>
<path fill="currentColor" d="M10,7.75c.497,0,.9-.403.9-.9s-.403-.9-.9-.9-.9.403-.9.9.403.9.9.9Z"></path>
<polygon
fill="currentColor"
points="10.651 9.05 8.501 9.05 8.501 10.35 9.351 10.35 9.351 12.75 8.5 12.75 8.5 14.05 11.5 14.05 11.5 12.75 10.651 12.75 10.651 9.05"
></polygon>
</g>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const hr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="LinkIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" stroke-width="0px" width="20" height="20"></rect>
<path
stroke-width="0px"
fill="currentColor"
d="m12.8776,10.6475h-5.7227c-.3589,0-.6499-.291-.6499-.6499s.291-.6499.6499-.6499h5.7227c.3589,0,.6499.291.6499.6499s-.291.6499-.6499.6499Z"
></path>
<path
stroke-width="0px"
fill="currentColor"
d="m6.4866,13.2092c-1.7645,0-3.2-1.4355-3.2-3.2s1.4355-3.2,3.2-3.2h2.8465v-1.3h-2.8465c-2.475,0-4.5,2.025-4.5,4.5s2.025,4.5,4.5,4.5h2.8465v-1.3h-2.8465Z"
></path>
<path
stroke-width="0px"
fill="currentColor"
d="m13.4866,5.5092h-2.8535v1.3h2.8535c1.7645,0,3.2,1.4355,3.2,3.2s-1.4355,3.2-3.2,3.2h-2.8535v1.3h2.8535c2.475,0,4.5-2.025,4.5-4.5s-2.025-4.5-4.5-4.5Z"
></path>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const dr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="LiveIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<g>
<path
fill="currentColor"
d="M10,2C5.582,2,2,5.582,2,10s3.582,8,8,8,8-3.582,8-8S14.418,2,10,2ZM10,16.4c-3.529,0-6.4-2.871-6.4-6.4s2.871-6.4,6.4-6.4,6.4,2.871,6.4,6.4-2.871,6.4-6.4,6.4Z"
></path>
<path fill="currentColor" d="M10,5.2c-2.651,0-4.8,2.149-4.8,4.8s2.149,4.8,4.8,4.8,4.8-2.149,4.8-4.8-2.149-4.8-4.8-4.8Z"></path>
</g>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const ur=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
width="${c}"
height="${c}"
viewBox="0 0 20 20"
fill="none"
xmlns="http://www.w3.org/2000/svg"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="LoadingIcon"
>
<path
d="M15.7501 16.7H15.0001V15.86C15.0001 13.867 13.9691 11.999 12.1701 10.732L11.1291 9.99902L12.1701 9.26602C13.9691 8.00002 15.0001 6.13102 15.0001 4.13902V3.29902H15.7501C16.1091 3.29902 16.4001 3.00802 16.4001 2.64902C16.4001 2.29002 16.1091 1.99902 15.7501 1.99902H4.2501C3.8911 1.99902 3.6001 2.29002 3.6001 2.64902C3.6001 3.00802 3.8911 3.29902 4.2501 3.29902H5.0001V4.13902C5.0001 6.13202 6.0311 8.00002 7.8301 9.26702L8.8711 10L7.8301 10.733C6.0311 11.999 5.0001 13.868 5.0001 15.86V16.7H4.2501C3.8911 16.7 3.6001 16.991 3.6001 17.35C3.6001 17.709 3.8911 18 4.2501 18H15.7501C16.1091 18 16.4001 17.709 16.4001 17.35C16.4001 16.991 16.1091 16.7 15.7501 16.7ZM13.5751 3.30002C13.6381 3.30002 13.6801 3.32102 13.6991 3.33402V4.14002C13.6991 4.69302 13.5901 5.23502 13.3921 5.75002H6.6081C6.4101 5.23402 6.3011 4.69302 6.3011 4.14002L6.2891 3.34502C6.2961 3.33602 6.3411 3.30102 6.4251 3.30102H13.5751V3.30002ZM11.9501 16.7V16.653C11.9501 16.093 11.6601 15.575 11.1551 15.234L10.3641 14.698C10.1451 14.549 9.8541 14.549 9.6351 14.698L8.8441 15.234C8.3391 15.576 8.0491 16.093 8.0491 16.653V16.7H6.3001V15.86C6.3001 14.296 7.1301 12.815 8.5771 11.796L9.9991 10.795L11.4211 11.795C12.8681 12.815 13.6981 14.296 13.6981 15.86V16.7H11.9501Z"
fill="currentColor"
></path>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const pr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="LockIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<g>
<path
fill="currentColor"
d="M14.4,6.4h-1.299v-1.3c0-1.709-1.392-3.1-3.101-3.1s-3.101,1.391-3.101,3.1v1.3h-1.299c-1.105,0-2,.895-2,2v6.8c0,1.105.895,2,2,2h8.8c1.105,0,2-.895,2-2v-6.8c0-1.105-.895-2-2-2ZM8.2,5.1c0-.992.808-1.799,1.8-1.799s1.8.807,1.8,1.799v1.3h-3.6v-1.3ZM15.1,15.2c0,.386-.314.7-.7.7H5.6c-.386,0-.7-.314-.7-.7v-6.8c0-.386.314-.7.7-.7h8.8c.386,0,.7.314.7.7v6.8Z"
></path>
<path
fill="currentColor"
d="M10,9.6c-.773,0-1.4.627-1.4,1.4,0,.537.306.998.75,1.233v1.767h1.3v-1.767c.444-.235.75-.696.75-1.233,0-.773-.627-1.4-1.4-1.4Z"
></path>
</g>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const gr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="LockOpenIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<g>
<path
fill="currentColor"
d="M14.9,2c-1.709,0-3.101,1.391-3.101,3.1v1.3h-6.2c-1.105,0-2,.895-2,2v6.8c0,1.105.895,2,2,2h8.8c1.105,0,2-.895,2-2v-6.8c0-1.105-.895-2-2-2h-1.299v-1.3c0-.993.808-1.8,1.8-1.8s1.799.808,1.799,1.8v1.355c0,.359.291.65.65.65s.65-.291.65-.65v-1.355c0-1.709-1.391-3.1-3.1-3.1ZM15.1,8.4v6.8c0,.386-.314.7-.7.7H5.6c-.386,0-.7-.314-.7-.7v-6.8c0-.386.314-.7.7-.7h8.8c.386,0,.7.314.7.7Z"
></path>
<path
fill="currentColor"
d="M9.35,12.233v1.767h1.3v-1.767c.444-.235.75-.696.75-1.233,0-.773-.627-1.4-1.4-1.4s-1.4.627-1.4,1.4c0,.537.306.998.75,1.233Z"
></path>
</g>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const fr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="LoginIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<g>
<path
fill="currentColor"
d="M16.005,2h-7.01c-1.1,0-1.995.895-1.995,1.995v1.657h1.3v-1.657c0-.383.312-.695.695-.695h7.01c.383,0,.695.312.695.695v12.01c0,.383-.312.695-.695.695h-7.01c-.383,0-.695-.312-.695-.695v-1.657h-1.3v1.657c0,1.1.895,1.995,1.995,1.995h7.01c1.1,0,1.995-.895,1.995-1.995V3.995c0-1.1-.895-1.995-1.995-1.995Z"
></path>
<path
fill="currentColor"
d="M9.741,11.938c-.254.254-.254.666,0,.919.127.127.293.19.46.19s.333-.063.459-.19l2.4-2.397c.007-.007.009-.016.015-.022.051-.056.096-.118.125-.189.066-.159.066-.338,0-.497-.028-.067-.07-.124-.118-.177-.009-.01-.012-.024-.022-.033l-2.396-2.399c-.253-.253-.665-.254-.919,0-.254.254-.254.666,0,.919l1.288,1.289H2.65c-.359,0-.65.291-.65.649s.291.65.65.65h8.38s-1.289,1.288-1.289,1.288Z"
></path>
</g>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const mr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="LogoutIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<g>
<path
fill="currentColor"
d="M11.7,16.005c0,.383-.312.695-.695.695H3.995c-.383,0-.695-.312-.695-.695V3.995c0-.383.312-.695.695-.695h7.01c.383,0,.695.312.695.695v1.657h1.3v-1.657c0-1.1-.895-1.995-1.995-1.995H3.995c-1.1,0-1.995.895-1.995,1.995v12.01c0,1.1.895,1.995,1.995,1.995h7.01c1.1,0,1.995-.895,1.995-1.995v-1.657h-1.3v1.657Z"
></path>
<path
fill="currentColor"
d="M17.95,10.25c.066-.159.066-.338,0-.497-.028-.067-.07-.124-.118-.177-.009-.01-.012-.024-.022-.033l-2.396-2.399c-.254-.253-.666-.254-.919,0-.254.254-.254.666,0,.919l1.288,1.289H7.4c-.359,0-.65.291-.65.649s.291.65.65.65h8.38s-1.289,1.288-1.289,1.288c-.254.254-.254.666,0,.919.127.127.293.19.46.19s.333-.063.459-.19l2.4-2.397c.007-.007.009-.016.015-.022.051-.056.096-.118.125-.189Z"
></path>
</g>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const _r=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="MinusIcon"
>
<defs></defs>
<g>
<g>
<path fill="currentColor" d="M17.35,9.35H2.65c-.359,0-.65.291-.65.65s.291.65.65.65h14.699c.359,0,.65-.291.65-.65s-.291-.65-.65-.65Z"></path>
<rect fill="none" width="20" height="20"></rect>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const br=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="ModalOpenIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<g>
<path
fill="currentColor"
d="M15.2,2.8H4.8c-1.105,0-2,.895-2,2v3.2h1.3v-3.2c0-.386.314-.7.7-.7h10.4c.386,0,.7.314.7.7v10.4c0,.386-.314.7-.7.7h-3.2v1.3h3.2c1.105,0,2-.895,2-2V4.8c0-1.105-.895-2-2-2Z"
></path>
<path
fill="currentColor"
d="M10.249,9.4c-.079-.033-.164-.05-.249-.05h-4.33c-.359,0-.65.291-.65.65s.291.65.65.65h2.76l-5.045,5.045c-.254.254-.254.666,0,.92.127.127.294.19.46.19s.333-.063.46-.19l5.045-5.045v2.76c0,.359.291.65.65.65s.65-.291.65-.65v-4.33c0-.085-.017-.169-.05-.249-.066-.159-.193-.286-.352-.352Z"
></path>
</g>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const yr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="NavigationIcon"
>
<defs></defs>
<g>
<g>
<path
stroke-width="0px"
fill="currentColor"
d="m16.1917,10.6499H3.7913c-.3589,0-.6499-.291-.6499-.6499s.291-.6499.6499-.6499h12.4004c.3589,0,.6499.291.6499.6499s-.291.6499-.6499.6499Z"
></path>
<path
stroke-width="0px"
fill="currentColor"
d="m16.1917,16.8501H3.7913c-.3589,0-.6499-.291-.6499-.6499s.291-.6499.6499-.6499h12.4004c.3589,0,.6499.291.6499.6499s-.291.6499-.6499.6499Z"
></path>
<path
stroke-width="0px"
fill="currentColor"
d="m16.1917,4.4497H3.7913c-.3589,0-.6499-.291-.6499-.6499s.291-.6499.6499-.6499h12.4004c.3589,0,.6499.291.6499.6499s-.291.6499-.6499.6499Z"
></path>
<rect fill="none" stroke-width="0px" width="20" height="20"></rect>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const vr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="NotFoundIcon"
>
<defs></defs>
<g>
<g>
<g>
<path
fill="currentColor"
d="M12.311,8.89c-.254-.254-.666-.254-.92,0l-1.39,1.39-1.39-1.39c-.254-.254-.666-.254-.92,0s-.254.666,0,.92l1.39,1.39-1.39,1.39c-.254.254-.254.666,0,.92.127.127.294.19.46.19s.333-.063.46-.19l1.39-1.39,1.39,1.39c.127.127.294.19.46.19s.333-.063.46-.19c.254-.254.254-.666,0-.92l-1.39-1.39,1.39-1.39c.254-.254.254-.666,0-.92Z"
></path>
<path
fill="currentColor"
d="M16.104,5.706l-3.385-3.411c-.186-.187-.438-.293-.701-.293h-.718s-.001,0-.001,0h0s-5.71.011-5.71.011c-1.095,0-1.983.895-1.983,2v12c0,1.105.888,2,1.983,2l8.823-.011c1.095,0,1.983-.895,1.983-2V6.414c0-.265-.105-.52-.291-.707ZM15.095,16.003c0,.386-.306.7-.685.7l-8.821.011c-.377,0-.683-.314-.683-.7V4.014c0-.386.306-.7.685-.7l5.708-.01v2.299c0,.497.403.9.899.9h2.864l.032.032v9.468Z"
></path>
</g>
<rect fill="none" width="20" height="20"></rect>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const wr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="NotificationIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<path
fill="currentColor"
d="M15.581,12.905c-.286-.351-.431-.706-.431-1.057v-3.505c0-2.456-1.651-4.577-3.875-5.167-.065-.656-.603-1.177-1.276-1.177s-1.216.524-1.277,1.184c-.802.204-1.552.578-2.187,1.154-1.071.975-1.687,2.364-1.687,3.812v3.698c0,.351-.145.706-.432,1.057-.527.647-.818,1.462-.818,2.295,0,.359.291.65.65.65h3.15c.235,1.222,1.31,2.15,2.6,2.15s2.365-.928,2.6-2.15h3.15c.359,0,.65-.291.65-.65,0-.833-.291-1.647-.819-2.295ZM10,16.7c-.568,0-1.056-.353-1.254-.85h2.508c-.198.497-.686.85-1.254.85ZM12,14.55h-7.009c.086-.297.232-.574.434-.822.475-.58.726-1.229.726-1.879v-3.698c0-1.083.459-2.122,1.261-2.851.812-.738,1.862-1.091,2.969-.981,1.945.186,3.47,1.954,3.47,4.025v3.505c0,.649.251,1.299.725,1.879.202.247.349.525.435.822h-3.009Z"
></path>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Cr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="PauseIcon"
>
<defs></defs>
<g>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
</g>
<g>
<rect fill="currentColor" x="4.377" y="3.6" width="3.6" height="12.8" rx="1" ry="1"></rect>
<rect fill="currentColor" x="11.977" y="3.6" width="3.6" height="12.8" rx="1" ry="1"></rect>
</g>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const kr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="PdfIcon"
>
<defs></defs>
<g>
<g>
<path
stroke-width="0px"
fill="currentColor"
d="m15.0903,16c0,.386-.3064.7-.6846.7l-8.8209.0111c-.3765,0-.6829-.314-.6829-.7v-1.5111h-1.3v1.5111c0,1.1046.8878,2,1.9829,2l8.8225-.0111c1.0952,0,1.9829-.8954,1.9829-2v-1.5h-1.3v1.5Z"
></path>
<path
stroke-width="0px"
fill="currentColor"
d="m16.0996,5.7032l-3.3848-3.4106c-.1859-.1873-.4379-.2925-.7007-.2925l-.7178.0012h-.0012l-5.7102.0099c-1.0952,0-1.9829.8954-1.9829,2v3.4889h1.3v-3.4889c0-.386.3064-.7.6852-.7l5.7079-.0099v2.2987c0,.4971.4026.9.8993.9h2.8645l.0314.0317v.9683h1.3v-1.0894c0-.2654-.1046-.5199-.2907-.7075Z"
></path>
<path
stroke-width="0px"
fill="currentColor"
d="m10.0247,8.3302v.0041h-1.4376c-.612,0-.957.2095-.957.9118v3.3721c0,.6654.2916.9119.957.9119h1.4376c2.103,0,2.3207-1.7826,2.3207-2.5876,0-.9324-.2834-2.6123-2.3207-2.6123Zm-.152,4.1525h-.7804c-.1191,0-.1848-.078-.1848-.1848v-2.7396c0-.1068.0657-.1766.1848-.1766h.7804c.8338,0,1.1665.7024,1.1665,1.5608,0,.4066-.1027,1.5402-1.1665,1.5402Z"
></path>
<path
stroke-width="0px"
fill="currentColor"
d="m5.8788,8.5562c-.1191-.0698-.4148-.2218-1.2116-.2218h-1.224c-.6161,0-.957.2136-.957.9118v3.8609c0,.3861.193.5627.6449.5627.5873,0,.6325-.3409.6325-.5627h-.0041v-1.3267h.9036c.1479,0,.8461,0,1.265-.2588.4395-.2711.7804-.8174.7804-1.4951,0-.7516-.4107-1.2281-.8297-1.4704Zm-1.2692,2.181h-.842v-1.1747c0-.1068.0657-.1766.1849-.1766h.6572c.575,0,.7927.2547.7927.6736,0,.3614-.152.6777-.7927.6777Z"
></path>
<path
stroke-width="0px"
fill="currentColor"
d="m14.9847,9.3899h1.9345c.3532,0,.5668-.1396.5668-.5339,0-.5134-.4272-.5216-.5668-.5216h-2.4438c-.612,0-.957.2095-.957.9118v3.8609c0,.4436.2588.5627.6531.5627.5833,0,.6243-.3614.6243-.5627v-1.606h1.7826c.4929,0,.5586-.267.5586-.5134,0-.4272-.3122-.4887-.5586-.4887l.0041.0041h-1.7826v-.9365c0-.1068.0657-.1766.1849-.1766Z"
></path>
<rect fill="none" stroke-width="0px" width="20" height="20"></rect>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Sr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="PlayIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<path
fill="currentColor"
d="M15.543,8.874L6.722,3.781c-.867-.5-1.95.125-1.95,1.126v10.185c0,1.001,1.083,1.626,1.95,1.126l8.82-5.092c.867-.5.867-1.751,0-2.252Z"
></path>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const $r=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="PlusIcon"
>
<defs></defs>
<g>
<g>
<path
fill="currentColor"
d="M17.35,9.35h-6.699V2.65c0-.359-.291-.65-.65-.65s-.65.291-.65.65v6.699H2.65c-.359,0-.65.291-.65.65s.291.65.65.65h6.699v6.699c0,.359.291.65.65.65s.65-.291.65-.65v-6.699h6.699c.359,0,.65-.291.65-.65s-.291-.65-.65-.65Z"
></path>
<rect fill="none" width="20" height="20"></rect>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const xr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="PrintIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" stroke-width="0px" width="20" height="20"></rect>
<path
stroke-width="0px"
fill="currentColor"
d="M16.49822,7h-.70001v-.58936c0-.26538-.10455-.5199-.29071-.70746l-3.38477-3.41064c-.18591-.18732-.43793-.29254-.70068-.29254h-5.24091c-1.09515,0-1.98291.89545-1.98291,2v3h-.70001c-.82843,0-1.5.67157-1.5,1.5v5c0,.82843.67157,1.5,1.5,1.5h.70001v1c0,1.10455.88776,2,1.98291,2h7.63416c1.09515,0,1.98291-.89545,1.98291-2v-1h.70001c.82843,0,1.5-.67157,1.5-1.5v-5c0-.82843-.67157-1.5-1.5-1.5ZM5.49822,4c0-.38599.30634-.70001.68292-.70001h5.10992l.00714.0072v2.29279c0,.49707.40265.90002.89929.90002h2.26929l.03143.03168v1.79169H5.49822v-4.32336ZM14.49822,16c0,.38599-.30634.70001-.68292.70001h-7.63416c-.37659,0-.68292-.31403-.68292-.70001v-2.30853h9v2.30853ZM14.99822,11.5c-.55231,0-1-.44775-1-1,0-.55231.44769-1,1-1s1,.44769,1,1c0,.55225-.44769,1-1,1Z"
></path>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Er=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
width="${c}"
height="${c}"
viewBox="0 0 20 20"
fill="none"
xmlns="http://www.w3.org/2000/svg"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="RefreshIcon"
>
<g clipPath="url(#clip0_4396_113728)">
<path
d="M6.21463 6.21829C4.12543 8.3075 4.12533 11.6947 6.21434 13.784L6.90977 13.0886C7.18194 12.8164 7.64667 12.941 7.74629 13.3128L8.51445 16.1796C8.61407 16.5514 8.27386 16.8916 7.90208 16.7919L5.03526 16.0238C4.66347 15.9242 4.53895 15.4594 4.81111 15.1873L5.2951 14.7033C2.69841 12.1063 2.69851 7.89594 5.2954 5.29905C6.59847 3.99598 8.30911 3.34663 10.0161 3.35134L10.0125 4.65134C8.63737 4.64754 7.26319 5.16974 6.21463 6.21829Z"
fill="currentColor"
></path>
<path
d="M14.7022 5.30132L15.1877 4.81585C15.4598 4.54368 15.3353 4.07895 14.9635 3.97933L12.0967 3.21117C11.7249 3.11155 11.3847 3.45176 11.4843 3.82354L12.2525 6.69036C12.3521 7.06215 12.8168 7.18667 13.089 6.91451L13.7829 6.22056C15.87 8.31005 15.8692 11.6958 13.7807 13.7843C12.7416 14.8235 11.3827 15.3456 10.02 15.3513L10.0254 16.6513C11.717 16.6442 13.4086 15.9949 14.6999 14.7036C17.2961 12.1073 17.2969 7.89849 14.7022 5.30132Z"
fill="currentColor"
></path>
</g>
<defs>
<clipPath>
<rect width="20" height="20" fill="white"></rect>
</clipPath>
</defs>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Ir=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="ReplayIcon"
>
<defs></defs>
<g>
<g>
<path
fill="currentColor"
d="M10.675,2.675c-3.87,0-7.041,3.019-7.3,6.825h-.875c-.179,0-.344.095-.433.25-.09.155-.09.345,0,.5l1.5,2.598c.089.155.254.25.433.25s.344-.095.433-.25l1.5-2.598c.09-.155.09-.345,0-.5-.089-.155-.254-.25-.433-.25h-.824c.255-3.089,2.845-5.525,5.999-5.525,3.322,0,6.024,2.703,6.024,6.025s-2.702,6.025-6.024,6.025c-1.052,0-2.093-.281-3.01-.811-.311-.181-.709-.073-.888.237-.18.311-.073.708.237.888,1.114.645,2.38.986,3.66.986,4.039,0,7.325-3.286,7.325-7.325s-3.286-7.325-7.325-7.325Z"
></path>
<rect fill="none" x="0" y="0" width="20" height="20"></rect>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Ar=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="SchoolIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<g>
<path fill="currentColor" d="M6.05,11.5c-.359,0-.65.291-.65.65s.291.65.65.65.65-.291.65-.65-.291-.65-.65-.65Z"></path>
<path fill="currentColor" d="M8.65,11.5c-.359,0-.65.291-.65.65s.291.65.65.65.65-.291.65-.65-.291-.65-.65-.65Z"></path>
<path fill="currentColor" d="M11.25,11.5c-.359,0-.65.291-.65.65s.291.65.65.65.65-.291.65-.65-.291-.65-.65-.65Z"></path>
<path fill="currentColor" d="M13.85,11.5c-.359,0-.65.291-.65.65s.291.65.65.65.65-.291.65-.65-.291-.65-.65-.65Z"></path>
<path
fill="currentColor"
d="M17.35,15.899h-.149v-5.699c0-.717-.583-1.301-1.3-1.301h-2.05v-2.9c0-.409-.196-.799-.524-1.043l-2.549-1.898c-.457-.34-1.097-.34-1.554,0l-2.55,1.898c-.328.244-.524.634-.524,1.043v2.9h-2.05c-.717,0-1.3.584-1.3,1.301v5.699h-.149c-.359,0-.65.291-.65.65s.291.65.65.65h14.699c.359,0,.65-.291.65-.65s-.291-.65-.65-.65ZM11.995,15.899c-.027-1.081-.908-1.949-1.995-1.949s-1.967.869-1.995,1.949h-3.905v-5.699s3.35,0,3.35,0v-4.201s2.551-1.898,2.551-1.898l2.549,1.898v4.201h3.351v5.699h-3.906Z"
></path>
<path fill="currentColor" d="M11.8,8c0-.276-.224-.5-.5-.5h-.8v-.8c0-.276-.224-.5-.5-.5s-.5.224-.5.5v1.3c0,.276.224.5.5.5h1.3c.276,0,.5-.224.5-.5Z"></path>
</g>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Mr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="SearchIcon"
>
<defs></defs>
<g>
<g>
<path
stroke-width="0px"
fill="currentColor"
d="m16.8025,15.8853l-3.718-3.723c.8698-1.0721,1.3928-2.4371,1.3928-3.9253,0-3.4446-2.7924-6.2369-6.237-6.2369s-6.2369,2.7924-6.2369,6.2369,2.7924,6.237,6.2369,6.237c1.4879,0,2.8527-.5228,3.9247-1.3924l3.7176,3.7227c.127.127.2935.1904.46.1904.166,0,.3325-.0635.4595-.1899.2539-.2539.2539-.665.0005-.9194ZM3.3034,8.2369c0-2.7222,2.2147-4.937,4.937-4.937s4.937,2.2147,4.937,4.937-2.2147,4.937-4.937,4.937-4.937-2.2147-4.937-4.937Z"
></path>
<rect fill="none" stroke-width="0px" width="20" height="20"></rect>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Tr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="ServicesIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<g>
<rect fill="currentColor" x="2.8" y="2.8" width="3.501" height="3.501" rx=".65" ry=".65"></rect>
<rect fill="currentColor" x="8.25" y="2.8" width="3.5" height="3.501" rx=".65" ry=".65"></rect>
<rect fill="currentColor" x="13.699" y="2.8" width="3.501" height="3.501" rx=".65" ry=".65"></rect>
<rect fill="currentColor" x="2.8" y="8.25" width="3.501" height="3.5" rx=".65" ry=".65"></rect>
<rect fill="currentColor" x="8.25" y="8.25" width="3.5" height="3.5" rx=".65" ry=".65"></rect>
<rect fill="currentColor" x="13.699" y="8.25" width="3.501" height="3.5" rx=".65" ry=".65"></rect>
<rect fill="currentColor" x="2.8" y="13.699" width="3.501" height="3.501" rx=".65" ry=".65"></rect>
<rect fill="currentColor" x="8.25" y="13.699" width="3.5" height="3.501" rx=".65" ry=".65"></rect>
<rect fill="currentColor" x="13.699" y="13.699" width="3.501" height="3.501" rx=".65" ry=".65"></rect>
</g>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Lr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="SettingsIcon"
>
<defs></defs>
<g>
<g>
<path
stroke-width="0px"
fill="currentColor"
d="m10.5948,3.3c.0483,0,.0951.017.1322.048.0379.0316.0632.0757.0713.1244l.2992,1.8232c.0056.0337.0194.0654.0403.0925.0209.027.0482.0484.0794.0623l.6614.292c.3055.1366.5953.3058.8646.5045l.5851.4282c.0276.0202.0598.0332.0936.0379.0094.0013.0189.002.0283.002.0245,0,.0489-.0044.0721-.013l1.7541-.6572c.0235-.0089.0483-.0134.0731-.0134.0234,0,.0469.004.0693.012.0461.0164.0849.0488.1093.0911l.5778,1.0008c.0243.0423.0329.0917.0242.1397-.0087.048-.0341.0913-.0717.1224l-1.4445,1.1855c-.0263.0218-.0468.0499-.0596.0816-.0128.0317-.0175.0661-.0137.1l.0774.7223c.0385.3349.0385.6732,0,1.0081l-.0774.7223c-.0038.034.0009.0684.0137.1.0128.0317.0333.0597.0596.0816l1.4445,1.1855c.0376.031.063.0744.0717.1224.0087.048.0001.0975-.0242.1397l-.5778,1.0008c-.0244.0424-.0632.0747-.1093.0911-.0224.008-.0459.012-.0693.012-.0248,0-.0496-.0045-.0731-.0134l-1.7541-.6572c-.0231-.0086-.0475-.013-.072-.013-.0095,0-.0189.0006-.0284.002-.0338.0047-.0661.0177-.0936.0379l-.5851.4292c-.2695.1981-.5593.3668-.8646.5035l-.6614.293c-.0312.0139-.0585.0353-.0794.0623s-.0347.0588-.0403.0925l-.3095,1.8407c-.0081.0486-.0334.0927-.0713.1244-.0371.031-.084.048-.1324.048-.0009,0-.0018,0-.0027,0h-1.1546c-.0009,0-.0018,0-.0027,0-.0484,0-.0952-.0169-.1324-.048-.0379-.0316-.0632-.0758-.0713-.1244l-.2135-1.8283c-.0043-.0371-.0186-.0723-.0412-.1019-.0228-.0296-.0531-.0525-.0878-.0662l-.7449-.292c-.3053-.1367-.5951-.3055-.8647-.5035l-.487-.4127c-.028-.0241-.0619-.0402-.0981-.0467-.0121-.0022-.0244-.0033-.0366-.0033-.0244,0-.0486.0043-.0717.0128l-1.8438.6562c-.0236.0089-.0483.0134-.0731.0134-.0234,0-.0469-.004-.0693-.012-.0461-.0164-.0849-.0488-.1094-.0911l-.5778-1.0009c-.0243-.0422-.0329-.0917-.0242-.1397.0087-.048.0341-.0913.0717-.1224l1.5188-1.1752c.0308-.0238.0541-.0558.0674-.0924.0133-.0365.0161-.076.0079-.114l-.1579-.7027c-.0399-.3349-.0399-.6732,0-1.0081l.1579-.7026c.0081-.038.0054-.0776-.0079-.1141-.0133-.0365-.0367-.0685-.0674-.0923l-1.5188-1.1763c-.0376-.031-.063-.0744-.0717-.1223-.0087-.048-.0002-.0975.0242-.1397l.5778-1.0008c.0245-.0424.0633-.0747.1094-.0911.0224-.008.0458-.012.0693-.012.0248,0,.0496.0045.0731.0134l1.8438.6562c.0231.0085.0474.0129.0717.0129.0122,0,.0244-.0011.0366-.0033.0363-.0065.0702-.0227.0981-.0467l.487-.4127c.2693-.1987.5592-.3679.8647-.5045l.7449-.292c.0347-.0138.065-.0367.0878-.0663.0227-.0296.037-.0649.0412-.1019l.2135-1.8283c.0081-.0486.0334-.0928.0713-.1244.0371-.031.0839-.048.1322-.048.0009,0,.0019,0,.0028,0h1.1649c.0009,0,.0019,0,.0028,0m0-1.3c-.0045,0-.012,0-.0165,0h-1.1512c-.3552,0-.6981.1243-.9685.3502-.2757.2301-.4606.5525-.52.9073-.0035.0212-.0066.0426-.0091.064l-.1374,1.1768-.1332.0522c-.019.0074-.0378.0153-.0565.0237-.3901.1745-.7622.3916-1.1058.6453-.0234.0173-.0463.0354-.0685.0542l-.0078.0066-1.2529-.446c-.1473-.0559-.3265-.0886-.509-.0886-.1731,0-.3435.0295-.5065.0877-.3354.1194-.6193.3559-.798.6655l-.5778,1.0008c-.1782.3097-.2409.6719-.1775,1.0216.0634.3496.2491.6667.523.8929l1.0006.7755-.005.0224c-.0097.0433-.0172.0871-.0225.1311-.052.4365-.052.8792,0,1.3158.0052.0441.0128.0878.0225.1311l.0049.0218-.9683.7493c-.3061.2519-.4919.569-.5552.9186-.0634.3498-.0007.7121.1766,1.0202l.5787,1.0023c.1787.3095.4626.5461.7994.6659.1613.0577.3318.0872.5051.0872.1827,0,.362-.0328.533-.0974l1.2289-.4372.0078.0066c.023.0195.0466.0382.0709.056.3434.2522.7145.4683,1.103.6423.0187.0084.0377.0163.0568.0238l.1332.0522.1374,1.1768c.0025.0214.0056.0428.0091.0641.0594.3545.244.6766.5199.9071.2707.226.6136.3503.9659.3503h1.1573c.355,0,.6979-.1243.9683-.3501.2765-.2311.4611-.5534.5203-.9082l.2118-1.2595.1232-.0546c.3934-.1762.7645-.3923,1.1078-.6445l.1072-.0787,1.2.4496c.1668.0632.3463.096.5292.096.1731,0,.3435-.0295.5065-.0877.3358-.1196.6198-.3563.7984-.6661l.5775-1.0002c.1782-.3097.2409-.6719.1775-1.0217-.0634-.3494-.249-.6663-.5226-.8925l-.9905-.8129.0146-.1358c.0487-.423.0487-.8621-.0011-1.2951l-.0135-.1258.9871-.8102c.2772-.2291.4627-.546.5261-.8953.0634-.3497.0007-.712-.1766-1.0201l-.5787-1.0024c-.1782-.3091-.462-.5457-.7989-.6657-.1624-.0579-.3326-.0874-.5056-.0874-.1826,0-.3619.0328-.5328.0974l-1.1971.4485-.1085-.0794c-.3397-.2507-.7117-.4679-1.1016-.6422l-.1249-.0552-.2032-1.2385c-.0598-.3584-.2446-.6811-.5211-.9119-.2701-.2256-.613-.3499-.9653-.3499h0Z"
></path>
<circle stroke-width="0px" fill="currentColor" cx="10.0114" cy="9.988" r="2.0944"></circle>
<rect fill="none" stroke-width="0px" width="20" height="20"></rect>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const zr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="ShareFilledIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<path
fill="currentColor"
d="M14.194,12.5c-.782,0-1.484.33-1.984.854l-4.481-2.587c.072-.245.122-.499.122-.767s-.05-.522-.122-.767l4.481-2.587c.501.524,1.203.854,1.984.854,1.519,0,2.75-1.231,2.75-2.75s-1.231-2.75-2.75-2.75-2.75,1.231-2.75,2.75c0,.268.05.522.122.767l-4.481,2.587c-.501-.524-1.202-.854-1.984-.854-1.519,0-2.75,1.231-2.75,2.75s1.231,2.75,2.75,2.75c.782,0,1.484-.33,1.984-.854l4.481,2.587c-.071.245-.122.499-.122.767,0,1.519,1.231,2.75,2.75,2.75s2.75-1.231,2.75-2.75-1.231-2.75-2.75-2.75Z"
></path>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Pr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="ShareIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<path
fill="currentColor"
d="M14.01,12c-.875,0-1.655.381-2.203.978l-3.608-2.083c.089-.284.151-.581.151-.894s-.062-.61-.151-.894l3.608-2.083c.548.597,1.328.977,2.203.977,1.657,0,3-1.343,3-3s-1.343-3-3-3-3,1.343-3,3c0,.314.062.61.151.894l-3.608,2.083c-.548-.597-1.328-.977-2.203-.977-1.657,0-3,1.343-3,3s1.343,3,3,3c.875,0,1.655-.38,2.203-.977l3.608,2.083c-.089.284-.151.581-.151.894,0,1.657,1.343,3,3,3s3-1.343,3-3-1.343-3-3-3ZM14.01,3.3c.937,0,1.7.763,1.7,1.7s-.763,1.7-1.7,1.7-1.7-.763-1.7-1.7.763-1.7,1.7-1.7ZM5.35,11.7c-.937,0-1.7-.763-1.7-1.7s.763-1.7,1.7-1.7,1.7.763,1.7,1.7-.763,1.7-1.7,1.7ZM14.01,16.7c-.937,0-1.7-.763-1.7-1.7s.763-1.7,1.7-1.7,1.7.763,1.7,1.7-.763,1.7-1.7,1.7Z"
></path>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Br=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="SkipNextIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<g>
<g>
<path fill="currentColor" d="M15.5,15.75c-.138,0-.25-.112-.25-.25V4.5c0-.138.112-.25.25-.25s.25.112.25.25v11c0,.138-.112.25-.25.25Z"></path>
<path fill="currentColor" d="M15.5,3.6c-.497,0-.9.403-.9.9v11c0,.497.403.9.9.9s.9-.403.9-.9V4.5c0-.497-.403-.9-.9-.9h0Z"></path>
</g>
<g>
<path
fill="currentColor"
d="M4.604,15.75c-.147,0-.354-.109-.354-.352V4.602c0-.243.207-.352.354-.352.07,0,.137.022.199.066l7.606,5.398c.128.091.147.218.147.285s-.019.194-.147.285l-7.606,5.398c-.062.044-.129.067-.199.067Z"
></path>
<path
fill="currentColor"
d="M4.9,5.183l6.788,4.817-6.788,4.817V5.183M4.603,3.6c-.519,0-1.003.411-1.003,1.002v10.796c0,.59.485,1.002,1.003,1.002.195,0,.394-.058.575-.186l7.606-5.398c.562-.399.562-1.232,0-1.631L5.179,3.787c-.181-.128-.38-.186-.575-.186h0Z"
></path>
</g>
</g>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Fr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="SkipPreviousIcon"
>
<defs></defs>
<g>
<g>
<g>
<g>
<path fill="currentColor" d="M4.5,15.75c-.138,0-.25-.112-.25-.25V4.5c0-.138.112-.25.25-.25s.25.112.25.25v11c0,.138-.112.25-.25.25Z"></path>
<path fill="currentColor" d="M4.5,3.6c-.497,0-.9.403-.9.9v11c0,.497.403.9.9.9s.9-.403.9-.9V4.5c0-.497-.403-.9-.9-.9h0Z"></path>
</g>
<g>
<path
fill="currentColor"
d="M15.396,15.75c-.07,0-.137-.022-.199-.066l-7.606-5.398c-.128-.091-.147-.218-.147-.285s.019-.194.147-.285l7.606-5.398c.062-.044.129-.067.199-.067.147,0,.354.109.354.352v10.796c0,.101-.035.185-.105.251-.067.064-.158.101-.249.101h0Z"
></path>
<path
fill="currentColor"
d="M15.574,4.847h.005-.005M15.1,5.183v9.634l-6.788-4.817,6.788-4.817M15.397,3.6c-.195,0-.395.058-.575.186l-7.606,5.398c-.562.399-.562,1.232,0,1.631l7.606,5.398c.181.128.38.186.575.186.519,0,1.003-.411,1.003-1.002V4.602c0-.59-.485-1.002-1.003-1.002h0Z"
></path>
</g>
</g>
<rect fill="none" width="20" height="20"></rect>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Rr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="StopIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<rect fill="currentColor" x="4.1" y="4.1" width="11.8" height="11.8" rx="1.3" ry="1.3"></rect>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Nr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="UserFilledIcon"
>
<defs></defs>
<g>
<g>
<circle stroke-width="0px" fill="currentColor" cx="10.0011" cy="6.5" r="4.5"></circle>
<rect fill="none" stroke-width="0px" width="20" height="20"></rect>
<path
stroke-width="0px"
fill="currentColor"
d="m17.9992,15.0011c0-1.9851-5.4239-3.0003-7.9979-3.0003S1.9997,13.0159,1.9997,15.0003v.0008s.0028,2.9996.0028,2.9996l15.9934-.0028.0028-2.9968h.0004Z"
></path>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Zr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="UserIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" stroke-width="0px" width="20" height="20"></rect>
<path
stroke-width="0px"
fill="currentColor"
d="m10.0011,3.3c1.7645,0,3.2,1.4355,3.2,3.2s-1.4355,3.2-3.2,3.2-3.2-1.4355-3.2-3.2,1.4355-3.2,3.2-3.2m0-1.3c-2.4853,0-4.5,2.0147-4.5,4.5s2.0147,4.5,4.5,4.5,4.5-2.0147,4.5-4.5-2.0147-4.5-4.5-4.5h0Z"
></path>
<path
stroke-width="0px"
fill="currentColor"
d="m10.0014,13.3007c2.8023,0,6.6974.7216,6.6974,1.7471l-.0015,1.6503-13.3959.0023-.0016-1.6528c0-1.0526,3.8987-1.747,6.7016-1.747m0-1.3c-2.5739,0-8.0016,1.0152-8.0016,2.9996v.0008s.0028,2.9997.0028,2.9997l15.9935-.0028.0028-2.9969h.0004c0-1.9852-5.4239-3.0004-7.9978-3.0004h0Z"
></path>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Or=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
width="${c}"
height="${c}"
viewBox="0 0 20 20"
fill="none"
xmlns="http://www.w3.org/2000/svg"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="ViewingHistoryIcon"
>
<path
d="M10.6751 2.67499C6.83012 2.67499 3.67512 5.65399 3.37912 9.42499H2.50512C2.32612 9.42499 2.16112 9.51999 2.07212 9.67499C1.98312 9.82999 1.98312 10.02 2.07212 10.175L3.57212 12.773C3.66112 12.928 3.82612 13.023 4.00512 13.023C4.18412 13.023 4.34912 12.928 4.43812 12.773L5.93812 10.175C6.02712 10.02 6.02712 9.82999 5.93812 9.67499C5.84912 9.51999 5.68412 9.42499 5.50512 9.42499H4.67912C4.97012 6.37199 7.54712 3.97499 10.6751 3.97499C13.9971 3.97499 16.7001 6.67799 16.7001 9.99999C16.7001 13.322 13.9971 16.025 10.6751 16.025C9.06612 16.025 7.55312 15.398 6.41512 14.26C6.16112 14.006 5.75012 14.006 5.49612 14.26C5.24212 14.514 5.24212 14.925 5.49612 15.179C6.87912 16.563 8.71912 17.325 10.6751 17.325C14.7141 17.325 18.0001 14.039 18.0001 9.99999C18.0001 5.96099 14.7141 2.67499 10.6751 2.67499Z"
fill="currentColor"
></path>
<path
d="M10.4251 6.19999C10.0661 6.19999 9.77512 6.49099 9.77512 6.84999V10.25C9.77512 10.278 9.78812 10.302 9.79112 10.329C9.79712 10.374 9.80312 10.417 9.81712 10.46C9.83112 10.5 9.85012 10.534 9.87112 10.57C9.89212 10.606 9.91212 10.64 9.94012 10.673C9.96912 10.707 10.0031 10.733 10.0381 10.76C10.0601 10.777 10.0751 10.8 10.1001 10.814L12.2651 12.064C12.3681 12.123 12.4791 12.151 12.5901 12.151C12.8151 12.151 13.0331 12.035 13.1531 11.826C13.3321 11.515 13.2261 11.118 12.9151 10.938L11.0751 9.87599V6.85199C11.0751 6.49299 10.7841 6.20199 10.4251 6.20199V6.19999Z"
fill="currentColor"
></path>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Dr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="VisibilityFilledIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<g>
<circle fill="currentColor" cx="10" cy="10" r="2.7"></circle>
<path
fill="currentColor"
fill-rule="evenodd"
d="M17.929,9.582c-1.149-3.246-4.265-5.582-7.929-5.582s-6.779,2.336-7.929,5.582c-.095.268-.095.568,0,.836,1.149,3.246,4.265,5.582,7.929,5.582s6.779-2.336,7.929-5.582c.095-.268.095-.568,0-.836ZM10,14c-2.209,0-4-1.791-4-4s1.791-4,4-4,4,1.791,4,4-1.791,4-4,4Z"
></path>
</g>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Hr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="VisibilityIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<g>
<path
fill="currentColor"
d="M10,6.6c-1.878,0-3.4,1.522-3.4,3.4s1.522,3.4,3.4,3.4,3.4-1.522,3.4-3.4-1.522-3.4-3.4-3.4ZM10,12.1c-1.158,0-2.1-.942-2.1-2.1s.942-2.1,2.1-2.1,2.1.942,2.1,2.1-.942,2.1-2.1,2.1Z"
></path>
<path
fill="currentColor"
d="M17.929,9.582c-1.15-3.246-4.265-5.582-7.929-5.582s-6.779,2.336-7.929,5.582c-.095.268-.095.568,0,.836,1.15,3.246,4.265,5.582,7.929,5.582s6.779-2.336,7.929-5.582c.095-.268.095-.568,0-.836ZM10,14.7c-3.01,0-5.704-1.895-6.703-4.684.999-2.821,3.693-4.716,6.703-4.716s5.704,1.895,6.703,4.684c-.999,2.821-3.693,4.716-6.703,4.716Z"
></path>
</g>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const jr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="VisibilityOffFilledIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<g>
<path
fill="currentColor"
d="M10,6c2.209,0,4,1.791,4,4,0,.377-.063.737-.161,1.081l2.269,2.269c.797-.835,1.429-1.825,1.821-2.932.095-.268.095-.568,0-.836-1.149-3.246-4.265-5.582-7.929-5.582-.97,0-1.891.183-2.755.487l1.674,1.674c.344-.099.704-.161,1.081-.161Z"
></path>
<path fill="currentColor" d="M12.694,9.936c-.034-1.437-1.193-2.595-2.63-2.63l2.63,2.63Z"></path>
<path
fill="currentColor"
d="M15.146,14.227h0s-1.902-1.902-1.902-1.902c0,0,0,0,0,0l-.939-.939s0,0,0,0l-3.691-3.691s0,0,0,0l-.939-.939s0,0,0,0l-1.712-1.712s0,0,0,0l-2.854-2.854c-.254-.254-.665-.254-.919,0s-.254.665,0,.919l2.664,2.664c-1.259.975-2.244,2.285-2.783,3.808-.095.268-.095.568,0,.836,1.149,3.246,4.265,5.582,7.929,5.582,1.467,0,2.837-.387,4.037-1.044l2.854,2.854c.127.127.293.19.459.19s.333-.063.459-.19c.254-.254.254-.665,0-.919l-2.664-2.664ZM10,14c-2.209,0-4-1.791-4-4,0-.87.285-1.669.756-2.325l.939.939c-.245.407-.395.877-.395,1.386,0,1.489,1.211,2.7,2.7,2.7.509,0,.979-.15,1.386-.395l.939.939c-.656.471-1.455.756-2.325.756Z"
></path>
</g>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Ur=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="VisibilityOffIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<g>
<path
fill="currentColor"
d="M10,5.3c3.01,0,5.704,1.895,6.703,4.684-.331.934-.861,1.753-1.515,2.446l.919.919c.797-.835,1.429-1.824,1.821-2.932.095-.268.095-.568,0-.836-1.149-3.246-4.265-5.582-7.929-5.582-.969,0-1.891.183-2.755.487l1.034,1.034c.555-.14,1.13-.221,1.721-.221Z"
></path>
<path
fill="currentColor"
d="M17.81,16.891l-2.664-2.664s0,0,0,0l-.923-.923h0s-1.403-1.403-1.403-1.403L3.109,2.19s0,0,0-.001c-.254-.252-.665-.252-.918.001s-.254.665,0,.919l2.664,2.664c-1.259.975-2.243,2.285-2.783,3.808-.095.268-.095.568,0,.836,1.149,3.246,4.265,5.582,7.929,5.582,1.466,0,2.836-.387,4.036-1.044l2.854,2.854c.127.127.294.19.46.19s.333-.063.46-.19c.254-.254.254-.665,0-.919ZM8.135,9.055l2.81,2.81c-.286.145-.604.235-.945.235-1.158,0-2.1-.942-2.1-2.1,0-.342.09-.66.235-.945ZM10,14.7c-3.01,0-5.704-1.895-6.703-4.684.482-1.361,1.365-2.498,2.48-3.319l1.403,1.403c-.366.543-.58,1.196-.58,1.9,0,1.878,1.522,3.4,3.4,3.4.704,0,1.358-.214,1.9-.58l1.175,1.175c-.941.45-1.986.705-3.075.705Z"
></path>
<path
fill="currentColor"
d="M9.413,6.655l1.418,1.418c.49.212.883.605,1.095,1.095l1.418,1.418c.033-.191.055-.386.055-.587,0-1.878-1.522-3.4-3.4-3.4-.201,0-.396.022-.587.055Z"
></path>
</g>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const qr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="WarningFilledIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<path
fill="currentColor"
d="M17.739,14.277L11.69,3.777c-.347-.602-.995-.977-1.69-.977s-1.343.374-1.69.977L2.261,14.277c-.346.601-.346,1.348.001,1.949.347.601.994.974,1.688.974h12.098c.694,0,1.341-.373,1.688-.974.347-.601.348-1.348.001-1.949ZM9.349,7.95c0-.359.291-.65.65-.65h0c.359,0,.65.291.65.65v2.9c0,.359-.291.65-.65.65s-.65-.291-.65-.65v-2.9ZM10,14.6c-.497,0-.9-.403-.9-.9s.403-.9.9-.9.9.403.9.9-.403.9-.9.9Z"
></path>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Wr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20"
height="${c}"
width="${c}"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="WarningIcon"
>
<defs></defs>
<g>
<g>
<rect fill="none" width="20" height="20"></rect>
<g>
<path fill="currentColor" d="M10,12.8c-.497,0-.9.403-.9.9s.403.9.9.9.9-.403.9-.9-.403-.9-.9-.9Z"></path>
<path fill="currentColor" d="M9.999,11.5c.359,0,.65-.291.65-.65v-2.9c0-.359-.291-.65-.65-.65h0c-.359,0-.65.291-.65.65v2.9c0,.359.291.65.65.65Z"></path>
<path
fill="currentColor"
d="M17.739,14.277L11.69,3.777c-.347-.602-.995-.977-1.69-.977s-1.343.374-1.69.977L2.261,14.277c-.346.601-.346,1.348.001,1.949.347.601.994.974,1.688.974h12.098c.694,0,1.341-.373,1.688-.974.347-.601.348-1.348.001-1.949ZM16.049,15.9H3.951c-.5,0-.813-.541-.563-.974l6.049-10.5c.125-.217.344-.326.563-.326s.438.109.563.326l6.049,10.5c.25.433-.063.974-.563.974Z"
></path>
</g>
</g>
</g>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Vr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
width="${c}"
height="${c}"
viewBox="0 0 20 20"
fill="none"
xmlns="http://www.w3.org/2000/svg"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="ZoomInIcon"
>
<path
d="M8.24453 5.09985C8.60352 5.09985 8.89453 5.39087 8.89453 5.74985V7.59985H10.7477C11.1066 7.59985 11.3977 7.89087 11.3977 8.24985C11.3977 8.60884 11.1066 8.89985 10.7477 8.89985H8.89453V10.7499C8.89453 11.1088 8.60352 11.3999 8.24453 11.3999C7.88555 11.3999 7.59453 11.1088 7.59453 10.7499V8.89985H5.74766C5.38867 8.89985 5.09766 8.60884 5.09766 8.24985C5.09766 7.89087 5.38867 7.59985 5.74766 7.59985H7.59453V5.74985C7.59453 5.39087 7.88555 5.09985 8.24453 5.09985Z"
fill="currentColor"
></path>
<path
fillRule="evenodd"
clipRule="evenodd"
d="M13.0771 12.1618L16.7951 15.8848C17.0491 16.1388 17.0491 16.5508 16.7951 16.8048C16.6691 16.9318 16.5031 16.9948 16.3361 16.9948C16.1691 16.9948 16.0031 16.9318 15.8761 16.8048L12.1581 13.0818C11.0861 13.9508 9.72109 14.4738 8.23309 14.4738C4.78809 14.4738 1.99609 11.6818 1.99609 8.23676C1.99609 4.79176 4.78809 1.99976 8.23309 1.99976C11.6781 1.99976 14.4701 4.79176 14.4701 8.23676C14.4701 9.72476 13.9471 11.0898 13.0771 12.1618ZM8.23309 3.29976C5.51109 3.29976 3.29609 5.51476 3.29609 8.23676C3.29609 10.9588 5.51109 13.1738 8.23309 13.1738C10.9551 13.1738 13.1701 10.9588 13.1701 8.23676C13.1701 5.51476 10.9551 3.29976 8.23309 3.29976Z"
fill="currentColor"
></path>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Jr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r,size:i,ref:o}=t;this.props=t,o&&(o.current=this);const n=r??"currentColor",s="string"==typeof n?{light:n,dark:n}:n,l="number"==typeof i?`${i}px`:i??"1em",[a,c]=l.includes("calc(")?[l,"1em"]:[void 0,l],h=ee`<svg
width="${c}"
height="${c}"
viewBox="0 0 20 20"
fill="none"
xmlns="http://www.w3.org/2000/svg"
class="${Kt}"
style="${qt({[Jt]:a,[Xt]:s.light,[Gt]:s.dark})}"
focusable="false"
aria-hidden="true"
data-testid="ZoomOutIcon"
>
<path
d="M5.75156 7.6001C5.39258 7.6001 5.10156 7.89111 5.10156 8.2501C5.10156 8.60908 5.39258 8.9001 5.75156 8.9001H10.7516C11.1105 8.9001 11.4016 8.60908 11.4016 8.2501C11.4016 7.89111 11.1105 7.6001 10.7516 7.6001H5.75156Z"
fill="currentColor"
></path>
<path
fillRule="evenodd"
clipRule="evenodd"
d="M13.081 12.162L16.799 15.885C17.053 16.139 17.053 16.551 16.799 16.805C16.673 16.932 16.507 16.995 16.34 16.995C16.173 16.995 16.007 16.932 15.88 16.805L12.162 13.082C11.09 13.951 9.725 14.474 8.237 14.474C4.792 14.474 2 11.682 2 8.237C2 4.792 4.792 2 8.237 2C11.682 2 14.474 4.792 14.474 8.237C14.474 9.725 13.951 11.09 13.081 12.162ZM8.237 3.3C5.515 3.3 3.3 5.515 3.3 8.237C3.3 10.959 5.515 13.174 8.237 13.174C10.959 13.174 13.174 10.959 13.174 8.237C13.174 5.515 10.959 3.3 8.237 3.3Z"
fill="currentColor"
></path>
</svg>`;return this.root=h,null==e||e.replaceWith(h),h}setColor(t="currentColor"){if(!this.root||!this.props)return;this.props={...this.props,color:t};const e="string"==typeof t?{light:t,dark:t}:t;Vt(this.root,{[Xt]:e.light,[Gt]:e.dark})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t},this.root.style.width=t,this.root.style.height=t)}});const Xr=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{ref:r}=t;this.props=t,r&&(r.current=this);const i=ee`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="0" width="0" focusable="false" aria-hidden="true" data-testid="InvalidIcon"></svg>`;return this.root=i,null==e||e.replaceWith(i),i}setColor(t="currentColor"){this.root&&this.props&&(this.props={...this.props,color:t})}setSize(t){this.root&&this.props&&(this.props={...this.props,size:t})}}),Gr={AccountFilledIcon:Me,AccountIcon:Te,AddFilledIcon:Le,AddIcon:ze,ArrowDownIcon:Pe,ArrowLeftIcon:Be,ArrowRightIcon:Fe,ArrowUpIcon:Re,BlankIcon:Ne,BookmarkFilledIcon:Xr,BookmarkIcon:Ze,CalendarIcon:Xr,CategoryIcon:Xr,CheckCircleFilledIcon:Oe,CheckCircleIcon:De,CheckIcon:He,ChevronDownIcon:je,ChevronLeftIcon:Ue,ChevronRightIcon:qe,ChevronSmallDownIcon:We,ChevronSmallLeftIcon:Ve,ChevronSmallRightIcon:Je,ChevronSmallUpIcon:Xe,ChevronUpIcon:Ge,CloseIcon:Ke,CompanyIcon:Ye,ConnectionIcon:Xr,ConnectionOffIcon:Xr,CopyIcon:Qe,DeleteIcon:tr,DevicePcIcon:Xr,DeviceSpIcon:Xr,DeviceTvIcon:Xr,EditIcon:er,ErrorFilledIcon:rr,ErrorIcon:ir,EventOnlineIcon:Xr,FastForwardIcon:or,FastReplayIcon:nr,FavoriteFilledIcon:Xr,FavoriteIcon:Xr,FilterIcon:Xr,Forward10sIcon:Xr,Forward30sIcon:Xr,FullscreenBrowserIcon:Xr,FullscreenExitIcon:Xr,FullscreenIcon:Xr,HelpIcon:sr,HomeIcon:lr,ImageIcon:ar,IndexIcon:Xr,InfoIcon:cr,LanguageIcon:Xr,LinkIcon:hr,LiveIcon:dr,LoadingIcon:ur,LocationFilledIcon:Xr,LocationIcon:Xr,LockIcon:pr,LockOpenIcon:gr,LoginIcon:fr,LogoutIcon:mr,MailIcon:Xr,MinusIcon:_r,ModalOpenIcon:br,MuteIcon:Xr,MyLocationIcon:Xr,NavigationIcon:yr,NearbyFilledIcon:Xr,NearbyIcon:Xr,NetworkErrorIcon:Xr,NotFoundIcon:vr,NotificationIcon:wr,PauseIcon:Cr,PdfIcon:kr,PhoneFilledIcon:Xr,PhoneIcon:Xr,PickupIcon:Xr,PipExitIcon:Xr,PipIcon:Xr,PlayIcon:Sr,PlaylistIcon:Xr,PlusIcon:$r,PrintIcon:xr,RefreshIcon:Er,Replay10sIcon:Xr,Replay30sIcon:Xr,ReplayIcon:Ir,RssIcon:Xr,SchoolIcon:Ar,SearchIcon:Mr,ServicesIcon:Tr,SettingsIcon:Lr,ShareFilledIcon:zr,ShareIcon:Pr,SimulcastFilledIcon:Xr,SimulcastIcon:Xr,SkipNextIcon:Br,SkipPreviousIcon:Fr,SortIcon:Xr,StopIcon:Rr,SubtitleIcon:Xr,ThumbDownIcon:Xr,ThumbUpIcon:Xr,UserFilledIcon:Nr,UserIcon:Zr,ViewingHistoryIcon:Or,VisibilityFilledIcon:Dr,VisibilityIcon:Hr,VisibilityOffFilledIcon:jr,VisibilityOffIcon:Ur,VodIcon:Xr,VolumeIcon:Xr,WarningFilledIcon:qr,WarningIcon:Wr,ZoomInIcon:Vr,ZoomOutIcon:Jr},Kr=t=>{var e;return(e=t.name,Gr[e])({...t})},Yr={spacingBase:"4px",spacingBase2:"8px",spacingBase3:"12px",spacingBase4:"16px",spacingBase5:"20px",spacingBase6:"24px",spacingBase7:"28px",spacingBase8:"32px",spacingBase9:"36px",spacingBase10:"40px",spacingBase11:"44px",spacingBase12:"48px",spacingBase13:"52px",spacingBase14:"56px",spacingBase15:"60px",spacingSectionPc:"80px",spacingSectionSp:"56px",spacingContentsPc:"56px",spacingContentsSp:"40px",spacingGroupPc:"40px",spacingGroupSp:"32px",spacingParagraphPc:"32px",spacingParagraphSp:"28px",spacingArticlePc:"24px",spacingArticleSp:"20px",spacingObjectPc:"20px",spacingObjectSp:"16px",spacingCompPc:"12px",spacingCompSp:"12px"},Qr={NONE:0,XS:4,S:8,M:12,L:24,XL:36,XXL:40,XXXL:60},ti={...Qr,A:"auto"},ei={...Qr,A:"auto"},ri=t=>"NONE"===t?"0px":Yr[t],ii=["NONE","XS","S","M","L","XL","XXL","XXXL"],oi={comp:{mobile:Yr.spacingCompSp,desktop:Yr.spacingCompPc},object:{mobile:Yr.spacingObjectSp,desktop:Yr.spacingObjectPc},article:{mobile:Yr.spacingArticleSp,desktop:Yr.spacingArticlePc},paragraph:{mobile:Yr.spacingParagraphSp,desktop:Yr.spacingParagraphPc},group:{mobile:Yr.spacingGroupSp,desktop:Yr.spacingGroupPc},contents:{mobile:Yr.spacingContentsSp,desktop:Yr.spacingContentsPc},section:{mobile:Yr.spacingSectionSp,desktop:Yr.spacingSectionPc}},ni=t=>Object.keys(oi).includes(t),si=t=>"string"==typeof t&&[...ii,"A"].includes(t),li=t=>"string"==typeof t&&[...ii,"A","NONE"].includes(t),ai=t=>"string"==typeof t&&ni(t)?oi[t]:"object"==typeof t?t:{...t&&{desktop:t},...t&&{mobile:t}},ci=t=>void 0===t?null:"number"==typeof t?`${t}px`:t;function hi(t){var e,r,i="";if("string"==typeof t||"number"==typeof t)i+=t;else if("object"==typeof t)if(Array.isArray(t)){var o=t.length;for(e=0;e<o;e++)t[e]&&(r=hi(t[e]))&&(i&&(i+=" "),i+=r)}else for(r in t)t[r]&&(i&&(i+=" "),i+=r);return i}function di(){for(var t,e,r=0,i="",o=arguments.length;r<o;r++)(t=arguments[r])&&(e=hi(t))&&(i&&(i+=" "),i+=e);return i}var ui="var(--margin_desktop__p54xq70)",pi="var(--margin_mobile__p54xq71)",gi="var(--marginTop_desktop__p54xq72)",fi="var(--marginTop_mobile__p54xq73)",mi="var(--marginRight_desktop__p54xq74)",_i="var(--marginRight_mobile__p54xq75)",bi="var(--marginBottom_desktop__p54xq76)",yi="var(--marginBottom_mobile__p54xq77)",vi="var(--marginLeft_desktop__p54xq78)",wi="var(--marginLeft_mobile__p54xq79)",Ci="var(--padding_desktop__p54xq7a)",ki="var(--padding_mobile__p54xq7b)",Si="var(--paddingTop_desktop__p54xq7c)",$i="var(--paddingTop_mobile__p54xq7d)",xi="var(--paddingRight_desktop__p54xq7e)",Ei="var(--paddingRight_mobile__p54xq7f)",Ii="var(--paddingBottom_desktop__p54xq7g)",Ai="var(--paddingBottom_mobile__p54xq7h)",Mi="var(--paddingLeft_desktop__p54xq7i)",Ti="var(--paddingLeft_mobile__p54xq7j)",Li="var(--width__p54xq7k)",zi="var(--maxWidth__p54xq7l)",Pi="var(--minWidth__p54xq7m)",Bi="var(--height__p54xq7n)",Fi="var(--maxHeight__p54xq7o)",Ri="var(--minHeight__p54xq7p)",Ni="var(--flex__p54xq7q)",Zi="var(--backgroundColor__p54xq7r)",Oi="var(--desktopDisplay__p54xq7s)",Di="var(--mobileDisplay__p54xq7t)",Hi="var(--color__p54xq7u)",ji="var(--borderStyle__p54xq7v)",Ui="var(--borderTopStyle__p54xq7w)",qi="var(--borderRightStyle__p54xq7x)",Wi="var(--borderBottomStyle__p54xq7y)",Vi="var(--borderLeftStyle__p54xq7z)",Ji="var(--borderWidth__p54xq710)",Xi="var(--borderTopWidth__p54xq711)",Gi="var(--borderRightWidth__p54xq712)",Ki="var(--borderBottomWidth__p54xq713)",Yi="var(--borderLeftWidth__p54xq714)",Qi="var(--borderCollapse__p54xq715)",to="var(--borderColor__p54xq716)",eo="var(--borderTopColor__p54xq717)",ro="var(--borderRightColor__p54xq718)",io="var(--borderBottomColor__p54xq719)",oo="var(--borderLeftColor__p54xq71a)",no="var(--borderRadius__p54xq71b)",so="var(--borderTopLeftRadius__p54xq71c)",lo="var(--borderTopRightRadius__p54xq71d)",ao="var(--borderBottomRightRadius__p54xq71e)",co="var(--borderBottomLeftRadius__p54xq71f)",ho="var(--desktopTextAlign__p54xq71g)",uo="var(--mobileTextAlign__p54xq71h)",po="var(--verticalAlign__p54xq71i)",go="var(--pointerEvents__p54xq71j)",fo={margin:"Container_containerStyles_margin__p54xq71k",marginTop:"Container_containerStyles_marginTop__p54xq71l",marginRight:"Container_containerStyles_marginRight__p54xq71m",marginBottom:"Container_containerStyles_marginBottom__p54xq71n",marginLeft:"Container_containerStyles_marginLeft__p54xq71o",padding:"Container_containerStyles_padding__p54xq71p",paddingTop:"Container_containerStyles_paddingTop__p54xq71q",paddingRight:"Container_containerStyles_paddingRight__p54xq71r",paddingBottom:"Container_containerStyles_paddingBottom__p54xq71s",paddingLeft:"Container_containerStyles_paddingLeft__p54xq71t",width:"Container_containerStyles_width__p54xq71u",maxWidth:"Container_containerStyles_maxWidth__p54xq71v",minWidth:"Container_containerStyles_minWidth__p54xq71w",height:"Container_containerStyles_height__p54xq71x",maxHeight:"Container_containerStyles_maxHeight__p54xq71y",minHeight:"Container_containerStyles_minHeight__p54xq71z",flex:"Container_containerStyles_flex__p54xq720",backgroundColor:"Container_containerStyles_backgroundColor__p54xq721",display:"Container_containerStyles_display__p54xq722",color:"Container_containerStyles_color__p54xq723",borderStyle:"Container_containerStyles_borderStyle__p54xq724",borderTopStyle:"Container_containerStyles_borderTopStyle__p54xq725",borderRightStyle:"Container_containerStyles_borderRightStyle__p54xq726",borderBottomStyle:"Container_containerStyles_borderBottomStyle__p54xq727",borderLeftStyle:"Container_containerStyles_borderLeftStyle__p54xq728",borderWidth:"Container_containerStyles_borderWidth__p54xq729",borderTopWidth:"Container_containerStyles_borderTopWidth__p54xq72a",borderRightWidth:"Container_containerStyles_borderRightWidth__p54xq72b",borderBottomWidth:"Container_containerStyles_borderBottomWidth__p54xq72c",borderLeftWidth:"Container_containerStyles_borderLeftWidth__p54xq72d",borderCollapse:"Container_containerStyles_borderCollapse__p54xq72e",borderColor:"Container_containerStyles_borderColor__p54xq72f",borderTopColor:"Container_containerStyles_borderTopColor__p54xq72g",borderRightColor:"Container_containerStyles_borderRightColor__p54xq72h",borderBottomColor:"Container_containerStyles_borderBottomColor__p54xq72i",borderLeftColor:"Container_containerStyles_borderLeftColor__p54xq72j",borderRadius:"Container_containerStyles_borderRadius__p54xq72k",borderTopLeftRadius:"Container_containerStyles_borderTopLeftRadius__p54xq72l",borderTopRightRadius:"Container_containerStyles_borderTopRightRadius__p54xq72m",borderBottomRightRadius:"Container_containerStyles_borderBottomRightRadius__p54xq72n",borderBottomLeftRadius:"Container_containerStyles_borderBottomLeftRadius__p54xq72o",textAlign:"Container_containerStyles_textAlign__p54xq72p",verticalAlign:"Container_containerStyles_verticalAlign__p54xq72q",pointerEvents:"Container_containerStyles_pointerEvents__p54xq72r"};const mo=t=>void 0===t?null:String(t),_o=(t,e)=>{e&&(Array.isArray(e)?e.forEach(e=>{e&&(e instanceof HTMLCollection||e instanceof NodeList||Array.isArray(e)?t.append(...e):e instanceof Node?t.append(e):t.append(`${e}`))}):e instanceof HTMLCollection||e instanceof NodeList||Array.isArray(e)?t.append(...e):e instanceof Node?t.append(e):t.append(`${e}`))};class bo extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"calculateStyles",t=>{const e=["Container_root__p54xq72s"];e.push(...Object.keys(t??{}).map(t=>fo[t]));const r={m:ai(null==t?void 0:t.m),mt:ai(null==t?void 0:t.mt),mr:ai(null==t?void 0:t.mr),mb:ai(null==t?void 0:t.mb),ml:ai(null==t?void 0:t.ml),mx:ai(null==t?void 0:t.mx),my:ai(null==t?void 0:t.my),p:ai(null==t?void 0:t.p),pt:ai(null==t?void 0:t.pt),pr:ai(null==t?void 0:t.pr),pb:ai(null==t?void 0:t.pb),pl:ai(null==t?void 0:t.pl),px:ai(null==t?void 0:t.px),py:ai(null==t?void 0:t.py)},i={margin:r.m,marginTop:{...r.my,...r.mt},marginRight:{...r.mx,...r.mr},marginBottom:{...r.my,...r.mb},marginLeft:{...r.mx,...r.ml}},o={padding:r.p,paddingTop:{...r.py,...r.pt},paddingRight:{...r.px,...r.pr},paddingBottom:{...r.py,...r.pb},paddingLeft:{...r.px,...r.pl}},n={};Object.entries(i).forEach(([t,r])=>{const i=t,{mobile:o,desktop:s}=r;(o||s)&&e.push(fo[i]);const l=s&&si(s)?ti[s]:s,a=o&&si(o)?ti[o]:o;"margin"===i?(n[ui]=ci(l),n[pi]=ci(a)):"marginTop"===i?(n[gi]=ci(l),n[fi]=ci(a)):"marginRight"===i?(n[mi]=ci(l),n[_i]=ci(a)):"marginBottom"===i?(n[bi]=ci(l),n[yi]=ci(a)):"marginLeft"===i&&(n[vi]=ci(l),n[wi]=ci(a))}),Object.entries(o).forEach(([t,r])=>{const i=t,{mobile:o,desktop:s}=r;(o||s)&&e.push(fo[i]);const l=s&&li(s)?ei[s]:s,a=o&&li(o)?ei[o]:o;"padding"===i?(n[Ci]=ci(l),n[ki]=ci(a)):"paddingTop"===i?(n[Si]=ci(l),n[$i]=ci(a)):"paddingRight"===i?(n[xi]=ci(l),n[Ei]=ci(a)):"paddingBottom"===i?(n[Ii]=ci(l),n[Ai]=ci(a)):"paddingLeft"===i&&(n[Mi]=ci(l),n[Ti]=ci(a))});const s=ai(null==t?void 0:t.display),l=ai(null==t?void 0:t.textAlign);return{classNames:e,styles:{...n,[Li]:ci(null==t?void 0:t.width),[zi]:ci(null==t?void 0:t.maxWidth),[Pi]:ci(null==t?void 0:t.minWidth),[Bi]:ci(null==t?void 0:t.height),[Fi]:ci(null==t?void 0:t.maxHeight),[Ri]:ci(null==t?void 0:t.minHeight),[Ni]:mo(null==t?void 0:t.flex),[Zi]:null==t?void 0:t.backgroundColor,[Oi]:mo(s.desktop),[Di]:mo(s.mobile),[Hi]:mo(null==t?void 0:t.color),[ji]:mo(null==t?void 0:t.borderStyle),[Ui]:mo(null==t?void 0:t.borderTopStyle),[qi]:mo(null==t?void 0:t.borderRightStyle),[Wi]:mo(null==t?void 0:t.borderBottomStyle),[Vi]:mo(null==t?void 0:t.borderLeftStyle),[Ji]:ci(null==t?void 0:t.borderWidth),[Xi]:ci(null==t?void 0:t.borderTopWidth),[Gi]:ci(null==t?void 0:t.borderRightWidth),[Ki]:ci(null==t?void 0:t.borderBottomWidth),[Yi]:ci(null==t?void 0:t.borderLeftWidth),[Qi]:mo(null==t?void 0:t.borderCollapse),[to]:mo(null==t?void 0:t.borderColor),[eo]:mo(null==t?void 0:t.borderTopColor),[ro]:mo(null==t?void 0:t.borderRightColor),[io]:mo(null==t?void 0:t.borderBottomColor),[oo]:mo(null==t?void 0:t.borderLeftColor),[no]:ci(null==t?void 0:t.borderRadius),[so]:ci(null==t?void 0:t.borderTopLeftRadius),[lo]:ci(null==t?void 0:t.borderTopRightRadius),[ao]:ci(null==t?void 0:t.borderBottomRightRadius),[co]:ci(null==t?void 0:t.borderBottomLeftRadius),[ho]:mo(l.desktop),[uo]:mo(l.mobile),[po]:mo(null==t?void 0:t.verticalAlign),[go]:mo(null==t?void 0:t.pointerEvents)}}})}render(t,e){this.props=t;const{children:r,customStyles:i,as:o="div",containerRef:n,className:s,customDataAttribute:l,...a}=t;n&&(n.current=this);const c=document.createElement(o);Object.entries(a).forEach(([t,e])=>{void 0!==e&&"function"!=typeof e&&("object"==typeof e&&"style"!==t||c.setAttribute(t,String(e)))}),l&&Object.entries(l).forEach(([t,e])=>{c.setAttribute(t,e)});const{classNames:h,styles:d}=this.calculateStyles(i);return c.className=di(...h,s),Vt(c,d),_o(c,r),null==e||e.replaceWith(c),this.root=c,c}update(t){const e=this.props;if(!this.root||!e)return;const r=ye(t,e),i={...e,...t},{children:o,customStyles:n,as:s="div",containerRef:l,className:a}=i;if(l&&(l.current=this),r.as){const t=yo({...i,as:s});this.root.replaceWith(t),this.root=t}Object.entries(function(t,...e){const r=new Set(e);return Object.fromEntries(Object.entries(t).filter(([t])=>!r.has(t)))}(r,"children","customStyles","as","containerRef")).forEach(([t,e])=>{var r,o;if(!e)return;const n=i[t];void 0===n?null==(r=this.root)||r.removeAttribute(String(t)):null==(o=this.root)||o.setAttribute(String(t),String(n))}),r.children&&(this.root.replaceChildren(),_o(this.root,o));const{classNames:c,styles:h}=this.calculateStyles(n);(r.className||r.customStyles)&&(this.root.className=di(c,a)),r.customStyles&&Vt(this.root,h),this.props=i}}const yo=(t,e)=>(new bo).render(t,e),vo=t=>"object"==typeof t?{desktop:t.desktop??"M",mobile:t.mobile??"M"}:{desktop:t,mobile:t},wo=(t=!1)=>"boolean"==typeof t?t?{desktop:"100%",mobile:"100%"}:{desktop:"auto",mobile:"auto"}:{desktop:t.desktop?"100%":"auto",mobile:t.mobile?"100%":"auto"};var Co="var(--width_desktop__cjixir0)",ko="var(--width_mobile__cjixir1)",So={XS:"Button_desktopSize_XS__cjixir3",S:"Button_desktopSize_S__cjixir4",M:"Button_desktopSize_M__cjixir5",L:"Button_desktopSize_L__cjixir6",XL:"Button_desktopSize_XL__cjixir7"},$o={XS:"Button_mobileSize_XS__cjixir8",S:"Button_mobileSize_S__cjixir9",M:"Button_mobileSize_M__cjixira",L:"Button_mobileSize_L__cjixirb",XL:"Button_mobileSize_XL__cjixirc"},xo={primary:"Button_buttonType_primary__cjixird",primaryAlert:"Button_buttonType_primaryAlert__cjixire",secondary:"Button_buttonType_secondary__cjixirf",secondaryAlert:"Button_buttonType_secondaryAlert__cjixirg",tertiary:"Button_buttonType_tertiary__cjixirh",tertiaryAlert:"Button_buttonType_tertiaryAlert__cjixiri"},Eo="Button_icon__cjixirj",Io="Button_disabledMessage__cjixirk";const Ao=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"props",null),__publicField(this,"buttonElement",null),__publicField(this,"disabledMessageElement",null),__publicField(this,"addDefaultValues",t=>({...t,buttonType:t.buttonType??"primary",size:t.size??"M",type:t.type??"button"})),__publicField(this,"refs",{containerRef:re(null)}),__publicField(this,"handleClick",t=>{var e,r;null==(r=null==(e=this.props)?void 0:e.onClick)||r.call(e,t)})}render(t,e){this.props=this.addDefaultValues(t);const{_customDataAttribute:r,ariaControls:i,ariaExpanded:o,ariaLabel:n,buttonType:s,disabled:l,disabledMessage:a,fullWidth:c,isAlert:h,leftIcon:d,rightIcon:u,size:p,type:g,children:f,customStyles:m,ref:_}=this.props,b=vo(p);_&&(_.current=this);const y=yo({containerRef:this.refs.containerRef,customStyles:m,as:"button",className:`Button_button__cjixir2 ${So[b.desktop]} ${$o[b.mobile]} ${xo[h?`${s}Alert`:s]}`,...l?{disabled:!0}:{},type:g,style:qt({[Co]:wo(c).desktop,[ko]:wo(c).mobile}),customDataAttribute:r,children:ee`<template>
${d&&ee`<i class="${Eo}">${Kr({name:d})}</i>`} ${f}
${u&&ee`<i class="${Eo}">${Kr({name:u})}</i>`}
</template>`});oe({click:this.handleClick},y),i&&y.setAttribute("aria-controls",i),void 0!==o&&y.setAttribute("aria-expanded",String(o)),n&&y.setAttribute("aria-label",n);const v=a&&l?ee`<span class="${Io}">${a}</span>`:null,w=v?[y,v]:y;return e&&ce(e,w),this.root=w,this.buttonElement=y,this.disabledMessageElement=v,w}update(t){var e,r;if(!this.root||!this.buttonElement||!this.props)return;const i=this.addDefaultValues({...this.props,...t}),o=ye(this.props,this.addDefaultValues(t));if(ve(o,"size","buttonType","isAlert","fullWidth","disabled","leftIcon","rightIcon","children","customStyles","disabledMessage")){if(o.size){const t=vo(this.props.size),e=vo(i.size);this.buttonElement.classList.remove(So[t.desktop]),this.buttonElement.classList.remove($o[t.mobile]),this.buttonElement.classList.add(So[e.desktop]),this.buttonElement.classList.add($o[e.mobile])}(o.buttonType||o.isAlert)&&(this.buttonElement.classList.remove(xo[this.props.isAlert?`${this.props.buttonType}Alert`:this.props.buttonType]),this.buttonElement.classList.add(xo[i.isAlert?`${i.buttonType}Alert`:i.buttonType])),o.fullWidth&&this.buttonElement.setAttribute("style",qt({[Co]:wo(i.fullWidth).desktop,[ko]:wo(i.fullWidth).mobile}).toString()),(o.disabled||o.disabledMessage)&&(this.buttonElement.disabled=i.disabled??!1,i.disabled&&i.disabledMessage?(this.disabledMessageElement=this.disabledMessageElement||ee`<span class="${Io}"></span>`,this.disabledMessageElement.textContent=i.disabledMessage,this.buttonElement.after(this.disabledMessageElement)):(null==(e=this.disabledMessageElement)||e.remove(),this.disabledMessageElement=null)),(o.leftIcon||o.rightIcon||o.children)&&this.buttonElement.replaceChildren(...ee`<template>
${i.leftIcon&&ee`<i class="${Eo}">${Kr({name:i.leftIcon})}</i>`} ${i.children}
${i.rightIcon&&ee`<i class="${Eo}">${Kr({name:i.rightIcon})}</i>`}
</template>`),o.customStyles&&(null==(r=this.refs.containerRef.current)||r.update({customStyles:i.customStyles}))}else this.render({...this.props,...t},this.root);this.props={...this.props,...t}}}),Mo=(t={})=>{var e;const{onChange:r}=t;let i=(null==(e=window.nhkLib)?void 0:e.auth)??null;const o=r?()=>{var t;i=(null==(t=window.nhkLib)?void 0:t.auth)??null,i&&r(i)}:null;return o&&(window.addEventListener(kt.authStateChange,o),setTimeout(o)),{current:i,dispose:()=>{o&&window.removeEventListener(kt.authStateChange,o)}}};class To extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"_manager",null),__publicField(this,"_disposables",[]),__publicField(this,"_refs",{buttonRef:re(null)}),__publicField(this,"isClicked",!1),__publicField(this,"handleClick",()=>{this.props&&this._manager&&!this.isClicked&&(this.isClicked=!0,this._manager.loginAccount({redirectUri:this.props.redirectUri,queryParams:this.props.queryParams}))})}static getPropsFromElement(t){var e;const r=t,i=(()=>{try{const t=r.getAttribute("data-custom-styles");return t?JSON.parse(t):{}}catch(t){return{}}})(),o=(()=>{const t=r.getAttribute("data-full-width");if(null===t)return!1;if("true"===t||""===t)return!0;try{return JSON.parse(t)}catch{return!1}})(),n=(()=>{const t=r.getAttribute("data-size");if(!t)return"M";try{return JSON.parse(t)}catch{return t}})(),s=(()=>{const t=r.getAttribute("data-query-params");if(t)try{return JSON.parse(t)}catch{return}})();return{buttonType:r.getAttribute("data-button-type")??"primary",fullWidth:o,leftIcon:r.getAttribute("data-left-icon"),redirectUri:r.getAttribute("data-redirect-uri")??void 0,rightIcon:r.getAttribute("data-right-icon"),title:r.getAttribute("data-title")??(null==(e=r.textContent)?void 0:e.trim())??"ログイン",queryParams:s,size:n,customStyles:i}}render(t,e){var r,i;t.title||(t.title="ログイン"),t.buttonType??(t.buttonType="primary"),t.fullWidth??(t.fullWidth=!1),t.size??(t.size="M"),this.props=t;const{title:o,buttonType:n,leftIcon:s,rightIcon:l,fullWidth:a,size:c}=t,h=Mo({onChange:t=>{var e;this._manager=t.manager;const r=this._manager.isAccessTokenValid("authN");null==(e=this._refs.buttonRef.current)||e.update(r?{disabled:!0,children:"ログイン済み"}:{disabled:!1,children:o})}});this._disposables.push(h),this._manager=(null==(r=h.current)?void 0:r.manager)??null;const d=null==(i=this._manager)?void 0:i.isAccessTokenValid("authN"),u=Ao({ref:this._refs.buttonRef,buttonType:n,leftIcon:s,rightIcon:l,fullWidth:a,onClick:this.handleClick,disabled:d??!1,children:d?"ログイン済み":o,size:c});return e&&ce(e,u),u}update(t){var e;if(!this.root||!this.props)return;const r=ye(this.props,t);r.redirectUri&&1===Object.values(r).filter(t=>!0===t).length||null==(e=this._refs.buttonRef.current)||e.update(t),this.props={...this.props,...t}}dispose(){this._disposables.forEach(t=>{var e;return null==(e=t.dispose)?void 0:e.call(t)}),this._disposables=[],this._manager=null}}const Lo=Qt(To);class zo extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"_manager",null),__publicField(this,"_disposables",[]),__publicField(this,"_refs",{buttonRef:re(null)}),__publicField(this,"isClicked",!1),__publicField(this,"handleClick",()=>{this.props&&this._manager&&!this.isClicked&&(this.isClicked=!0,this._manager.register({redirectUri:this.props.redirectUri,queryParams:this.props.queryParams}))})}static getPropsFromElement(t){var e;const r=t,i=(()=>{try{const t=r.getAttribute("data-custom-styles");return t?JSON.parse(t):{}}catch(t){return{}}})(),o=(()=>{const t=r.getAttribute("data-full-width");if(null===t)return!1;if("true"===t||""===t)return!0;try{return JSON.parse(t)}catch{return!1}})(),n=(()=>{const t=r.getAttribute("data-size");if(!t)return"M";try{return JSON.parse(t)}catch{return t}})(),s=(()=>{const t=r.getAttribute("data-query-params");if(t)try{return JSON.parse(t)}catch{return}})();return{buttonType:r.getAttribute("data-button-type")??"primary",fullWidth:o,leftIcon:r.getAttribute("data-left-icon"),redirectUri:r.getAttribute("data-redirect-uri")??void 0,rightIcon:r.getAttribute("data-right-icon"),title:r.getAttribute("data-title")??(null==(e=r.textContent)?void 0:e.trim())??"アカウントを作成する",queryParams:s,size:n,customStyles:i}}render(t,e){var r,i;t.title||(t.title="アカウントを作成する"),t.buttonType??(t.buttonType="primary"),t.fullWidth??(t.fullWidth=!1),t.size??(t.size="M"),this.props=t;const{title:o,buttonType:n,leftIcon:s,rightIcon:l,fullWidth:a,size:c}=t,h=Mo({onChange:t=>{var e;this._manager=t.manager;const r=this._manager.isAccessTokenValid("authN");null==(e=this._refs.buttonRef.current)||e.update({disabled:r,children:o})}});this._disposables.push(h),this._manager=(null==(r=h.current)?void 0:r.manager)??null;const d=null==(i=this._manager)?void 0:i.isAccessTokenValid("authN"),u=Ao({ref:this._refs.buttonRef,buttonType:n,leftIcon:s,rightIcon:l,fullWidth:a,onClick:this.handleClick,disabled:d??!1,children:o,size:c});return e&&ce(e,u),u}update(t){var e;if(!this.root||!this.props)return;const r=ye(this.props,t);r.redirectUri&&1===Object.values(r).filter(t=>!0===t).length||null==(e=this._refs.buttonRef.current)||e.update(t),this.props={...this.props,...t}}dispose(){this._disposables.forEach(t=>{var e;return null==(e=t.dispose)?void 0:e.call(t)}),this._disposables=[],this._manager=null}}const Po=Qt(zo);var Bo={information:"Notification_container_information__1to2e2j0",warning:"Notification_container_warning__1to2e2j1",danger:"Notification_container_danger__1to2e2j2"},Fo={information:"Notification_iconAndTitleContainer_information__1to2e2j4",warning:"Notification_iconAndTitleContainer_warning__1to2e2j5",danger:"Notification_iconAndTitleContainer_danger__1to2e2j6"},Ro={primary:"Notification_buttonType_primary__1to2e2jc",secondary:"Notification_buttonType_secondary__1to2e2jd",tertiary:"Notification_buttonType_tertiary__1to2e2je"},No="var(--lightColorProps__1u0etpb0)",Zo="var(--darkColorProps__1u0etpb1)",Oo="var(--fontWeight__1u0etpb2)",Do="var(--width_desktop__1u0etpb3)",Ho="var(--width_mobile__1u0etpb4)",jo={XS:"PrimaryOrSecondary_desktopSize_XS__1u0etpb9",S:"PrimaryOrSecondary_desktopSize_S__1u0etpba",M:"PrimaryOrSecondary_desktopSize_M__1u0etpbb",L:"PrimaryOrSecondary_desktopSize_L__1u0etpbc",XL:"PrimaryOrSecondary_desktopSize_XL__1u0etpbd"},Uo={XS:"PrimaryOrSecondary_mobileSize_XS__1u0etpbe",S:"PrimaryOrSecondary_mobileSize_S__1u0etpbf",M:"PrimaryOrSecondary_mobileSize_M__1u0etpbg",L:"PrimaryOrSecondary_mobileSize_L__1u0etpbh",XL:"PrimaryOrSecondary_mobileSize_XL__1u0etpbi"},qo={XS:"PrimaryOrSecondary_desktopFontSize_XS__1u0etpbj",S:"PrimaryOrSecondary_desktopFontSize_S__1u0etpbk",M:"PrimaryOrSecondary_desktopFontSize_M__1u0etpbl",L:"PrimaryOrSecondary_desktopFontSize_L__1u0etpbm",XL:"PrimaryOrSecondary_desktopFontSize_XL__1u0etpbn"},Wo={XS:"PrimaryOrSecondary_desktopFixedFontSize_XS__1u0etpbo",S:"PrimaryOrSecondary_desktopFixedFontSize_S__1u0etpbp",M:"PrimaryOrSecondary_desktopFixedFontSize_M__1u0etpbq",L:"PrimaryOrSecondary_desktopFixedFontSize_L__1u0etpbr",XL:"PrimaryOrSecondary_desktopFixedFontSize_XL__1u0etpbs"},Vo={XS:"PrimaryOrSecondary_mobileFontSize_XS__1u0etpbt",S:"PrimaryOrSecondary_mobileFontSize_S__1u0etpbu",M:"PrimaryOrSecondary_mobileFontSize_M__1u0etpbv",L:"PrimaryOrSecondary_mobileFontSize_L__1u0etpbw",XL:"PrimaryOrSecondary_mobileFontSize_XL__1u0etpbx"},Jo={XS:"PrimaryOrSecondary_mobileFixedFontSize_XS__1u0etpby",S:"PrimaryOrSecondary_mobileFixedFontSize_S__1u0etpbz",M:"PrimaryOrSecondary_mobileFixedFontSize_M__1u0etpb10",L:"PrimaryOrSecondary_mobileFixedFontSize_L__1u0etpb11",XL:"PrimaryOrSecondary_mobileFixedFontSize_XL__1u0etpb12"},Xo={primary:"PrimaryOrSecondary_linkType_primary__1u0etpb13",primaryAlert:"PrimaryOrSecondary_linkType_primaryAlert__1u0etpb14",secondary:"PrimaryOrSecondary_linkType_secondary__1u0etpb15"},Go={primary:"PrimaryOrSecondary_hover_primary__1u0etpb16",primaryAlert:"PrimaryOrSecondary_hover_primaryAlert__1u0etpb17",secondary:"PrimaryOrSecondary_hover_secondary__1u0etpb18"},Ko="PrimaryOrSecondary_icon__1u0etpb1a";const Yo={colorBasePrimary:{light:"#ffffff",dark:"#000000"},colorBaseSecondary:{light:"#f2f2f3",dark:"#313132"},colorBaseTertiary:{light:"#f9f9f9",dark:"#1f1f20"},colorBasePlayerBackground:{light:"#313132",dark:"#000000"},colorOverlay:{light:"#000000",dark:"#000000"},colorScrem:{light:"#000000",dark:"#000000"},colorSurfacePrimary:{light:"#e2e2e3",dark:"#414143"},colorSurfaceSecondary:{light:"#f2f2f3",dark:"#313132"},colorSurfaceTertiary:{light:"#f9f9f9",dark:"#1f1f20"},colorSurfaceModal:{light:"#ffffff",dark:"#000000"},colorSurfaceObjectPrimary:{light:"#ffffff",dark:"#000000"},colorSurfaceObjectSecondary:{light:"#e2e2e3",dark:"#1f1f20"},colorSurfaceObjectCurrent:{light:"#f2f2f3",dark:"#606061"},colorSurfaceOmissionBackground:{light:"linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 75%, rgba(255, 255, 255, 1) 100% )",dark:"linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 75%, rgba(0, 0, 0, 1) 100% )"},colorSurfaceOmissionScremMd:{light:"linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 1) 100% )",dark:"linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 1) 100% )"},colorSurfaceStartmarkerCurrent:{light:"#606061",dark:"#d2d2d3"},colorLogoPrimary:{light:"#808080",dark:"#ffffff"},colorInfoAlert:{light:"#c91b1b",dark:"#df1e1e"},colorFormBackground:{light:"#ffffff",dark:"#000000"},colorFormBackgroundDisabled:{light:"#f2f2f3",dark:"#000000"},colorFormChecked:{light:"#ffffff",dark:"#ffffff"},colorFormCheckedDisabled:{light:"#414143",dark:"#ffffff"},colorInteractionDefault:{light:"#e2e2e3",dark:"#313132"},colorInteractionCurrent:{light:"#313132",dark:"#f9f9f9"},colorSearchbuttonDefault:{light:"#313132",dark:"#313132"},colorButtonDefault:{light:"#313132",dark:"#f2f2f3"},colorButtonHover:{light:"#1f1f20",dark:"#f9f9f9"},colorButtonActive:{light:"#000000",dark:"#ffffff"},colorButtonAlertDefault:{light:"#c91b1b",dark:"#df1e1e"},colorButtonAlertHover:{light:"#b21818",dark:"#e53f3f"},colorButtonAlertActive:{light:"#9c1515",dark:"#e96262"},colorButtonFocusInline:{light:"#ffffff",dark:"#000000"},colorButtonBorderBackgroundDefault:{light:"#ffffff",dark:"#000000"},colorButtonBorderBackgroundHover:{light:"#f9f9f9",dark:"#1f1f20"},colorButtonBorderBackgroundActive:{light:"#f2f2f3",dark:"#313132"},colorLabelBackgroundPostponed:{light:"#e2e2e3",dark:"#e2e2e3"},colorLabelBackgroundCancelled:{light:"#757577",dark:"#757577"},colorLabelAttention:{light:"#c91b1b",dark:"#c91b1b"},colorLabelInformation:{light:"#1566a7",dark:"#1566a7"},colorLabelHighlight:{light:"#b26206",dark:"#b26206"},colorLabelLimited:{light:"#414143",dark:"#414143"},colorLabelCategory:{light:"#f2f2f3",dark:"#f2f2f3"},colorPlaylist:{light:"rgba(0, 0, 0, 0.8)",dark:"rgba(0, 0, 0, 0.8)"},colorDurationBackground:{light:"rgba(0, 0, 0, 0.5)",dark:"rgba(0, 0, 0, 0.5)"},colorIconPrimary:{light:"#1f1f20",dark:"#f9f9f9"},colorIconSecondary:{light:"#414143",dark:"#f2f2f3"},colorIconTertiary:{light:"#757577",dark:"#e2e2e3"},colorIconLayer:{light:"#ffffff",dark:"#1f1f20"},colorIconOnfillPrimary:{light:"#ffffff",dark:"#ffffff"},colorIconOnfillSecondary:{light:"#1f1f20",dark:"#1f1f20"},colorIconOverlay:{light:"#f9f9f9",dark:"#ffffff"},colorIconGnavi:{light:"#606061",dark:"#f2f2f3"},colorToggleswitchControlDefault:{light:"#ffffff",dark:"#f9f9f9"},colorToggleswitchControlDisabled:{light:"#e2e2e3",dark:"#b1b1b2"},colorToggleswitchBackgroundDefault:{light:"#757577",dark:"#909091"},colorToggleswitchBackgroundDisabled:{light:"#414143",dark:"#f2f2f3"},colorToggleswitchBackgroundCheckedDisabled:{light:"#0f4672",dark:"#ffffff"},colorClipcardlistCurrent:{light:"#414143",dark:"#d2d2d3"},colorToclistMarker:{light:"#757577",dark:"#909091"},colorDropdownSelectBackground:{light:"#606061",dark:"#606061"},colorTableheader:{light:"#313132",dark:"#f2f2f3"},colorCurrentBackground:{light:"#f2f2f3",dark:"#313132"},colorTextPrimary:{light:"#1f1f20",dark:"#f9f9f9"},colorTextSecondary:{light:"#414143",dark:"#e2e2e3"},colorTextTertiary:{light:"#606061",dark:"#909091"},colorTextLayer:{light:"#ffffff",dark:"#1f1f20"},colorTextlink:{light:"#1566a7",dark:"#87bae3"},colorTextlinkVisited:{light:"#4a158f",dark:"#b48fe6"},colorTextOnfillPrimary:{light:"#ffffff",dark:"#ffffff"},colorTextOnfillSecondary:{light:"#1f1f20",dark:"#1f1f20"},colorTextGnavi:{light:"#606061",dark:"#f9f9f9"},colorTextGfooter:{light:"#414143",dark:"#e2e2e3"},colorTextSearchbutton:{light:"#f9f9f9",dark:"#ffffff"},colorTextAlert:{light:"#c91b1b",dark:"#ef8f8f"},colorTextTimestampNew:{light:"#c91b1b",dark:"#ef8f8f"},colorTextTimestampNewCurrent:{light:"#c91b1b",dark:"#fce9e9"},colorTextCalendarSaturday:{light:"#1566a7",dark:"#add2ef"},colorTextCalendarCurrentSaturday:{light:"#add2ef",dark:"#1566a7"},colorTextCalendarHoliday:{light:"#c91b1b",dark:"#ef8f8f"},colorTextCalendarCurrentHoliday:{light:"#ef8f8f",dark:"#c91b1b"},colorBorder:{light:"#d2d2d3",dark:"#606061"},colorDividerPrimary:{light:"#909091",dark:"#606061"},colorDividerSecondary:{light:"#e2e2e3",dark:"#414143"},colorDividerAnchorlink:{light:"#e2e2e3",dark:"#e2e2e3"},colorDividerObjectCurrent:{light:"#909091",dark:"#ffffff"},colorBorderFrame:{light:"#ffffff",dark:"#606061"},colorBorderForm:{light:"#414143",dark:"#f2f2f3"},colorBorderTag:{light:"#757577",dark:"#909091"},colorBorderTagCurrent:{light:"#757577",dark:"#d2d2d3"},colorBorderDuration:{light:"#ffffff",dark:"#ffffff"},colorBorderLabelOutline:{light:"rgba(255, 255, 255, 0)",dark:"#ffffff"},colorBorderInteraction:{light:"#909091",dark:"#606061"},colorLogoSecondary:{light:"#ffffff",dark:"#808080"},colorLogoOnfillWhite:{light:"#ffffff",dark:"#ffffff"},colorLogoOnfillBlack:{light:"#000000",dark:"#000000"},colorLogoOnfillGray:{light:"#808080",dark:"#808080"},colorInterfaceObject:{light:"#c91b1b",dark:"#e96262"},colorSurfaceItemBackground:{light:"#1f1f20",dark:"#1f1f20"},colorScrollObject:{light:"#757577",dark:"#909091"},colorScrollObjectBackground:{light:"#f2f2f3",dark:"#313132"},colorProgressbarObjectBackground:{light:"#1f1f20",dark:"#e2e2e3"},colorIndicatorObject:"#e53f3f",colorIndicatorText:"#e96262",colorPlaybackbuttonBackground:"rgba(0, 0, 0, 0.5)",colorMoviecontrolBackground:"rgba(0, 0, 0, 0.75)",colorSurfaceMedia:"rgba(31, 31, 32, 0.75)",colorMpObjectCurrent:"#606061",colorMpDividerCurrent:"#ffffff",colorMpScrollbar:"#757577",colorMpScrollbarBackground:"#f9f9f9",colorStatusText:{light:"#ffffff",dark:"#ffffff"},colorStatusBaseLv5:{light:"#c91b1b",dark:"#c91b1b"},colorStatusBaseLv4:{light:"#fce9e9",dark:"#fce9e9"},colorStatusTextLv4:{light:"#700f0f",dark:"#700f0f"},colorStatusBaseLv3:{light:"#fffbe8",dark:"#fffbe8"},colorStatusFillLv3:{light:"#e6c016",dark:"#e6c016"},colorStatusTextLv3:{light:"#806b0c",dark:"#806b0c"},colorStatusBaseComplete:{light:"#e9faf9",dark:"#e9faf9"},colorStatusFillComplete:{light:"#1cb7ad",dark:"#1cb7ad"},colorStatusTextComplete:{light:"#106660",dark:"#106660"},colorStatusBaseInformation:{light:"#e0f1ff",dark:"#e0f1ff"},colorStatusFillInformation:{light:"#1566a7",dark:"#1875c0"},colorStatusTextInformation:{light:"#0c3557",dark:"#0c3557"},colorWarningBorder:{light:"#1f1f20",dark:"#ffffff"},colorWarningBorderInner:{light:"#ffffff",dark:"#ffffff"},colorWarningLabelLow:{light:"#000000",dark:"#000000"},colorWarningLabelHigh:{light:"#ffffff",dark:"#ffffff"},colorWarningLevel1:{light:"#ffffff",dark:"#ffffff"},colorWarningLevel2:{light:"#f2e700",dark:"#f2e700"},colorWarningCaution:{light:"#e67225",dark:"#e67225"},colorWarningLevel3:{light:"#ea1605",dark:"#ea1605"},colorWarningLevel4:{light:"#aa00aa",dark:"#aa00aa"},colorWarningLevel5:{light:"#0c000c",dark:"#0c000c"},colorCallout01Background:{light:"#e0f1ff",dark:"#0c3557"},colorCallout02Background:{light:"#fff4e6",dark:"#7f4605"},colorCallout03Background:{light:"#e9faf9",dark:"#106660"},colorCallout04Background:{light:"#fce9e9",dark:"#700f0f"},colorCallout05Background:{light:"#e6f2ee",dark:"#003d29"},colorCallout06Background:{light:"#f0e9fa",dark:"#350f66"},colorBreakingnewsBackground:{light:"#757577",dark:"#313132"},colorButtonSubBackgroundcolorDefault:{light:"#f9f9f9",dark:"#1f1f20"},colorButtonSubBackgroundcolorActive:{light:"#f2f2f3",dark:"#414143"},colorButtonSubBackgroundcolorHover:{light:"#ffffff",dark:"#000000"},colorIconBreakingnews:{light:"#c91b1b",dark:"#e53f3f"},colorGnaviCurrentBackground:{light:"#e2e2e3",dark:"#606061"},colorErpcScrem:{light:"#ffffff",dark:"#000000"},colorSpinnerStart:{light:"#ffffff",dark:"#ffffff"},colorSpinnerEnd:{light:"#414143",dark:"#414143"},colorSkeletonloaderObject:{light:"linear-gradient(90deg, rgba(249, 249, 249, 1) 0%, rgba(242, 242, 243, 1) 100%)",dark:"linear-gradient(90deg, rgba(31, 31, 32, 1) 0%, rgba(49, 49, 50, 1) 100%)"},colorIconOnfillBackgroundPrimary:{light:"#ffffff",dark:"#ffffff"},colorIconOnfillBackgroundSecondary:{light:"#e2e2e3",dark:"#e2e2e3"},colorBorderProgressbar:{light:"#ffffff",dark:"#000000"},colorLocallabelVariant01:{light:"#f9f9f9",dark:"#f9f9f9"},colorLocallabelBorderVariant01:{light:"#909091",dark:"#909091"},colorStrengthbarBackground:{light:"#e2e2e3",dark:"#606061"},colorStrengthbarDivider:{light:"#909091",dark:"#ffffff"},colorStrengthbarDividerActive:{light:"rgba(255, 255, 255, 0)",dark:"#ffffff"},colorStrengthbarWeak:{light:"#c91b1b",dark:"#c91b1b"},colorStrengthbarContentWeak:{light:"#c91b1b",dark:"#ef8f8f"},colorStrengthbarStrong:{light:"#19a29a",dark:"#19a29a"},colorStrengthbarContentStrong:{light:"#106660",dark:"#35d0c6"}},Qo="calc(0.625rem * (var(--font-size-scale-factor, 1)))",tn="calc(0.75rem * (var(--font-size-scale-factor, 1)))",en="calc(0.875rem * (var(--font-size-scale-factor, 1)))",rn="calc(1rem * (var(--font-size-scale-factor, 1)))",on="calc(1.125rem * (var(--font-size-scale-factor, 1)))",nn="calc(1.25rem * (var(--font-size-scale-factor, 1)))",sn="calc(1.375rem * (var(--font-size-scale-factor, 1)))",ln="calc(1.125rem * (var(--font-size-scale-factor, 1)))",an="1",cn="1.25",hn="1.5",dn="1.75",un="8px",pn="4px",gn="8px",fn="12px",mn="16px",_n="20px",bn="24px",yn="28px",vn="48px",wn=t=>{const{href:e,target:r}=t;if(!e)return{};const i="_blank"===r;try{const t=new URL(e).hostname;return t.endsWith(".nhk")||t.endsWith(".nhk.or.jp")||t.endsWith(".nhk.jp")&&!t.endsWith("plus.nhk.jp")?{...i&&{target:"_blank",rel:"noopener"},icon:i?"BlankIcon":"ChevronRightIcon"}:"plus.nhk.jp"===t||"www.nhk-ondemand.jp"===t||"www.nhk-cs.jp"===t?{target:"_blank",rel:"noopener",icon:"BlankIcon"}:{target:"_blank",rel:"noreferrer noopener",icon:"BlankIcon",message:"※NHKサイトを離れます"}}catch{return{...i&&{target:"_blank",rel:"noopener"},icon:i?"BlankIcon":"ChevronRightIcon"}}};var Cn="var(--lightColor__pknme60)",kn="var(--darkColor__pknme61)",Sn="LinkRenderer_link__pknme62",$n="LinkRenderer_content__pknme63";const xn=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"containerRef",re(null)),__publicField(this,"handleClick",t=>{var e,r;null==(r=null==(e=this.props)?void 0:e.onClick)||r.call(e,t)})}render(t,e){const{_fallbackTag:r="div",attributes:i,color:o,href:n,className:s,children:l,customStyles:a,ref:c,onClick:h,...d}=t;this.props=t,c&&(c.current=this);const u="string"==typeof o?{light:o,dark:o}:o,p={customStyles:a,className:di(s,n?Sn:$n),style:qt({[Cn]:u.light,[kn]:u.dark}),children:l},g={},f={};i&&Array.from(i).forEach(t=>{"style"===t.name?t.value.split(";").forEach(t=>{const[e,r]=t.split(":"),i=null==e?void 0:e.trim(),o=null==r?void 0:r.trim();i&&o&&(f[i]=o)}):g[t.name]=t.value});const m=yo(n?{as:"a",href:n,...d,...p,containerRef:this.containerRef}:{as:r,...d,...p,containerRef:this.containerRef});return Object.entries(f).forEach(([t,e])=>{m&&m.style&&m.style.setProperty(t,e)}),this.props.onClick&&oe({click:this.handleClick},m),this.root=m,null==e||e.replaceWith(m),this.root}update(t){if(!this.root||!this.props||!this.containerRef.current)return;const e={...this.props,...t},r=e.href?di(e.className,Sn):di(e.className,$n),i=e.customStyles,o=e.children,n={containerRef:this.containerRef,customStyles:i,className:e.href?di(r,Sn):di(r,$n),children:o};e.href?this.containerRef.current.update({as:"a",href:e.href,...n,containerRef:this.containerRef}):this.containerRef.current.update({as:e._fallbackTag,...n,containerRef:this.containerRef}),e.onClick?oe({click:this.handleClick},this.root):function(t,e){for(const[r,i]of Object.entries(t))i&&e.removeEventListener(r,i)}({click:this.handleClick},this.root),this.props=e}});const En=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{link:r,_isAlert:i,_roundFull:o,_isFixedFontSize:n,ariaLabel:s,color:l,disabled:a,disabledMessage:c,fullWidth:h,hideLinkIcon:d,leftIcon:u,linkType:p,size:g="M",weight:f,customStyles:m,children:_}=t;this.props=t;const b=wn(r),y="string"==typeof l?{light:l,dark:l}:l,v=!a&&b.message,w=a&&c,C=vo(g),k=(()=>{if(i&&"primary"===p)return Yo.colorTextOnfillPrimary;return y??("primary"===p?Yo.colorTextLayer:Yo.colorTextPrimary)})(),S=yo({as:"div",customStyles:m,className:"PrimaryOrSecondary_container__1u0etpb5",style:qt({[No]:null==y?void 0:y.light,[Zo]:null==y?void 0:y.dark,[Oo]:f,[Do]:wo(h).desktop,[Ho]:wo(h).mobile}),children:[xn({...!a&&{...r},...s&&{"aria-label":s},...a&&{role:"link","aria-disabled":!0,tabIndex:0},className:di(r.className,"PrimaryOrSecondary_link__1u0etpb6",o&&"PrimaryOrSecondary_roundFull__1u0etpb7",Xo[i&&"primary"===p?"primaryAlert":p],jo[C.desktop],Uo[C.mobile],n?[Wo[C.desktop],Jo[C.mobile]]:[qo[C.desktop],Vo[C.mobile]],a?"PrimaryOrSecondary_disabledOpacity__1u0etpb8":Go[i&&"primary"===p?"primaryAlert":p]),color:k,...!a&&b.target&&{target:b.target},...!a&&b.rel&&{rel:b.rel},onClick:t=>{var e;if(a)return t.preventDefault(),void t.stopPropagation();null==(e=null==r?void 0:r.onClick)||e.call(r,t)},children:ee`<template>
${u&&ee`<i class="${Ko}">${Kr({name:u})}</i>`}${_}
${!d&&b.icon&&ee`<i class="${Ko}">${Kr({name:b.icon})}</i>`}
</template>`}),w&&ee`<span class="${di("PrimaryOrSecondary_disabledMessage__1u0etpb1e",n?"PrimaryOrSecondary_disabledMessageFixedFontSize__1u0etpb1g":"PrimaryOrSecondary_disabledMessageFontSize__1u0etpb1f")}"
>${c}</span
>`,v&&ee`<span class="${di("PrimaryOrSecondary_message__1u0etpb1b",n?"PrimaryOrSecondary_messageFixedFontSize__1u0etpb1d":"PrimaryOrSecondary_messageFontSize__1u0etpb1c")}">${b.message}</span>`]});return e&&e.replaceWith(S),this.root=S,S}});var In="var(--lightColorProps__3dwnnq0)",An="var(--darkColorProps__3dwnnq1)",Mn="var(--fontWeight__3dwnnq2)",Tn="var(--desktopMargin__3dwnnq3)",Ln="var(--mobileMargin__3dwnnq4)",zn={XS:"Tertiary_desktopFontSize_XS__3dwnnq8",S:"Tertiary_desktopFontSize_S__3dwnnq9",M:"Tertiary_desktopFontSize_M__3dwnnqa",L:"Tertiary_desktopFontSize_L__3dwnnqb",XL:"Tertiary_desktopFontSize_XL__3dwnnqc"},Pn={XS:"Tertiary_desktopFixedFontSize_XS__3dwnnqd",S:"Tertiary_desktopFixedFontSize_S__3dwnnqe",M:"Tertiary_desktopFixedFontSize_M__3dwnnqf",L:"Tertiary_desktopFixedFontSize_L__3dwnnqg",XL:"Tertiary_desktopFixedFontSize_XL__3dwnnqh"},Bn={XS:"Tertiary_mobileFontSize_XS__3dwnnqi",S:"Tertiary_mobileFontSize_S__3dwnnqj",M:"Tertiary_mobileFontSize_M__3dwnnqk",L:"Tertiary_mobileFontSize_L__3dwnnql",XL:"Tertiary_mobileFontSize_XL__3dwnnqm"},Fn={XS:"Tertiary_mobileFixedFontSize_XS__3dwnnqn",S:"Tertiary_mobileFixedFontSize_S__3dwnnqo",M:"Tertiary_mobileFixedFontSize_M__3dwnnqp",L:"Tertiary_mobileFixedFontSize_L__3dwnnqq",XL:"Tertiary_mobileFixedFontSize_XL__3dwnnqr"};const Rn=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{_isFixedFontSize:r,link:i,ariaLabel:o,color:n,disabled:s,disabledMessage:l,hideLinkIcon:a,leftIcon:c,removeBreak:h,size:d="M",weight:u,customStyles:p,children:g}=t;this.props=t;const f=wn(i),m="string"==typeof n?{light:n,dark:n}:n,_=!s&&f.message&&!h,b=s&&l,y=vo(d),v=yo({as:"span",customStyles:p,style:qt({[In]:null==m?void 0:m.light,[An]:null==m?void 0:m.dark,[Mn]:u,[Tn]:"XS"===y.desktop||"S"===y.desktop?"2px":pn,[Ln]:"XS"===y.mobile||"S"===y.mobile?"2px":pn}),children:[xn({_fallbackTag:"span",...!s&&{...i},...o&&{"aria-label":o},...s&&{role:"link","aria-disabled":!0,tabIndex:0},className:di(i.className,"Tertiary_link__3dwnnq5",r?[Pn[y.desktop],Fn[y.mobile]]:[zn[y.desktop],Bn[y.mobile]],s?"Tertiary_disabledOpacity__3dwnnq7":"Tertiary_hover__3dwnnq6"),color:"currentColor",...!s&&f.target&&{target:f.target},...!s&&f.rel&&{rel:f.rel},onClick:t=>{var e;if(s)return t.preventDefault(),void t.stopPropagation();null==(e=null==i?void 0:i.onClick)||e.call(i,t)},children:[c&&ee`<i class="${"Tertiary_leftIcon__3dwnnqs"}">${Kr({name:c})}</i>`,...Array.isArray(g)?g:[g],f.message&&h&&`(${f.message})`,!a&&f.icon&&ee`<i class="${"Tertiary_rightIcon__3dwnnqt"}">${Kr({name:f.icon})}</i>`]}),b&&ee`<span class="${di("Tertiary_disabledMessage__3dwnnqx",r?"Tertiary_disabledMessageFixedFontSize__3dwnnqz":"Tertiary_disabledMessageFontSize__3dwnnqy")}">
${l}
</span>`,_&&ee`<span class="${di("Tertiary_message__3dwnnqu",r?"Tertiary_messageFixedFontSize__3dwnnqw":"Tertiary_messageFontSize__3dwnnqv")}">${f.message}</span>`]});return e&&e.replaceWith(v),this.root=v,v}});const Nn=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{linkType:r="tertiary",ref:i}=t;this.props=t,i&&(i.current=this);const o="tertiary"===r?Rn({...t}):En({...t,linkType:r});return e&&e.replaceWith(o),this.root=o,o}update(t){this.root&&this.props&&this.render({...this.props,...t},this.root)}remove(){this.root&&(this.root.remove(),this.root=null)}});var Zn="var(--direction_desktop__22jqbj0)",On="var(--direction_mobile__22jqbj1)",Dn="var(--justify_desktop__22jqbj2)",Hn="var(--justify_mobile__22jqbj3)",jn="var(--align_desktop__22jqbj4)",Un="var(--align_mobile__22jqbj5)",qn="var(--spacing_desktop__22jqbj6)",Wn="var(--spacing_mobile__22jqbj7)",Vn="var(--wrap__22jqbj8)",Jn="var(--width_desktop__uif8ay0)",Xn="var(--width_mobile__uif8ay1)",Gn="var(--height_desktop__uif8ay2)",Kn="var(--height_mobile__uif8ay3)",Yn="var(--margin_desktop__uif8ay4)",Qn="var(--margin_mobile__uif8ay5)",ts="var(--lightBorderTop_desktop__uif8ay6)",es="var(--lightBorderTop_mobile__uif8ay7)",rs="var(--darkBorderTop_desktop__uif8ay8)",is="var(--darkBorderTop_mobile__uif8ay9)",os="var(--lightBorderRight_desktop__uif8aya)",ns="var(--lightBorderRight_mobile__uif8ayb)",ss="var(--darkBorderRight_desktop__uif8ayc)",ls="var(--darkBorderRight_mobile__uif8ayd)";const as=t=>"horizontal"===t,cs=(t,e,r)=>{const i=as(t.desktop),o=as(t.mobile);return{desktop:"width"===r?i?e?"calc(100% - 10%)":"100%":"0px":i?"0px":e?"calc(100% - 10%)":"100%",mobile:"width"===r?o?e?"calc(100% - 10%)":"100%":"0px":o?"0px":e?"calc(100% - 10%)":"100%"}};const hs=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}generateStyles(t){const{orientation:e,shape:r,inset:i,color:o}=t,n="object"==typeof e?{desktop:e.desktop??"horizontal",mobile:e.mobile??"horizontal"}:{desktop:e,mobile:e},s=cs(n,i,"width"),l=cs(n,i,"height"),a=((t,e)=>{const r=as(t.desktop),i=as(t.mobile);return e?{desktop:r?"0 5%":"5% 0",mobile:i?"0 5%":"5% 0"}:{desktop:"0",mobile:"0"}})(n,i),c=((t,e,r)=>{const i=`1px ${e} ${r.light}`,o=`1px ${e} ${r.dark}`,n=as(t.desktop),s=as(t.mobile);return{top:{light:{desktop:n?i:"none",mobile:s?i:"none"},dark:{desktop:n?o:"none",mobile:s?o:"none"}},right:{light:{desktop:n?"none":i,mobile:s?"none":i},dark:{desktop:n?"none":o,mobile:s?"none":o}}}})(n,r,"string"==typeof o?{light:o,dark:o}:o);return qt({[Jn]:s.desktop,[Xn]:s.mobile,[Gn]:l.desktop,[Kn]:l.mobile,[Yn]:a.desktop,[Qn]:a.mobile,[ts]:c.top.light.desktop,[es]:c.top.light.mobile,[rs]:c.top.dark.desktop,[is]:c.top.dark.mobile,[os]:c.right.light.desktop,[ns]:c.right.light.mobile,[ss]:c.right.dark.desktop,[ls]:c.right.dark.mobile})}normalizeProps(t){const e=t.shape??"solid";return{...t,orientation:t.orientation??"horizontal",shape:e,inset:t.inset??!1,color:t.color??("solid"===e?Yo.colorDividerSecondary:Yo.colorBorder)}}render(t,e){const r=this.normalizeProps(t),{orientation:i,shape:o,inset:n,color:s,ref:l,customStyles:a}=r;this.props=r,l&&(l.current=this);const c=yo({as:"hr",customStyles:a,className:"Divider_container__uif8aye",style:this.generateStyles({...t,orientation:i,shape:o,inset:n,color:s})});return this.root=c,e&&e.replaceWith(c),c}update(t){if(!this.root||!this.props)return;const e=this.normalizeProps({...this.props,...t});Vt(this.root,this.generateStyles(e)),this.props=e}}),ds=t=>"object"==typeof t,us=t=>t.includes("column")?"horizontal":"vertical",ps=t=>{if("string"==typeof t){if("string"==typeof(e=t)&&ii.includes(e))return Qr[t]-.5+"px";const r=Number(t.split("px")[0]);return Number.isNaN(r)?"23.5px":r-.5+"px"}var e;return t-.5+"px"},gs=(t,e)=>{const{desktop:r,mobile:i}=(t=>"object"==typeof t?{desktop:ri(t.desktop),mobile:ri(t.mobile)}:ni(t)?{desktop:oi[t].desktop,mobile:oi[t].mobile}:{desktop:ri(t),mobile:ri(t)})(ds(t)?{desktop:t.desktop??"spacingObjectPc",mobile:t.mobile??"spacingObjectSp"}:t);return e?{desktop:ps(r),mobile:ps(i)}:{desktop:r,mobile:i}};const fs=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}normalizeProps(t){return{...t,align:t.align??"stretch",direction:t.direction??"column",justify:t.justify??"start",spacing:t.spacing??"object",tag:t.tag??"div",wrap:t.wrap??"nowrap"}}render(t,e){const{children:r,direction:i,justify:o,align:n,wrap:s,tag:l,spacing:a,divider:c,customStyles:h}=this.normalizeProps(t),d=ds(i)?{desktop:i.desktop??"column",mobile:i.mobile??"column"}:{desktop:i,mobile:i},u=ds(o)?{desktop:o.desktop??"start",mobile:o.mobile??"start"}:{desktop:o,mobile:o},p=ds(n)?{desktop:n.desktop??"stretch",mobile:n.mobile??"stretch"}:{desktop:n,mobile:n},g=gs(a,!!c),f=yo({as:l,customStyles:h,className:"Stack_container__22jqbj9",style:qt({[Vn]:s,[Zn]:d.desktop,[On]:d.mobile,[Dn]:u.desktop,[Hn]:u.mobile,[jn]:p.desktop,[Un]:p.mobile,[qn]:g.desktop,[Wn]:g.mobile}),children:ee`<template>
${c&&Array.isArray(r)?Array.from(r).flatMap((t,e)=>{if(e===r.length-1||t instanceof Comment||t instanceof Text&&(!t.textContent||""===t.textContent.replace(/[\n\r\s]/g,"").trim()))return[t];const i={desktop:us(d.desktop),mobile:us(d.mobile)};return[t,hs({...c,orientation:i,customStyles:{height:"auto"}})]}):r}
</template>`});return this.root=f,e&&e.replaceWith(f),f}update(t){const e=this.normalizeProps({...this.props,...t});this.root&&this.render(e,this.root)}});class ms extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"refs",{linkTextRef:re(null)})}render(t,e){const{title:r,type:i,buttonList:o,description:n,link:s,linkText:l,onClose:a,open:c,_hideCloseButton:h,customStyles:d,ref:u}=t;if(u&&(u.current=this),this.props=t,!c)return e&&e.remove(),null;const p=s&&l&&ee`<div class="${"Notification_linkContainer__1to2e2ja"}">${Nn({link:s,ref:this.refs.linkTextRef,children:l})}</div>`,g=o&&!!o.length&&ee`<div class="${"Notification_buttonContainer__1to2e2jf"}">
${o.map(t=>oe({click:t.onClick},ee`<button type="button" class="${di("Notification_button__1to2e2jb",Ro[t.type||"primary"])}">${t.label}</button>`))}
</div>`,f=ee`<template>
<div class="${"Notification_screenReaderOnly__1to2e2j3"}">${{information:"お知らせ",warning:"警告",danger:"エラー"}[i]}</div>
${fs({direction:"row",spacing:"spacingBase",justify:"space-between",align:"flex-start",children:ee`<template>
<div class="${Fo[t.type]}">
${m=i,"information"===m?ir({size:"20px"}):Wr({size:"22px"})}
<span class="${"Notification_title__1to2e2j7"}">${r}</span>
</div>
${!h&&"danger"!==i&&oe({click:a},ee`<button type="button" class="${"Notification_closeButton__1to2e2j8"}">${Ke({size:18})}<span>閉じる</span></button>`)}
</template>`})}
<span class="${"Notification_description__1to2e2j9"}">${n}</span>
${p} ${g}
</template>`;var m;const _=yo({as:"div",customStyles:d,role:"information"===i?"status":"alert",className:Bo[i],children:f});return _.setAttribute("aria-live","polite"),e&&e.replaceWith(_),this.root=_,_}update(t){this.root&&this.props&&this.render({...this.props,...t},this.root)}}var _s={success:"Snackbar_container_success__1jony1o3",error:"Snackbar_container_error__1jony1o4",information:"Snackbar_container_information__1jony1o5"},bs={success:"Snackbar_titleText_success__1jony1o8",error:"Snackbar_titleText_error__1jony1o9",information:"Snackbar_titleText_information__1jony1oa"},ys={true:"Snackbar_show_true__1jony1oc",false:"Snackbar_show_false__1jony1od"},vs="Snackbar_screenReaderOnly__1jony1oe";class ws extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"abortController",new AbortController)}get element(){return this.root}render(t,e){const{title:r,type:i,description:o,onClose:n,open:s,autoClose:l,autoCloseDuration:a=10,customStyles:c,ref:h}=t;if(h&&(h.current=this),this.props=t,!s)return e&&e.remove(),h&&(h.current=null),null;const d=t=>{"Escape"===t.key&&"error"!==i&&(t.preventDefault(),n())},[u,p]=ae("");let g=null,f=null;const m=t=>({success:"完了",information:"お知らせ",error:"エラー"}[t]);s&&(p(""),g=setTimeout(()=>{p(`${m(i)} ${r} ${o?" "+o:""}`)},170)),s&&l&&(f=setTimeout(()=>{n()},1e3*a));const _=ee`<div role=${"error"===i?"alert":"status"} aria-live="polite" class="${vs}">
${de({liveContent:u},({liveContent:t})=>ee`<span>${t}</span>`)}
</div>`,b=yo({as:"div",customStyles:c,className:di(_s[i],ys[s?"true":"false"],this.root&&"Snackbar_noAnimation__1jony1o6"),customDataAttribute:{"data-testid":`nhk-snackbar-${i}`},children:[ee`<div class="${vs}">${m(i)}</div>`,fs({spacing:"NONE",direction:"row",children:[ee`<div class="${bs[i]}"><span class="${"Snackbar_icon__1jony1o2"}">${y=i,"success"===y?De({size:"22px"}):"error"===y?Wr({size:"22px"}):cr({size:"22px"})}</span>${r}</div>`,oe({click:n},ee`<button type="button" class="${"Snackbar_button__1jony1o0"}">${Ke({size:ln})}閉じる</button>`)]}),o&&ee`<span class="${"Snackbar_descriptionText__1jony1ob"}">${o}</span>`]});var y;return e&&e.replaceWith(b),_e(b,this.abortController.signal).then(()=>{if(b.before(_),s&&"error"!==i)return document.addEventListener("keydown",d)}),be(b,this.abortController.signal).then(()=>{}).catch(()=>{}).finally(()=>{_.remove(),document.removeEventListener("keydown",d),g&&clearTimeout(g),f&&(clearTimeout(f),f=null)}),this.root=b,b}update(t){this.root&&this.props&&this.render({...this.props,...t},this.root)}dispose(){var t;this.root&&(this.root.remove(),this.root=null),(null==(t=this.props)?void 0:t.ref)&&(this.props.ref.current=null),this.abortController.abort()}}const Cs=Qt(ws);const ks=()=>(t=>{const e=getComputedStyle(t).overflowY.split(" ").find(t=>["auto","scroll"].includes(t)),r=t.scrollHeight>t.clientHeight;return Boolean(e&&r)})(document.body)?document.body:document.documentElement,Ss=t=>{const e=ue({target:t},({target:t})=>(t=>{const e=ks(),r=(r=document.activeElement)=>{const i=null==t?void 0:t.contains(r),o=null==t?void 0:t.getBoundingClientRect().height,n=t&&r&&(null==t?void 0:t.compareDocumentPosition(r))&Node.DOCUMENT_POSITION_FOLLOWING;e.style.scrollPaddingBottom=!o||i||n?"":`${o+12}px`};r();const i=new ResizeObserver(()=>r());t&&i.observe(t);const o=t=>{r(t.target instanceof Node?t.target:document.activeElement)},n=t=>{r(t.relatedTarget instanceof Node?t.relatedTarget:document.activeElement)},s=t=>{1&t.buttons&&r(t.target instanceof Node?t.target:document.activeElement)};return document.addEventListener("focusin",o),document.addEventListener("focusout",n),document.addEventListener("pointermove",s),()=>{e.style.scrollPaddingBottom="",i.disconnect(),document.removeEventListener("focusin",o),document.removeEventListener("focusout",n),document.removeEventListener("pointermove",s)}})(t));return be(t).then(e.dispose),e};const $s={erpc:{startService:{key:"ctu",value:"in"},exit:{key:"ctu",value:"out"}},registrationEnforcement:{category1Register:{key:"refm",value:"1-modal-register"},category1Login:{key:"refm",value:"1-modal-login"},category2Register:{key:"refm",value:"2-modal-register"},category2Login:{key:"refm",value:"2-modal-login"},category2BannerRegister:{key:"refm",value:"2-banner-register"}}};var xs={left:"styles_textAlign_left__usy41h5",center:"styles_textAlign_center__usy41h6",right:"styles_textAlign_right__usy41h7"},Es={normal:"styles_fontWeight_normal__usy41h8",bold:"styles_fontWeight_bold__usy41h9"},Is="var(--lightColor__1frl8cc0)",As="var(--darkColor__1frl8cc1)",Ms="var(--whiteSpace__1frl8cc2)",Ts="var(--lineHeight__1frl8cc3)",Ls="var(--desktopFontSize__1frl8cc4)",zs="var(--mobileFontSize__1frl8cc5)";const Ps={none:an,heading:cn,text:hn,article:dn},Bs={XXS:Qo,XS:tn,S:en,M:rn,L:on,XL:nn,XXL:sn};const Fs=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}normalizeProps(t){return{...t,color:t.color??Yo.colorTextPrimary,lineHeight:t.lineHeight??"text",size:t.size??"M",tag:t.tag??"p",whiteSpace:t.whiteSpace??"normal"}}render(t,e){const r=this.normalizeProps(t),{align:i,ariaLevel:o,color:n,id:s,lineHeight:l,showStrikeThrough:a,size:c,tag:h,weight:d,whiteSpace:u,children:p,customStyles:g}=r,f="string"==typeof n?{light:n,dark:n}:n,m=yo({as:h,customStyles:g,...s&&{id:s},className:di("Text_container__1frl8cc6",i&&xs[i],d&&Es[d],a&&"Text_strikeThrough__1frl8cc7"),style:qt({[Is]:null==f?void 0:f.light,[As]:null==f?void 0:f.dark,[Ms]:u,[Ts]:Ps[l],[Ls]:Bs["string"==typeof c?c:c.desktop||"M"],[zs]:Bs["string"==typeof c?c:c.mobile||"M"]}),children:p});return o&&"p"===h&&(m.setAttribute("aria-level",o.toString()),m.setAttribute("role","heading")),e&&e.replaceWith(m),m}update(t){const e=this.normalizeProps({...this.props,...t});this.root&&this.render(e,this.root)}}),Rs="",Ns="",Zs="",Os="",Ds={introText:"すでに受信契約を締結されている場合は、別途のご契約や追加のご負担は必要ありません。受信契約を締結されていない方がご利用された場合は、ご契約の手続きをお願いします。\n事業や学校でのご利用の場合は、下記のリンクを確認してください。",infoLinkUrl:"https://www.nhk.or.jp/nhkone/how-to-use/article/J001-0001/",exitUrl:"https://www.nhk.or.jp",selectionGuideText:"「用途」に合わせて、該当のボタンをお選びください。また、お住まいの地域の番組・情報をお届けするために、「地域（放送局）の選択」をお願いします。"},Hs={lastText:"すでに受信契約を締結されている場合は、別途のご契約や追加のご負担は必要ありません。受信契約を締結されていない方がご利用された場合は、ご契約の手続きをお願いします。"},js={lastText:"ご利用状況によっては追加でご負担が必要になる場合があります。詳しくは「事業での利用について詳しく見る」のリンクを確認してください。",infoLinkUrl:"https://www.nhk.or.jp/nhkone/how-to-use/article/B001-0001/"},Us={lastText:"ご利用状況によっては追加でご負担が必要になる場合があります。詳しくは「学校での利用について詳しく見る」のリンクを確認してください。",infoLinkUrl:"https://www.nhk.or.jp/nhkone/how-to-use/article/S001-0001/"},qs={message:"緊急時のため、命を守る情報をみなさまに広くお伝えしています。",additionalText:"緊急時につき受信契約の必要なくご利用いただけます。通常時でもサービスをご利用になりたい方は下記を確認してください。"},Ws={japaneseText:"このサービスは日本国内向けのサービスのため、海外からの利用は一部制限されます。文字情報は閲覧できますが、動画は視聴できない場合があります。",englishText:"This website is intended for viewing in Japan. Some texts and videos may be restricted when accessed from outside of Japan."},Vs=(t={})=>{const{onChange:e}=t,r=()=>{var t,e,r,i,o,n,s,l,a,c,h,d,u,p,g,f,m;const _=(null==(e=null==(t=window.nhkLib)?void 0:t.consentToUseDataProvider)?void 0:e.consentToUseData)??null;return{consentToUseData:{createdAt:(null==_?void 0:_.createdAt)||Rs,updatedAt:(null==_?void 0:_.updatedAt)||Ns,publishedAt:(null==_?void 0:_.publishedAt)||Zs,revisedAt:(null==_?void 0:_.revisedAt)||Os,common:{introText:(null==(r=null==_?void 0:_.common)?void 0:r.introText)||Ds.introText,infoLinkUrl:(null==(i=null==_?void 0:_.common)?void 0:i.infoLinkUrl)||Ds.infoLinkUrl,exitUrl:(null==(o=null==_?void 0:_.common)?void 0:o.exitUrl)||Ds.exitUrl,selectionGuideText:(null==(n=null==_?void 0:_.common)?void 0:n.selectionGuideText)||Ds.selectionGuideText},household:{lastText:(null==(s=null==_?void 0:_.household)?void 0:s.lastText)||Hs.lastText},business:{lastText:(null==(l=null==_?void 0:_.business)?void 0:l.lastText)||js.lastText,infoLinkUrl:(null==(a=null==_?void 0:_.business)?void 0:a.infoLinkUrl)||js.infoLinkUrl},school:{lastText:(null==(c=null==_?void 0:_.school)?void 0:c.lastText)||Us.lastText,infoLinkUrl:(null==(h=null==_?void 0:_.school)?void 0:h.infoLinkUrl)||Us.infoLinkUrl},emergency:{message:(null==(d=null==_?void 0:_.emergency)?void 0:d.message)||qs.message,additionalText:(null==(u=null==_?void 0:_.emergency)?void 0:u.additionalText)||qs.additionalText},abroad:{japaneseText:(null==(p=null==_?void 0:_.abroad)?void 0:p.japaneseText)||Ws.japaneseText,englishText:(null==(g=null==_?void 0:_.abroad)?void 0:g.englishText)||Ws.englishText}},initialized:(null==(m=null==(f=window.nhkLib)?void 0:f.consentToUseDataProvider)?void 0:m.initialized)??!1}},i=e?()=>e(r()):null;return i&&window.addEventListener(kt.consentToUseDataChange,i),{current:r(),dispose:()=>{i&&window.removeEventListener(kt.consentToUseDataChange,i)}}},Js=(t={})=>{var e;const{onChange:r}=t,i={current:(null==(e=window.nhkLib)?void 0:e.opsManagementSystem)??null,dispose:()=>{o&&window.removeEventListener(kt.opsManagementChange,o)}},o=r?()=>{var t;const e=null==(t=window.nhkLib)?void 0:t.opsManagementSystem;e&&(i.current=e,r(e))}:null;return o&&(window.addEventListener(kt.opsManagementChange,o),setTimeout(o)),i};var Xs="var(--width_desktop__g5usuh0)",Gs="var(--width_mobile__g5usuh1)",Ks={XS:"AccentButton_desktopSize_XS__g5usuh3",S:"AccentButton_desktopSize_S__g5usuh4",M:"AccentButton_desktopSize_M__g5usuh5",L:"AccentButton_desktopSize_L__g5usuh6",XL:"AccentButton_desktopSize_XL__g5usuh7"},Ys={XS:"AccentButton_mobileSize_XS__g5usuh8",S:"AccentButton_mobileSize_S__g5usuh9",M:"AccentButton_mobileSize_M__g5usuha",L:"AccentButton_mobileSize_L__g5usuhb",XL:"AccentButton_mobileSize_XL__g5usuhc"},Qs={primary:"AccentButton_buttonType_primary__g5usuhd",primaryAlert:"AccentButton_buttonType_primaryAlert__g5usuhe",secondary:"AccentButton_buttonType_secondary__g5usuhf",secondaryAlert:"AccentButton_buttonType_secondaryAlert__g5usuhg"},tl="AccentButton_icon__g5usuhh",el="AccentButton_disabledMessage__g5usuhi";const rl=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"props",null),__publicField(this,"buttonElement",null),__publicField(this,"disabledMessageElement",null),__publicField(this,"addDefaultValues",t=>({...t,buttonType:t.buttonType??"primary",size:t.size??"M",type:t.type??"button"})),__publicField(this,"refs",{containerRef:re(null)}),__publicField(this,"handleClick",t=>{var e,r;null==(r=null==(e=this.props)?void 0:e.onClick)||r.call(e,t)})}render(t,e){this.props=this.addDefaultValues(t);const{ariaControls:r,ariaExpanded:i,ariaLabel:o,buttonType:n,disabled:s,disabledMessage:l,fullWidth:a,isAlert:c,leftIcon:h,rightIcon:d,size:u,type:p,children:g,customStyles:f,ref:m}=this.props,_=vo(u);m&&(m.current=this);const b=yo({customStyles:f,as:"button",className:`AccentButton_button__g5usuh2 ${Ks[_.desktop]} ${Ys[_.mobile]} ${Qs[c?`${n}Alert`:n]}`,...s?{disabled:!0}:{},type:p,style:qt({[Xs]:wo(a).desktop,[Gs]:wo(a).mobile}),children:ee`<template>
${h&&ee`<i class="${tl}">${Kr({name:h})}</i>`} ${g}
${d&&ee`<i class="${tl}">${Kr({name:d})}</i>`}
</template>`});oe({click:this.handleClick},b),r&&b.setAttribute("aria-controls",r),void 0!==i&&b.setAttribute("aria-expanded",String(i)),o&&b.setAttribute("aria-label",o);const y=l&&s?[b,ee`<span class="${el}">${l}</span>`]:b;return e&&ce(e,y),this.root=y,this.buttonElement=b,y}update(t){var e,r;if(!this.root||!this.buttonElement||!this.props)return;const i=this.addDefaultValues({...this.props,...t}),o=ye(this.props,this.addDefaultValues(t));if(ve(o,"size","buttonType","isAlert","fullWidth","disabled","leftIcon","rightIcon","children","customStyles","disabledMessage")){if(o.size){const t=vo(this.props.size),e=vo(i.size);this.buttonElement.classList.remove(Ks[t.desktop]),this.buttonElement.classList.remove(Ys[t.mobile]),this.buttonElement.classList.add(Ks[e.desktop]),this.buttonElement.classList.add(Ys[e.mobile])}(o.buttonType||o.isAlert)&&(this.buttonElement.classList.remove(Qs[this.props.isAlert?`${this.props.buttonType}Alert`:this.props.buttonType]),this.buttonElement.classList.add(Qs[i.isAlert?`${i.buttonType}Alert`:i.buttonType])),o.fullWidth&&this.buttonElement.setAttribute("style",qt({[Xs]:wo(i.fullWidth).desktop,[Gs]:wo(i.fullWidth).mobile}).toString()),(o.disabled||o.disabledMessage)&&(this.buttonElement.disabled=i.disabled??!1,i.disabled&&i.disabledMessage?(this.disabledMessageElement=this.disabledMessageElement||ee`<span class="${el}"></span>`,this.disabledMessageElement.textContent=i.disabledMessage,this.buttonElement.after(this.disabledMessageElement)):(null==(e=this.disabledMessageElement)||e.remove(),this.disabledMessageElement=null)),(o.leftIcon||o.rightIcon||o.children)&&this.buttonElement.replaceChildren(...ee`<template>
${i.leftIcon&&ee`<i class="${tl}">${Kr({name:i.leftIcon})}</i>`} ${i.children}
${i.rightIcon&&ee`<i class="${tl}">${Kr({name:i.rightIcon})}</i>`}
</template>`),o.customStyles&&(null==(r=this.refs.containerRef.current)||r.update({customStyles:i.customStyles}))}else this.render({...this.props,...t},this.root);this.props={...this.props,...t}}});var il="var(--checkColor__10dygh50)",ol="var(--desktopPadding__10dygh51)",nl="var(--mobilePadding__10dygh52)",sl="var(--controlMarginVertical__10dygh53)",ll={top:"CheckboxField_container_top__10dygh57 CheckboxField_baseContainer__10dygh56",right:"CheckboxField_container_right__10dygh58 CheckboxField_baseContainer__10dygh56",bottom:"CheckboxField_container_bottom__10dygh59 CheckboxField_baseContainer__10dygh56",left:"CheckboxField_container_left__10dygh5a CheckboxField_baseContainer__10dygh56"},al={S:"CheckboxField_desktopMainText_S__10dygh5c",M:"CheckboxField_desktopMainText_M__10dygh5d",L:"CheckboxField_desktopMainText_L__10dygh5e"},cl={S:"CheckboxField_mobileMainText_S__10dygh5f",M:"CheckboxField_mobileMainText_M__10dygh5g",L:"CheckboxField_mobileMainText_L__10dygh5h"},hl={S:"CheckboxField_desktopsSubText_S__10dygh5i",M:"CheckboxField_desktopsSubText_M__10dygh5j",L:"CheckboxField_desktopsSubText_L__10dygh5k"},dl={S:"CheckboxField_mobileSubText_S__10dygh5l",M:"CheckboxField_mobileSubText_M__10dygh5m",L:"CheckboxField_mobileSubText_L__10dygh5n"};const ul={top:"center",bottom:"center",right:"flex-start",left:"flex-end"};class pl extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"refs",{input:re(null)})}render(t,e){const{description:r,size:i="M",checked:o,color:n,defaultChecked:s,disabled:l,id:a,label:c,labelPlacement:h="right",name:d,onBlur:u,onChange:p,onFocus:g,value:f,ref:m,customStyles:_}=t;m&&(m.current=this);const b="left"===h||"right"===h,y="object"==typeof i?i.desktop??"M":i,v="object"==typeof i?i.mobile??"M":i,w=yo({customStyles:_,as:"label",onclick:()=>{},className:ll[h],style:qt({[il]:n,[ol]:"L"===y||b?mn:fn,[nl]:"L"===v||b?mn:fn}),children:ee`<template>
${("top"===h||"left"===h)&&(c||r)&&fs({tag:"span",spacing:"spacingBase2",align:ul[h],children:ee`<template>
${c&&`<span class="${di(al[y],cl[v])}">${c}</span>`}
${r&&`<span class="${di(hl[y],dl[v])}">${r}</span>`}
</template>`})}
<span
class="${"CheckboxField_control__10dygh54"}"
style="${qt({[sl]:b?"0px":pn})}"
>
<span class="${"CheckboxField_checkbox__10dygh5b"}"></span>
${ie(this.refs.input,oe({blur:u,change:p,focus:g},ee`<input
type="checkbox"
class="${"CheckboxField_input__10dygh55"}"
${o&&"checked"}
${s&&"checked"}
${l?"disabled":""}
${a&&`id="${a}"`}
${d&&`name="${d}"`}
${f&&`value="${f}"`}
/>`))}
</span>
${("right"===h||"bottom"===h)&&(c||r)&&fs({tag:"span",spacing:"spacingBase2",align:ul[h],children:ee`<template>
${c&&`<span class="${di(al[y],cl[v])}">${c}</span>`}
${r&&`<span class="${di(hl[y],dl[v])}">${r}</span>`}
</template>`})}
</template>`});return e&&e.replaceWith(w),this.root=w,this.props=t,w}toggleChecked(t){this.refs.input.current&&(this.refs.input.current.checked=t)}}__publicField(pl,"defaultProps",{size:"M",labelPlacement:"right"});const gl=Qt(pl);const fl=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"refs",{checkBox:re(null),nextButton:re(null)}),__publicField(this,"render",(t,e)=>{var r;const{checked:i,exitUrl:o,onCheckedChange:n,onNext:s,ref:l}=t,{manager:a}=Mo({}).current??{},c=(null==(r=Vs({}).current)?void 0:r.consentToUseData)??null;if(l&&(l.current=this),!(null==c?void 0:c.common)||!a){const r=e??document.createElement("div");return e&&e.replaceWith(r),this.root=r,(async()=>{await Promise.all([new Promise(t=>{const e=Mo({onChange:()=>{var r;null==(r=e.dispose)||r.call(e),t()}})}),new Promise(t=>{const e=Vs({onChange:()=>{var r;null==(r=e.dispose)||r.call(e),t()}})})]),this.render(t,r)})(),r}const h=fs({spacing:{desktop:"spacingBase8",mobile:"spacingBase7"},direction:{desktop:"row",mobile:"column"},justify:{desktop:"space-between"},children:ee`<template>
<div>
${Fs({whiteSpace:"pre-wrap",customStyles:{mb:{desktop:fn,mobile:mn}},children:c.common.introText})}
${fs({align:{desktop:"flex-start",mobile:"center"},customStyles:{mb:{desktop:bn,mobile:_n}},children:Nn({link:{href:c.common.infoLinkUrl},children:"受信契約について詳しく確認する"})})}
<div class="${"Step1_sectionTitle__3jdeag1"}">ご利用いただけるサービス</div>
${fs({spacing:"spacingBase3",children:[fs({spacing:"spacingBase2",direction:"row",align:"center",children:[De({color:"#1CB7AD",size:24}),Fs({children:"放送番組の同時配信・見逃し配信"})]}),fs({spacing:"spacingBase2",direction:"row",align:"center",children:[De({color:"#1CB7AD",size:24}),Fs({children:"ニュース記事など番組関連情報の閲覧"})]})]})}
</div>
<div class="${"Step1_rightArea__3jdeag0"}">
${gl({ref:this.refs.checkBox,size:{desktop:"M",mobile:"S"},label:"内容について確認しました",checked:i,onChange:t=>{var e;return n(null==(e=t.target)?void 0:e.checked)},customStyles:{mb:gn}})}
${Fs({align:"center",color:Yo.colorTextSecondary,size:"XS",customStyles:{mb:{desktop:_n,mobile:yn}},children:"チェックをすると次に進めます"})}
<div class="${"Step1_nextButtonContainer__3jdeag2"}">
${rl({ref:this.refs.nextButton,fullWidth:!0,disabled:!i,onClick:s,children:"次へ"})}
</div>
${de({exitUrl:o},({exitUrl:t})=>ee`<template>
${fs({align:"center",customStyles:{mb:_n},children:Nn({link:{href:t},children:"サービスを利用しない"})})}
</template>`)}
${hs({customStyles:{mb:gn}})}
${fs({align:"center",children:Ao({buttonType:"tertiary",onClick:()=>{var t;return null==(t=a.loginAccount)?void 0:t.call(a)},rightIcon:"ChevronRightIcon",children:"アカウントをお持ちの方はログイン"})})}
</div>
</template>`});return e&&e.replaceWith(h),this.root=h,h}),__publicField(this,"toggleChecked",t=>{var e,r;null==(e=this.refs.checkBox.current)||e.toggleChecked(t),null==(r=this.refs.nextButton.current)||r.update({disabled:!t})})}});var ml="Step2_label__1ai23qi3",_l="var(--checkColor__l2oadq0)",bl="var(--flexDirection__l2oadq1)",yl={S:"Radio_size_S__l2oadq5",M:"Radio_size_M__l2oadq6",L:"Radio_size_L__l2oadq7"},vl={horizontal:"Radio_gap_horizontal__l2oadq8",vertical:"Radio_gap_vertical__l2oadq9"};const wl=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"refs",{input:re(null)})}render(t,e){const{checked:r,color:i,disabled:o,id:n,label:s,labelPlacement:l="right",name:a,onBlur:c,onChange:h,onFocus:d,size:u="M",value:p,ref:g,customStyles:f}=t;g&&(g.current=this);const m=yo({customStyles:f,...s?{as:"label",onclick:()=>{}}:{as:"div"},className:di("Radio_container__l2oadq4",yl[u],vl["left"===l||"right"===l?"horizontal":"vertical"]),style:qt({[bl]:{top:"column",bottom:"column",right:"row",left:"row"}[l]}),children:ee`<template>
${("top"===l||"left"===l)&&s}
<span class="${"Radio_control__l2oadq2"}">
<span class="${"Radio_radio__l2oadqa"}" style="${qt({[_l]:i})}"></span>
${ie(this.refs.input,oe({blur:c,change:h,focus:d},ee`<input
type="radio"
class="${"Radio_input__l2oadq3"}"
${r&&"checked"}
${o&&"disabled"}
${n&&`id="${n}"`}
${a&&`name="${a}"`}
${p&&`value="${p}"`}
/>`))}
</span>
${("right"===l||"bottom"===l)&&s}
</template>`});return e&&e.replaceWith(m),this.root=m,this.props=t,m}toggleChecked(t){this.refs.input.current&&(this.refs.input.current.checked=t)}});const Cl=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t){this.props=t;const{ariaHidden:e,customStyles:r}=t;return this.root=yo({as:"span",customStyles:r,"aria-hidden":e,className:"RequiredBadge_requiredBadge__kp1tr50",children:ee`<template>必須</template>`}),this.root}});var kl="var(--flexDirection__1c8l56d0)",Sl="var(--alignItems__1c8l56d1)",$l="var(--gap__1c8l56d2)",xl="var(--whitespace__1c8l56d3)",El={default:"Dropdown_container_default__1c8l56d4",compact:"Dropdown_container_compact__1c8l56d5"},Il={S:"Dropdown_fontSize_S__1c8l56d6",M:"Dropdown_fontSize_M__1c8l56d7",L:"Dropdown_fontSize_L__1c8l56d8"},Al={S:"Dropdown_compactFontSize_S__1c8l56d9",M:"Dropdown_compactFontSize_M__1c8l56da",L:"Dropdown_compactFontSize_L__1c8l56db"},Ml="var(--selectContainerOpacity__1c8l56dd)",Tl={default:"Dropdown_selectContainer_default__1c8l56de",compact:"Dropdown_selectContainer_compact__1c8l56df"},Ll="var(--compactTextWidth__1c8l56dg)",zl={default:"Dropdown_select_default__1c8l56dh",compact:"Dropdown_select_compact__1c8l56di"},Pl={default:"Dropdown_arrow_default__1c8l56dj",compact:"Dropdown_arrow_compact__1c8l56dk"};class Bl extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"props",null),__publicField(this,"refs",{containerRef:re(null),labelEl:re(null),selectEl:re(null),selectContainerEl:re(null)}),__publicField(this,"setters",{setDisabled:null,setItems:null,setSelectedItemValue:null})}render(t,e){this.props=t;const{onChange:r,id:i,size:o="M",ariaLabel:n,label:s,labelPlacement:l="left",required:a,isError:c,customStyles:h,variant:d="default",ref:u}=t;u&&(u.current=this);const[p,g]=ae(t.items),[f,m]=ae(t.selectedItemValue),[_,b]=ae(t.disabled??!1);this.setters.setItems=g,this.setters.setSelectedItemValue=m,this.setters.setDisabled=b;const y=pe({items:p},({items:t})=>t.map(t=>"items"in t?t.items:[t]).flat()),v=pe({selectedItemValue:f,flattenItems:y},({selectedItemValue:t,flattenItems:e})=>e.findIndex(e=>e.value===t)),w=pe({selectedItemIndex:v,flattenItems:y},({selectedItemIndex:t,flattenItems:e})=>{var r;return(null==(r=e[t])?void 0:r.label)??""}),[C,k]=ae(0),S=re(null);ue({selectedLabel:w},()=>{requestAnimationFrame(()=>{"compact"===d&&S.current?k(S.current.offsetWidth):k(0)})}),ue({compactTextWidth:C},({compactTextWidth:t})=>{this.refs.selectEl.current&&Vt(this.refs.selectEl.current,{[Ll]:`${t}px`}),this.refs.selectContainerEl.current&&Vt(this.refs.selectContainerEl.current,{[Ml]:t>0?"1":"0"})});const $=yo({as:s||a?"label":"div",className:di(El[d],"compact"===d?Al[o]:Il[o]),customStyles:h,containerRef:this.refs.containerRef,style:qt({[kl]:"left"===l?"row":"column",[Sl]:"left"===l?"center":"flex-start",[$l]:"left"===l?fn:gn,[xl]:"left"===l?"nowrap":"normal"}),children:ee`<template>
${(s||a)&&ie(this.refs.labelEl,ee`<span>
${s&&`<span class="Dropdown_label__1c8l56dc">${s}</span>`}${a&&Cl({ariaHidden:!0,customStyles:{ml:gn}})}
</span>`)}
${ie(this.refs.selectContainerEl,ee`<div
class="${Tl[d]}"
style="${qt({[Ml]:C.current>0?"1":"0"})}"
>
${ie(this.refs.selectEl,oe({change:t=>{if(t.target instanceof HTMLSelectElement==!1)return;const e=y.current[Number(t.target.value)];void 0!==e&&r(e.value)}},ee`<select
${i&&`id="${i}"`}
${a?"required":""}
aria-label="${s?void 0:n}"
class="${zl[d]}"
${_?"disabled":""}
aria-invalid="${c?"true":"false"}"
style="${qt({[Ll]:`${C.current}px`})}"
></select>`))}
<i class="${Pl[d]}">${Pe({})}</i>
${"compact"===d&&ie(S,ee`<span class="${di(zl[d],Al[o],"Dropdown_textForComputeWidth__1c8l56dl")}">
${de({selectedLabel:w},({selectedLabel:t})=>document.createTextNode(t))}
</span>`)}
</div>`)}
</template>`});return ue({items:p},({items:t})=>{this.refs.selectEl.current&&(this.refs.selectEl.current.replaceChildren(...function(t){const{items:e}=t;let r=0;return e.map(t=>{if("item"===t.type){const e=ee`<option value="${r}" ${t.disabled?" disabled":""}>${t.label}</option>`;return r+=1,e}{const e=ee`<optgroup label="${t.label}">
${t.items.map((t,e)=>ee`<option value="${r+e}" ${t.disabled?" disabled":""}>${t.label}</option>`)}
</optgroup>`;return r+=t.items.length,e}})}({items:t})),this.refs.selectEl.current.selectedIndex=v.current)}),ue({selectedItemIndex:v},({selectedItemIndex:t})=>{this.refs.selectEl.current&&(this.refs.selectEl.current.selectedIndex=t)}),ue({disabled:_},({disabled:t})=>{this.refs.selectEl.current&&(this.refs.selectEl.current.disabled=t)}),e&&e.replaceWith($),this.root=$,$}update(t){var e,r,i,o,n,s;if(!this.root||!this.props)return;const l={...this.props,...t};null==(r=(e=this.setters).setDisabled)||r.call(e,l.disabled??!1),null==(o=(i=this.setters).setSelectedItemValue)||o.call(i,l.selectedItemValue),null==(s=(n=this.setters).setItems)||s.call(n,l.items)}}const Fl=(t,e)=>(new Bl).render(t,e);const Rl=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"refs",{dropdownRef:re(null)})}render(t,e){const{onChange:r,_showLabel:i,defaultArea:o,hideUnselected:n,disabled:s,id:l,size:a}=t,{initialized:c,accountProfile:h,account:d}=ge(fe(Mo)[0],"initialized","accountProfile","account"),{constJson:u}=ge(fe(jt)[0],"constJson"),[p,g]=ae(!0),[f,m]=ae([]),[_,b]=ae(null),y=re(null);ue({authInitialized:c,constJson:u,accountProfile:h,account:d},({authInitialized:t,constJson:e,account:r})=>{if(e instanceof Error)return m([{label:`${Lt.prefName}(${Lt.name})`,type:"item",value:Lt}]),b(Lt),void g(!1);const i=null==e?void 0:e.area;if(!t||!i)return;const s=[];i.forEach(t=>{(()=>{const e=s.filter(t=>"group"===t.type).find(e=>e.label===t.blockName);if(e)return e;const r={type:"group",label:t.blockName,items:[]};return s.push(r),r})().items.push({type:"item",label:`${t.prefName}(${t.name})`,value:t})}),n||s.unshift({type:"item",label:"未選択です",value:null}),m(s);const l=(o&&i.find(t=>t.id===o)?o:null)??(null==r?void 0:r.responseContent.area)??(n?"130":null),a=i.find(t=>t.id===l)??null;b(a),g(!1)}),ue({value:_},({value:t})=>{t!==y.current&&(y.current=t,null==r||r(t))}),ue({isLoading:p,areaList:f,value:_,constJson:u},({isLoading:t,areaList:e,value:r,constJson:i})=>{var o;null==(o=this.refs.dropdownRef.current)||o.update({items:e,selectedItemValue:r,disabled:t||s||i instanceof Error})});const v=Fl({ref:this.refs.dropdownRef,labelPlacement:"top",label:i?"お住まいの地域(放送局)":void 0,ariaLabel:"地域選択",disabled:p.current||s||u.current instanceof Error,id:l,size:a,selectedItemValue:_.current,items:f.current,onChange:t=>null==r?void 0:r(t)});return e&&e.replaceWith(v),this.root=v,v}});const Nl=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"states",{}),__publicField(this,"render",(t,e)=>{var r;const{area:i,entity:o,exitUrl:n,onAreaChange:s,onEntityChange:l,onBack:a,onSubmit:c,ref:h}=t;this.props=t,h&&(h.current=this);const d=we(),u=`${d}-entity-label`,p=`${d}-entity-radio`,g=`${d}-area-dropdown-widget`,f=(null==(r=Vs({}).current)?void 0:r.consentToUseData)??null;if(!(null==f?void 0:f.common)){const r=e??document.createElement("div");e&&e.replaceWith(r),this.root=r;const i=Vs({onChange:()=>{var e;null==(e=i.dispose)||e.call(i),this.render(t,r)}});return r}const[m,_]=ae(o);this.states.setEntity=_;const b=fs({spacing:"spacingBase8",direction:{desktop:"row",mobile:"column"},justify:{desktop:"space-between"},children:ee`<template>
<div>
${Fs({whiteSpace:"pre-wrap",customStyles:{mb:bn},children:f.common.selectionGuideText})}
<div class="${"Step2_entityGroup__1ai23qi1"}" role="group" aria-labelledby="${u}">
<div class="${"Step2_labelContainer__1ai23qi2"}" id="${u}">
<span class="${ml}">用途の選択</span>
${Cl({})}
</div>
${fs({spacing:"spacingBase5",direction:"row",wrap:"wrap",children:[wl({label:"世帯(個人)で",checked:"household"===m.current,value:"household",name:p,onChange:()=>l("household")}),wl({label:"事業で",checked:"business"===m.current,value:"business",name:p,onChange:()=>l("business")}),wl({label:"学校で",checked:"school"===m.current,value:"school",name:p,onChange:()=>l("school")})]})}
</div>
${fs({spacing:"spacingBase4",customStyles:{mb:{desktop:fn,mobile:mn}},children:ee`<template>
${fs({spacing:"spacingBase3",direction:"row",align:"center",children:ee`<template>
<span class="${ml}">地域(放送局)の選択</span>
${Cl({})}
</template>`})}
${fs({spacing:{desktop:"spacingBase3",mobile:"spacingBase2"},direction:{desktop:"row",mobile:"column"},align:{desktop:"center"},children:ee`<template>
<label class="${"Step2_areaLabel__1ai23qi4"}" for="${g}">地域から探す</label>
<div class="${"Step2_areaDropdownWidgetContainer__1ai23qi5"}">
${Rl({id:g,size:"S",onChange:s,hideUnselected:!0,defaultArea:(null==i?void 0:i.id)||"130"})}
</div>
</template>`})}
</template>`})}
${de({entity:m},({entity:t})=>Fs({whiteSpace:"pre-wrap",color:Yo.colorTextSecondary,size:"XS",lineHeight:"heading",children:f[t].lastText}))}
</div>
<div class="${"Step2_rightArea__1ai23qi0"}">
${de({entity:m},({entity:t})=>ee`<template>
${"business"===t&&fs({align:"center",customStyles:{mb:{desktop:_n,mobile:bn}},children:Nn({link:{href:f.business.infoLinkUrl},children:"事業での利用について詳しく見る"})})}
${"school"===t&&fs({align:"center",customStyles:{mb:{desktop:_n,mobile:bn}},children:Nn({link:{href:f.school.infoLinkUrl},children:"学校での利用について詳しく見る"})})}
</template>`)}
${rl({fullWidth:!0,onClick:c,customStyles:{mx:"auto",mb:{desktop:_n,mobile:bn}},children:"サービスの利用を開始する"})}
${de({exitUrl:n},({exitUrl:t})=>fs({align:"center",customStyles:{mb:{desktop:_n,mobile:bn}},children:Nn({link:{href:t},children:"サービスを利用しない"})}))}
${hs({customStyles:{mb:{desktop:gn,mobile:fn}}})}
${fs({align:"center",children:Ao({buttonType:"tertiary",onClick:a,leftIcon:"ChevronLeftIcon",children:"戻る"})})}
</div>
</template>`});return e&&e.replaceWith(b),this.root=b,b})}update(t){var e,r;if(!this.root||!this.props)return;const i=ye(this.props,t),o={...this.props,...t};i.entity&&(null==(r=(e=this.states).setEntity)||r.call(e,o.entity)),this.props=o}});const Zl=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"step",1),__publicField(this,"checked",!1),__publicField(this,"entity","household"),__publicField(this,"area",null),__publicField(this,"pageTitle",(null==(t=document.querySelector("meta[property='og:title']"))?void 0:t.getAttribute("content"))||"このページ"),__publicField(this,"processing",!1),__publicField(this,"refs",{step1:re(null),step2:re(null),scrollArea:re(null),stepRef:re(null)})}render(t,e){this.props=t;const{titleId:r,customStyles:i}=t,{consentToUseData:o}=ge(fe(Vs)[0],"consentToUseData"),n=pe({consentToUseData:o},({consentToUseData:t})=>{if(!t)return"";try{const e=new URL(t.common.exitUrl);return e.searchParams.set($s.erpc.exit.key,$s.erpc.exit.value),e.toString()}catch{return t.common.exitUrl}}),s=e=>{var r,i,o;this.step=e,null==(r=t.onStepChange)||r.call(t,e),null==(i=this.refs.scrollArea.current)||i.scrollTo({top:0,behavior:"instant"}),this.render(t,this.root??void 0),null==(o=this.refs.stepRef.current)||o.focus()};return this.root=yo({as:"div",customStyles:i,className:"MultiPageERPCContent_container__9ubed20",children:ee`<template>
<span class="${"MultiPageERPCContent_screenReaderOnly__9ubed21"}">${this.pageTitle}を見るにはご利用意向の確認をお願いします。</span>

<div class="${"MultiPageERPCContent_titleContainer__9ubed22"}">
<span class="${"MultiPageERPCContent_side__9ubed23"}"></span>
${Fs({id:r,size:{desktop:"XXL",mobile:"XL"},lineHeight:"heading",weight:"bold",children:"ご利用にあたって"})}
${ie(this.refs.stepRef,ee`<span class="${"MultiPageERPCContent_step__9ubed24"}" role="status" tabindex="-1" aria-label="ステップ ${this.step}/2">
<span aria-hidden="true">${this.step}/2</span>
</span>`)}
</div>

${ie(this.refs.scrollArea,ee`<div class="${"MultiPageERPCContent_stepContainer__9ubed25"}">
${1===this.step&&fl({ref:this.refs.step1,checked:this.checked,exitUrl:n,onCheckedChange:t=>{var e;this.checked=t,null==(e=this.refs.step1.current)||e.toggleChecked(t)},onNext:()=>s(2)})}
${2===this.step&&Nl({ref:this.refs.step2,area:this.area,entity:this.entity,exitUrl:n,onAreaChange:t=>{var e;this.area=t,null==(e=this.refs.step2.current)||e.update({area:t})},onEntityChange:t=>{var e;this.entity=t,null==(e=this.refs.step2.current)||e.update({entity:t})},onBack:()=>s(1),onSubmit:async()=>{const{manager:t}=Mo({}).current??{},{opsManagementSystemData:e}=Js({}).current??{};if(!this.processing&&(this.processing=!0,t)){if("household"===this.entity&&(null==e?void 0:e.enforcementSettings)){const r=e.enforcementSettings.registrationSettings.firstIntervalSec,i=new Date,o=new Date(i.getTime()+1e3*r),n={sd:i.toISOString(),ed:o.toISOString()};try{await t.setEfm(JSON.stringify(n))}catch{}}this.area&&t.loginAccountless({entity:this.entity,area:this.area.id,pref:this.area.pref,postal:this.area.postalCode,jisx0402:this.area.jisx0402,queryParams:{[$s.erpc.startService.key]:$s.erpc.startService.value}})}}})}
</div>`)}
</template>`}),e&&e.replaceWith(this.root),this.root}});const Ol=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){this.props=t;const{onStepChange:r,titleId:i,customStyles:o}=t,n=Zl({titleId:i,onStepChange:r,customStyles:o});return e&&e.replaceWith(n),this.root=n,n}}),Dl=(t={})=>{var e;const{onChange:r}=t;let i=(null==(e=window.nhkLib)?void 0:e.emergencyMode)??null;const o=r?()=>{var t;i=(null==(t=window.nhkLib)?void 0:t.emergencyMode)??null,i&&r(i)}:null;return o&&(window.addEventListener(kt.emergencyModeChange,o),setTimeout(o)),{current:i,dispose:()=>{o&&window.removeEventListener(kt.emergencyModeChange,o)}}},Hl=t=>{const{isERPConfirmationRequired:e,onChange:r}=t;let i=e??null;const o=()=>{const t=Mo({}).current,o=Dl({}).current;if(!t||!o)return;const{manager:n}=t,{isEmergencyMode:s,initialized:l}=o;var a;l&&void 0===e&&(a="confirmView"===n.getNextAction()||!!s,i!==a&&(i=a,null!==a&&(null==r||r(a))))},n=Mo({onChange:()=>o()}),s=Dl({onChange:()=>o()});return o(),{current:i,dispose:()=>{var t,e;null==(t=n.dispose)||t.call(n),null==(e=s.dispose)||e.call(s)}}};const jl=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"disposable",[])}render(t,e){this.props=t;const{isERPConfirmationRequired:r,onClose:i,showCloseButton:o,customStyles:n}=t;let s=null;const l=Hl({isERPConfirmationRequired:r,onChange:e=>{this.root&&e!==s&&this.render(t,this.root),s=e}});this.disposable.push(l),s=l.current;const a=`title-${we()}`;if(l.current){const t=yo({id:Ft,as:"dialog",open:!0,role:"region","aria-labelledby":a,customDataAttribute:{"data-modal-type":"ERPCHalfModal"},className:`ERPCHalfModal_container__xn9d5z0 ${"string"==typeof n?n:""}`,customStyles:n,children:ee`<template>
${o&&oe({click:i},ee`<button class="${"ERPCHalfModal_closeButton__xn9d5z2"}" type="button">
${je({size:"18px"})}
<span class="${"ERPCHalfModal_closeButtonText__xn9d5z3"}">最小化</span>
</button>`)}
<div class="${"ERPCHalfModal_inner__xn9d5z1"}">
${Ol({titleId:a})}
</div>
</template>`}),r=new MutationObserver(e=>{for(const i of e)i.removedNodes.length>0&&Array.from(i.removedNodes).includes(t)&&r.disconnect()});r.observe(document.body,{childList:!0,subtree:!0}),this.disposable.push({dispose:()=>r.disconnect()}),this.root=t,e&&e.replaceWith(t),_e(t).then(()=>{Ss({current:t})})}else this.root=e??null;return this.root}dispose(){this.disposable.forEach(t=>{var e;return null==(e=t.dispose)?void 0:e.call(t)})}});var Ul="var(--maxWidth__crkkhu0)",ql=["NHKFooter_loader__crkkhu2","NHKFooter_loader__crkkhu3","NHKFooter_loader__crkkhu4","NHKFooter_loader__crkkhu5","NHKFooter_loader__crkkhu6"],Wl="var(--lightColor__3xmmpx0)",Vl="var(--darkColor__3xmmpx1)";const Jl=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{color:r="currentColor"}=t,i="string"==typeof r?{light:r,dark:r}:r,o=ee`<svg
class=${"NHKLogo_container__3xmmpx2"}
style="${qt({[Wl]:i.light,[Vl]:i.dark})}"
viewBox="0 0 73 22"
aria-label="エヌエイチケー"
role="img"
>
<g clipPath="url(#clip0_67292_4475)">
<path
fillRule="evenodd"
clipRule="evenodd"
d="M46.4443 0.614488C45.6582 0.386135 44.8158 0.486634 44.1019 0.893927C43.3881 1.30122 42.8612 1.98202 42.6368 2.7869L41.191 8.00399H34.2508L35.2308 4.51496C35.3638 4.10893 35.4145 3.67933 35.3797 3.25253C35.3448 2.82572 35.2252 2.41071 35.0282 2.03297C34.8311 1.65523 34.5608 1.32272 34.2338 1.05586C33.9068 0.788998 33.53 0.593408 33.1265 0.481096C32.7231 0.368784 32.3015 0.342119 31.8876 0.402737C31.4737 0.463355 31.0763 0.609977 30.7198 0.833605C30.3632 1.05723 30.055 1.35315 29.8141 1.70319C29.5732 2.05323 29.4046 2.45002 29.3188 2.86919L25.2222 17.4836C24.9985 18.2823 25.0926 19.1393 25.484 19.8671C25.8754 20.595 26.5321 21.1345 27.3107 21.3676C27.5874 21.4504 27.8738 21.4947 28.1621 21.4993C28.8302 21.4974 29.4796 21.2733 30.0127 20.8607C30.5458 20.4482 30.9337 19.8695 31.1181 19.2117L32.58 13.9946H39.5202L38.5563 17.4836C38.3332 18.2845 38.4295 19.1434 38.8241 19.8717C39.2187 20.5999 39.8793 21.1379 40.6608 21.3676C40.9376 21.4504 41.224 21.4947 41.5123 21.4993C42.1803 21.4974 42.8298 21.2733 43.3628 20.8607C43.8959 20.4482 44.2838 19.8695 44.4682 19.2117L48.5649 4.51496C48.7878 3.70966 48.6897 2.84666 48.2921 2.11538C47.8945 1.38411 47.2299 0.844315 46.4443 0.614488ZM21.3347 0.614347C20.9465 0.501497 20.5404 0.46819 20.1397 0.516334C19.7389 0.564479 19.3513 0.693128 18.9992 0.894916C18.647 1.09671 18.3371 1.36767 18.0873 1.6923C17.8375 2.01693 17.6526 2.38885 17.5433 2.78676L15.3103 10.7852L9.75174 1.94742C9.43967 1.43194 8.988 1.02056 8.45174 0.763411C7.91548 0.506262 7.31779 0.414444 6.73149 0.499143C6.14058 0.590863 5.58814 0.855582 5.14066 1.26144C4.69318 1.66729 4.36974 2.19699 4.20926 2.78676L0.112651 17.4835C0.00249213 17.8811 -0.0300199 18.2972 0.0169759 18.7077C0.0639717 19.1183 0.189552 19.5153 0.386528 19.8761C0.583504 20.2369 0.848007 20.5543 1.16489 20.8102C1.48178 21.0661 1.84483 21.2555 2.23325 21.3675C2.50431 21.4513 2.78553 21.4956 3.06864 21.4991C3.73738 21.4999 4.38806 21.2769 4.92166 20.8639C5.45526 20.451 5.84256 19.8707 6.02462 19.2115L8.25768 11.2131L13.8002 20.0509C14.122 20.5587 14.5787 20.9617 15.1167 21.2125C15.6546 21.4633 16.2513 21.5513 16.8365 21.4662C17.4111 21.3683 17.9463 21.1039 18.379 20.7044C18.8117 20.3049 19.1238 19.7869 19.2784 19.2115L23.4553 4.51482C23.6782 3.70952 23.5801 2.84652 23.1825 2.11524C22.7849 1.38397 22.1204 0.844174 21.3347 0.614347ZM71.4775 0.932883C71.8257 1.14223 72.1302 1.41994 72.3734 1.75007C72.6198 2.07857 72.8 2.45395 72.9035 2.8544C73.0071 3.25484 73.0319 3.67237 72.9766 4.08274C72.9213 4.4931 72.787 4.88812 72.5814 5.24485C72.3758 5.60157 72.1031 5.91289 71.779 6.16073L65.0156 11.4107L69.3693 16.1999C69.6435 16.5036 69.8567 16.8596 69.9967 17.2476C70.1366 17.6357 70.2006 18.0482 70.1849 18.4616C70.1693 18.875 70.0743 19.2812 69.9054 19.6569C69.7365 20.0327 69.497 20.3707 69.2006 20.6517C68.9042 20.9327 68.5566 21.1511 68.1778 21.2944C67.799 21.4378 67.3964 21.5034 66.9928 21.4873C66.5893 21.4713 66.1928 21.3739 65.826 21.2009C65.4592 21.0279 65.1292 20.7826 64.855 20.4789L58.204 13.1388L58.0915 12.9907C58.0555 12.962 58.0231 12.9288 57.9951 12.8919L56.228 19.2117C56.1364 19.6181 55.9656 20.0013 55.7258 20.3383C55.486 20.6754 55.1821 20.9593 54.8325 21.173C54.4828 21.3867 54.0946 21.5257 53.6912 21.5818C53.2877 21.6379 52.8774 21.6098 52.4848 21.4993C52.0964 21.3873 51.7333 21.1979 51.4164 20.942C51.0996 20.6861 50.8351 20.3687 50.6381 20.0079C50.4411 19.6471 50.3155 19.2501 50.2685 18.8395C50.2215 18.429 50.254 18.0129 50.3642 17.6153L54.4769 2.91856C54.5627 2.49939 54.7313 2.10261 54.9722 1.75256C55.2131 1.40252 55.5213 1.10661 55.8778 0.882978C56.2344 0.65935 56.6318 0.512728 57.0457 0.45211C57.4595 0.391493 57.8811 0.418158 58.2846 0.53047C58.688 0.642782 59.0648 0.838371 59.3918 1.10523C59.7188 1.3721 59.9892 1.7046 60.1862 2.08234C60.3833 2.46009 60.5029 2.8751 60.5377 3.3019C60.5726 3.72871 60.5219 4.15831 60.3888 4.56433L59.441 7.85587L68.068 1.14113C68.3895 0.890876 68.756 0.70808 69.1466 0.603222C69.5372 0.498365 69.9441 0.473508 70.3441 0.530078C70.7441 0.586648 71.1292 0.723532 71.4775 0.932883Z"
fill="currentColor"
/>
</g>
<defs>
<clipPath id="clip0_67292_4475">
<rect width="73" height="21" fill="white" transform="translate(0 0.5)" />
</clipPath>
</defs>
</svg>`;return this.root=o,null==e||e.replaceWith(this.root),this.root}}),Xl=t=>`Failed to fetch ${t.url}: ${t.status} ${t.statusText}`;class Gl{debug(...t){console.debug(...t)}error(...t){console.error(...t)}info(...t){console.info(...t)}}class Kl{constructor(t,e){__publicField(this,"instance",new Gl),__publicField(this,"logLevel",[]),t&&(this.instance=t),e&&(this.logLevel=e)}canLog(t){return"all"===this.logLevel||this.logLevel.includes(t)}debug(...t){this.canLog("debug")&&this.instance.debug(...t)}error(...t){this.canLog("error")&&this.instance.error(...t)}info(...t){this.canLog("info")&&this.instance.info(...t)}}class Yl{constructor(t,e){__publicField(this,"_logger");const r=new Kl(t,e);this._logger=r}get logger(){return this._logger}}const Ql=()=>{var t;const e=null==(t=window.nhkLib)?void 0:t.logger;return e||{logger:new Kl}};const ta=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"updateIsEnglishItems",null)}render(t,e){const{customStyles:r,contentMaxWidth:i="1040px",backgroundColor:o,isEnglishItems:n=!1,ref:s}=t,{logger:l}=Ql(),{defaultConfig:a}=ge(fe(jt)[0],"defaultConfig"),[c,h]=ae({ja:void 0,en:void 0}),[d,u]=ae(n);this.updateIsEnglishItems=u,s&&(s.current=this),this.props=t;const p=pe({footerContents:c},({footerContents:t})=>{var e,r;return d.current?null==(e=t.en)?void 0:e.items:null==(r=t.ja)?void 0:r.items});ue({isEnglishItems:d,footerContents:c,defaultConfig:a},async({isEnglishItems:t,footerContents:e,defaultConfig:r})=>{if(!r)return;if(t&&e.en||!t&&e.ja)return;const i=r.endpoint,o=t?i.footer_en:i.footer_ja;try{const r=await te(o),i={...e};t?i.en=r:i.ja=r,h(i)}catch(n){l.error(n)}});const g=yo({id:"nhk-one-footer",as:"footer",customStyles:{...r,...o&&{backgroundColor:o}},className:"NHKFooter_footer__crkkhu7",children:ee`<div class="${"NHKFooter_content__crkkhu8"}" style="${qt({[Ul]:i})}">
<div class="${"NHKFooter_nhkLogoContainer__crkkhu9"}">${Jl({})}</div>
${de({footerItems:p},({footerItems:t})=>t?ee`<nav aria-label="フッターサイトナビゲーション" class="${"NHKFooter_nav__crkkhua"}">
${t.flatMap(t=>ee`<ul class="${"NHKFooter_group__crkkhub"}">
${t.items.flatMap(t=>ee`<li>
${Nn({size:{mobile:"S",desktop:"M"},link:{href:t.href,target:t.target},color:Yo.colorTextGfooter,hideLinkIcon:!0,children:t.label})}
</li>`)}
</ul>`)}
</nav>`:ee`<div aria-label="ローディング" role="progressbar" class="${"NHKFooter_loaderContainer__crkkhu1"}">
<div class="${ql[0]}"></div>
<div class="${ql[1]}"></div>
<div class="${ql[2]}"></div>
<div class="${ql[3]}"></div>
<div class="${ql[4]}"></div>
</div>`)}
${hs({color:Yo.colorDividerSecondary,customStyles:{mt:vn,mb:mn}})}
${Fs({size:"XXS",align:"center",color:Yo.colorTextGfooter,customStyles:{mx:8},children:"Copyright NHK (Japan Broadcasting Corporation). All rights reserved. 許可なく転載することを禁じます。このページは受信料で制作しています。"})}
</div>`});return e&&e.replaceWith(g),this.root=g,g}update(t){var e;if(!this.root||!this.props)return;const r=ye(t,this.props);r.backgroundColor||r.contentMaxWidth||r.customStyles?this.render({...this.props,...t},this.root):r.isEnglishItems&&(null==(e=this.updateIsEnglishItems)||e.call(this,t.isEnglishItems??!1))}});var ea={withShadow:"NHKHeader_container_withShadow__101v3yx0",withoutShadow:"NHKHeader_container_withoutShadow__101v3yx1"};const ra=(t={})=>{var e;const{onChange:r}=t;let i=(null==(e=window.nhkLib)?void 0:e.area)??null;const o=r?()=>{var t;i=(null==(t=window.nhkLib)?void 0:t.area)??null,i&&r(i)}:null;return o&&(window.addEventListener(kt.areaStateChange,o),setTimeout(o)),{current:i,dispose:()=>{o&&window.removeEventListener(kt.areaStateChange,o)}}};const ia=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"refs",{dropdownRef:re(null)})}render(t){const{size:e,variant:r}=t,{manager:i}=ge(fe(Mo)[0],"manager"),{initialized:o,currentArea:n}=ge(fe(ra)[0],"initialized","currentArea"),{constJson:s}=ge(fe(jt)[0],"constJson"),[l,a]=ae(!0),[c,h]=ae([]),[d,u]=ae(null);ue({areaInitialized:o,constJson:s,currentArea:n},({areaInitialized:t,constJson:e,currentArea:r})=>{if(e instanceof Error)return;const i=null==e?void 0:e.area,o=null==i?void 0:i.find(t=>t.id===((null==r?void 0:r.id)||"130"));if(!t||!o||!i)return;const n=[];i.forEach(t=>{(()=>{const e=n.filter(t=>"group"===t.type).find(e=>e.label===t.blockName);if(e)return e;const r={type:"group",label:t.blockName,items:[]};return n.push(r),r})().items.push({type:"item",label:t.areaName,value:t})}),h(n),u(o),a(!1)});ue({isLoading:l,areaList:c,value:d,constJson:s},({isLoading:t,areaList:e,value:r})=>{var i;null==(i=this.refs.dropdownRef.current)||i.update({items:e,selectedItemValue:r,disabled:t})});const p=Fl({ref:this.refs.dropdownRef,size:e,variant:r,ariaLabel:"地域選択",disabled:l.current,selectedItemValue:d.current,items:c.current,onChange:t=>{var e;u(t),t&&(null==(e=i.current)||e.setAreaTemporary(t.id),window.location.reload())}});return this.root=p,p}}),oa=t=>{const{onChange:e}=t,r={current:null,dispose:()=>{i&&window.removeEventListener(kt.isInJapanChange,i)}};window.nhkLib&&(r.current={initialized:window.nhkLib.isInJapanInitialized,isInJapan:window.nhkLib.isInJapan});const i=e?()=>{window.nhkLib&&(r.current={initialized:window.nhkLib.isInJapanInitialized,isInJapan:window.nhkLib.isInJapan},e(r.current))}:null;return i&&(window.addEventListener(kt.isInJapanChange,i),setTimeout(i)),r},na=(t={})=>{var e;const{onChange:r}=t,i=r?()=>{var t;null==r||r((null==(t=window.nhkLib)?void 0:t.siteConfig)??null)}:null;return i&&(window.addEventListener(kt.nhkProviderStateChange,i),setTimeout(i)),{current:(null==(e=window.nhkLib)?void 0:e.siteConfig)??null,dispose:()=>{i&&window.removeEventListener(kt.nhkProviderStateChange,i)}}},sa=t=>{var e,r;const[i,o]=ae((null==(r=null==(e=window.nhkLib)?void 0:e.flashNewsProvider)?void 0:r.flashNews)||[]);window.addEventListener(kt.flashNewsChange,()=>{var t,e;o((null==(e=null==(t=window.nhkLib)?void 0:t.flashNewsProvider)?void 0:e.flashNews)||[])});const{onChange:n}=t;return ue({flashNews:i},({flashNews:t})=>{null==n||n(t)}),i},la=767,aa=`(max-width: ${la}px)`,ca=t=>{const e=[],r=window.matchMedia(aa),[i,o]=ae(r.matches);i.addDisposeListener(()=>e.forEach(t=>t.dispose()));const n=t=>o(t.matches);r.addEventListener("change",n),e.push({dispose:()=>r.removeEventListener("change",n)});const{onChange:s}=t||{};return s&&e.push(ue({isMobile:i},({isMobile:t})=>s(t))),i};var ha={high:"HeaderInfo_container_high__1uy05fb0",medium:"HeaderInfo_container_medium__1uy05fb1",low:"HeaderInfo_container_low__1uy05fb2"};const da=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{label:r,onClose:i,priority:o,title:n,closeable:s,date:l,link:a,disableLink:c,customStyles:h}=t,d=l instanceof Date?l.toISOString():l,u=a&&!c?a:{},p=yo({as:"div",customStyles:h,className:ha[o],children:ee`<template>
${xn({...u,className:"HeaderInfo_link__1uy05fb3",color:"currentColor",children:ee`<template>
<div class="${"HeaderInfo_infoIcon__1uy05fb4"}">${cr({size:"100%"})}</div>
<span>
${r&&ee`<span class="${"HeaderInfo_label__1uy05fb5"}">${r}</span>`}${n&&ee`<span class="${"HeaderInfo_title__1uy05fb6"}">${n}</span>`}${l&&ee`<span class="${"HeaderInfo_time__1uy05fb7"}">${Ce(d)}</span>`}${u.href&&ee`<span class="${"HeaderInfo_chevronRightIcon__1uy05fb8"}">${qe({size:18})}</span>`}
</span>
</template>`})}
${s&&oe({click:t=>{t.preventDefault(),t.stopPropagation(),null==i||i()}},ee`<button class="${"HeaderInfo_closeButton__1uy05fb9"}">${Ke({size:18})} 閉じる</button>`)}
</template>`});return this.root=p,e&&e.replaceWith(p),p}}),ua=t=>{var e,r;const{onChange:i}=t;let o=(null==(r=null==(e=window.nhkLib)?void 0:e.enforcement)?void 0:r.registrationEnforcementProvider)??null;const n=i?()=>{var t,e;o=(null==(e=null==(t=window.nhkLib)?void 0:t.enforcement)?void 0:e.registrationEnforcementProvider)??null,o&&i(o)}:null;return n&&(window.addEventListener(kt.registrationEnforcementChange,n),setTimeout(n)),{current:o,dispose:()=>{n&&window.removeEventListener(kt.registrationEnforcementChange,n)}}},pa={contents:[{id:"85f_frgoksti",createdAt:"2025-05-17T10:59:35.991Z",updatedAt:"2025-05-19T03:49:48.138Z",publishedAt:"2025-05-17T10:59:35.991Z",revisedAt:"2025-05-19T03:49:48.138Z",body:"テスト用お知らせ",url:"#"}]},ga=(t={})=>{const{onChange:e}=t;if(Ie())return{current:pa};const r=t=>{var e;return void 0===(null==(e=null==t?void 0:t.emergencyMessages)?void 0:e.contents)||0===t.emergencyMessages.contents.length?null:t.emergencyMessages};let i=null;const o=e?()=>{e(i)}:null,{current:n,dispose:s}=Js({onChange:({opsManagementSystemData:t})=>{i=r(t),null==o||o()}});return i=r((null==n?void 0:n.opsManagementSystemData)??null),
// istanbul ignore else @preserve
o&&setTimeout(o),{current:i,dispose:s}},fa=t=>{
// istanbul ignore next @preserve 型定義上必須なので分岐に入ることはない
const{onChange:e}=t||{};let r=null,i=null,o=null,n=null,s=!1;const l=()=>{var t,e;return null===i||null===n?null:!r&&(!(i.length>0)&&("guide"===o&&!!(null==(e=null==(t=null==n?void 0:n.enforcementSettings)?void 0:t.registrationSettings)?void 0:e.registrationGuideMessage)))},a=()=>{const t=l();null!==t&&(s=!0,null==e||e(t))},c=ga({onChange:t=>{r=t,a()}}),h=sa({onChange:t=>{i=t,a()}}),d=ua({onChange:t=>{o=t.registrationEnforcementType,a()}}),u=Js({onChange:t=>{n=t.opsManagementSystemData,a()}});return{get current(){return l()},initialized:s,dispose:()=>{var t,e,r,i;null==(t=null==c?void 0:c.dispose)||t.call(c),null==(e=null==h?void 0:h.dispose)||e.call(h),null==(r=null==d?void 0:d.dispose)||r.call(d),null==(i=null==u?void 0:u.dispose)||i.call(u)}}};const ma=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"refs",{rootRef:re(null)}),__publicField(this,"_disposable",[])}
// istanbul ignore next @preserve 現状rootを取得するケースがない
get root(){return this.refs.rootRef.current}render(){const[t]=fe(fa),{opsManagementSystemData:e}=ge(fe(Js)[0],"opsManagementSystemData"),r=pe({opsManagementSystemData:e},({opsManagementSystemData:t})=>{var e;return null==(e=null==t?void 0:t.enforcementSettings)?void 0:e.registrationSettings.registrationGuideMessage}),i=pe({opsManagementSystemData:e},({opsManagementSystemData:t})=>{var e;return null==(e=null==t?void 0:t.enforcementSettings)?void 0:e.registrationSettings.registrationGuideUrl}),o=()=>{var t;const e=null==(t=ua({}).current)?void 0:t.closeRegistrationEnforcement;null==e||e()};return this._disposable.push(r,i,t),be(this.refs.rootRef).then(()=>this.dispose()),de({showRegistrationEnforcementGuide:t,title:r,href:i},({showRegistrationEnforcementGuide:t,title:e,href:r})=>t&&e?da({priority:"low",closeable:!0,title:e,link:{href:r},onClose:o}):null,{ref:this.refs.rootRef})}dispose(){this._disposable.forEach(t=>{var e;return null==(e=t.dispose)?void 0:e.call(t)}),this._disposable=[]}}),_a=t=>{var e,r,i,o,n;const{onChange:s}=t;let l=null,a=null,c=null;const h=()=>{var t,e;return!(!a||null===l)&&(null==(t=null==d?void 0:d.dispose)||t.call(d),null==(e=null==u?void 0:u.dispose)||e.call(u),!(!l&&c))},d=na({onChange:t=>{l=(null==t?void 0:t.authNOnlyMode)??!1,null==s||s(h())}});l=(null==(e=d.current)?void 0:e.authNOnlyMode)??!1;const u=Mo({onChange:t=>{a=null==t?void 0:t.account,c=null==t?void 0:t.accountProfile,null==s||s(h())}});return a=(null==(r=u.current)?void 0:r.account)??null,c=(null==(i=u.current)?void 0:i.accountProfile)??null,s||(null==(o=null==d?void 0:d.dispose)||o.call(d),null==(n=null==u?void 0:u.dispose)||n.call(u)),{current:h(),dispose:()=>{var t,e;null==(t=null==d?void 0:d.dispose)||t.call(d),null==(e=null==u?void 0:u.dispose)||e.call(u)}}};var ba="BaseButton_container__h46buw0",ya="BaseButton_active__h46buw1";const va=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"refs",{rootRef:re(null)})}get root(){return this.refs.rootRef.current}render(t){this.props=t,this.props.ref&&(this.props.ref.current=this);const{active:e={current:!1},onClick:r,ariaControls:i,ariaExpanded:o={current:void 0},icon:n,text:s,id:l,showAlert:a={current:!1}}=t,c=ie(this.refs.rootRef,oe({click:r},ee`<button
${l?`id="${l}"`:""}
class="${di(ba,e.current&&ya)}"
type="button"
${i?`aria-controls="${i}"`:""}
${void 0!==o.current?`aria-expanded="${o.current}"`:""}
>
<i class="${"BaseButton_iconContainer__h46buw2"}">${ne(n)?de({icon:n},({icon:t})=>ee`${t}`):n}</i>
<span class="${"BaseButton_iconLabel__h46buw3"}">${s}</span>
${de({showAlert:a},({showAlert:t})=>t?ee`<i class="${"BaseButton_alert__h46buw4"}">${rr({size:"100%"})}</i>`:null)}
</button>`));return ue({active:e,ariaExpanded:o},({active:t,ariaExpanded:e})=>{c&&(c.className=di(ba,t&&ya),void 0!==e?c.setAttribute("aria-expanded",String(e)):c.removeAttribute("aria-expanded"))}),c}});const wa=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(){const{manager:t}=ge(fe(Mo)[0],"manager");return this.root=va({icon:fr({size:"100%"}),onClick:()=>{var e;return null==(e=t.current)?void 0:e.loginAccount()},text:"ログイン"}),this.root}});var Ca="var(--lightColor__zla7k70)",ka="var(--darkColor__zla7k71)",Sa="NHKOneLogo_container__zla7k72";const $a=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"refs",{rootRef:re(null)})}get root(){return this.refs.rootRef.current}render(t){this.props=t;const{color:e={current:"currentColor"},mini:r,customStyles:i}=this.props;return de({},()=>yo({as:"div",className:Sa,customStyles:i??{},children:de({color:e},({color:t})=>{const e="string"==typeof t?{light:t,dark:t}:t;return r?ee`<svg
class="${Sa}"
style="${qt({[Ca]:e.light,[ka]:e.dark})}"
viewBox="0 0 46 30"
aria-label="エヌエイチケーワン"
role="img"
>
<g clipPath="url(#clip0_67441_3928)">
<path
d="M13.4753 0.139631C12.451 -0.153488 11.3805 0.438943 11.0876 1.46142L9.68481 6.35225L6.19889 0.949494C5.78862 0.313714 5.04267 -0.0241301 4.2912 0.0859616C3.54042 0.196741 2.92363 0.734127 2.71574 1.46142L0.140151 10.4435C-0.153393 11.4653 0.441292 12.5311 1.46697 12.8229C1.64447 12.8731 1.82267 12.8972 1.99811 12.8972C2.83868 12.8972 3.61225 12.3461 3.85469 11.5011L5.25679 6.61027L8.74339 12.013C9.15435 12.6488 9.90099 12.9887 10.6504 12.8759C11.4012 12.7658 12.018 12.2277 12.2259 11.5004L14.8021 2.51899C15.0957 1.4972 14.501 0.432062 13.4753 0.139631Z"
fill="currentColor"
></path>
<path
d="M29.2526 0.139623C28.2255 -0.154184 27.1577 0.439623 26.8649 1.46141L25.9497 4.6527H21.5963L22.2082 2.51898C22.5018 1.49719 21.9071 0.431366 20.8814 0.139623C19.8537 -0.154184 18.7859 0.439623 18.4937 1.46141L15.9181 10.4435C15.6246 11.4653 16.2193 12.5311 17.2449 12.8229C17.4224 12.8731 17.6006 12.8972 17.7761 12.8972C18.6166 12.8972 19.3902 12.346 19.6326 11.5011L20.5478 8.30981H24.9012L24.2893 10.4435C23.9964 11.4653 24.5904 12.5311 25.6161 12.8229C25.7936 12.8731 25.9718 12.8972 26.1479 12.8972C26.9885 12.8972 27.7621 12.346 28.0045 11.5011L30.5801 2.51967C30.8736 1.49788 30.279 0.432054 29.2533 0.140311L29.2526 0.139623Z"
fill="currentColor"
></path>
<path
d="M45.5579 0.828393C44.9142 -0.0193138 43.7013 -0.185827 42.8517 0.455457L37.3994 4.56601L37.9865 2.51899C38.2794 1.4972 37.6854 0.432062 36.6597 0.139631C35.6327 -0.153488 34.5641 0.438943 34.2713 1.46142L31.695 10.4435C31.4022 11.4653 31.9962 12.5305 33.0225 12.8229C33.2 12.8731 33.3782 12.8972 33.5544 12.8972C34.3956 12.8972 35.1685 12.3461 35.4109 11.5011L36.5188 7.63894C36.5188 7.63894 36.5202 7.6417 36.5209 7.64307C36.5381 7.66509 36.5602 7.68023 36.5782 7.70225C36.6024 7.73114 36.6196 7.76348 36.6459 7.7917L40.8322 12.2828C41.2127 12.6908 41.7301 12.8979 42.2481 12.8979C42.7184 12.8979 43.1909 12.7272 43.5625 12.3832C44.3443 11.66 44.3892 10.4422 43.664 9.66325L40.9316 6.73275L45.1849 3.52633C46.0351 2.88504 46.2037 1.67816 45.5593 0.830457L45.5579 0.828393Z"
fill="currentColor"
></path>
<path
d="M3.64329 23.1694C3.64329 19.1662 6.2023 16.5267 9.69788 16.5267C13.1935 16.5267 15.807 19.1655 15.807 23.1694C15.807 27.1733 13.2121 29.9373 9.69788 29.9373C6.18365 29.9373 3.64329 27.2263 3.64329 23.1694ZM13.6086 23.1694C13.6086 20.2967 12.0227 18.43 9.71584 18.43C7.40893 18.43 5.84106 20.3146 5.84106 23.1694C5.84106 26.0242 7.37302 28.0341 9.71584 28.0341C12.0587 28.0341 13.6086 26.1309 13.6086 23.1694Z"
fill="currentColor"
></path>
<path
d="M28.2484 16.7965V29.5781H25.9781L20.1031 20.2795V29.5781H17.9765V16.7965H20.2115L26.1218 26.1316V16.7965H28.2484Z"
fill="currentColor"
></path>
<path
d="M40.3445 29.5781H30.9739V16.7965H40.1828V18.6453H33.1544V22.0382H39.5515V23.9049H33.1544V27.7286H40.3445V29.5781Z"
fill="currentColor"
></path>
</g>
<defs>
<clipPath id="clip0_67441_3928">
<rect width="46" height="30" fill="white"></rect>
</clipPath>
</defs>
</svg>`:ee`<svg
class="${Sa}"
style="${qt({[Ca]:e.light,[ka]:e.dark})}"
viewBox="0 0 134 22"
aria-label="エヌエイチケーワン"
role="img"
>
<g clipPath="url(#clip0_67292_2350)">
<path
d="M20.9156 1.03752C19.3259 0.581089 17.6643 1.50359 17.2097 3.09573L15.0325 10.7114L9.62211 2.29859C8.98534 1.30859 7.82758 0.782518 6.66124 0.953947C5.49598 1.12645 4.53868 1.96323 4.21601 3.09573L0.218524 17.0811C-0.237076 18.6722 0.685916 20.3318 2.27784 20.7861C2.55334 20.8643 2.82992 20.9018 3.1022 20.9018C4.40683 20.9018 5.60747 20.0436 5.98374 18.7279L8.1599 11.1122L13.5714 19.525C14.2092 20.515 15.368 21.0443 16.5311 20.8686C17.6964 20.6972 18.6537 19.8593 18.9764 18.7268L22.9749 4.74145C23.4305 3.15037 22.5075 1.4918 20.9156 1.03645V1.03752Z"
fill="currentColor"
></path>
<path
d="M45.4022 1.03855C43.8082 0.581051 42.1508 1.50569 41.6963 3.09677L40.2759 8.06605H33.5191L34.4689 4.74355C34.9245 3.15248 34.0015 1.49284 32.4096 1.03855C30.8144 0.581051 29.1571 1.50569 28.7037 3.09677L24.7062 17.0821C24.2506 18.6732 25.1736 20.3328 26.7655 20.7871C27.041 20.8653 27.3176 20.9028 27.5899 20.9028C28.8945 20.9028 30.0951 20.0446 30.4714 18.7289L31.8918 13.7607H38.6486L37.6988 17.0832C37.2443 18.6743 38.1662 20.3339 39.7581 20.7882C40.0336 20.8664 40.3102 20.9039 40.5836 20.9039C41.8882 20.9039 43.0888 20.0457 43.4651 18.73L47.4626 4.74462C47.9182 3.15355 46.9952 1.49391 45.4033 1.03962L45.4022 1.03855Z"
fill="currentColor"
></path>
<path
d="M70.7079 2.11106C69.7088 0.791065 67.8274 0.531779 66.5078 1.53035L58.0454 7.93107L58.9566 4.74356C59.4112 3.15249 58.4893 1.49392 56.8973 1.03856C55.3033 0.582136 53.6449 1.50464 53.1903 3.09678L49.1918 17.0821C48.7373 18.6732 49.6592 20.3318 51.2511 20.7871C51.5266 20.8654 51.8032 20.9029 52.0765 20.9029C53.3812 20.9029 54.5818 20.0446 54.9581 18.7289L56.6776 12.715C56.6776 12.715 56.6797 12.7193 56.6808 12.7214C56.7076 12.7557 56.7419 12.7793 56.7698 12.8136C56.8073 12.8586 56.8341 12.9089 56.8748 12.9529L63.3722 19.945C63.9629 20.5804 64.7658 20.9029 65.5698 20.9029C66.2998 20.9029 67.0331 20.6371 67.6098 20.1014C68.8233 18.9754 68.893 17.0789 67.7674 15.8661L63.5266 11.3029L70.128 6.30999C71.4476 5.31142 71.7092 3.43214 70.709 2.11214L70.7079 2.11106Z"
fill="currentColor"
></path>
<path
d="M77.0061 10.9236C77.0061 4.68998 80.9778 0.581055 86.4032 0.581055C91.8286 0.581055 95.884 4.68998 95.884 10.9236C95.884 17.1571 91.8565 21.4621 86.4032 21.4621C80.9499 21.4621 77.0061 17.2407 77.0061 10.9236ZM92.4718 10.9236C92.4718 6.45141 90.0105 3.54356 86.4311 3.54356C82.8517 3.54356 80.4182 6.4782 80.4182 10.9236C80.4182 15.3689 82.7959 18.4986 86.4311 18.4986C90.0662 18.4986 92.4718 15.5361 92.4718 10.9236Z"
fill="currentColor"
></path>
<path
d="M115.194 0.999975V20.9028H111.67L102.553 6.42355V20.9028H99.2521V0.999975H102.721L111.894 15.536V0.999975H115.195H115.194Z"
fill="currentColor"
></path>
<path
d="M133.967 18.0239V20.9028H119.423V0.999975H133.715V3.8789H122.807V9.16212H132.736V12.07H122.807V18.0239H133.967Z"
fill="currentColor"
></path>
</g>
<defs>
<clipPath id="clip0_67292_2350">
<rect width="134" height="21" fill="white" transform="translate(0 0.5)"></rect>
</clipPath>
</defs>
</svg>`})}))}}),xa=t=>{switch(t){case"prd":case"pre":case"pvw":return"web";case"bxprd":case"stg":case"dev":return"bx"}},Ea=(t,e)=>{if(".nhk"===e){const r=xa(t);switch(t){case"prd":case"bxprd":return`https://www.${r}${e}`;case"pre":return`https://pre-www.${r}${e}`;case"pvw":return`https://pvw-www.${r}${e}`;case"stg":return`https://stg-www.${r}${e}`;case"dev":return`https://dev-www.${r}${e}`}}else switch(t){case"prd":case"bxprd":return`https://www${e}`;case"pre":return`https://pre-www${e}`;case"pvw":return`https://pvw-www${e}`;case"stg":return`https://stg-www${e}`;case"dev":return`https://dev-www${e}`}};const Ia=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"refs",{rootRef:re(null)})}get root(){return this.refs.rootRef.current}render(){const[t]=fe(oa),[e]=fe(na),[r]=fe(Mo),{authType:i}=ge(r,"authType"),o=pe({isInJapan:t,siteConfig:e,authType:i},({isInJapan:t,siteConfig:e,authType:r})=>!e||!t&&"accountAuthN"===r?"":Ea(e.env,".nhk")),n=[re(null),re(null)];return ue({url:o},({url:t})=>{var e,r;null==(e=n[0].current)||e.update({href:t}),null==(r=n[1].current)||r.update({href:t})}),ee`<template>
${xn({href:o.current,className:"Logo_desktopContainer__h88xol0",color:{light:"#808080",dark:"#ffffff"},children:$a({}),ref:n[0]})}
${xn({href:o.current,className:"Logo_mobileContainer__h88xol1",color:{light:"#808080",dark:"#ffffff"},children:$a({mini:!0}),ref:n[1]})}
</template>`}});const Aa=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(){const{manager:t}=ge(fe(Mo)[0],"manager");return this.root=Ao({size:{desktop:"S",mobile:"XS"},onClick:()=>{var e;return null==(e=t.current)?void 0:e.register()},customStyles:{ml:{mobile:pn},px:{mobile:gn,desktop:fn}},children:"新規登録"}),this.root}});const Ma=(t,e,r,i)=>`https://apps.${xa(t)}.nhk/static/profile/profile-${e}-${r}-${i}.svg`,Ta=t=>{var e,r;const{onChange:i}=t;let o=(null==(r=null==(e=window.nhkLib)?void 0:e.enforcement)?void 0:r.bindEnforcementProvider)??null;const n=i?()=>{var t,e;o=(null==(e=null==(t=window.nhkLib)?void 0:t.enforcement)?void 0:e.bindEnforcementProvider)??null,o&&i(o)}:null;return n&&(window.addEventListener(kt.bindEnforcementChange,n),setTimeout(n)),{current:o,dispose:
// istanbul ignore next @preserve 現状disposeを呼ぶケースがない
()=>{n&&window.removeEventListener(kt.bindEnforcementChange,n)}}};var La="var(--mobileVar_top__z7fseo0)",za="var(--mobileVar_opacity__z7fseo1)",Pa="SettingModal_menuItem__z7fseo8",Ba="SettingModal_menuItemLabel__z7fseo9",Fa="SettingModal_menuItemAlert__z7fseoa";const Ra=t=>{const[e,r]=ae(null),{dispose:i}=ue({open:t},({open:t})=>{const e=document.getElementById(Bt);if(!e)return void r(null);if(!t)return void r(null);const i=()=>{const t=e.getBoundingClientRect();r(t.bottom+window.scrollY)};i();const o=new ResizeObserver(i);return o.observe(e),()=>{o.disconnect()}});return e.addDisposeListener(i),e},Na=t=>{const{onClose:e,open:r,contentAreaRef:i,disableBackgroundClickClose:o={current:!1},disableEscapekeyClose:n={current:!1}}=t,s={current:null},l=[],a=new AbortController,c=a.signal,h=()=>{a.abort(),l.forEach(t=>t.dispose())},d=()=>{var t,e;(null==(t=s.current)?void 0:t.open)||null==(e=s.current)||e.showModal()},u=()=>{var t,e;(null==(t=s.current)?void 0:t.open)&&(null==(e=s.current)||e.close())};return be(s,c).then(h),_e(s,c).then(()=>{l.push(ue({open:r},({open:t})=>{t?d():u()})),l.push(ue({open:r,disableBackgroundClickClose:o},({open:t,disableBackgroundClickClose:r})=>{if(t&&!r){const t=t=>{var r;t.target instanceof Node&&!(null==(r=(i||s).current)?void 0:r.contains(t.target))&&e()},r=setTimeout(()=>{document.addEventListener("mousedown",t)});return()=>{clearTimeout(r),document.removeEventListener("mousedown",t)}}})),l.push(ue({open:r,disableEscapekeyClose:n},({open:t,disableEscapekeyClose:r})=>{if(t){const t=t=>{"Escape"===t.key&&(r?t.preventDefault():e())};return document.addEventListener("keydown",t),()=>{document.removeEventListener("keydown",t)}}}))}),{dialogRef:s,showModal:d,closeModal:u,dispose:h}};const Za=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"refs",{rootRef:re(null)})}get root(){return this.refs.rootRef.current}render(t,e){const{id:r,onClose:i,open:o,showBindEnforcementAlert:n={current:!1}}=this.props=t,[s]=fe(na),{dialogRef:l}=Na({open:o,onClose:i}),[a]=fe(_a);this.refs.rootRef=l;const[c]=fe(Mo),{accountProfile:h}=ge(c,"accountProfile"),{state:d}=(({showBindEnforcementAlert:t,onChange:e})=>{const[r,i]=ae([]),[o,n]=fe(na),[s,l]=fe(jt),[a,c]=fe(_a),[h,d]=fe(Mo);let u=!1;const p=async()=>{var t,e;u||(u=!0,await(null==(e=null==(t=h.current)?void 0:t.manager)?void 0:e.signout()),u=!1)},{dispose:g}=ue({siteConfig:o,defaultConfig:s,authNOnlyMode:a,showBindEnforcementAlert:t??{current:!1},auth:h},({siteConfig:t,defaultConfig:e,authNOnlyMode:r,showBindEnforcementAlert:o,auth:n})=>{var s,l,a;if(r)return void i([{label:"ログアウト",onClick:p,icon:mr}]);const c=t?Ea(t.env,".nhk"):"";i([..."private"!==(null==(s=null==n?void 0:n.accountProfile)?void 0:s.profileType)?[{label:"マイリスト",icon:Ze,href:new URL("mylist",c).toString()},{label:"視聴・閲覧履歴",icon:Or,href:new URL("myhistory",c).toString()}]:[],{label:"プロファイル切り替え",icon:Te,href:new URL("profile",c).toString()},...(null==t?void 0:t.env)&&(null==(l=null==e?void 0:e.defaultConfig)?void 0:l.endpoint.accountPortal)?[{label:"アカウント設定",icon:Lr,href:null==(a=null==e?void 0:e.defaultConfig)?void 0:a.endpoint.accountPortal,showAlert:!!o}]:[],{label:"ログアウト",onClick:p,icon:mr}])});return e&&ue({items:r},({items:t})=>{e(t)}),{...r,state:r,dispose:()=>{var t;null==(t=r.dispose)||t.call(r),null==n||n(),null==l||l(),null==c||c(),null==g||g(),null==d||d()}}})({showBindEnforcementAlert:n}),u=Ra(o);return ue({topPosition:u},({topPosition:t})=>{this.root instanceof HTMLElement&&Vt(this.root,{[La]:null===t?"0px":`${t}px`,[za]:null===t?"0":"1"})}),ce(e,ie(l,ee`<dialog
id="${r}"
class="${"SettingModal_dialog__z7fseo2"}"
aria-label="設定"
style=${qt({[La]:null===u.current?"0px":`${u.current}px`,[za]:null===u.current?"0":"1"})}
>
<div class="${"SettingModal_inner__z7fseo3"}">
${de({showBindEnforcementAlert:n},({showBindEnforcementAlert:t})=>t?xn({className:"SettingModal_bindEnforcement__z7fseo4",color:Yo.colorTextLayer,href:"https://www.nhk.or.jp/nhkone/how-to-use/article/H001-0001/#renkei",target:"_blank",rel:"noopener noreferrer",onClick:i,children:[ir({size:16}),"受信契約情報の登録・連携のお願い"]}):null)}
${de({accountProfile:h,siteConfig:s,authNOnlyMode:a},({accountProfile:t,siteConfig:e,authNOnlyMode:r})=>t&&!r&&e?ee`<div class="${"SettingModal_profileName__z7fseo5"}">
<img
src="${Ma(e.env,t.entity,t.profileType,t.icon)}"
alt=""
class="${"SettingModal_profileIcon__z7fseo6"}"
/>
${t.name}
</div>`:null)}
<ul class="${"SettingModal_menuList__z7fseo7"}" aria-label="設定一覧">
${de({settingMenuItems:d},({settingMenuItems:t})=>t.map(t=>ee`<li>
${t.href?xn({className:Pa,color:Yo.colorTextPrimary,href:t.href,onClick:i,children:[ee`<div class="${Ba}">
${t.icon({size:18})} ${t.label}
${t.showAlert?ee`<i class="${Fa}">${rr({size:18})}</i>`:null}
</div>`,qe({size:18})]}):oe({click:t.onClick},ee`<button class="${Pa}" type="button">
<span class="${Ba}">
${t.icon({size:18})} ${t.label}
${t.showAlert?ee`<i class="${Fa}">${rr({size:"100%"})}</i>`:null}
</span>
${qe({size:18})}
</button>`)}
</li>`))}
</ul>
</div>
${oe({click:i},ee`<div class="${"SettingModal_closeButtonContainer__z7fseob"}">
<button class="${"SettingModal_closeButton__z7fseoc"}" type="button">${Ke({})} 閉じる</button>
</div>`)}
</dialog>`))}});const Oa=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(){const[t]=fe(na),[e]=fe(Mo),[r]=fe(_a),[i]=fe(Ta),[o,n]=ae(!1),s=we(),{account:l,accountProfile:a}=ge(e,"account","accountProfile"),{env:c}=ge(t,"env"),{bindEnforcementStatus:h}=ge(i,"bindEnforcementStatus"),d=pe({account:l},({account:t})=>{var e;return null==(e=null==t?void 0:t.responseContent)?void 0:e.entity}),u=pe({bindEnforcementStatus:h},({bindEnforcementStatus:t})=>"未照合"===t||"照合NG"===t),p=pe({authNOnlyMode:r,entity:d,accountProfile:a,env:c},({authNOnlyMode:t,entity:e,accountProfile:r,env:i})=>t?"household"===e?Te({size:"100%"}):"business"===e?Ye({size:"100%"}):"school"===e?Ar({size:"100%"}):Zr({size:"100%"}):r&&i?ee`<img src="${Ma(i,r.entity,r.profileType,r.icon)}" alt="" class="${"Setting_profileIcon__1s8hu2t0"}" />`:Zr({size:"100%"}));return ca({onChange:()=>{n(!1)}}),this.root=ee`<template>
${va({active:o,icon:p,onClick:()=>n(!0),text:"設定",showAlert:u,ariaControls:s,ariaExpanded:o})}
${Za({id:s,open:o,onClose:()=>n(!1),showBindEnforcementAlert:u})}
</template>`,this.root}});const Da=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t){this.props={...t};const{emergencyMessage:e}=t;return this.root=ee`<div class="${"EmergencyMessage_container__12qdrf90"}">
<div class="${"EmergencyMessage_badge__12qdrf91"}">お知らせ</div>

${xn({...e.url&&!t.disableLink&&{href:e.url},className:"EmergencyMessage_messageContainer__12qdrf92",color:Yo.colorStatusTextInformation,children:ee`<template>
<span class="${"EmergencyMessage_message__12qdrf93"}">${e.body}</span> ${e.url&&ee`<i class="${"EmergencyMessage_chevronIcon__12qdrf94"}">${qe({size:"100%"})}</i>`}
</template>`})}
</div>`}});var Ha="var(--mobileVar_top__wkl5p80)",ja="var(--mobileVar_opacity__wkl5p81)";const Ua=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"refs",{rootRef:re(null),detailsRef:re(null),thirdListRef:re(null)})}get root(){return this.refs.rootRef.current}render(t,e){var r;const{item:i,onLinkClick:o,openModal:n}=t,[s,l]=ae(!1),{rootRef:a,detailsRef:c,thirdListRef:h}=this.refs;ue({openModal:n},({openModal:t})=>{var e;t||null==(e=c.current)||e.removeAttribute("open")});const d=i.items&&i.items.length>0,u=ee`<li class="${"SecondItem_secondItem__1ge2j1p0"}">
${d?oe({toggle:()=>{l(t=>!t)}},ie(this.refs.detailsRef,ee`<details class="${"SecondItem_secondItemDetails__1ge2j1p2"}">
<summary class="${"SecondItem_secondItemSummary__1ge2j1p3"}">
${i.label}
<i class="${"SecondItem_secondItemSummaryIcon__1ge2j1p4"}"
>${de({openAccordion:s},({openAccordion:t})=>t?_r({size:20}):$r({size:20}))}</i
>
</summary>
${ie(h,ee`<ul class="${"SecondItem_thirdList__1ge2j1p5"}">
${null==(r=i.items)?void 0:r.map(t=>ee`<li class="${"SecondItem_thirdItem__1ge2j1p6"}">
${xn({href:t.href,target:t.target,className:"SecondItem_thirdItemLink__1ge2j1p7",color:Yo.colorTextPrimary,onClick:()=>t.href&&o(),children:[t.label,t.href&&ee`<i class="${"SecondItem_thirdItemLinkIcon__1ge2j1p8"}">${qe({size:16})}</i>`]})}
${t.items&&t.items.length>0&&ee`<ul class="${"SecondItem_fourthList__1ge2j1p9"}">
${t.items.map(t=>ee`<li>
${xn({href:t.href,target:t.target,className:"SecondItem_fourthItemLink__1ge2j1pa",color:Yo.colorTextSecondary,onClick:()=>t.href&&o(),children:[t.label]})}
</li>`)}
</ul>`}
</li>`)}
</ul>`)}
</details>`)):xn({href:i.href,target:i.target,className:"SecondItem_secondItemLink__1ge2j1p1",color:Yo.colorTextPrimary,onClick:()=>i.href&&o(),children:[i.label]})}
</li>`;return ie(a,u),e&&ce(e,u),u}});const qa=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"refs",{rootRef:re(null)})}get root(){return this.refs.rootRef.current}initializeProps(t){return{id:t.id,open:t.open,onClose:t.onClose}}render(t,e){const{onClose:r,open:i,id:o}=this.props=this.initializeProps(t),[n]=fe(jt),{hamburgerMenu:s}=ge(n,"hamburgerMenu"),{dialogRef:l}=Na({open:i,onClose:r});this.refs.rootRef=l;const a=Ra(i),c=re(null);return ue({topPosition:a},({topPosition:t})=>{this.root instanceof HTMLElement&&Vt(this.root,{[Ha]:null===t?"0px":`${t}px`,[ja]:null===t?"0":"1"})}),ue({open:i},({open:t})=>{t&&requestAnimationFrame(()=>{var t;null==(t=c.current)||t.scrollTo({top:0,behavior:"instant"})})}),de({hamburgerMenu:s},({hamburgerMenu:e})=>e instanceof Error?null:ee`<dialog id="${o}" class="${"HamburgerMenuModal_dialog__wkl5p82"}" aria-label="メニュー" style="${qt({[ja]:"0"})}">
${ie(c,ee`<div class="${"HamburgerMenuModal_inner__wkl5p83"}">
<ul class="${"HamburgerMenuModal_firstList__wkl5p84"}">
${null==e?void 0:e.items.map(t=>ee`<li class="${"HamburgerMenuModal_firstItem__wkl5p85"}">
<div class="${"HamburgerMenuModal_firstItemLink__wkl5p86"}">${t.label}</div>
${t.items&&t.items.length>0&&ee`<ul>
${t.items.map(t=>Ua({item:t,openModal:i,onLinkClick:r}))}
</ul>`}
</li>`)}
</ul>
</div>`)}
<div class="${"HamburgerMenuModal_closeButtonContainer__wkl5p87"}">
${oe({click:t.onClose},ee`<button class="${"HamburgerMenuModal_closeButton__wkl5p88"}" type="button">${Ke({})} 閉じる</button>`)}
</div>
</dialog>`,{target:e,ref:this.refs.rootRef})}});const Wa=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"refs",{rootRef:re(null)})}get root(){return this.refs.rootRef.current}initializeProps(t){return{ref:t.ref??re(null)}}render(t,e){this.props=this.initializeProps(t);const[r]=fe(jt),i=pe({defaultConfig:r},({defaultConfig:t})=>(null==t?void 0:t.hamburgerMenu)instanceof Error),[o,n]=ae(!1),s=we();return ca({onChange:()=>{n(!1)}}),ee`<div>
${de({hideHamburgerMenu:i},({hideHamburgerMenu:t})=>t?null:ee`<template
>${va({active:o,icon:yr({size:"100%"}),onClick:()=>n(!0),text:"メニュー",ariaControls:s,ariaExpanded:o})}
${qa({id:s,open:o,onClose:()=>n(!1)})}
</template>`,{target:e})}
</div>`}});var Va="var(--mobileVar_top__1ofp6460)",Ja="var(--mobileVar_opacity__1ofp6461)",Xa={S:"SearchBox_height_S__10bo93i1",M:"SearchBox_height_M__10bo93i2",L:"SearchBox_height_L__10bo93i3"},Ga={S:"SearchBox_button_S__10bo93i5 SearchBox_buttonBase__10bo93i4",M:"SearchBox_button_M__10bo93i6 SearchBox_buttonBase__10bo93i4",L:"SearchBox_button_L__10bo93i7 SearchBox_buttonBase__10bo93i4"},Ka={S:"SearchBox_input_S__10bo93ib SearchBox_inputBase__10bo93ia",M:"SearchBox_input_M__10bo93ic SearchBox_inputBase__10bo93ia",L:"SearchBox_input_L__10bo93id SearchBox_inputBase__10bo93ia"};const Ya={S:14,M:16,L:18},Qa={S:18,M:20,L:22};const tc=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"value",[{current:""},void 0]),__publicField(this,"refs",{containerRef:re(null),inputRef:re(null)}),__publicField(this,"handleInput",()=>{var t,e;const r=this.refs.inputRef.current;if(!r)return;const[,i]=this.value;null==i||i(r.value),null==(e=null==(t=this.props)?void 0:t.onChange)||e.call(t,r.value)}),__publicField(this,"handleBlur",t=>{var e,r;null==(r=null==(e=this.props)?void 0:e.onBlur)||r.call(e,t)}),__publicField(this,"handleFocus",t=>{var e,r;null==(r=null==(e=this.props)?void 0:e.onFocus)||r.call(e,t)}),__publicField(this,"handleKeydown",t=>{var e;"Enter"!==t.key||t.isComposing||229===t.keyCode||null==(e=this.props)||e.onSubmit(this.value[0].current)}),__publicField(this,"handleClear",()=>{var t,e;if(!this.refs.inputRef.current)return;const[,r]=this.value;null==r||r(""),null==(e=null==(t=this.props)?void 0:t.onChange)||e.call(t,"")}),__publicField(this,"handleSubmit",()=>{var t;(null==(t=this.props)?void 0:t.onSubmit)&&this.props.onSubmit(this.value[0].current)}),__publicField(this,"handleHistoryBack",()=>{var t,e,r,i;const[,o]=this.value;null==o||o((null==(t=this.refs.inputRef.current)?void 0:t.value)??""),null==(i=null==(e=this.props)?void 0:e.onChange)||i.call(e,(null==(r=this.refs.inputRef.current)?void 0:r.value)??"")})}render(t,e){this.props=t;const{buttonType:r="icon",defaultValue:i="",size:o="M",customStyles:n,ref:s,inputRef:l,ariaLabelledby:a,value:c}=t,h=void 0!==c;this.value=h?[c,void 0]:ae(i);const[d,u]=this.value;h&&ue({valueProp:c},({valueProp:t})=>null==u?void 0:u(t)),s&&(s.current=this),l&&(this.refs.inputRef=l),ue({value:d},({value:t})=>{this.refs.inputRef.current&&(this.refs.inputRef.current.value=t)});const p=pe({value:d},({value:t})=>!t),g=yo({as:"div",className:`SearchBox_container__10bo93i0 ${Xa[o]}`,customStyles:n,children:ee`<template>
<div class="${"SearchBox_inputContainer__10bo93i9"}">
${ie(this.refs.inputRef,oe({input:this.handleInput,blur:this.handleBlur,focus:this.handleFocus,keydown:this.handleKeydown},ee`<input
aria-label="検索フォーム"
${a?`aria-labelledby="${a}"`:""}
type="search"
autocomplete="off"
spellcheck="false"
enterkeyhint="search"
class="${Ka[o]}"
value="${d.current}"
/>`))}
${de({valueIsEmpty:p},({valueIsEmpty:t})=>t?null:oe({click:this.handleClear},ee`<button type="reset" class="${"SearchBox_clear__10bo93i8"}" aria-label="クリア">
${Ke({size:Ya[o]})}
</button>`))}
</div>
${oe({click:this.handleSubmit},ee`<button type="button" class="${Ga[o]}">
${"text"===r?"検索する":ee`<template>${Mr({size:Qa[o]})}<span>検索する</span></template>`}
</button>`)}
</template>`});return removeEventListener("pageshow",this.handleHistoryBack),addEventListener("pageshow",this.handleHistoryBack),e&&e.replaceWith(g),this.root=g,g}dispose(){removeEventListener("pageshow",this.handleHistoryBack),this.refs.inputRef.current=null,this.root=null}});var ec={withSearchList:"SearchBoxWidget_container_withSearchList__g7xylv1 SearchBoxWidget_baseContainer__g7xylv0",withoutSearchList:"SearchBoxWidget_container_withoutSearchList__g7xylv2 SearchBoxWidget_baseContainer__g7xylv0"};const rc=(t={})=>{var e,r;const{onChange:i}=t;let o=(null==(r=null==(e=window.nhkLib)?void 0:e.profile)?void 0:r.searchProvider)??null;const n=i?()=>{var t,e;o=(null==(e=null==(t=window.nhkLib)?void 0:t.profile)?void 0:e.searchProvider)??null,o&&i(o)}:null;return n&&(window.addEventListener(kt.searchStateChange,n),setTimeout(n)),{current:o,dispose:()=>{n&&window.removeEventListener(kt.searchStateChange,n)}}};const ic=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"refs",{rootRef:re(null),searchBoxRef:re(null)}),__publicField(this,"disposable",[])}get root(){return this.refs.rootRef.current}render(t){const{_clearOnSubmit:e,_closeTimingOnOutsideClick:r="mousedown",ariaLabelledby:i,enableRedirect:o,onSubmit:n,defaultValue:s,onFocus:l,customStyles:a,...c}=this.props=t,{rootRef:h,searchBoxRef:d}=this.refs,[u]=fe(Mo),[p]=fe(rc),{searchList:g,initialized:f}=ge(p,"searchList","initialized"),[m,_]=ae(!1),[b,y]=ae(s||""),v=pe({showSearch:m,searchList:g},({showSearch:t,searchList:e})=>t&&e&&!!e.length),w=re(!1),C=re([]),k=re(null);((t,e,r={current:!1},i={current:{}})=>{ue({disable:r,options:i},({disable:r,options:{on:i="mouseup"}})=>{if(r)return;const o=r=>{t.current&&r.target instanceof Node&&!t.current.contains(r.target)&&e(r)};return document.addEventListener(i,o),()=>{document.removeEventListener(i,o)}})})(h,()=>_(!1),pe({showSearch:m},({showSearch:t})=>!t),{current:{on:r}});this.disposable.push(ue({showSearch:m,initialized:f},({showSearch:t,initialized:e})=>{var r;t&&!e&&(null==(r=p.current)||r.initializeSearchState())})),this.disposable.push(u,g,b,v,m,f);return ue({showSearchList:v},({showSearchList:t})=>{var e,r,i,o;if(!h.current)return;const n=ec.withSearchList.split(" ").filter(t=>t),s=ec.withoutSearchList.split(" ").filter(t=>t);t?(null==(e=h.current)||e.classList.remove(...s),null==(r=h.current)||r.classList.add(...n)):(null==(i=h.current)||i.classList.remove(...n),null==(o=h.current)||o.classList.add(...s))}),ie(h,oe({keydown:t=>{var e;if("ArrowUp"===t.key||"ArrowDown"===t.key){if(t.preventDefault(),document.activeElement===k.current)return void(null==(e=C.current[0])||e.focus());const r=C.current.findIndex(t=>t===document.activeElement);if(-1===r)return;const i=C.current.length,o=(r+("ArrowDown"===t.key?1:-1)+i)%i,n=C.current[o];null==n||n.focus()}}},yo({as:"div",customStyles:a,children:ee`<template>
${tc({...c,ref:d,inputRef:k,onSubmit:async t=>{var r,i;t&&(_(!1),e&&y(""),n?(await(null==(r=p.current)?void 0:r.createSearch(t,!o)),await n(t)):await(null==(i=p.current)?void 0:i.createSearch(t)))},onFocus:t=>{null==l||l(t),_(!0)},onBlur:t=>{var e;"mousedown"===r&&(w.current?w.current=!1:t.relatedTarget instanceof Node&&!(null==(e=h.current)?void 0:e.contains(t.relatedTarget))&&_(!1))},onChange:y,value:b,ariaLabelledby:i})}
${de({showSearchList:v},({showSearchList:t})=>t?oe({mousedown:()=>w.current=!0},ee`<div class="${"SearchBoxWidget_searchListContainer__g7xylv3"}">
<div class="${"SearchBoxWidget_scrollArea__g7xylv4"}">
${Fs({weight:"bold",children:"あなたの検索履歴"})}
${oe({touchstart:()=>{var t;null==(t=k.current)||t.blur()}},ee`<ul aria-label="検索履歴一覧">
${de({searchList:g},({searchList:t})=>(C.current=[],null==t?void 0:t.map((t,e)=>{const r=ee`<button type="button" class="${"SearchBoxWidget_itemButton__g7xylv6"}">
${t.searchKeyword}
</button>`;return C.current[e]=r,ee`<li key=${e} class="${"SearchBoxWidget_searchItem__g7xylv5"}">
${oe({click:()=>y(t.searchKeyword)},r)}
${oe({click:()=>{var e;return null==(e=p.current)?void 0:e.deleteSearchById({searchId:t.searchId})}},ee`<button type="button" class="${"SearchBoxWidget_deleteButton__g7xylv7"}">${tr({size:16})}削除する</button>`)}
</li>`})))}
</ul>`)}
</div>
</div>`):null)}
</template>`})))}dispose(){this.disposable.forEach(t=>{var e;return null==(e=t.dispose)?void 0:e.call(t)}),this.disposable=[]}});const oc=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"refs",{rootRef:re(null)})}get root(){return this.refs.rootRef.current}render(t,e){const{component:r,id:i,onClose:o,open:n}=this.props=t,[s]=fe(na),l=we(),{dialogRef:a}=Na({open:n,onClose:o});ue({topPosition:Ra(n)},({topPosition:t})=>{this.root instanceof HTMLElement&&Vt(this.root,{[Va]:null===t?"0px":`${t}px`,[Ja]:null===t?"0":"1"})}),this.refs.rootRef=a;const[c,h]=ae(""),d=t=>{if(!t||!s.current)return;h(""),o();const e=Mt[s.current.siteGroup][s.current.env],r=Tt[s.current.siteGroup];window.location.href=`${e}?${r}=${encodeURIComponent(t)}`};return ce(e,ie(a,ee`<dialog id="${i}" class="${"SearchModal_dialog__1ofp6462"}" aria-label="検索" style="${qt({[Ja]:"0"})}">
<div class="${"SearchModal_searchArea__1ofp6463"}">
<div id="${l}" class="${"SearchModal_title__1ofp6464"}">番組名やニュース、出演者などを検索</div>
${de({component:r},({component:t})=>"SearchBoxWidget"===t?ic({onSubmit:o,ariaLabelledby:l,enableRedirect:!0,_clearOnSubmit:!0,_closeTimingOnOutsideClick:"mouseup"}):tc({onSubmit:d,ariaLabelledby:l,value:c,onChange:h}))}
</div>
<div class="${"SearchModal_closeButtonContainer__1ofp6465"}">
${oe({mouseup:o,click:o},ee`<button class="${"SearchModal_closeButton__1ofp6466"}" type="button">${Ke({})} 閉じる</button>`)}
</div>
</dialog>`))}});const nc=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"refs",{rootRef:re(null)})}get root(){return this.refs.rootRef.current}initializeProps(t){return{...t,ref:t.ref??re(null)}}render(t,e){this.props=this.initializeProps(t);const{component:r}=this.props,[i,o]=ae(!1),n=we();ca({onChange:()=>{o(!1)}});const s=ee`<template>
${va({active:i,icon:Mr({size:"100%"}),onClick:()=>o(!0),text:"検索",ariaControls:n,ariaExpanded:i})}
${oc({id:n,component:r,open:i,onClose:()=>o(!1)})}
</template>`;return this.refs.rootRef.current=s,e&&ce(e,s),s}});var sc="var(--mobileVar_top__za5css0)",lc="var(--rightPosition__za5css1)",ac="var(--dialogOpacity__za5css2)";const cc=(t,e={})=>{const{watchWindowResize:r={current:!1},watchWindowScroll:i={current:!1}}=e,[o,n]=ae(null);return ue({target:t,watchWindowResize:r,watchWindowScroll:i},({target:t,watchWindowResize:e,watchWindowScroll:r})=>{const i="string"==typeof t?document.getElementById(t):t;if(!(i&&i instanceof Element))return void n(null);const o=()=>{n(i.getBoundingClientRect())};o();const s=new IntersectionObserver(o);s.observe(i);const l=new ResizeObserver(o);return l.observe(i),e&&window.addEventListener("resize",o,{passive:!0}),r&&window.addEventListener("scroll",o,{passive:!0}),()=>{s.disconnect(),l.disconnect(),e&&window.removeEventListener("resize",o),r&&window.removeEventListener("scroll",o)}}),o};const hc=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"refs",{rootRef:re(null)})}get root(){return this.refs.rootRef.current}render(t,e){const{buttonId:r,id:i,onClose:o,open:n}=this.props=t,[s]=fe(jt),{dialogRef:l}=Na({open:n,onClose:o}),a=Ra(n),c=(()=>{const[t,e]=ae(0),r=()=>{{const t=window.innerWidth-document.documentElement.clientWidth;e(t>0?t:0)}};return r(),window.addEventListener("resize",r),t.addDisposeListener(()=>{window.removeEventListener("resize",r)}),t})(),h=cc({current:r},{watchWindowResize:{current:!0}});this.refs.rootRef=l;const[d,u]=ae(null);ue({open:n,buttonRect:h,scrollbarWidth:c},({open:t,buttonRect:e,scrollbarWidth:r})=>{requestAnimationFrame(()=>{if(t&&l.current&&e){const t=window.innerWidth-r,i=l.current.getBoundingClientRect();let o=t-e.right+e.width/2-i.width/2;o<0&&(o=0),o+i.width>t&&(o=t-i.width),u(o)}else u(null)})});const p=pe({defaultConfig:s},({defaultConfig:t})=>(null==t?void 0:t.serviceMenu)??null);return ue({rightPosition:d,topPosition:a},({rightPosition:t,topPosition:e})=>{l.current&&Vt(l.current,{[lc]:null===t?"0px":`${t}px`,[ac]:null===e||null===t?"0":"1",[sc]:null===e?"0px":`${e}px`})}),ce(e,ie(l,ee`<dialog
id="${i}"
class="${"ServiceModal_dialog__za5css3"}"
aria-label="サービス"
style="${qt({[ac]:null===a||null===d?"0":"1"})}"
>
<ul class="${"ServiceModal_menuList__za5css4"}">
${de({serviceMenu:p},({serviceMenu:t})=>t instanceof Error?null:null==t?void 0:t.items.map(t=>ee`<li class="${"ServiceModal_menuItem__za5css5"}">
${xn({onClick:o,href:t.href,target:t.target,className:"ServiceModal_menuItemLink__za5css6",color:"currentColor",children:[ee`<img src="${t.iconImageSrc}" alt="" class="${"ServiceModal_menuItemIcon__za5css7"}" />`,ee`<span class="${"ServiceModal_menuItemLabel__za5css8"}">${t.label}</span>`]})}
</li>`))}
</ul>
<div class="${"ServiceModal_closeButtonContainer__za5css9"}">
${oe({click:o},ee`<button class="${"ServiceModal_closeButton__za5cssa"}" type="button">${Ke({})} 閉じる</button>`)}
</div>
</dialog>`))}});const dc=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"refs",{rootRef:re(null),buttonRef:re(null)})}get root(){return this.refs.rootRef.current}initializeProps(t){return{...t,ref:t.ref??re(null)}}render(t,e){this.props=this.initializeProps(t);const[r,i]=ae(!1),o=we(),n=`service-button-${o}`,s=`service-modal-${o}`,{rootRef:l,buttonRef:a}=this.refs,[c]=fe(jt),h=pe({defaultConfig:c},({defaultConfig:t})=>(null==t?void 0:t.serviceMenu)instanceof Error);return ca({onChange:()=>{i(!1)}}),ee`<div>
${de({hideServiceMenu:h},({hideServiceMenu:t})=>t?null:ee`<template>
${ie(a,va({active:r,icon:Tr({size:"100%"}),onClick:()=>i(!0),text:"サービス",ariaExpanded:r,ariaControls:o,id:n}))}
${hc({id:s,buttonId:n,open:r,onClose:()=>i(!1)})}
</template>`,{target:e,ref:l})}
</div>`}});var uc="var(--linkPaddingRight__19s7gsf2)",pc="var(--linkHeightDesktop__19s7gsf3)",gc="var(--linkHeightMobile__19s7gsf4)",fc="var(--indicatorWidth__19s7gsf5)",mc="HeaderNewsTicker_iconButton__19s7gsff",_c="HeaderNewsTicker_fastIconButton__19s7gsfg";class bc{constructor(t){__publicField(this,"displayItems",[]),__publicField(this,"calcResults",[]),__publicField(this,"items",[]),__publicField(this,"itemIndex",0),__publicField(this,"columnIndex",0),__publicField(this,"nodes",[]);const e=[];t.forEach(t=>{t.title.split("\n").forEach(r=>{const i=r.trim();if(i){const r={...t,title:i};e.push(r)}})}),this.items=e;const r=e.slice(0);this.items.length>0?this.displayItems=[r[r.length-1],...r,r[0]]:this.displayItems=r,this.itemIndex=1,this.columnIndex=0,this.nodes=[],this.calcResults=[]}get currentItem(){return this.items[this.itemIndex-1]}rendered(t){this.nodes=t,this.calcResults=[];let e=0,r=0;this.nodes.forEach((t,i)=>{const o=0===i||i===this.nodes.length-1,n=t.scrollWidth,s=t.getBoundingClientRect().width,l=s+0,a=l?n/l:0,c=(l?n%l:0)<3?Math.floor(a):Math.ceil(a),h=Math.max(1,c);this.calcResults[i]={columnWidth:l,totalColumns:h,scrollWidth:n,clientWidth:s,startPageNumber:o?0:e+1,endPageNumber:o?0:e+h,transformOffset:r},o||(e+=h),r-=l});const i=this.calcResults[0],o=this.calcResults[this.calcResults.length-1],n=this.calcResults[1],s=this.calcResults[this.calcResults.length-2];return i.startPageNumber=s.startPageNumber,i.endPageNumber=s.endPageNumber,o.startPageNumber=n.startPageNumber,o.endPageNumber=n.endPageNumber,this.actionResult("none",!1)}resized(){this.calcResults=[];const t=this.rendered(this.nodes),e=this.calcResults[this.itemIndex];return e?this.columnIndex>e.totalColumns-1&&(this.columnIndex=e.totalColumns-1):this.columnIndex=0,t.columnIndex=this.columnIndex,t}next(){const t=this.calcResults[this.itemIndex];if(this.columnIndex<t.totalColumns-1)return this.columnIndex++,this.actionResult("next",!0);this.columnIndex=0,this.itemIndex++;let e=!0;return this.itemIndex>this.calcResults.length-1&&(this.itemIndex=0,e=!1),this.actionResult("next",e)}prev(){if(this.columnIndex>0)return this.columnIndex--,this.actionResult("prev",!0);let t=!0;this.itemIndex>0?this.itemIndex--:(this.itemIndex=this.calcResults.length-1,t=!1);const e=this.calcResults[this.itemIndex];return this.columnIndex=e.totalColumns-1,this.actionResult("prev",t)}changeIfOutOfRange(){return 0===this.itemIndex?(this.itemIndex=this.items.length,this.actionResult("prev",!1)):this.itemIndex>this.items.length?(this.itemIndex=1,this.actionResult("next",!1)):null}actionResult(t,e){const r=this.calcResults[this.itemIndex];if(!r)return{itemIndex:this.itemIndex,columnIndex:this.columnIndex,totalPage:0,currentPage:0,columnScroll:0,transformOffset:0,direction:"none",withAnimation:!1};const i=this.calcResults[this.calcResults.length-2].endPageNumber,o=r.startPageNumber+this.columnIndex;return{itemIndex:this.itemIndex,columnIndex:this.columnIndex,totalPage:i,currentPage:o,columnScroll:r.columnWidth*this.columnIndex,transformOffset:r.transformOffset,direction:t,withAnimation:e}}}const yc=Qt(class extends Yt{constructor(){super(),__publicField(this,"root",null),__publicField(this,"_control",null),__publicField(this,"_chevron",null),__publicField(this,"_indicator",null),__publicField(this,"_resizeTimer",null),__publicField(this,"_requestResize",!1),__publicField(this,"_firstRendered",!1),__publicField(this,"_play",!0),__publicField(this,"_logic",null),__publicField(this,"_list",null),__publicField(this,"_itemNodes",[]),__publicField(this,"_resizeObserver",null),__publicField(this,"_afterTransitionEnd",!1),__publicField(this,"_hidden",!1),__publicField(this,"_timer",null),__publicField(this,"_startPauseButton",null),__publicField(this,"_actionResult",{itemIndex:0,columnIndex:0,totalPage:0,currentPage:0,columnScroll:0,transformOffset:0,direction:"none",withAnimation:!1}),__publicField(this,"handlePlayClickBound"),__publicField(this,"handlePrevClickBound"),__publicField(this,"handleNextClickBound"),__publicField(this,"handleVisibilityChangeBound"),__publicField(this,"handleTransitionEndBound"),__publicField(this,"handleControlFocusBound"),__publicField(this,"handleLinkFocusBound"),this.handlePlayClickBound=this.handlePlayClick.bind(this),this.handlePrevClickBound=this.handlePrevClick.bind(this),this.handleNextClickBound=this.handleNextClick.bind(this),this.handleVisibilityChangeBound=this.handleVisibilityChange.bind(this),this.handleTransitionEndBound=this.handleTransitionEnd.bind(this),this.handleControlFocusBound=this.handleControlFocus.bind(this),this.handleLinkFocusBound=this.handleLinkFocus.bind(this),this._resizeObserver=new ResizeObserver(()=>{this._resizeTimer&&clearTimeout(this._resizeTimer),this._resizeTimer=setTimeout(()=>{this._resizeTimer=null,this._requestResize=!0,this.updateView(),setTimeout(()=>{if(!this._logic)return;const t=this._logic.resized();this._actionResult=t,this._requestResize=!1,this.updateView()},10)},50)})}updateView(){var t,e,r;this._control&&(this._actionResult.totalPage>1?this._control.style.display="flex":this._control.style.display="none"),this._indicator&&(this._indicator.innerText=`${this._actionResult.currentPage}/${this._actionResult.totalPage}`),this._chevron&&(!(null==(t=this.props)?void 0:t.disableLink)&&(null==(r=null==(e=this._logic)?void 0:e.currentItem)?void 0:r.link)?this._chevron.style.display="flex":this._chevron.style.display="none"),this._list&&(this._list.style.transform=`translateX(${this._actionResult.transformOffset}px)`,this._list.style.transition=this._actionResult.withAnimation?"400ms":"none");const i=this._logic;if(!i)return;this._itemNodes.forEach((t,e)=>{var r,o,n;Vt(t,{[uc]:(null==(r=this.props)?void 0:r.disableLink)?"0px":"20px",[pc]:this._requestResize?"unset":`calc(${null==(o=i.calcResults[e])?void 0:o.totalColumns} * ${cn} * 1em)`,[gc]:this._requestResize?"unset":`calc(2 * ${null==(n=i.calcResults[e])?void 0:n.totalColumns} * ${cn} * 1em)`});const s=t.querySelector("a");e===this._actionResult.itemIndex?(null==s||s.removeAttribute("aria-hidden"),null==s||s.removeAttribute("tabindex")):(null==s||s.setAttribute("aria-hidden","true"),null==s||s.setAttribute("tabindex","-1"))});const o=this._itemNodes[this._actionResult.itemIndex];if(!o)return;const n=(()=>this._actionResult.withAnimation?o.scrollLeft>this._actionResult.columnScroll&&"next"===this._actionResult.direction||o.scrollLeft<this._actionResult.columnScroll&&"prev"===this._actionResult.direction?"instant":"smooth":"instant")();o.addEventListener("scrollend",()=>{const t=i.changeIfOutOfRange();t&&(this._actionResult=t,this.updateView())},{once:!0}),o.scrollTo({left:this._actionResult.columnScroll,behavior:n}),this._indicator&&Vt(this._indicator,{[fc]:.7*(2*(""+this._actionResult.totalPage).length+1)+"em"})}stopTimer(){this._play&&(this._play=!1,this._startPauseButton&&(this._startPauseButton.innerHTML="",this._startPauseButton.append(Sr({size:14}))),this._timer&&(clearTimeout(this._timer),this._timer=null))}handleTransitionEnd(){if(this._afterTransitionEnd=!0,this._logic){const t=this._logic.changeIfOutOfRange();t&&(this._actionResult=t,this.updateView())}}handleVisibilityChange(){this._hidden=document.hidden}handlePlayClick(){this._play=!this._play,this._startPauseButton&&(this._startPauseButton.innerHTML="",this._startPauseButton.append(this._play?Cr({size:14}):Sr({size:14}))),this._play?this.startTimer():this._timer&&(clearTimeout(this._timer),this._timer=null)}handlePrevClick(){if(this.stopTimer(),this._logic){const t=this._logic.changeIfOutOfRange();if(t)return this._actionResult=t,this.updateView(),void setTimeout(()=>{if(!this._logic)return;const t=this._logic.prev();this._actionResult=t,this.updateView()},0);this._actionResult=this._logic.prev(),this.updateView()}}handleNextClick(){if(this.stopTimer(),this._logic){const t=this._logic.changeIfOutOfRange();if(t)return this._actionResult=t,this.updateView(),void setTimeout(()=>{if(!this._logic)return;const t=this._logic.next();this._actionResult=t,this.updateView()},0);this._actionResult=this._logic.next(),this.updateView()}}handleControlFocus(){this.stopTimer()}handleLinkFocus(){if(!this._logic)return;const t=this._itemNodes[this._actionResult.itemIndex],e=this._logic.calcResults[this._actionResult.itemIndex];t&&e&&e.totalColumns>1&&0!==t.scrollLeft&&t.addEventListener("scroll",()=>{t.scrollTo({left:this._actionResult.columnScroll,behavior:"instant"})},{once:!0}),this.stopTimer()}startTimer(){if(!this._play||this._hidden||this._actionResult.totalPage<2)return;const t=this._afterTransitionEnd?5600:6e3;this._timer=setTimeout(()=>{if(this._logic){const t=this._logic.next();this._actionResult=t,this.updateView(),this.startTimer()}},t)}render(t,e){var r;const{items:i,disableLink:o,customStyles:n,ref:s}=t;s&&(s.current=this),this.props=t,this._logic||(this._logic=new bc(i));const l=this._logic,a=ee`<ul class="${"HeaderNewsTicker_list__19s7gsfb"}"></ul>`;l.displayItems.forEach(t=>{const e=xn({className:"HeaderNewsTicker_link__19s7gsfe",color:"currentColor",...o?{}:t.link,children:t.title,style:qt({[uc]:o?"0px":"20px",[pc]:"unset",[gc]:"unset"})});oe({focus:this.handleLinkFocusBound},e);const r=ee`<li class="${"HeaderNewsTicker_item__19s7gsfc"}">${e}</li>`;a.append(r),this._itemNodes.push(r)}),this._list=a;const c=ee`<button class="${di(mc,"HeaderNewsTicker_pausePlayIcon__19s7gsfi")}" title="play-pause">
${this._play?Cr({size:14}):Sr({size:14})}
</button>`;oe({click:this.handlePlayClickBound},c),this._startPauseButton=c;const h=ee`<button class="${di(mc,_c)}" aria-label="1つ前のアイテムに移動">
${nr({size:12})}
</button>`;oe({click:this.handlePrevClickBound,focus:this.handleControlFocusBound},h);const d=ee`<span
class="${"HeaderNewsTicker_currentItemIndicator__19s7gsfh"}"
style="${qt({[fc]:.7*(2*(""+this._actionResult.totalPage).length+1)+"em"})}"
>${this._actionResult.currentPage}/${this._actionResult.totalPage}</span
>`;this._indicator=d;const u=ee`<button class="${di(mc,_c)}" aria-label="1つ後ろのアイテムに移動">
${or({size:12})}
</button>`;oe({click:this.handleNextClickBound,focus:this.handleControlFocusBound},u);const p=ee`<div class="${"HeaderNewsTicker_controlInner__19s7gsfk"}">${h}${d}${u}</div>`,g=ee`<div class="${"HeaderNewsTicker_controlContainer__19s7gsfj"}">${c}${p}</div>`;this._control=g;const f=ee`<div class="${"HeaderNewsTicker_chevron__19s7gsfa"}">${qe({size:18})}</div>`;!o&&(null==(r=l.currentItem)?void 0:r.link)||(f.style.display="none"),this._chevron=f;const m=ee`<div class="${"HeaderNewsTicker_inner__19s7gsf7"}">
<div class="${"HeaderNewsTicker_news__19s7gsf8"}">
<span class="${"HeaderNewsTicker_label__19s7gsfd"}">速報</span>
<div class="${"HeaderNewsTicker_listContainer__19s7gsf9"}">${a}</div>
${f}
</div>
${g}
</div>`,_=yo({as:"div",customStyles:n,role:"region",className:"HeaderNewsTicker_container__19s7gsf6",children:m});return _.setAttribute("aria-label","ニュース速報ティッカー"),this.root=_,e&&e.replaceWith(_),this._firstRendered||(setTimeout(()=>{this._resizeObserver&&this._list&&this._resizeObserver.observe(this._list),this._list&&this._list.addEventListener("transitionend",this.handleTransitionEndBound),document.addEventListener("visibilitychange",this.handleVisibilityChangeBound),l&&(this._actionResult=l.rendered(this._itemNodes),this.updateView(),this.startTimer())},0),this._firstRendered=!0),this._logic=l,_}update(t){this.root&&this.props&&this.render({...this.props,...t},this.root)}dispose(){this._timer&&(clearTimeout(this._timer),this._timer=null),this._resizeObserver&&(this._resizeObserver.disconnect(),this._resizeObserver=null),this._control=null,this._chevron=null,this._indicator=null,this._logic=null,this._list=null,this._itemNodes=[],this._startPauseButton=null,document.removeEventListener("visibilitychange",this.handleVisibilityChangeBound)}});const vc=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"refs",{rootRef:re(null),containerRef:re(null)}),__publicField(this,"states",{customStyles:ae({})}),__publicField(this,"_disposable",[])}get root(){return this.refs.rootRef.current}render(t,e){const{ref:r,onFocus:i}=t;this.props={...t},r&&(r.current=this);const{disableShadow:o}=t,{containerRef:n,rootRef:s}=this.refs,[l,a]=this.states.customStyles;a(t.customStyles||{}),ue({customStyles:l},({customStyles:t})=>{var e;return null==(e=this.refs.containerRef.current)?void 0:e.update({customStyles:t})});const c=fe(na)[0],{defaultConfigError:h,hamburgerMenu:d,serviceMenu:u}=ge(fe(jt)[0],"defaultConfigError","hamburgerMenu","serviceMenu"),{initialized:p,authType:g}=ge(fe(Mo)[0],"authType","initialized"),f=fe(sa)[0],m=ca({}),{initialized:_,isInJapan:b}=ge(fe(oa)[0],"isInJapan","initialized"),y=fe(_a)[0],[v]=fe(ga),w=pe({emergencyMessages:v},({emergencyMessages:t})=>null==t?void 0:t.contents[0]),C=(({onChange:t})=>{const[e,r]=ae(!1),[i,o]=fe(jt),[n,s]=fe(na),[l,a]=fe(oa),[c,h]=fe(Mo),{dispose:d}=ue({defaultConfig:i,siteConfig:n,isInJapan:l,auth:c},({defaultConfig:t,siteConfig:e,isInJapan:i,auth:o})=>{const{defaultConfig:n}=t||{},{authType:s}=o??{};if(!(null==i?void 0:i.isInJapan))return void r(!1);if("accountAuthZ"!==s&&"accountlessAuthZ"!==s)return void r(!1);const l=(null==n?void 0:n.config.showAreaDropdown.overwritable)?(null==e?void 0:e.showAreaDropdown)??n.config.showAreaDropdown.default:null==n?void 0:n.config.showAreaDropdown.default;r(l||!1)});return t&&ue({showAreaDropdown:e},({showAreaDropdown:e})=>{t(e)}),{...e,state:e,dispose:()=>{e.dispose(),null==o||o(),null==s||s(),null==a||a(),null==h||h(),null==d||d()}}})({}).state,k=pe({isInJapan:b,authNOnlyMode:y},({isInJapan:t,authNOnlyMode:e})=>(!t&&e)??!1),S=pe({isAuthNOnlyAndInAbroad:k,defaultConfigError:h,hamburgerMenu:d},({isAuthNOnlyAndInAbroad:t,defaultConfigError:e,hamburgerMenu:r})=>!t&&!(e||r instanceof Error)),$=pe({authType:g,siteConfig:c,isInJapan:b},({authType:t,siteConfig:e,isInJapan:r})=>(("accountAuthZ"===t||"accountlessAuthZ"===t)&&!(null==e?void 0:e.hideSearchBox)&&r)??!1),x=pe({authType:g,isMobile:m,isInJapan:b,defaultConfigError:h,serviceMenu:u},({authType:t,isMobile:e,isInJapan:r,defaultConfigError:i,serviceMenu:o})=>(("accountlessAuthZ"!==t||!e)&&r&&!(i||o instanceof Error))??!1);ue({disableShadow:o},({disableShadow:t})=>{var e;null==(e=this.refs.containerRef.current)||e.update({className:ea[t?"withoutShadow":"withShadow"]})});const E=yo({as:"header",id:Pt,containerRef:n,customStyles:l.current,className:ea[o.current?"withoutShadow":"withShadow"],children:ee`<template>
<div id="${Bt}" class="${"NHKHeader_containerInner__101v3yx2"}">
<div class="${"NHKHeader_leftArea__101v3yx3"}">
${de({showHamburgerMenu:S},({showHamburgerMenu:t})=>t?Wa({}):null)}
<div class="${"NHKHeader_logoAndAreaChangeDropdownContainer__101v3yx4"}">
${Ia(null)}
${de({showAreaDropdown:C},({showAreaDropdown:t})=>t?ia({size:"S",variant:"compact"}):null)}
</div>
</div>
${de({authInitialized:p,isInJapanInitialized:_,isMobile:m,isAuthNOnlyAndInAbroad:k,emergencyMessage:w},({authInitialized:t,isInJapanInitialized:e,isMobile:r,isAuthNOnlyAndInAbroad:i,emergencyMessage:o})=>t&&e&&o&&!r?Da({disableLink:i,emergencyMessage:o}):null)}
<div class="${"NHKHeader_rightArea__101v3yx5"}">
${de({authInitialized:p,isInJapanInitialized:_,isInJapan:b,showSearch:$,authType:g,showService:x},({authInitialized:t,isInJapanInitialized:e,isInJapan:r,showSearch:i,authType:o,showService:n})=>t&&e?ee`<template>
${i&&ee`<div data-auth-type="${o}" class="${"NHKHeader_searchContainer__101v3yx6"}">
${nc({component:{current:"SearchBoxWidget"}})}
</div>`}
${n?ee`<div data-auth-type="${o}" class="${"NHKHeader_serviceContainer__101v3yx7"}">${dc({})}</div>`:null}
${!("accountAuthN"===o||"accountAuthZ"===o)&&wa(null)}
${!("accountAuthN"===o||"accountAuthZ"===o)&&r&&Aa(null)}
${("accountAuthN"===o||"accountAuthZ"===o)&&Oa(null)}
</template>`:null)}
</div>
</div>
${ma(null)}
${de({isMobile:m,isAuthNOnlyAndInAbroad:k,emergencyMessage:w},({isMobile:t,isAuthNOnlyAndInAbroad:e,emergencyMessage:r})=>t&&r?Da({disableLink:e,emergencyMessage:r}):null)}
${de({flashNews:f,isAuthNOnlyAndInAbroad:k},({flashNews:t,isAuthNOnlyAndInAbroad:e})=>t&&t.length>0?yc({items:t,disableLink:e}):null)}
</template>`});return i&&(E.addEventListener("focusin",i),this._disposable.push({dispose:()=>E.removeEventListener("focusin",i)})),s.current=E,e&&ce(e,E),this.root}update(t){if(!this.root||!this.props)return;const e={...this.props,...t};this.props=e;const[,r]=this.states.customStyles;r(e.customStyles||{})}dispose(){this._disposable.forEach(t=>{var e;return null==(e=t.dispose)?void 0:e.call(t)})}});var wc={withShadow:"NHKHeaderNoAuth_container_withShadow__1p4b1pn0",withoutShadow:"NHKHeaderNoAuth_container_withoutShadow__1p4b1pn1"};const Cc=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"refs",{rootRef:re(null),containerRef:re(null)}),__publicField(this,"states",{customStyles:ae({})}),__publicField(this,"_disposable",[])}get root(){return this.refs.rootRef.current}render(t,e){var r;const{ref:i}=t;this.props={...t},i&&(i.current=this);const{disableShadow:o}=t,{containerRef:n,rootRef:s}=this.refs,[l,a]=this.states.customStyles;a(t.customStyles||{});const c=fe(na)[0],h=(null==(r=c.current)?void 0:r.siteGroup)??"",{defaultConfigError:d,hamburgerMenu:u,serviceMenu:p}=ge(fe(jt)[0],"defaultConfigError","hamburgerMenu","serviceMenu"),g=fe(sa)[0],f=ca({}),{isInJapan:m}=ge(fe(oa)[0],"isInJapan"),_=fe(_a)[0],b=pe({defaultConfigError:d,hamburgerMenu:u},({defaultConfigError:t,hamburgerMenu:e})=>!(t||e instanceof Error)),y=pe({defaultConfigError:d,serviceMenu:p},({defaultConfigError:t,serviceMenu:e})=>!(t||e instanceof Error)),[v]=fe(ga),w=pe({emergencyMessages:v},({emergencyMessages:t})=>null==t?void 0:t.contents[0]),C=pe({siteConfig:c},({siteConfig:t})=>t?Ea(t.env,".nhk.or.jp"):""),k=pe({siteConfig:c},({siteConfig:t})=>t?Ea(t.env,".nhk"):""),S=pe({isInJapan:m,authNOnlyMode:_},({isInJapan:t,authNOnlyMode:e})=>(!t&&e)??!1),$=()=>{window.location.href="https://www.nhk-cs.jp/"},x=()=>{window.location.href=k.current};ue({disableShadow:o},({disableShadow:t})=>{var e;null==(e=this.refs.containerRef.current)||e.update({className:wc[t?"withoutShadow":"withShadow"]})});const E=de({customStyles:l},({customStyles:t})=>yo({as:"header",id:Pt,containerRef:n,customStyles:t,className:wc[o.current?"withoutShadow":"withShadow"],children:ee`<template>
<div id="${Bt}" class="${"NHKHeaderNoAuth_containerInner__1p4b1pn2"}">
<div class="${"NHKHeaderNoAuth_leftArea__1p4b1pn3"}">
${de({showHamburgerMenu:b},({showHamburgerMenu:t})=>t?Wa({}):null)}
${de({logoUrl:C},({logoUrl:t})=>xn({className:"NHKHeaderNoAuth_logoContainer__1p4b1pn7",color:{light:"#808080",dark:"#ffffff"},href:t,children:Jl({})}))}
</div>
${de({isMobile:f,emergencyMessage:w},({isMobile:t,emergencyMessage:e})=>!t&&e?Da({emergencyMessage:e}):null)}
<div class="${"NHKHeaderNoAuth_rightArea__1p4b1pn4"}">
${nc({component:{current:"SearchBox"}})}
${de({showService:y},({showService:t})=>t?ee`<div class="${"NHKHeaderNoAuth_serviceContainer__1p4b1pn5"}">${dc({})}</div>`:null)}
${de({isMobile:f},({isMobile:t})=>t?null:Ao({type:"button",buttonType:"secondary",size:"S",onClick:$,children:"受信料の窓口",_customDataAttribute:"dms"===h?{}:{"data-click":"nhkcs-button"}}))}
${Ao({type:"button",buttonType:"secondary",size:{desktop:"S",mobile:"XS"},onClick:x,customStyles:{px:{mobile:gn,desktop:fn}},children:ee`<span class="${"NHKHeaderNoAuth_nhkOneLogoContainer__1p4b1pn8"}">${$a({})}</span>`,_customDataAttribute:"dms"===h?{}:{"data-click":"nhkone-button"}})}
</div>
</div>
${de({isMobile:f,isAuthNOnlyAndInAbroad:S,emergencyMessage:w},({isMobile:t,isAuthNOnlyAndInAbroad:e,emergencyMessage:r})=>t&&r?Da({disableLink:e,emergencyMessage:r}):null)}
${de({flashNews:g,isAuthNOnlyAndInAbroad:S},({flashNews:t,isAuthNOnlyAndInAbroad:e})=>t&&t.length>0?yc({items:t,disableLink:e}):null)}
</template>`}),{ref:s});return s.current=E,e&&ce(e,E),this.root}update(t){if(!this.root||!this.props)return;const e={...this.props,...t};this.props=e;const[,r]=this.states.customStyles;r(e.customStyles||{})}dispose(){this._disposable.forEach(t=>{var e;return null==(e=t.dispose)?void 0:e.call(t)})}}),kc=t=>"undefined"==typeof window||null===navigator.userAgent.match(/\bNHK[\w ]+\/\d/)&&"true"!==new URLSearchParams(window.location.search).get("app")&&!window.isAppWebView?null:t.getCustomAppName();var Sc=Object.defineProperty,$c=(t,e,r)=>((t,e,r)=>e in t?Sc(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r)(t,"symbol"!=typeof e?e+"":e,r);const xc=()=>{const t=navigator.userAgent;return t.includes("Android")?screen.width>la?"tablet":"mobile":t.includes("iPad")?"tablet":t.includes("iPhone")||t.includes("iPod")?"mobile":navigator.maxTouchPoints>2?"tablet":"pc"};class Ec{constructor(t,e,r){$c(this,"stop",()=>{this.timer&&(clearTimeout(this.timer),this.timer=void 0)}),$c(this,"callback"),$c(this,"timer"),$c(this,"heartbeatData"),$c(this,"manager"),$c(this,"count",0),$c(this,"getHeartbeatType",()=>this.lastHeartbeatSent?Date.now()-this.lastHeartbeatSent>=this.heartbeatData.interval.HBInterval2?(this.lastHeartbeatSent=Date.now(),"Interval2"):null:(this.lastHeartbeatSent=Date.now(),"Start")),$c(this,"lastHeartbeatSent"),$c(this,"tick",()=>{if(this.count>=2&&("view"===this.heartbeatData.mediaAction||"read"===this.heartbeatData.mediaAction))return;const t=this.getHeartbeatType();t&&(this.send(t),this.count++),this.timer=setTimeout(this.tick,500)}),$c(this,"send",async t=>{const[e,r,i,o]=(()=>"Start"===t?[0,"start",0,0]:[2,"continuity",this.heartbeatData.interval.HBInterval2,this.heartbeatData.interval.HBInterval2])(),n=navigator.userAgent,s={...this.heartbeatData,message:"heartbeat",value:r,interval:i,currentPosition:o,type:e,deviceType:xc(),ua:n,dateBeat:(new Date).toISOString()};if(!1!==Ac(s))try{await this.manager.createHeartbeat(s)}catch(l){this.callback.onError(l)}else this.callback.onError(new Error("Invalid heartbeat parameters"))}),this.heartbeatData=t,this.manager=e,this.callback=r,this.tick()}updateHeartbeatProps(t,e,r){this.heartbeatData=t,this.manager=e,this.callback=r,this.tick()}}const Ic={value:["start","end","discontinuity","continuity"],type:[0,1,2],status:["optedin","optedout","optunknown","none"],modeOfItem:["tv","radio","news","webcontent"],typeOfItem:["RadioEpisode","TVEpisode","NewsArticle","WebContent","BroadcastEvent","NPlaylist"],typeOfList:["news","series","editorial","program","search","linear","schedule","moment"],mediaAction:["watch","watchDigest","watchTrailer","watchAsset","view","read","listen"],appName:["nhk-tep-web","nhk-nwa-web","nhk-edu-web","nhk-at-web","nhk-rep-web","nhk-tep-ios","nhk-tep-android","nhk-nwa-ios","nhk-nwa-android","nhk-edu-ios","nhk-edu-android","nhk-rep-ios","nhk-rep-android","nhk-tep-html5","nhk-tep-firetv","nhk-tep-androidtv","bx-components-test"],deviceType:["mobile","tablet","pc","tv"],profileType:["shared","personal","child","private","member","unknown","anonymous","emergency","abroad"]},Ac=t=>{for(const e in Ic){const r=Ic[e],i=t[e];if("profileType"===e||"status"===e){if(null==i||""===i)continue;const t=String(i).split(",").map(t=>t.trim());for(const e of t)if(!(null==r?void 0:r.includes(e)))return!1}else{if(null==i||""===i)return!1;if(!(null==r?void 0:r.includes(i)))return!1}}return!0},Mc=(t={})=>{var e;const{onChange:r}=t,i=r?()=>{var t;const e=null==(t=window.nhkLib)?void 0:t.deviceId;e&&r(e)}:null;return i&&(setTimeout(i),window.addEventListener(kt.deviceIdChange,i),window.addEventListener(kt.nhkProviderStateChange,i)),{current:(null==(e=window.nhkLib)?void 0:e.deviceId)??null,dispose:()=>{i&&(window.removeEventListener(kt.deviceIdChange,i),window.removeEventListener(kt.nhkProviderStateChange,i))}}},Tc=(t={})=>{var e;const{onChange:r}=t,i=r?()=>{var t;const e=null==(t=window.nhkLib)?void 0:t.profile;r&&e&&r(e)}:null;return i&&(window.addEventListener(kt.profileStateChange,i),setTimeout(i)),{current:(null==(e=window.nhkLib)?void 0:e.profile)??null,dispose:()=>{i&&window.removeEventListener(kt.profileStateChange,i)}}},Lc=re(null),zc=re(!1),Pc=()=>({showSnackbar:t=>{var e,r;const{isInDialog:i=!1,...o}=t;if(Lc.current){if(zc.current===i)return void(null==(e=Lc.current)||e.update(t));null==(r=Lc.current)||r.dispose(),Lc.current=null}let n=document.body;i&&(n=document.querySelector("dialog[open]")||document.body),zc.current=i;const s=Cs({...o,ref:Lc,open:!0,onClose:()=>{var t;null==(t=Lc.current)||t.update({open:!1})}});if(s&&(n.appendChild(s),n!==document.body)){const t=n,e=()=>{var e;t.isConnected&&t.hasAttribute("open")||(null==(e=Lc.current)||e.update({open:!1}),r.disconnect())},r=new MutationObserver(e);
// istanbul ignore else @preserve 要素の親要素がnullである場合、isConnectedはfalseとなる。このケースは下のcheck()呼び出しでカバーする
t.parentElement&&r.observe(t.parentElement,{childList:!0}),r.observe(t,{attributes:!0}),e(),be(s).then(()=>r.disconnect())}}}),Bc=()=>{const[t,e]=ae(null),r=()=>{var t;const{manager:r,initialized:i,account:o,accountProfile:n,accountlessProfile:s}=(null==(t=window.nhkLib)?void 0:t.auth)||{};e((({manager:t,initialized:e,account:r,accountProfile:i,accountlessProfile:o})=>{var n;if(!e||!t)return null;const s=t.getAuthType();if("accountAuthZ"===s)return{tag:"ac2",area:(null==r?void 0:r.responseContent.area)??"999",profileId:(null==i?void 0:i.profileId)??"",entity:(null==i?void 0:i.entity)??"",profileType:(null==i?void 0:i.profileType)??"",policyVer:(null==r?void 0:r.responseContent.consentToHistoryFeature.ver)??"",status:(null==r?void 0:r.responseContent.consentToHistoryFeature.status)??""};if("accountlessAuthZ"===s)return{tag:"ac1",area:(null==(n=t.getConsentToUseData())?void 0:n.area.areaId)??"999",profileId:(null==o?void 0:o.profileId)??"",entity:(null==o?void 0:o.entity)??"",profileType:(null==o?void 0:o.profileType)??"",policyVer:o?"none":"",status:o?"optunknown":""};return null})({manager:r,initialized:i??!1,account:o,accountProfile:n,accountlessProfile:s}))};return window.addEventListener(kt.authStateChange,r),r(),t.addDisposeListener(()=>{window.removeEventListener(kt.authStateChange,r)}),t},Fc=({onChange:t})=>{const e=Bc(),{dispose:r}=ue({data:e},({data:e})=>t(e));return e.addDisposeListener(r),{dispose:()=>{e.dispose()}}},Rc=t=>{const e=fe(na)[0],r=fe(Mo)[0],{manager:i}=ge(r,"manager"),{appName:o}=ge(e,"appName"),n=fe(Mc)[0],s=Bc(),{initialized:l,getDefaultHBConfig:a}=(()=>{var t,e,r,i;const[o,n]=ae((null==(e=null==(t=window.nhkLib)?void 0:t.heartbeatConfigProvider)?void 0:e.initialized)??!1),[s,l]=ae((null==(i=null==(r=window.nhkLib)?void 0:r.heartbeatConfigProvider)?void 0:i.getDefaultHBConfig)??null);return window.addEventListener(kt.heartbeatConfigChange,()=>{
// istanbul ignore if @preserve このイベントが発火した時点でNHKProviderは存在する
var t;if(!(null==(t=window.nhkLib)?void 0:t.heartbeatConfigProvider))return;const e=window.nhkLib.heartbeatConfigProvider;n(e.initialized),l(()=>e.getDefaultHBConfig)}),{initialized:o,getDefaultHBConfig:s}})(),[c,h]=ae(null),[d,u]=ae(!1);ue({initialized:l,getDefaultHBConfig:a},async({initialized:t,getDefaultHBConfig:e})=>{if(t&&e){const t=await e();h(t),u(!0)}});const p=pe({body:t,appName:o,authManager:i,deviceId:n,profileRelated:s,defaultHBConfig:c,isDefaultHBConfigCalled:d},({body:t,appName:e,authManager:r,deviceId:i,profileRelated:o,defaultHBConfig:n,isDefaultHBConfigCalled:s})=>null===e||null===r||null===i?null:(t=>{const{appName:e,authManager:r,body:i,deviceId:o,profileRelated:n,defaultHBConfig:s,isDefaultHBConfigCalled:l}=t;if(!l||!n)return null;const a=i.interval?i.interval:s?{HBInterval1:0,HBInterval2:s.articleHeartbeatIntervalType2}:{HBInterval1:0,HBInterval2:zt};return{...i,...n,appName:kc(r)||e,deviceId:o,interval:a,duration:i.duration??a.HBInterval2}})({appName:e,authManager:r,deviceId:i,profileRelated:o,defaultHBConfig:n,isDefaultHBConfigCalled:s,body:t}));return p.addDisposeListener(()=>{e.dispose(),o.dispose(),n.dispose(),s.dispose(),c.dispose(),d.dispose()}),p},Nc=(t,e)=>{let r=!1;const[i,o]=ae(t),[n,s]=ae(!!e),l=fe(Mo)[0],{manager:a,initialized:c}=ge(l,"manager","initialized"),h=fe(Tc)[0],{manager:d}=ge(h,"manager"),{showSnackbar:u}=Pc(),p=Rc(i),g=re(null),f=re(null),m=ue({disabledState:n,authInitialized:c,heartbeatData:p,authManager:a,profileManager:d},({disabledState:t,authInitialized:e,heartbeatData:i,authManager:o,profileManager:n})=>{if(!r&&i&&o&&n)return(t=>{const{disabled:e,authManager:r,authInitialized:i,profileManager:o,heartbeatData:n,showSnackbar:s,heartbeatInstanceRef:l,lastItemIdRef:a}=t,c=null==r?void 0:r.getAuthType();if(!(i&&c&&"accountAuthN"!==c&&o&&n))return()=>{};if(e)return l.current=null,()=>{};a.current!==n.itemId&&(l.current=null,a.current=n.itemId);const h=t=>{var e;if(t instanceof H&&409===t.statusCode&&("view"===n.mediaAction||"read"===n.mediaAction)){const r=null==(e=t.rawError)?void 0:e.error;3100===(r instanceof Object&&"code"in r&&"number"==typeof r.code?r.code:null)&&s({title:"一定時間内に閲覧できるページ数の上限を超えました。",description:"時間をおいて再度アクセスしてください。",type:"error"})}};return l.current?l.current.updateHeartbeatProps(n,o,{onError:h}):l.current=new Ec(n,o,{onError:h}),()=>{var t;null==(t=l.current)||t.stop()}})({disabled:t,authInitialized:e??!1,heartbeatData:i,authManager:o,profileManager:n,showSnackbar:u,heartbeatInstanceRef:g,lastItemIdRef:f})}),_=[m,l,h,i,n,c,p,a,d];return{dispose:()=>{var t;r=!0,_.forEach(t=>t.dispose()),s(!0),null==(t=null==g?void 0:g.current)||t.stop(),g.current=null},disable:()=>{var t;s(!0),null==(t=null==g?void 0:g.current)||t.stop(),g.current=null},enable:()=>{if(r)throw new Error("useHeartbeat is disposed");s(!1)},update:t=>{o(e=>({...e,...t}))}}};const Zc=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"props",null),__publicField(this,"accentButtonRef",re(null)),__publicField(this,"dispose",()=>{this.root=null,this.props=null})}render(t,e){this.props=t;const{onClick:r,size:i="M",ref:o}=t;o&&(o.current=this);const n=rl({ref:this.accentButtonRef,size:i,leftIcon:"ShareFilledIcon",buttonType:"secondary",onClick:r,children:"シェアする"});return e&&ce(e,n),this.root=n,n}update(t){var e,r;if(!this.props)return;const i={...this.props,...t};t.size&&(null==(e=this.accentButtonRef.current)||e.update({size:i.size})),t.onClick&&(null==(r=this.accentButtonRef.current)||r.update({onClick:i.onClick})),this.props=i}});var Oc="var(--marginBottom__j8fra63)",Dc="var(--flexDirection__1k39fo90)",Hc="var(--checkColor__1k39fo91)",jc="var(--checkWidth__1k39fo92)",Uc="var(--checkHeight__1k39fo93)",qc="var(--checkTop__1k39fo94)",Wc="var(--checkLeft__1k39fo95)",Vc={S:"Checkbox_size_S__1k39fo99",M:"Checkbox_size_M__1k39fo9a",L:"Checkbox_size_L__1k39fo9b"},Jc={horizontal:"Checkbox_gap_horizontal__1k39fo9c",vertical:"Checkbox_gap_vertical__1k39fo9d"};const Xc={S:{width:"8px",height:"4px",top:"6.5px",left:"3.5px"},M:{width:"10px",height:"5px",top:"7px",left:"4px"},L:{width:"12px",height:"6px",top:"8px",left:"4px"}};const Gc=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"props",null),__publicField(this,"inputRef",re(null)),__publicField(this,"dispose",()=>{var t;null==(t=this.root)||t.remove(),this.root=null,this.props=null})}render(t,e){this.props=t;const{checked:r,color:i,defaultChecked:o,disabled:n,id:s,label:l,labelPlacement:a="right",name:c,onBlur:h,onChange:d,onFocus:u,size:p="M",value:g,customStyles:f,ref:m}=t;m&&(m.current=this);const _="left"===a||"right"===a,b=ee`<input
type="checkbox"
class="${"Checkbox_input__1k39fo97"}"
${void 0!==r?`checked="${r}"`:""}
${o?`checked="${o}"`:""}
${n?"disabled":""}
${s?`id="${s}"`:""}
${c?`name="${c}"`:""}
${g?`value="${g}"`:""}
/>`;d&&oe({change:d},b),h&&oe({blur:h},b),u&&oe({focus:u},b),this.inputRef.current=b;const y=["top"===a||"left"===a?l:null,ee`<span class="${"Checkbox_control__1k39fo96"}">
<span
style="${qt({[Hc]:i,[jc]:Xc[p].width,[Uc]:Xc[p].height,[qc]:Xc[p].top,[Wc]:Xc[p].left})}"
class="${"Checkbox_checkbox__1k39fo9e"}"
></span>
${b}
</span>`,"right"===a||"bottom"===a?l:null].filter(Boolean),v=yo({customStyles:f,...l?{as:"label",onclick:()=>{}}:{as:"div"},className:di("Checkbox_container__1k39fo98",Vc[p],Jc[_?"horizontal":"vertical"]),style:qt({[Dc]:{top:"column",bottom:"column",right:"row",left:"row"}[a]}),children:y});return e&&ce(e,v),this.root=v,v}update(t){if(!this.root||!this.props)return;const e={...this.props,...t};this.render(e,this.root)}});var Kc="Modal_overlay__1p23p6d0",Yc="Modal_backdrop__1p23p6d1",Qc={L:"Modal_content_L__1p23p6d2",M:"Modal_content_M__1p23p6d3",S:"Modal_content_S__1p23p6d4"},th="Modal_contentShadow__1p23p6d5";const eh=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"props",null),__publicField(this,"setters",null),__publicField(this,"abortController",null),__publicField(this,"dispose",()=>{var t,e;null==(t=this.abortController)||t.abort(),null==(e=this.root)||e.remove(),this.root=null,this.props=null,this.setters=null})}get element(){return this.root}render(t,e){var r,i;null==(r=this.abortController)||r.abort(),this.abortController=new AbortController;const{children:o,open:n,ariaLabel:s,ariaLabelledby:l,disableBackdropBlur:a,size:c,hideCloseButton:h,disableBackgroundClickClose:d,disableEscapekeyClose:u,modalType:p,customStyles:g}=this.propsToState(t);this.props=t,t.ref&&(t.ref.current=this);const f=re(null),m=re(null),_=re(null),b=re(null),[y,v]=ae(!1),w=(t=>{const{elementRef:e,direction:r="horizontal"}=t,[i,o]=ae(!1),n=()=>{const t=e.current;o(!!t&&("horizontal"===r?t.scrollWidth>t.clientWidth:t.scrollHeight>t.clientHeight))},s=()=>{const t=e.current;if(!t)return void o(!1);n();const r=new ResizeObserver(n);r.observe(t);const i=new MutationObserver(n);return i.observe(t,{childList:!0,subtree:!0,characterData:!0}),()=>{r.disconnect(),i.disconnect()}};let l=s();return le(e)&&ue({elementRef:e},()=>{null==l||l(),l=s()}),i.addDisposeListener(()=>{null==l||l(),i.dispose()}),i})({elementRef:b});let C;const k=()=>{var t;m.current&&!m.current.open&&(null==(t=m.current)||t.showModal(),C=((t={current:!0})=>{const e=ks(),r=e.style.overflow,i=e.style.paddingRight,o=()=>{const t=window.innerWidth-e.clientWidth;e.style.overflow="hidden",t>0&&(e.style.paddingRight=`${t}px`)},n=()=>{e.style.overflow=r,e.style.paddingRight=i};return ue({locked:t},({locked:t})=>(t&&o(),()=>n())),{lock:o,unlock:n}})().unlock)},S=()=>{m.current&&m.current.open&&(m.current.close(),null==C||C())};ue({open:n},({open:t})=>{t?k():S()},{abortSignal:this.abortController.signal});const $=()=>{var t;null==(t=this.props)||t.onClose()};ue({disableBackgroundClickClose:d,open:n,mounted:y},({disableBackgroundClickClose:t,open:e,mounted:r})=>{if(e&&r&&!t){const t=t=>{var e;t.target instanceof Node&&!(null==(e=_.current)?void 0:e.contains(t.target))&&$()};return document.addEventListener("click",t),()=>{document.removeEventListener("click",t)}}},{abortSignal:this.abortController.signal}),ue({disableEscapekeyClose:u,open:n,mounted:y},({disableEscapekeyClose:t,open:e,mounted:r})=>{if(e&&r){const e=e=>{"Escape"===e.key&&(e.preventDefault(),t||$())};return document.addEventListener("keydown",e),()=>{document.removeEventListener("keydown",e)}}},{abortSignal:this.abortController.signal}),ue({customStyles:g},({customStyles:t})=>{var e;null==(e=f.current)||e.update({customStyles:t})},{abortSignal:this.abortController.signal}),ue({disableBackdropBlur:a},({disableBackdropBlur:t})=>{var e,r,i;null==(e=f.current)||e.update({className:di(Kc,!t&&Yc)}),t?null==(r=_.current)||r.classList.add(th):null==(i=_.current)||i.classList.remove(th)},{abortSignal:this.abortController.signal}),ue({ariaLabel:s},({ariaLabel:t})=>{var e,r;this.root instanceof HTMLDialogElement&&(t?null==(e=this.root)||e.setAttribute("aria-label",t):null==(r=this.root)||r.removeAttribute("aria-label"))},{abortSignal:this.abortController.signal}),ue({ariaLabelledby:l},({ariaLabelledby:t})=>{var e,r;this.root instanceof HTMLDialogElement&&(t?null==(e=this.root)||e.setAttribute("aria-labelledby",t):null==(r=this.root)||r.removeAttribute("aria-labelledby"))},{abortSignal:this.abortController.signal}),ue({modalType:p},({modalType:t})=>{var e,r;this.root instanceof HTMLDialogElement&&(t?null==(e=this.root)||e.setAttribute("data-modal-type",t):null==(r=this.root)||r.removeAttribute("data-modal-type"))},{abortSignal:this.abortController.signal});const x=ie(m,yo({customStyles:g.current,className:di(Kc,!a.current&&Yc),as:"dialog",containerRef:f,children:de({size:c},({size:t})=>ie(_,ee`<div class=${di(Qc[t],a&&th)} tabindex="-1">
${de({hasScrollbar:w,children:o},({hasScrollbar:t,children:e})=>ie(b,ee`<div ${t&&"tabindex=0"} class=${"Modal_contentInner__1p23p6d6"}>${e}</div>`))}
${de({hideCloseButton:h},({hideCloseButton:t})=>ee`${!t&&oe({click:$},ee`<button class="${"Modal_closeButton__1p23p6d7"}">
${Ke({size:18})}
<span class="${"Modal_closeButtonText__1p23p6d8"}">閉じる</span>
</button>`)}`)}
</div>`))}));return function(t,e,r){let i=()=>{};_e(t,r).then(()=>{var o;const n=new MutationObserver(()=>{var r;(null==(r=me(t))?void 0:r.isConnected)||(n.disconnect(),e())});i=()=>{n.disconnect()},n.observe(document,{childList:!0,subtree:!0}),null==r||r.addEventListener("abort",()=>{n.disconnect()}),(null==(o=me(t))?void 0:o.isConnected)||(n.disconnect(),e()),(null==r?void 0:r.aborted)&&n.disconnect()})}(x,()=>{v(!1),S()},this.abortController.signal),function(t,e,r){var i;const o=new MutationObserver(()=>{var r;(null==(r=me(t))?void 0:r.isConnected)&&e()});o.observe(document,{childList:!0,subtree:!0}),null==r||r.addEventListener("abort",()=>{o.disconnect()}),(null==(i=me(t))?void 0:i.isConnected)&&e()}(x,()=>{v(!0),n.current&&k()},this.abortController.signal),this.abortController.signal.addEventListener("abort",()=>{null==C||C()}),null==(i=this.root)||i.replaceWith(x),this.root=x,e&&e.replaceWith(x),x}update(t){if(!this.props||!this.setters)return;const{open:e,ariaLabel:r,ariaLabelledby:i,disableBackdropBlur:o,size:n="L",hideCloseButton:s,disableBackgroundClickClose:l,disableEscapekeyClose:a,modalType:c,children:h,customStyles:d}={...this.props,...t};this.setters.open(e),this.setters.ariaLabel(r),this.setters.ariaLabelledby(i),this.setters.disableBackdropBlur(o),this.setters.size(n),this.setters.hideCloseButton(s),this.setters.disableBackgroundClickClose(l),this.setters.disableEscapekeyClose(a),this.setters.modalType(c),this.setters.customStyles(d),this.setters.children(h),this.props={...this.props,...t}}propsToState(t){const{ariaLabel:e,ariaLabelledby:r,disableBackdropBlur:i,size:o="L",open:n,hideCloseButton:s,disableBackgroundClickClose:l,disableEscapekeyClose:a,children:c,modalType:h,customStyles:d}=t,u=ae(n),p=ae(e),g=ae(r),f=ae(i),m=ae(o),_=ae(s),b=ae(l),y=ae(a),v=ae(d),w=ae(c),C=ae(h);this.setters={open:u[1],ariaLabel:p[1],ariaLabelledby:g[1],disableBackdropBlur:f[1],size:m[1],hideCloseButton:_[1],disableBackgroundClickClose:b[1],disableEscapekeyClose:y[1],modalType:C[1],customStyles:v[1],children:w[1]};return{open:u[0],ariaLabel:p[0],ariaLabelledby:g[0],disableBackdropBlur:f[0],size:m[0],hideCloseButton:_[0],disableBackgroundClickClose:b[0],disableEscapekeyClose:y[0],modalType:C[0],children:w[0],customStyles:v[0]}}});const rh=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"props",null),__publicField(this,"modalRef",re(null)),__publicField(this,"openState",ae(!1)),__publicField(this,"currentTimeState",ae(void 0)),__publicField(this,"urlState",ae(void 0)),__publicField(this,"isPrioritizeUrl",ae(!1)),__publicField(this,"targetUrlState",ae("")),__publicField(this,"checkboxCheckedState",ae(!1)),__publicField(this,"abortController",null),__publicField(this,"dispose",()=>{var t;null==(t=this.abortController)||t.abort(),this.root=null,this.props=null})}render(t,e){var r,i;const{showSnackbar:o}=Pc();null==(r=this.abortController)||r.abort(),this.abortController=new AbortController,this.props=t;const{onClose:n,open:s,currentTime:l,url:a,isPrioritizeUrl:c,ref:h}=t;h&&(h.current=this),this.openState[1](s),this.currentTimeState[1](l),this.urlState[1](a),this.isPrioritizeUrl[1](!!c);const d=null==(i=document.querySelector("meta[property='og:url']"))?void 0:i.getAttribute("content"),u=(c?a||d:d||a)||window.location.href;this.targetUrlState[1](u);const p=t=>{var e;if(this.checkboxCheckedState[1](t),t&&l){const t=this.targetUrlState[0].current,e=new URL(t);e.searchParams.set("startOffset",String(l)),this.targetUrlState[1](e.toString())}else{const t=null==(e=document.querySelector("meta[property='og:url']"))?void 0:e.getAttribute("content"),r=(c?a||t:t||a)||window.location.href;this.targetUrlState[1](r)}},g=async()=>{const t=this.targetUrlState[0].current;if(t)try{await navigator.clipboard.writeText(t),o({title:"コピーしました",type:"success",isInDialog:!0})}catch{}};ue({open:this.openState[0],url:this.urlState[0],isPrioritizeUrl:this.isPrioritizeUrl[0]},({open:t,url:e,isPrioritizeUrl:r})=>{var i;if(t){const t=null==(i=document.querySelector("meta[property='og:url']"))?void 0:i.getAttribute("content"),o=(r?e||t:t||e)||window.location.href;this.targetUrlState[1](o)}}),ue({currentTime:this.currentTimeState[0],targetUrl:this.targetUrlState[0]},({currentTime:t,targetUrl:e})=>{if(t&&this.checkboxCheckedState[0].current){const r=new URL(e);r.searchParams.set("startOffset",String(t)),this.targetUrlState[1](r.toString())}},{abortSignal:this.abortController.signal});const f=(t,e,r)=>({ref:r,onClose:n,open:e,modalType:"ShareModule",size:"M",children:ee`<div class="${"SocialShareModal_container__j8fra60"}">
${Fs({align:"center",lineHeight:"heading",weight:"bold",children:ee`<span class="${"SocialShareModal_headlineText__j8fra61"}">シェアする</span>`})}
${t?ee`<div class="${"SocialShareModal_urlShareContainer__j8fra62"}">
${Fs({children:"以下のURLが共有されます。"})}
<div
class="${"SocialShareModal_urlTextBox__j8fra64"}"
style="${qt({[Oc]:l?fn:"0px"})}"
>
${Fs({size:"S",lineHeight:"heading",children:t})}
</div>
${l?Gc({defaultChecked:this.checkboxCheckedState[0].current,onChange:t=>{const e=t.target;p(e.checked)},label:"再生時間をURLに含める"}):""}
</div>`:""}
<div class="${"SocialShareModal_copyContainer__j8fra65"}">
${oe({click:g},ee`<button class="${"SocialShareModal_copyButtonContainer__j8fra67"}">
<span class="${"SocialShareModal_copyButton__j8fra68"}"> ${hr({size:"24"})} </span>
<span class="${"SocialShareModal_iconLabel__j8fra66"}">コピーする</span>
</button>`)}
</div>
</div>`});ue({targetUrl:this.targetUrlState[0],open:this.openState[0]},({targetUrl:t,open:e})=>{var r;null==(r=this.modalRef.current)||r.render(f(t,e))});const m=eh(f(this.targetUrlState[0].current,s,this.modalRef));return e&&ce(e,m),this.root=m,m}update(t){if(!this.props)return;const e={...this.props,...t};this.currentTimeState[1](e.currentTime),this.urlState[1](e.url||""),this.openState[1](e.open),this.isPrioritizeUrl[1](!!e.isPrioritizeUrl),this.props=e}});class ih extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"props",null),__publicField(this,"buttonRef",re(null)),__publicField(this,"modalRef",re(null)),__publicField(this,"openModal",!1),__publicField(this,"dispose",()=>{var t;null==(t=this.root)||t.remove(),this.root=null,this.props=null})}render(t,e){this.props=t;const{size:r="M",customStyles:i,currentTime:o,url:n,isPrioritizeUrl:s,ref:l}=t;l&&(l.current=this);const a=Zc({ref:this.buttonRef,size:r,onClick:async()=>{if(this.props)if(this.props.isShowModal)this.openModal=!0,this.update({});else{const{title:e,description:r,url:i,isPrioritizeUrl:o}=this.props,n=function(t,e,r){var i,o,n;const{title:s,description:l,url:a}=t,c=(null==(i=document.querySelector("meta[property='og:title']"))?void 0:i.getAttribute("content"))||s||"",h=(null==(o=document.querySelector("meta[property='og:description']"))?void 0:o.getAttribute("content"))||l||"",d=null==(n=document.querySelector("meta[property='og:url']"))?void 0:n.getAttribute("content"),u=(r?a||d:d||a)||window.location.href,p=[c,h].filter(Boolean).join(" ");return{title:c,text:p,url:u}}({title:e,description:r,url:i},0,o);if(navigator.share)try{await navigator.share(n)}catch(t){if(t instanceof DOMException){if("AbortError"===t.name)return;if("InvalidStateError"===t.name)return}this.openModal=!0,this.update({})}else this.openModal=!0,this.update({})}}}),c=rh({ref:this.modalRef,open:this.openModal,onClose:()=>{this.openModal=!1,this.update({})},currentTime:o,url:n,isPrioritizeUrl:s}),h=yo({as:"div",customStyles:i,className:"ShareModule_container__r7clai0",children:[...Array.isArray(a)?a:[a],c]});return e&&ce(e,h),this.root=h,h}update(t){var e,r;if(!this.root||!this.props)return;const i={...this.props,...t};t.size&&t.size!==this.props.size&&(null==(e=this.buttonRef.current)||e.update({size:i.size})),t.customStyles?this.render(i,this.root):(null==(r=this.modalRef.current)||r.update({currentTime:i.currentTime,url:i.url,open:this.openModal,isPrioritizeUrl:i.isPrioritizeUrl}),this.props=i)}}const oh={news:"__bx_newsAppBanner",plus:"__bx_plusAppBanner",forSchool:"__bx_forSchoolAppBanner"},nh=t=>{const{appBannerType:e,onChange:r}=t;let i=null;const o=async t=>{var r;if(!e||!t)return null;if((null==(r=document.cookie.split("; ").find(t=>t.startsWith(`${oh[e]}=`)))?void 0:r.split("=")[1])||null)return null;try{return i=await(async(t,e)=>{const r="news"===t?e.endpoint.appBanner_news:"plus"===t?e.endpoint.appBanner_plus:e.endpoint.appBanner_forschool,i=await fetch(r);if(!i.ok){const t=[`${i.status}`,i.statusText,await i.text()].filter(t=>t).join(" ");throw new Error(`Failed to fetch: ${t}`)}return i.json()})(e,t),i}catch{return null}},[n,s]=fe(jt),{defaultConfig:l}=ge(n,"defaultConfig");return ue({defaultConfig:l},async({defaultConfig:t})=>{null==r||r(await o(t))}),{current:i,closeAppBanner:()=>{
// istanbul ignore if -- @preserve
if(!e||!i)return;const{expires:t}=i.default,o=24*Number(t)*60*60;document.cookie=`${oh[e]}=closed; max-age=${o}`,null==r||r(null)},dispose:s}};var sh=Object.defineProperty,lh=(t,e,r)=>((t,e,r)=>e in t?sh(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r)(t,"symbol"!=typeof e?e+"":e,r);class ah extends Error{constructor(t,e,r=null){super(t),lh(this,"statusCode"),lh(this,"rawError",null),this.name="APIError",this.statusCode=e,this.rawError=r}}var ch=Object.defineProperty,hh=(t,e,r)=>((t,e,r)=>e in t?ch(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r)(t,"symbol"!=typeof e?e+"":e,r);class dh{constructor(t,e,r,i){hh(this,"baseUrl"),hh(this,"authManager"),hh(this,"defaultFetchOptions"),hh(this,"options"),this.baseUrl=t.endsWith("/")?t:`${t}/`,this.authManager=e,this.defaultFetchOptions=r,this.options=i}async fetch(t,e,r,i=!1){var o;const n={...e,credentials:"include"},s=await fetch(t,n);if(401===s.status&&!i&&"undefined"!=typeof window){try{await this.authManager.refreshToken(r)}catch(l){throw new Error("Failed to refresh token")}return await this.fetch(t,n,r,!0)}if(200!==s.status){let t="API Error";const e=s.status;let r=null;try{const e=await s.json();t=null==(o=null==e?void 0:e.error)?void 0:o.message,r=e}catch{t=await s.text()}throw new ah(t,e,r)}return s.json()}async get(t,e,r){const i=new URLSearchParams(e).toString(),o=t.startsWith("/")?t.slice(1):t,n=`${this.baseUrl}${o}${i?`?${i}`:""}`,s=this.authManager.getTokens().accountAuthZ.accessToken?"accountAuthZ":"accountlessAuthZ",l={...this.defaultFetchOptions,...r,method:"GET"};return this.fetch(n,l,s)}}class uh extends dh{async get(t,e,r){var i;return super.get(t,{...e,...(null==(i=this.options)?void 0:i.scope)&&{scope:this.options.scope}},r)}getTVEpisode(t,e,r){var i;return this.get(`t/tvepisode/te/${t}.json`,{...e,...(null==(i=this.options)?void 0:i.addExtendedEntitiesToEpisodeRequest)&&{extendedEntities:"true"}},r)}getTVEpisodeListByNPlaylistId(t,e,r){var i;return this.get(`l/tvepisode/pl/${t}.json`,{...e,...(null==(i=this.options)?void 0:i.addExtendedEntitiesToEpisodeRequest)&&{extendedEntities:"true"}},r)}getRadioEpisode(t,e,r){var i;return this.get(`t/radioepisode/re/${t}.json`,{...e,...(null==(i=this.options)?void 0:i.addExtendedEntitiesToEpisodeRequest)&&{extendedEntities:"true"}},r)}getRadioEpisodeListByNPlaylistId(t,e,r){var i;return this.get(`l/radioepisode/pl/${t}.json`,{...e,...(null==(i=this.options)?void 0:i.addExtendedEntitiesToEpisodeRequest)&&{extendedEntities:"true"}},r)}getBroadcastService(t,e,r){const i=t.replace(/^bs-/,"");return this.get(`t/broadcastservice/bs/${i}.json`,e,r)}getNewsArticle(t,e,r){return this.get(`t/newsarticle/na/${t}.json`,e,r)}getNewsArticleListByNPlaylistId(t,e,r){return this.get(`l/newsarticle/pl/${t}.json`,e,r)}getNPlaylist(t,e,r){return this.get(`t/nplaylist/pl/${t}.json`,e,r)}async getNPlaylistWithTVEpisodeList(t,e,r){const i=await this.get(`t/nplaylist/pl/${t}.json`,e,r),o=i.itemUrl.replace(this.baseUrl,"");return{nplaylist:i,episodeList:await this.get(o,void 0,r)}}async getNPlaylistWithRadioEpisodeList(t,e,r){const i=await this.get(`t/nplaylist/pl/${t}.json`,e,r),o=i.itemUrl.replace(this.baseUrl,"");return{nplaylist:i,episodeList:await this.get(o)}}getNPlaylistListByTVEpisodeId(t,e,r){return this.get(`l/nplaylist/te/${t}.json`,e,r)}getNPlaylistListByRadioEpisodeId(t,e,r){return this.get(`l/nplaylist/re/${t}.json`,e,r)}getNPlaylistListByNewsArticleId(t,e,r){return this.get(`l/nplaylist/na/${t}.json`,e,r)}getNPlaylistListByNDeckId(t,e,r){return this.get(`l/nplaylist/dk/${t}.json`,e,r)}getNDeck(t,e,r){return this.get(`t/ndeck/dk/${t}.json`,e,r)}getBroadcastServiceListByNPlaylistId(t,e,r){return this.get(`l/broadcastservice/pl/${t}.json`,e,r)}getBroadcastEventListByTVEpisodeId(t,e,r){return this.get(`l/broadcastevent/te/${t}.json`,e,r)}getBroadcastEventListByRadioEpisodeId(t,e,r){return this.get(`l/broadcastevent/re/${t}.json`,e,r)}getBundleListByTVEpisodeId(t,e,r){return this.get(`l/bundle/te/${t}.json`,e,r)}getBundleListByRadioEpisodeId(t,e,r){return this.get(`l/bundle/re/${t}.json`,e,r)}getBundleListByNPlaylistId(t,e,r){return this.get(`l/bundle/pl/${t}.json`,e,r)}getBundleListInfoByTVEpisodeId(t,e,r){return this.get(`l/bundle/te/${t}/types.json`,e,r)}getBundleListInfoByRadioEpisodeId(t,e,r){return this.get(`l/bundle/re/${t}/types.json`,e,r)}getConst(t,e){return this.get("const.json",t,e)}}class ph extends dh{async get(t,e,r){var i;return super.get(t,{...e,...(null==(i=this.options)?void 0:i.scope)&&{scope:this.options.scope}},r)}getTVEpisode(t,e,r){var i;return this.get(`t/tvepisode/te/${t}.json`,{...e,...(null==(i=this.options)?void 0:i.addExtendedEntitiesToEpisodeRequest)&&{extendedEntities:"true"}},r)}getTVEpisodeListByNPlaylistId(t,e,r){var i;return this.get(`l/tvepisode/pl/${t}.json`,{...e,...(null==(i=this.options)?void 0:i.addExtendedEntitiesToEpisodeRequest)&&{extendedEntities:"true"}},r)}getRadioEpisode(t,e,r){var i;return this.get(`t/radioepisode/re/${t}.json`,{...e,...(null==(i=this.options)?void 0:i.addExtendedEntitiesToEpisodeRequest)&&{extendedEntities:"true"}},r)}getRadioEpisodeListByNPlaylistId(t,e,r){var i;return this.get(`l/radioepisode/pl/${t}.json`,{...e,...(null==(i=this.options)?void 0:i.addExtendedEntitiesToEpisodeRequest)&&{extendedEntities:"true"}},r)}getBroadcastService(t,e,r){const i=t.replace(/^bs-/,"");return this.get(`t/broadcastservice/bs/${i}.json`,e,r)}getNewsArticle(t,e,r){return this.get(`t/newsarticle/na/${t}.json`,e,r)}getNewsArticleListByNPlaylistId(t,e,r){return this.get(`l/newsarticle/pl/${t}.json`,e,r)}getEpisodeNPlaylist(t,e,r){return this.get(`t/nplaylist/pl/${t}.json`,e,r)}getNewsArticleNPlaylist(t,e,r){return this.get(`t/nplaylist/pl/${t}.json`,e,r)}async getNPlaylistWithTVEpisodeList(t,e,r){const i=await this.get(`t/nplaylist/pl/${t}.json`,e,r),o=i.itemUrl.replace(this.baseUrl,"");return{nplaylist:i,episodeList:await this.get(o,void 0,r)}}async getNPlaylistWithRadioEpisodeList(t,e,r){const i=await this.get(`t/nplaylist/pl/${t}.json`,e,r),o=i.itemUrl.replace(this.baseUrl,"");return{nplaylist:i,episodeList:await this.get(o)}}getNPlaylistListByTVEpisodeId(t,e,r){return this.get(`l/nplaylist/te/${t}.json`,e,r)}getNPlaylistListByRadioEpisodeId(t,e,r){return this.get(`l/nplaylist/re/${t}.json`,e,r)}getNPlaylistListByNewsArticleId(t,e,r){return this.get(`l/nplaylist/na/${t}.json`,e,r)}getEpisodeNPlaylistListByNDeckId(t,e,r){return this.get(`l/nplaylist/dk/${t}.json`,e,r)}getNewsArticleNPlaylistListByNDeckId(t,e,r){return this.get(`l/nplaylist/dk/${t}.json`,e,r)}getEpisodeNDeck(t,e,r){return this.get(`t/ndeck/dk/${t}.json`,e,r)}getNewsArticleNDeck(t,e,r){return this.get(`t/ndeck/dk/${t}.json`,e,r)}getBroadcastServiceListByNPlaylistId(t,e,r){return this.get(`l/broadcastservice/pl/${t}.json`,e,r)}getBroadcastEventListByTVEpisodeId(t,e,r){return this.get(`l/broadcastevent/te/${t}.json`,e,r)}getBroadcastEventListByRadioEpisodeId(t,e,r){return this.get(`l/broadcastevent/re/${t}.json`,e,r)}getBundleListByTVEpisodeId(t,e,r){return this.get(`l/bundle/te/${t}.json`,e,r)}getBundleListByRadioEpisodeId(t,e,r){return this.get(`l/bundle/re/${t}.json`,e,r)}getBundleListByNPlaylistId(t,e,r){return this.get(`l/bundle/pl/${t}.json`,e,r)}getBundleListInfoByTVEpisodeId(t,e,r){return this.get(`l/bundle/te/${t}/types.json`,e,r)}getBundleListInfoByRadioEpisodeId(t,e,r){return this.get(`l/bundle/re/${t}/types.json`,e,r)}getConst(t,e){return this.get("const.json",t,e)}}const gh="useAPIClientを使用するには、NHKProviderを利用し `apiConfig` と `auth` プロパティを設定する必要があります。";class fh{constructor(t){__publicField(this,"_apiClient",null),__publicField(this,"_apiClientR8",null);const{apiConfig:e}=t,r=Mo({}).current;
// istanbul ignore else @preserve 認証機能が無効であるとき、親プロバイダはこのプロバイダを初期化しない
(null==r?void 0:r.manager)&&(this._apiClient=(()=>{if(!(null==e?void 0:e["r8.0"]))return null;const{baseUrl:t,defaultFetchOptions:i,options:o}=e["r8.0"];return new uh(t,r.manager,i,o)})(),this._apiClientR8=(()=>{if(!(null==e?void 0:e.r8))return null;const{baseUrl:t,defaultFetchOptions:i,options:o}=e.r8;return new ph(t,r.manager,i,o)})())}get"r8.0"(){if(!this._apiClient)throw new Error(gh);return this._apiClient}get r8(){if(!this._apiClientR8)throw new Error(gh);return this._apiClientR8}}class mh{constructor(){__publicField(this,"_initialized",!1),__publicField(this,"_currentArea",null);const{manager:t,account:e,accountProfile:r,initialized:i}=ge(fe(Mo)[0],"manager","account","accountProfile","initialized"),{constJson:o}=ge(fe(jt)[0],"constJson");ue({authInitialized:i,constJson:o,accountProfile:r,account:e,manager:t},({authInitialized:t,constJson:e,account:r,manager:i})=>{
// istanbul ignore if @preserve
var o;if(!i)return;if(e instanceof Error)return;const n=null==e?void 0:e.area;if(!t||!n)return;const s=t=>{const e=t&&n.find(e=>e.id===t);return e||null},l=s(i.getAreaTemporary()),a=s(null==l?void 0:l.id)??s(null==r?void 0:r.responseContent.area)??s(null==(o=i.getConsentToUseData())?void 0:o.area.areaId);this._currentArea=a,this._initialized=!0,window.dispatchEvent(new Event(kt.areaStateChange))})}get initialized(){return this._initialized}get currentArea(){return this._currentArea}}class _h{constructor(t){__publicField(this,"_account"),__publicField(this,"_accountlessProfile"),__publicField(this,"_accountProfile"),__publicField(this,"_accountProfileList"),__publicField(this,"_authType",null),__publicField(this,"_config"),__publicField(this,"_cookieAccessInstance"),__publicField(this,"_initialized"),__publicField(this,"_manager"),__publicField(this,"_statusManagementManager"),__publicField(this,"refreshAccountState",async()=>{if(!this._manager.getTokens().accountAuthN.accessToken)return void(this._account=null);const t=await this._manager.getAccount();this._account=t}),__publicField(this,"refreshAuthState",async()=>{const t=this._manager.getTokens();if(!t.accountAuthN.accessToken)return this._account=null,this._accountProfile=null,this._accountProfileList=null,t.accountlessAuthZ.accessToken?this._accountlessProfile=await this._manager.getAccountlessProfile().catch(()=>null):this._accountlessProfile=null,this._initialized=!0,void window.dispatchEvent(new Event(kt.authStateChange));const e=await this._manager.getAccount().catch(()=>null),r=await this._manager.getAccountProfileList().catch(()=>null),i=await(async()=>t.accountAuthZ.accessToken?this._manager.getAccountProfile().catch(()=>null):null)();this._accountlessProfile=null,this._account=e,this._accountProfile=i,this._accountProfileList=r,this._initialized=!0,window.dispatchEvent(new Event(kt.authStateChange))}),__publicField(this,"updateAccountProfile",async t=>{const e=await this._manager.updateAccountProfile(t);return this._accountProfile=e,window.dispatchEvent(new Event(kt.authStateChange)),e}),__publicField(this,"initialize",async()=>{await this.refreshAuthState(),this._authType=this._manager.getAuthType()});const{cookie:e,config:r}=t,i=e??Ct(),{logger:o}=Ql();this._manager=new dt(i,r,o),this._statusManagementManager=new wt(i,r,{serverUrl:r.statusManagement.serverUrl},o),this._account=null,this._accountlessProfile=null,this._accountProfile=null,this._accountProfileList=null,this._config=r,this._cookieAccessInstance=i,this._initialized=!1}get account(){return this._account}get accountlessProfile(){return this._accountlessProfile}get accountProfile(){return this._accountProfile}get accountProfileList(){return this._accountProfileList}get authType(){return this._authType}get config(){return this._config}get cookieAccessInstance(){return this._cookieAccessInstance}get initialized(){return this._initialized}get manager(){return this._manager}get statusManagementManager(){return this._statusManagementManager}}var bh="AppBanner_container__yawuwr0";var yh="var(--cursor__qoq1p10)",vh="var(--objectFit__qoq1p11)",wh="var(--display__qoq1p12)",Ch="var(--borderRadius__qoq1p13)",kh="var(--source__qoq1p14)",Sh="var(--aspectRatio__qoq1p15)",$h="var(--height__qoq1p16)",xh="var(--width__qoq1p17)",Eh="var(--pointerEvents__qoq1p18)",Ih="Image_round__qoq1p1a",Ah="Image_disablePrint__qoq1p1h";const Mh=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){this.props=t;const{src:r,alt:i,enablePrint:o,height:n="auto",width:s="100%",isBackground:l,caption:a,copyright:c,cursor:h,display:d="inline",onClick:u,title:p,shape:g="square",_fallbackSrc:f,_preventCopyImage:m,imageButtonLabel:_="",customStyles:b}=t,y=(()=>{if((null==b?void 0:b.borderRadius)||"square"!==g)return(null==b?void 0:b.borderRadius)?"number"==typeof b.borderRadius?`${b.borderRadius}px`:b.borderRadius:`${un}`})(),v=r,w=re(null),C=re(null),k=(t=>{const[e,r]=ae("idle");if(!t)return e;r("loading");const i=new window.Image;return i.onload=()=>{r("loaded"),i.onload=null,i.onerror=null},i.onerror=()=>{r("error"),i.onload=null,i.onerror=null},i.src=t,e})(l?r:""),[S,$]=ae("none"),[x,E]=ae(r),[I,A]=ae(!1);ue({imageState:k},({imageState:t})=>{this.root&&("loaded"===t?$(`url(${v})`):"error"===t&&(f?$(`url(${f})`):this.root.style.display="none"))}),ue({hasImgError:I},({hasImgError:t})=>{t&&f&&E(f)});const M=()=>{f&&E(f),A(!0)};ue({currentImgSrc:x},({currentImgSrc:t})=>{var e;null==(e=w.current)||e.setAttribute("src",t)});const T=()=>{if(!l)return{};const{originalHeight:e,originalWidth:r}=t;return{[$h]:n,[yh]:h,[kh]:S.current,[Sh]:""+r/e}};ue({backgroundImage:S},()=>{C.current&&Vt(C.current,T())});const L=yo({as:"figure",customStyles:b,className:di("Image_container__qoq1p19","round"===g&&(c||a)&&Ih),style:qt({[wh]:d,[xh]:s,[Ch]:y}),children:l?oe({click:u,keydown:t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),null==u||u())}},ee`<div class="${di("round"===g&&(a||c)&&Ih)}">
${ie(C,ee`<div
tabindex="${u?"0":"-1"}"
role="${u?"button":"img"}"
aria-label="${u?_:i}"
title="${p}"
class="${di("Image_backgroundImage__qoq1p1b",!o&&Ah)}"
style="${qt(T())}"
></div>`)}
</div>`):(()=>{const{objectFit:e="fill"}=t;return oe({click:u,keydown:t=>{"Enter"!==t.key&&" "!==t.key||null==u||u()}},ee`<div
class="${di("Image_imageWrapper__qoq1p1c","round"===g&&(a||c)&&Ih)}"
style="${qt({[yh]:h})}"
tabindex="${u?"0":"-1"}"
role="${u?"button":"generic"}"
aria-label="${_}"
>
${ie(w,oe({error:M},ee`<img
src="${x.current}"
alt="${i}"
title="${p}"
class="${di("Image_image__qoq1p1d",!o&&Ah)}"
style="${qt({[$h]:n,[vh]:e,[Eh]:m?"none":"auto"})}"
/>`))}
</div>`)})()});if(a||c){const t=ee`<div class="${"Image_captionContainer__qoq1p1e"}">
${c&&ee`<span class="${"Image_copyright__qoq1p1f"}">${c}</span>`} ${a&&ee`<figcaption class="${"Image_caption__qoq1p1g"}">${a}</figcaption>`}
</div>`;L.appendChild(t)}return e&&e.replaceWith(L),this.root=L,L}}),Th=`.${bh}`;const Lh=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"props",null)}render(t,e){const{image:r,description:i,link:o,onClose:n,customStyles:s,ref:l}=t;this.props=t;const a=we();
// istanbul ignore else @preserve
l&&(l.current=this);const c=i.replace(/<br>/g,"\n"),h=yo({as:"div",role:"region","aria-labelledby":a,className:bh,customStyles:s,children:ee`<template>
<div class="${"AppBanner_leftArea__yawuwr1"}">
${Mh({src:r,alt:"",width:"40px",height:"40px",shape:"round"})}
${Fs({id:a,size:"XS",whiteSpace:"pre-wrap",lineHeight:"heading",customStyles:{flex:1},children:c})}
</div>
<div class="${"AppBanner_rightArea__yawuwr2"}">
${Ao({size:"XS",onClick:()=>{
// istanbul ignore else @preserve
o.href&&(window.location.href=o.href)},children:"インストール"})}
${oe({click:n},ee`<button class="${"AppBanner_closeButton__yawuwr3"}" type="button">
<i class="${"AppBanner_closeButtonIcon__yawuwr4"}">${Ke({size:"100%"})}</i>
閉じる
</button>`)}
</div>
</template>`});
// istanbul ignore next @preserve 現在targetが指定されるケースはない。
return e&&e.replaceWith(h),this.root=h,h}
// istanbul ignore next @preserve 現在updateが使用されているケースはない。
update(t){this.root&&this.props&&this.render({...this.props,...t},this.root)}dispose(){
// istanbul ignore else @preserve
this.root&&this.root.replaceWith(),this.root=null,this.props=null}});const zh=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null)}render(t,e){const{onClick:r,ref:i}=t;
// istanbul ignore else @preserve refを渡さないパターンがない
i&&(i.current=this);const{consentToUseData:o}=ge(fe(Vs)[0],"consentToUseData");return this.root=yo({id:"emergency-mode-info",as:"dialog",open:!0,role:"region","aria-label":"ご利用にあたって",customDataAttribute:{"data-modal-type":"EmergencyModeInfo"},className:"EmergencyModeInfo_container__enhbti0",customStyles:void 0,children:ee`<div class="${"EmergencyModeInfo_content__enhbti1"}">
<div class="${"EmergencyModeInfo_textContainer__enhbti2"}">
${de({consentToUseData:o},({consentToUseData:t})=>Fs({whiteSpace:"pre-wrap",children:null==t?void 0:t.emergency.additionalText}))}
</div>
<div class="${"EmergencyModeInfo_buttonContainer__enhbti3"}">
${rl({fullWidth:!0,size:{desktop:"M",mobile:"S"},onClick:r,children:"「ご利用にあたって」"})}
</div>
</div>`}),_e(this.root).then(()=>{Ss({current:this.root})}),
// istanbul ignore else @preserve 親コンポーネントがtargetを渡さないパターンがない
e&&e.replaceWith(this.root),this.root}dispose(){
// istanbul ignore else @preserve rootが存在しない状態でdisposeが呼ばれるパターンがない
this.root&&this.root.remove(),this.root=null}});const Ph=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"render",t=>{const{bannerData:e,onButtonClick:r}=t,i=we(),o=re(null);return ue({bannerData:e},({bannerData:t})=>{
// istanbul ignore else @preserve このコールバックが実行される時点で常にセットされている
o.current&&o.current.update({link:{href:t.infoLinkUrl}})}),this.root=yo({as:"div","aria-describedby":i,"data-testid":"enforcement-banner",className:"EnforcementBanner_container__rxl72l0",customStyles:{},children:ee`<div class=${"EnforcementBanner_inner__rxl72l1"}>
<div class=${"EnforcementBanner_scrollContainer__rxl72l2"}>
<div class=${"EnforcementBanner_scrollInner__rxl72l3"}>
<div id=${i} class=${"EnforcementBanner_iconAndTitleContainer__rxl72l4"}>
<i class=${"EnforcementBanner_icon__rxl72l5"}> ${Wr({size:"1.25em"})} </i>
<div>${de({bannerData:e},({bannerData:t})=>document.createTextNode(t.title))}</div>
</div>

<div class=${"EnforcementBanner_description__rxl72l6"}>${de({bannerData:e},({bannerData:t})=>document.createTextNode(t.message))}</div>

${Nn({ref:o,link:{href:e.current.infoLinkUrl},size:{desktop:"S",mobile:"XS"},color:Yo.colorIconOnfillSecondary.light,removeBreak:!0,customStyles:{pl:{desktop:yn}},children:de({bannerData:e},({bannerData:t})=>document.createTextNode(t.infoButtonText))})}
</div>
</div>

${oe({click:r},ee`<button type="button" class=${"EnforcementBanner_button__rxl72l7"}>${de({bannerData:e},({bannerData:t})=>document.createTextNode(t.buttonText))}</button>`)}
</div>`})})}}),Bh=()=>{const t=fe(Ta)[0],{bindEnforcementData:e,bindEnforcementType:r}=ge(t,"bindEnforcementData","bindEnforcementType"),i=pe({bindEnforcementData:e,bindEnforcementType:r},({bindEnforcementData:t,bindEnforcementType:e})=>{if("household-null-category4-banner"!==e)return!1;return!!(null==t?void 0:t["household-null-category4-banner"])});return i.addDisposeListener(
// istanbul ignore next @preserve 現状disposeを呼ぶケースがない
()=>{e.dispose(),r.dispose(),t.dispose()}),i},Fh=()=>{const t=fe(ua)[0],{registrationEnforcementData:e,registrationEnforcementType:r}=ge(t,"registrationEnforcementData","registrationEnforcementType"),i=pe({registrationEnforcementData:e,registrationEnforcementType:r},({registrationEnforcementData:t,registrationEnforcementType:e})=>{if("banner"!==e)return!1;return!!(null==t?void 0:t["household-anonymous-category2-banner"])});return i.addDisposeListener(
// istanbul ignore next @preserve 現状disposeされるケースがない
()=>{e.dispose(),r.dispose(),t.dispose()}),i};var Rh="var(--underHeaderStickyTopPosition__81iek0)";const Nh=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"refs",{rootRef:re(null)}),__publicField(this,"_disposable",[])}get root(){return this.refs.rootRef.current}render(t,e){const{ref:r,headerEl:i}=t;this.props={...t},
// istanbul ignore if @preserve 親コンポーネントでrefを渡していない
r&&(r.current=this);const{rootRef:o}=this.refs,{isEmergencyMode:n}=ge(fe(Dl)[0],"isEmergencyMode"),s=Fh(),l=Bh(),{consentToUseData:a}=ge(fe(Vs)[0],"consentToUseData"),c=ee`<div class="${"UnderHeaderElement_underHeaderSticky__81iek1"}">
${de({isEmergencyMode:n,consentToUseData:a},({isEmergencyMode:t,consentToUseData:e})=>t?da({priority:"medium",label:null==e?void 0:e.emergency.message}):null)}
${de({showRegistrationEnforcementBanner:s},({showRegistrationEnforcementBanner:t})=>t?(()=>{
// istanbul ignore next @preserve
const{manager:t}=Mo({}).current??{},{registrationEnforcementData:e}=ua({}).current??{},r=null==e?void 0:e["household-anonymous-category2-banner"];
// istanbul ignore next @preserve
// istanbul ignore if @preserve useShowRegistrationEnforcementBanner で存在判定をしているため、この条件分岐に入ることはない
return r?Ph({bannerData:{current:r},onButtonClick:()=>{const{key:e,value:r}=$s.registrationEnforcement.category2BannerRegister;null==t||t.register({queryParams:{[e]:r}})}}):null})():null)}
${de({showBindEnforcementBanner:l},({showBindEnforcementBanner:t})=>t?(()=>{
// istanbul ignore next @preserve
const{bindEnforcementData:t}=Ta({}).current??{},e=null==t?void 0:t["household-null-category4-banner"];
// istanbul ignore if @preserve useShowBindEnforcementBanner で存在判定をしているため、この条件分岐に入ることはない
return e?Ph({bannerData:{current:e},onButtonClick:()=>{window.location.href=e.buttonUrl}}):null})():null)}
</div>`;return ue({headerRect:cc(i)},({headerRect:t})=>{c.setAttribute("style",`${qt({[Rh]:`${(null==t?void 0:t.height)||0}px`})}`)}),o.current=c,
// istanbul ignore else @preserve 親コンポーネントでtargetを渡さないことがない
e&&ce(e,c),this.root}
// istanbul ignore next @preserve 親コンポーネントでrefを渡していない
update(t){if(!this.root||!this.props)return;const e={...this.props,...t};this.props=e}
// istanbul ignore next @preserve 親コンポーネントでrefを渡していない
dispose(){this._disposable.forEach(t=>{var e;return null==(e=t.dispose)?void 0:e.call(t)})}});class Zh{constructor(){__publicField(this,"_consentToUseData",ae(null)),__publicField(this,"_initialized",ae(!1)),__publicField(this,"_disposable",[]),__publicField(this,"_abortController",new AbortController)}get consentToUseData(){return this._consentToUseData[0].current}get initialized(){return this._initialized[0].current}initialize(){const t=fe(jt)[0],e=fe(Mo)[0],r=fe(Dl)[0];this._disposable.push(t),this._disposable.push(e),this._disposable.push(r);const{logger:i}=Ql(),{defaultConfig:o}=ge(t,"defaultConfig"),{manager:n}=ge(e,"manager"),{initialized:s,isEmergencyMode:l}=ge(r,"initialized","isEmergencyMode"),[a,c]=this._consentToUseData,[h,d]=this._initialized;ue({consentToUseData:a,initialized:h},()=>{window.dispatchEvent(new Event(kt.consentToUseDataChange))},{abortSignal:this._abortController.signal}),ue({defaultConfig:o,manager:n,isEmergencyModeInitialized:s,isEmergencyMode:l},async({defaultConfig:t,manager:e,isEmergencyModeInitialized:r,isEmergencyMode:o})=>{if(h.current)return;
// istanbul ignore if @preserve このプロバイダだけが初期化されることはない
if(!e)return;if(!t)return;if(!o&&("confirmView"===e.getNextAction()||e.getAuthZType()===F.accountlessAuthZEmergency)||o){try{const e=await te(t.endpoint.consentToUseJson);c(e)}catch(n){i.error(n)}d(!0)}else r&&d(!0)},{abortSignal:this._abortController.signal})}
// istanbul ignore next @preserve disposeを呼ばれることがない
dispose(){this._abortController.abort(),this._disposable.forEach(({dispose:t})=>t()),this._disposable=[]}}class Oh{constructor(){__publicField(this,"_defaultConfig",ae(null)),__publicField(this,"_defaultConfigError",ae(null)),__publicField(this,"_hamburgerMenu",ae(null)),__publicField(this,"_serviceMenu",ae(null)),__publicField(this,"_constJson",ae(null)),__publicField(this,"_disposable",[]),__publicField(this,"_abortController",new AbortController)}get defaultConfig(){return this._defaultConfig[0].current}get defaultConfigError(){return this._defaultConfigError[0].current}get hamburgerMenu(){return this._hamburgerMenu[0].current}get serviceMenu(){return this._serviceMenu[0].current}get constJson(){return this._constJson[0].current}
// istanbul ignore next @preserve 未使用、削除予定
get defaultConfigState(){return this._defaultConfig[0]}
// istanbul ignore next @preserve 未使用、削除予定
get defaultConfigErrorState(){return this._defaultConfigError[0]}
// istanbul ignore next @preserve 未使用、削除予定
get hamburgerMenuState(){return this._hamburgerMenu[0]}
// istanbul ignore next @preserve 未使用、削除予定
get serviceMenuState(){return this._serviceMenu[0]}
// istanbul ignore next @preserve 未使用、削除予定
get constJsonState(){return this._constJson[0]}async initialize(){const{siteGroup:t}=ge(fe(na)[0],"siteGroup"),{logger:e}=Ql(),[r,i]=this._defaultConfig,[o,n]=this._defaultConfigError,[s,l]=this._hamburgerMenu,[a,c]=this._serviceMenu,[h,d]=this._constJson;this._disposable.push(t,r,o,s,a,h),ue({defaultConfig:r,defaultConfigError:o,hamburgerMenu:s,serviceMenu:a,constJson:h},()=>{window.dispatchEvent(new Event(kt.defaultConfigChange))},{abortSignal:this._abortController.signal}),ue({siteGroup:t},({siteGroup:t})=>{if(!t)return;let r=!1;const o=new AbortController;return(async()=>{try{const n=await(async(t,e)=>te(`/assets/conf/${t}/v1/default.json`,{signal:e}))(t,o.signal);i(n);const s=!$e()&&!xe(),a=await Promise.allSettled([te(n.endpoint.area,{signal:o.signal}),...s?[te(n.endpoint.hamburgerMenu,{signal:o.signal}),te(n.endpoint.serviceMenu,{signal:o.signal})]:[]]),[h,u,p]=a;if(r)return;"fulfilled"===h.status?d(h.value):(h.reason instanceof Error?d(h.reason):d(new Error("Failed to fetch const.json")),e.error(h.reason)),s&&("fulfilled"===u.status?l(u.value):(u.reason instanceof Error?l(u.reason):l(new Error("Failed to fetch hamburger menu")),e.error(u.reason)),"fulfilled"===p.status?c(p.value):(p.reason instanceof Error?c(p.reason):c(new Error("Failed to fetch service menu")),e.error(p.reason)))}catch(s){
// istanbul ignore if @preserve 通常は実行されずキャンセルされるため、カバレッジ無効化
if(r)return;s instanceof Error?n(s):n(new Error("Failed to fetch default.json")),e.error(s)}})(),()=>{r=!0,o.abort()}},{abortSignal:this._abortController.signal})}dispose(){this._abortController.abort(),this._disposable.forEach(({dispose:t})=>t()),this._disposable=[]}}class Dh{constructor(){__publicField(this,"_disposable",[]),__publicField(this,"_manager",null),__publicField(this,"_isInJapanInitialized",!1),__publicField(this,"_isInJapan",!1),__publicField(this,"_opsManagementSystemData",null),__publicField(this,"_processing",!1),__publicField(this,"initialized",!1),__publicField(this,"isEmergencyMode",!1)}_notifyChange(){window.dispatchEvent(new Event(kt.emergencyModeChange))}async initialize(){const t=jt({onChange:()=>{this._check()}}),e=Mo({onChange:t=>{this._manager=t.manager,this._check()}}),r=oa({onChange:t=>{this._isInJapanInitialized=t.initialized,this._isInJapan=t.isInJapan,this._check()}}),i=Js({onChange:t=>{this._opsManagementSystemData=t.opsManagementSystemData,this._check()}});this._disposable.push(t),this._disposable.push(e),this._disposable.push(r),this._disposable.push(i)}async _check(){var t,e,r,i;const{logger:o}=Ql(),n=this._manager;if(!n)return;
// istanbul ignore next @preserve .currentが存在しないパターンはない
const{defaultConfig:s}=jt({}).current||{},l=this._opsManagementSystemData;if(s&&this._isInJapanInitialized&&void 0!==(null==(t=null==l?void 0:l.emergencyMode)?void 0:t.isEmergencyMode))try{if($e())return this.initialized=!0,void this._notifyChange();if("emergency"===(null==(e=n.getTokenData().accountlessAuthZ)?void 0:e.profileType))return(null==(r=null==l?void 0:l.emergencyMode)?void 0:r.isEmergencyMode)||Ae()?this.isEmergencyMode=!0:(this.isEmergencyMode=!1,n.deleteAuthZCookie(),window.location.reload()),this.initialized=!0,void this._notifyChange();const t=n.getConsentToUse(),o=n.getTokens(),a=o.accountlessAuthZ.accessToken,c=o.accountAuthN.accessToken,h=o.accountAuthZ.accessToken;if(t||a||c||h)return this.isEmergencyMode=!1,this.initialized=!0,void this._notifyChange();if(!this._isInJapan&&!Ae())return this.isEmergencyMode=!1,this.initialized=!0,void this._notifyChange();if(!(null==(i=l.emergencyMode)?void 0:i.isEmergencyMode)&&!Ae())return this.isEmergencyMode=!1,this.initialized=!0,void this._notifyChange();const d=await te(s.endpoint.emergencyDomain);if(!((t,e)=>{const r=e=>{const r=e.endsWith("/")?e.slice(0,-1):e,i=t.endsWith("/")?null==t?void 0:t.slice(0,-1):t;if(r.endsWith("/*")){const t=r.slice(0,-2);return i.startsWith(t)}try{const t=new URL(r),e=new URL(i);return t.origin===e.origin&&t.pathname===e.pathname}catch{return!1}},i=e.allow.some(r),o=e.deny.some(r);return i&&!o})(window.location.href,d)&&!Ae())return this.isEmergencyMode=!1,this.initialized=!0,void this._notifyChange();if(this._processing)return;this._processing=!0,n.loginAccountlessEmergency()}catch(a){this.initialized=!0,this._notifyChange(),o.error(a)}}dispose(){this._disposable.forEach(t=>{var e;null==(e=t.dispose)||e.call(t)})}}function Hh(t,e,r){return new Promise((r,i)=>{const o=()=>{i(new Error("State disposed while waiting for predicate"))},n=()=>!!e(t.current)&&(t.removeUpdateListener(n),t.removeDisposeListener(o),r(t.current),!0);n()||(t.addUpdateListener(n),t.addDisposeListener(o))})}const jh=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"refs",{modalComponentRef:re(null)}),__publicField(this,"render",(t,e)=>{const{bindEnforcement:r,bindEnforcementType:i,enforcementConfig:o,onClose:n,ref:s}=t,l=we();
// istanbul ignore else @preserve このコンポーネントを呼び出す際、refが渡されないケースがない
s&&(s.current=this);const a=r[i],c=o.config[i];
// istanbul ignore if @preserve 型定義上この条件に該当するケースがない
if(!a||!c){const t=document.createElement("div");return t.appendChild(document.createComment("BindEnforcementModal: No content available")),e&&e.replaceWith(t),this.root=t,t}const h=c.titleColor.split("-").map((t,e)=>0===e?t.toLowerCase():t.charAt(0).toUpperCase()+t.slice(1).toLowerCase()).join("");const d=eh({ref:this.refs.modalComponentRef,open:!0,onClose:()=>{
// istanbul ignore else @preserve onCloseは必ず渡されるため、この条件に該当するケースがない
n&&n()},disableBackgroundClickClose:!0,disableEscapekeyClose:!0,disableBackdropBlur:!0,size:"M",ariaLabelledby:l,modalType:"BindEnforcementModal",children:ee`<template>
${fs({spacing:"spacingBase2",direction:"row",align:"center",justify:"center",customStyles:{mb:{desktop:_n,mobile:mn}},children:ee`<template>
${"imageLink"in c&&Mh({src:c.imageLink,alt:"",height:"60px",width:"60px"})}
${Fs({id:l,...h in Yo&&{color:Yo[h]},size:{desktop:"XXL",mobile:"XL"},lineHeight:"heading",weight:"bold",align:"imageLink"in c?"left":"center",whiteSpace:"pre-wrap",children:a.title})}
</template>`})}
${Fs({whiteSpace:"pre-wrap",customStyles:{mb:yn},children:a.message})}
<div class="${"BindEnforcementModal_linkContainer__hnlzk90"}">
${Nn({linkType:"primary",fullWidth:!0,_isAlert:c.okButtonIsAlert,_roundFull:!0,link:{href:a.buttonUrl,target:"_blank",onClick:n},children:a.buttonText})}
</div>
${fs({align:"center",children:Nn({link:{href:a.infoLinkUrl,target:"_blank",onClick:n},children:c.infoButtonText})})}
${"dismissButton"in a&&ee`<template>
${hs({customStyles:{mt:{desktop:_n,mobile:bn},mb:{desktop:gn,mobile:fn}}})}
${fs({align:"center",children:Ao({buttonType:"tertiary",onClick:n,children:a.dismissButton})})}
</template>`}
</template>`});
// istanbul ignore if @preserve このコンポーネントを呼び出す際、targetが渡されるケースがない
return e&&e.replaceWith(d),this.root=d,d}),__publicField(this,"update",t=>{if(!this.root||!this.props)return;const e={...this.props,...t},r=ye(this.props,e);Object.keys(r).length&&this.render(e,this.root)}),__publicField(this,"dispose",()=>{var t,e;null==(t=this.refs.modalComponentRef.current)||t.dispose(),null==(e=this.root)||e.remove(),this.root=null,this.props=null,this.refs.modalComponentRef={current:null}})}});class Uh{constructor(){__publicField(this,"_disposable",[]),__publicField(this,"_abortController",new AbortController),__publicField(this,"_value",{bindEnforcementData:null,bindEnforcementType:null,bindEnforcementStatus:null,initialized:!1}),__publicField(this,"_state"),__publicField(this,"closeBindEnforcement",async()=>(await Hh(this._state.closeBindEnforcement,t=>null!==t))());const t=this._abortController.signal,{logger:e}=Ql(),{disableEnforcement:r,disableEnforcementBanner:i}=ge(fe(na)[0],"disableEnforcement","disableEnforcementBanner"),{defaultConfig:o}=ge(fe(jt)[0],"defaultConfig"),{initialized:n,isInJapan:s}=ge(fe(oa)[0],"initialized","isInJapan"),{initialized:l,manager:a,account:c,accountProfile:h,updateAccountProfile:d}=ge(fe(Mo)[0],"initialized","manager","account","accountProfile","updateAccountProfile"),{opsManagementSystemOrigin:u,opsManagementSystemIndexData:p,opsManagementSystemData:g}=ge(fe(Js)[0],"opsManagementSystemOrigin","opsManagementSystemIndexData","opsManagementSystemData"),f=pe({opsManagementSystemData:g},({opsManagementSystemData:t})=>null==t?void 0:t.enforcementSettings),[m,_]=ae(null),[b,y]=ae(null),[v,w]=ae(!1),[C,k]=ae(null),[S,$]=ae(null),x=t=>{k(e=>{var r,i;return null===t?null:v.current&&"household-null-category4-banner"!==t?e:(null==(i=null==(r=g.current)?void 0:r.emergencyMode)?void 0:i.isEmergencyMode)&&"household-null-category4-banner"===t?null:t})},E=pe({enforcementSettings:f},({enforcementSettings:t})=>t?e=>{const r=[...t.bindSettings.category].sort((t,e)=>e.min-t.min).find(t=>e>=t.min);return(null==r?void 0:r.category)?r.category:"category1"}:null),I=pe({disableEnforcementBanner:i,getCategory:E},({disableEnforcementBanner:t,getCategory:e})=>e?r=>{if(t)return void x(null);"category4"===e(r)&&x("household-null-category4-banner")}:null,{abortSignal:t}),A=pe({enforcementSettings:f,accountProfile:h,bindEnforcementType:C,manager:a,updateAccountProfile:d,setBanner:I},({enforcementSettings:t,accountProfile:e,bindEnforcementType:r,manager:i,updateAccountProfile:o,setBanner:n})=>i&&n&&o?async()=>{
// istanbul ignore if @preserve closeBindEnforcement が呼ばれる === enforcementSettings と accountProfile があるため存在しないパターン
if(!t||!e)return;const i=r;x(null);const{intervalSec:s,countInterval:l}=t.bindSettings,a=Math.floor(Date.now()/1e3),c=a,h=a+s,d=e.enforcementCount+l;await o({profileId:e.profileId,profile:{enforcementOffStartDate:c,enforcementOffEndDate:h,enforcementCount:d}}),"household-0"!==i&&n(d)}:null,{abortSignal:t}),M=pe({opsManagementSystemData:g},({opsManagementSystemData:t})=>{var e;return null==(e=null==t?void 0:t.emergencyMode)?void 0:e.isEmergencyMode}),T=re(M.current);ue({disableEnforcement:r,initialized:v,defaultConfig:o,enforcementSettings:f,isInJapanInitialized:n,isInJapan:s,isEmergencyMode:M,opsManagementSystemData:g,authInitialized:l,manager:a,account:c,accountProfile:h,setBanner:I,bindEnforcementType:C},({disableEnforcement:t,initialized:r,defaultConfig:i,enforcementSettings:o,isInJapanInitialized:n,isInJapan:s,opsManagementSystemData:l,authInitialized:a,manager:c,account:h,accountProfile:d,setBanner:u,bindEnforcementType:p})=>{c&&u&&(async()=>{var g,f,m;if(t)w(!0);else if($e())w(!0);else if((!r||(null==(g=null==l?void 0:l.emergencyMode)?void 0:g.isEmergencyMode)!==T.current)&&i&&o&&n&&a&&void 0!==(null==(f=null==l?void 0:l.emergencyMode)?void 0:f.isEmergencyMode))
// istanbul ignore if @preserve ここに辿り着く前に上のif文で引っかかるため、基本通らないパターン
{T.current=null==(m=null==l?void 0:l.emergencyMode)?void 0:m.isEmergencyMode;try{if(!s)return;if(l.emergencyMode.isEmergencyMode)return void("household-null-category4-banner"===p&&x(null));if("household"!==(null==d?void 0:d.entity))return;
// istanbul ignore if @preserve 3の条件を突破した時点でaccountProfileは必ず存在するため、基本通らないパターン
if("accountAuthZ"!==c.getAuthType()||!h)return;if(!o.bindSettings.enabled)return;if("active"===h.responseContent.lifecycle){if(1===h.responseContent.status)return;if(0===o.bindSettings.countInterval)return;return void $("照合中")}if("established"===h.responseContent.lifecycle){if("number"!=typeof h.responseContent.status){0!==o.bindSettings.countInterval&&$("未照合");const t=Date.now()/1e3,e=d.enforcementOffStartDate,r=d.enforcementOffEndDate;if(e<=t&&t<=r)return void u(d.enforcementCount);const i=[...o.bindSettings.category].sort((t,e)=>e.min-t.min).find(t=>d.enforcementCount>=t.min);return void x(`household-null-${(null==i?void 0:i.category)||"category1"}`)}if(0===h.responseContent.status){0!==o.bindSettings.countInterval&&$("照合NG");const t=Date.now()/1e3,e=d.enforcementOffStartDate,r=d.enforcementOffEndDate;if(e<=t&&t<=r)return;x("household-0")}}}catch(_){
// istanbul ignore next @preserve TODO: テスト書く
e.error(_)}finally{w(!0)}}
// istanbul ignore if @preserve setBannerが存在する時点でenforcementSettingsが取得できていて、すなわちdefaultConfigが存在するため、通らないパターン
})()},{abortSignal:t}),ue({opsManagementSystemIndexData:p,bindEnforcementType:C,bindEnforcement:m,enforcementConfig:b,opsManagementSystemOrigin:u,defaultConfig:o},({opsManagementSystemIndexData:t,bindEnforcementType:r,bindEnforcement:i,enforcementConfig:o,opsManagementSystemOrigin:n,defaultConfig:s})=>{var l;if(!n||!t)return;if(!r)return;if(i&&o)return;const a=null==(l=t.items.find(t=>"bindEnforcement"===t.id))?void 0:l.path;
// istanbul ignore if @preserve
if(a)try{(async()=>{
// istanbul ignore if @preserve
if(!s)return;const t=new URL(a,n).toString(),[e,r]=await Promise.all([te(t),te(s.endpoint.enforcementConfig)]);_(e),y(r)})()}catch(c){
// istanbul ignore next @preserve TODO: テスト書く
e.error(c)}},{abortSignal:t}),ue({bindEnforcement:m,bindEnforcementStatus:S,bindEnforcementType:C,initialized:v},({bindEnforcement:t,bindEnforcementStatus:e,bindEnforcementType:r,initialized:i})=>{this._value={bindEnforcementData:t,bindEnforcementStatus:e,bindEnforcementType:r,initialized:i},window.dispatchEvent(new Event(kt.bindEnforcementChange))},{abortSignal:t}),this._state={closeBindEnforcement:A},ue({enforcementConfig:b,bindEnforcement:m,bindEnforcementType:C},({enforcementConfig:t,bindEnforcement:e,bindEnforcementType:r})=>{if(t&&e&&r&&"household-null-category4-banner"!==r){const i=re(null);return document.body.appendChild(jh({ref:i,enforcementConfig:t,bindEnforcement:e,bindEnforcementType:r,onClose:this.closeBindEnforcement})),()=>{var t;null==(t=i.current)||t.dispose()}}},{abortSignal:t}),this._disposable.push(r,i,o,n,s,l,a,c,h,u,p,g,m,b,v,C,S,I,A,M)}get bindEnforcementData(){return this._value.bindEnforcementData}get bindEnforcementType(){return this._value.bindEnforcementType}get bindEnforcementStatus(){return this._value.bindEnforcementStatus}get initialized(){return this._value.initialized}dispose(){this._abortController.abort(),this._disposable.forEach(t=>{var e;return null==(e=t.dispose)?void 0:e.call(t)}),this._disposable=[],this._value.initialized=!1,this._value.bindEnforcementStatus=null,this._value.bindEnforcementData=null,this._value.bindEnforcementType=null}}const qh=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"refs",{modalComponentRef:re(null)}),__publicField(this,"render",(t,e)=>{const{collationEnforcementType:r,enforcementConfig:i,onClose:o,registrationEnforcement:n,ref:s}=t;
// istanbul ignore else @preserve 親コンポーネントがこれを渡さないことがない
s&&(s.current=this);const l=we(),{defaultConfig:a}=jt({}).current||// istanbul ignore next @preserve .currentがないパターンは存在しない
{},c=n[r],h=i.config[r],d=(()=>{if(!a||!h.okButtonLink)return null;try{return new URL(h.okButtonLink,a.endpoint.accountPortal).toString()}catch{return null}})();if(!c||!h||!d){const t=document.createElement("div");return t.appendChild(document.createComment("CollationEnforcementModal: No content available")),
// istanbul ignore if @preserve 親コンポーネントがこれを渡すことがない
e&&e.replaceWith(t),this.root=t,t}const u=eh({ref:this.refs.modalComponentRef,open:!0,onClose:o,disableBackgroundClickClose:!0,disableEscapekeyClose:!0,disableBackdropBlur:!0,size:"M",ariaLabelledby:l,modalType:"CollationEnforcementModal",children:ee`<template>
${"subtitle"in h&&ee`<div class="${"CollationEnforcementModal_subtitle__1gl6p7z0"}">${h.subtitle}</div>`}
${Fs({id:l,size:{desktop:"XXL",mobile:"XL"},lineHeight:"heading",weight:"bold",align:"center",whiteSpace:"pre-wrap",customStyles:{mb:{desktop:_n,mobile:mn}},children:h.title})}
${Fs({whiteSpace:"pre-wrap",customStyles:{mb:yn},children:c.message})}
${fs({align:"center",customStyles:{mb:bn},children:Nn({link:{href:c.infoLinkUrl,target:"_blank",onClick:o},children:h.infoButtonText})})}

<div class="${"CollationEnforcementModal_linkContainer__1gl6p7z1"}">
${Nn({linkType:"primary",fullWidth:!0,_roundFull:!0,link:{href:d,target:"_blank",onClick:o},children:h.okButtonText})}
</div>
${hs({customStyles:{mb:fn}})}
${fs({align:"center",children:Ao({buttonType:"tertiary",onClick:o,children:h.dismissButtonText})})}
</template>`});
// istanbul ignore if @preserve 親コンポーネントがこれを渡すことがない
return e&&e.replaceWith(u),this.root=u,u}),__publicField(this,"update",t=>{if(!this.root||!this.props)return;const e={...this.props,...t},r=ye(this.props,e);Object.keys(r).length&&this.render(e,this.root)}),__publicField(this,"dispose",()=>{var t,e;null==(t=this.refs.modalComponentRef.current)||t.dispose(),null==(e=this.root)||e.remove(),this.root=null,this.props=null,this.refs.modalComponentRef={current:null}})}});class Wh{constructor(){__publicField(this,"_enforcementConfig",ae(null)),__publicField(this,"_registrationEnforcement",ae(null)),__publicField(this,"_collationEnforcementType",ae(null)),__publicField(this,"_initialized",ae(!1)),__publicField(this,"_disposable",[]),__publicField(this,"closeCollationRecommendation",async()=>{
// istanbul ignore next @preserve
const{manager:t}=Mo({}).current??{},{opsManagementSystemData:e}=Js({}).current??{},r=null==e?void 0:e.enforcementSettings,[,i]=this._collationEnforcementType;
// istanbul ignore next @preserve
// istanbul ignore if @preserve closeCollationRecommendationが呼ばれる===enforcementSettingsがあるため存在しないパターン
if(i(null),!r||!t)return;const o=r.registrationSettings.intervalSec,n=new Date,s=new Date(n.getTime()+1e3*o),l={sd:n.toISOString(),ed:s.toISOString()};await t.setEfm(JSON.stringify(l))}),__publicField(this,"_checkCollationEnforcement",()=>{var t;const{logger:e}=Ql(),{disableEnforcement:r}=na({}).current??{},{initialized:i,isInJapan:o}=oa({}).current??{},n=Mo({}).current,{opsManagementSystemData:s}=Js({}).current??{},l=null==s?void 0:s.enforcementSettings,[a,c]=this._initialized,[,h]=this._collationEnforcementType;
// istanbul ignore next @preserve
if(r)return void c(!0);if($e())return void c(!0);if(a.current)return;if(!l)return;if(!i)return;
// istanbul ignore if @preserve ここに辿り着く前に上のif文で引っかかるため、基本通らないパターン
if(!(null==n?void 0:n.initialized))return;const{manager:d,statusManagementManager:u,accountlessProfile:p}=n;
// istanbul ignore if @preserve ここに辿り着く前に上のif文で引っかかるため、基本通らないパターン
void 0!==(null==(t=null==s?void 0:s.emergencyMode)?void 0:t.isEmergencyMode)&&((()=>{if(!o)return;if(s.emergencyMode.isEmergencyMode)return;if("business"!==(null==p?void 0:p.entity)&&"school"!==(null==p?void 0:p.entity))return;
// istanbul ignore if @preserve 3の条件を突破した時点で accountlessProfile は必ず存在するため、基本通らないパターン
if("accountlessAuthZ"!==d.getAuthType())return;if(!l.registrationSettings.enabled)return;if("unknown"===p.profileType){const t=d.getNextStatusUpdateTime();if(t&&new Date<new Date(t))return;return void(async()=>{try{const t=await u.getStatusManagementStatus();if("OK"===t.status)await d.setNextStatusUpdateTime(t.nextStatusUpdateTime);else{const t=d.getConsentToUseData();if(!t)throw new Error("CollationEnforcementProvider consentToUseData is null");d.deleteNextStatusUpdateTime(),d.setShowRevokedMessage("true"),d.loginAccountless({area:t.area.areaId,entity:t.entity,jisx0402:t.area.jisx0402,postal:t.area.postal,pref:t.area.pref})}}catch(t){e.error(t)}})()}if("true"===d.getShowRevokedMessage())return h(`${p.entity}-unknown`),void d.deleteShowRevokedMessage();try{const t=d.getEfm(),e=JSON.parse(t||"{}");if(e.sd&&e.ed){const t=new Date,r=new Date(e.sd),i=new Date(e.ed);if(r<=t&&t<=i)return}}catch(t){}if("school"===p.entity){const t=(new Date).toLocaleTimeString("ja-JP",{timeZone:"Asia/Tokyo",hour12:!1,hour:"2-digit",minute:"2-digit",second:"2-digit"}),e=l.registrationSettings.schoolStartTime.split("+")[0],r=l.registrationSettings.schoolEndTime.split("+")[0];
// istanbul ignore next @preserve
if(!e||!r)return;const i=t=>{
// istanbul ignore next @preserve
const[e=0,r=0,i=0]=t.split(":").map(Number);return 3600*e+60*r+i},o=i(t),n=i(e),s=i(r);if(!(n<=o&&o<=s))return;h("school-anonymous")}else h("business-anonymous")})(),c(!0))}),__publicField(this,"_fetchCollationEnforcement",async()=>{var t;const{logger:e}=Ql(),{opsManagementSystemIndexData:r,opsManagementSystemOrigin:i}=Js({}).current??{},[o]=this._collationEnforcementType,[n,s]=this._registrationEnforcement,[l,a]=this._enforcementConfig,{defaultConfig:c}=jt({}).current??{};
// istanbul ignore next @preserve
if(!r)return;if(!o.current)return;
// istanbul ignore next @preserve 表示するタイプが変化することは通常ない
if(n.current&&l.current)return;const h=null==(t=r.items.find(t=>"registrationEnforcement"===t.id))?void 0:t.path;
// istanbul ignore if @preserve
if(h)try{(async()=>{
// istanbul ignore if @preserve
if(!c)return;const t=new URL(h,i).toString(),[e,r]=await Promise.all([te(t),te(c.endpoint.enforcementConfig)]);s(e),a(r)})()}catch(d){
// istanbul ignore next @preserve TODO: テスト書く
e.error(d)}})}get collationEnforcementType(){return this._collationEnforcementType[0].current}get initialized(){return this._initialized[0].current}get collationEnforcementTypeState(){return this._collationEnforcementType[0]}get initializedState(){return this._initialized[0]}initialize(){const t=na({onChange:()=>this._checkCollationEnforcement()}),e=Mo({onChange:()=>this._checkCollationEnforcement()}),r=oa({onChange:()=>this._checkCollationEnforcement()}),i=Js({onChange:()=>this._checkCollationEnforcement()});this._disposable.push(t),this._disposable.push(e),this._disposable.push(r),this._disposable.push(i),ue({initialized:this.initializedState,collationEnforcementType:this.collationEnforcementTypeState},()=>{this._fetchCollationEnforcement(),window.dispatchEvent(new Event(kt.collationEnforcementChange))}),ue({enforcementConfig:this._enforcementConfig[0],registrationEnforcement:this._registrationEnforcement[0],collationEnforcementType:this.collationEnforcementTypeState},({enforcementConfig:t,registrationEnforcement:e,collationEnforcementType:r})=>{if(t&&e&&r){const i=re(null);return document.body.appendChild(qh({ref:i,enforcementConfig:t,registrationEnforcement:e,collationEnforcementType:r,onClose:this.closeCollationRecommendation})),()=>{var t;null==(t=i.current)||t.dispose()}}})}
// istanbul ignore next @preserve 現状利用されていない
dispose(){this._disposable.forEach(t=>{t.dispose&&t.dispose()})}}var Vh="RegistrationEnforcementModal_buttonContainer__w1pjdl0";const Jh=Qt(class extends Yt{constructor(){super(...arguments),__publicField(this,"root",null),__publicField(this,"refs",{modalComponentRef:re(null)}),__publicField(this,"render",(t,e)=>{const{enforcementConfig:r,onClose:i,registrationEnforcement:o,registrationEnforcementType:n,ref:s}=t,l=we(),{manager:a}=Mo({}).current??{};
// istanbul ignore if @preserve 常にrefを渡しているため、この条件分岐に入ることはない
s&&(s.current=this);const c=o["household-anonymous"],h=r.config["household-anonymous"];
// istanbul ignore if @preserve 型定義上、この条件分岐に入ることはない
if(!c||!h){const t=document.createElement("div");return t.appendChild(document.createComment("RegistrationEnforcementModal: No content available")),e&&e.replaceWith(t),this.root=t,t}const d=eh({ref:this.refs.modalComponentRef,open:!0,onClose:i,disableBackgroundClickClose:!0,disableEscapekeyClose:!0,disableBackdropBlur:!0,size:"M",ariaLabelledby:l,modalType:"RegistrationEnforcementModal",children:ee`<template>
${Fs({id:l,size:{desktop:"XXL",mobile:"XL"},lineHeight:"heading",weight:"bold",align:"center",whiteSpace:"pre-wrap",customStyles:{mb:{desktop:_n,mobile:mn}},children:c.title})}
${Fs({whiteSpace:"pre-wrap",customStyles:{mb:yn},children:c.message})}
${fs({spacing:{desktop:"spacingBase4"},align:"center",customStyles:{mb:bn},children:ee`<template>
<div class="${Vh}">
${rl({onClick:async()=>{try{await i()}catch{}const{key:t,value:e}=$s.registrationEnforcement["category1Modal"===n?"category1Register":"category2Register"];null==a||a.register({queryParams:{[t]:e}})},fullWidth:!0,children:h.okButtonText})}
</div>
<div class="${Vh}">
${rl({onClick:async()=>{try{await i()}catch{}const{key:t,value:e}=$s.registrationEnforcement["category1Modal"===n?"category1Login":"category2Login"];null==a||a.loginAccount({queryParams:{[t]:e}})},buttonType:"secondary",fullWidth:!0,children:h.loginButtonText})}
</div>
</template>`})}
${fs({align:"center",customStyles:{mb:{desktop:_n,mobile:bn}},children:Nn({link:{href:c.infoLinkUrl,target:"_blank",onClick:i},children:h.infoButtonText})})}
${hs({customStyles:{mb:{desktop:gn,mobile:fn}}})}
${fs({align:"center",children:Ao({buttonType:"tertiary",onClick:i,children:h.dismissButtonText})})}
</template>`});
// istanbul ignore if @preserve このコンポーネントを呼び出す際、targetを渡すケースがない
return e&&e.replaceWith(d),this.root=d,d}),
// istanbul ignore next @preserve 現状updateを呼ぶケースがない
__publicField(this,"update",t=>{if(!this.root||!this.props)return;const e={...this.props,...t},r=ye(this.props,e);Object.keys(r).length&&this.render(e,this.root)}),__publicField(this,"dispose",()=>{var t,e;null==(t=this.refs.modalComponentRef.current)||t.dispose(),null==(e=this.root)||e.remove(),this.root=null,this.props=null,this.refs.modalComponentRef={current:null}})}});class Xh{constructor(){__publicField(this,"_disposable",[]),__publicField(this,"_value",{initialized:!1,registrationEnforcementData:null,registrationEnforcementType:null}),__publicField(this,"_state"),__publicField(this,"closeRegistrationEnforcement",async()=>(await Hh(this._state.closeRegistrationEnforcement,t=>null!==t))());const t=fe(na)[0],e=fe(jt)[0],r=fe(Mo)[0],i=fe(oa)[0],o=fe(Js)[0];this._disposable.push(t),this._disposable.push(r),this._disposable.push(i),this._disposable.push(o);const{logger:n}=Ql(),{disableEnforcement:s,disableEnforcementBanner:l}=ge(t,"disableEnforcement","disableEnforcementBanner"),{defaultConfig:a}=ge(e,"defaultConfig"),{isInJapan:c,initialized:h}=ge(i,"isInJapan","initialized"),{initialized:d,manager:u,accountlessProfile:p}=ge(r,"initialized","manager","accountlessProfile"),{opsManagementSystemOrigin:g,opsManagementSystemIndexData:f,opsManagementSystemData:m}=ge(o,"opsManagementSystemOrigin","opsManagementSystemIndexData","opsManagementSystemData"),{enforcementSettings:_}=ge(m,"enforcementSettings"),[b,y]=ae(null),[v,w]=ae(null),[C,k]=ae(!1),[S,$]=ae(null),x=t=>{$(e=>{var r,i;return null===t?null:!C.current||"category1Modal"!==t&&"category2Modal"!==t?!(null==(i=null==(r=m.current)?void 0:r.emergencyMode)?void 0:i.isEmergencyMode)||"guide"!==t&&"banner"!==t?t:null:e})},E=pe({manager:u},({manager:t})=>()=>{
// istanbul ignore if @preserve manager このプロバイダが初期化された時点でこれがないパターンは存在しない
if(!t)return null;const e=t.getEfm();if(!e)return null;let r;try{r=JSON.parse(e)}catch(s){return null}const i=r.sd,o=r.ed;if("string"!=typeof i||"string"!=typeof o)return null;let n=null;return"number"==typeof r.ec&&(n=r.ec),{sd:i,ed:o,ec:n}}),I=pe({getEfmCookieData:E,enforcementSettings:_},({getEfmCookieData:t,enforcementSettings:e})=>e?()=>{
// istanbul ignore if @preserve enforcementSettings がないパターンは存在しない
if(!e)return"category1";const r=t(),i=null==r?void 0:r.ec;if(!i)return"category1";const o=[...e.registrationSettings.category].sort((t,e)=>e.min-t.min).find(t=>i>=t.min);return(null==o?void 0:o.category)?o.category:"category1"}:null),A=pe({disableEnforcementBanner:l,getCategory:I},({disableEnforcementBanner:t,getCategory:e})=>{if(e)return()=>{if(t)return void x(null);const r=e();x("category1"===r?"guide":"banner")}}),M=pe({enforcementSettings:_,registrationEnforcementType:S,manager:u,getEfmCookieData:E,setGuideOrBanner:A},({enforcementSettings:t,registrationEnforcementType:e,manager:r,getEfmCookieData:i,setGuideOrBanner:o})=>r&&i&&o?async()=>{
// istanbul ignore if @preserve closeCollationRecommendation が呼ばれる ===enforcementSettingsがあるため存在しないパターン
if(t)if("guide"!==e){
// istanbul ignore else @preserve ガイドとモーダル以外のパターンは存在しない
if("category1Modal"===e||"category2Modal"===e){x(null);const e=i(),{intervalSec:n,countInterval:s}=t.registrationSettings,l=new Date,a=new Date(l.getTime()+1e3*n),c={sd:l.toISOString(),ed:a.toISOString(),ec:((null==e?void 0:e.ec)||0)+s};await r.setEfm(JSON.stringify(c)),o()}}else x(null);else x(null)}:null),T=pe({opsManagementSystemData:m},({opsManagementSystemData:t})=>{var e;return null==(e=null==t?void 0:t.emergencyMode)?void 0:e.isEmergencyMode}),L=re(T.current);ue({opsManagementSystemData:m,disableEnforcement:s,disableEnforcementBanner:l,initialized:C,enforcementSettings:_,isInJapanInitialized:h,isInJapan:c,isEmergencyMode:T,authInitialized:d,manager:u,accountlessProfile:p,getCategory:I,getEfmCookieData:E,setGuideOrBanner:A},({opsManagementSystemData:t,disableEnforcement:e,initialized:r,enforcementSettings:i,isInJapanInitialized:o,isInJapan:n,authInitialized:s,manager:l,accountlessProfile:a,getCategory:c,getEfmCookieData:h,setGuideOrBanner:d})=>{var u,p,g;l&&c&&d&&(e||$e()?k(!0):r&&(null==(u=null==t?void 0:t.emergencyMode)?void 0:u.isEmergencyMode)===L.current||
// istanbul ignore if @preserve getCategoryがenforcementSettingsに依存しているため、最初の!getCategoryを通る時点で存在する
i&&o&&s&&void 0!==(null==(p=null==t?void 0:t.emergencyMode)?void 0:p.isEmergencyMode)&&(L.current=null==(g=null==t?void 0:t.emergencyMode)?void 0:g.isEmergencyMode,(()=>{if(!n)return;if(t.emergencyMode.isEmergencyMode)return void("category1Modal"!==S.current&&"category2Modal"!==S.current&&x(null));if("household"!==(null==a?void 0:a.entity))return;
// istanbul ignore if @preserve ３の条件が通る === 認可トークンがアカウントレスATであるため存在しないパターン
if("accountlessAuthZ"!==l.getAuthType())return;if(!i.registrationSettings.enabled)return;const e=h();if(!e)return void x("category1Modal");const r=new Date,o=new Date(e.sd),s=new Date(e.ed);if(o<=r&&r<=s)d();else{const t=c();x("category1"===t?"category1Modal":"category2Modal")}})(),k(!0)))}),ue({opsManagementSystemIndexData:f,registrationEnforcementType:S,registrationEnforcement:b,enforcementConfig:v,opsManagementSystemOrigin:g,defaultConfig:a},({opsManagementSystemIndexData:t,registrationEnforcementType:e,registrationEnforcement:r,enforcementConfig:i,opsManagementSystemOrigin:o,defaultConfig:s})=>{var l;if(!o)return;
// istanbul ignore if @preserve opsManagementSystemOriginと同一のタイミングでセットされるため、基本通らないパターン
if(!t)return;if("category1Modal"!==e&&"category2Modal"!==e&&"banner"!==e)return;if(r&&i)return;const a=null==(l=t.items.find(t=>"registrationEnforcement"===t.id))?void 0:l.path;
// istanbul ignore if @preserve
if(a)try{(async()=>{
// istanbul ignore if @preserve
if(!s)return;const t=new URL(a,o).toString(),[e,r]=await Promise.all([te(t),te(s.endpoint.enforcementConfig)]);y(e),w(r)})()}catch(c){
// istanbul ignore next @preserve TODO: テスト書く
n.error(c)}}),ue({initialized:C,registrationEnforcement:b,registrationEnforcementType:S},({initialized:t,registrationEnforcement:e,registrationEnforcementType:r})=>{this._value.initialized=t,this._value.registrationEnforcementData=e,this._value.registrationEnforcementType=r,window.dispatchEvent(new Event(kt.registrationEnforcementChange))}),this._state={closeRegistrationEnforcement:M},ue({enforcementConfig:v,registrationEnforcement:b,registrationEnforcementType:S},({enforcementConfig:t,registrationEnforcement:e,registrationEnforcementType:r})=>{if(t&&e&&("category1Modal"===r||"category2Modal"===r)){const i=re(null);return document.body.appendChild(Jh({ref:i,enforcementConfig:t,registrationEnforcement:e,onClose:this.closeRegistrationEnforcement,registrationEnforcementType:r})),()=>{var t;null==(t=i.current)||t.dispose()}}})}get registrationEnforcementData(){return this._value.registrationEnforcementData}get registrationEnforcementType(){return this._value.registrationEnforcementType}get initialized(){return this._value.initialized}
// istanbul ignore next @preserve 現状disposeを呼ぶケースがない
dispose(){var t;this._value.initialized=!1,this._value.registrationEnforcementData=null,this._value.registrationEnforcementType=null,null==(t=this._state.closeRegistrationEnforcement)||t.dispose(),this._disposable.forEach(t=>{var e;return null==(e=t.dispose)?void 0:e.call(t)})}}class Gh{constructor(){__publicField(this,"_registrationEnforcementProvider",null),__publicField(this,"_bindEnforcementProvider",null),__publicField(this,"_collationEnforcementProvider",null)}get registrationEnforcementProvider(){return this._registrationEnforcementProvider}get bindEnforcementProvider(){return this._bindEnforcementProvider}get collationEnforcementProvider(){return this._collationEnforcementProvider}initialize(){this._registrationEnforcementProvider=new Xh,this._bindEnforcementProvider=new Uh,this._collationEnforcementProvider=new Wh,this._collationEnforcementProvider.initialize()}
// istanbul ignore next @preserve 現状disposeを呼ぶケースがない
dispose(){var t,e,r;null==(t=this._registrationEnforcementProvider)||t.dispose(),this._registrationEnforcementProvider=null,null==(e=this._bindEnforcementProvider)||e.dispose(),this._bindEnforcementProvider=null,null==(r=this._collationEnforcementProvider)||r.dispose(),this._collationEnforcementProvider=null}}class Kh{constructor(){__publicField(this,"_flashNews",ae([])),__publicField(this,"_disposable",[]),__publicField(this,"_abortController",new AbortController),__publicField(this,"_timeout",null)}get flashNews(){return this._flashNews[0].current}
// istanbul ignore next @preserve 現状flashNewsStateを呼ぶケースがない
get flashNewsState(){return this._flashNews[0]}async initialize(){const{logger:t}=Ql(),{defaultConfig:e}=ge(fe(jt)[0],"defaultConfig"),r=pe({siteConfig:fe(na)[0]},({siteConfig:t})=>!((null==t?void 0:t.sokuhoNews)??1)),[i,o]=this._flashNews;let n=0;ue({flashNews:i},()=>{window.dispatchEvent(new Event(kt.flashNewsChange))},{abortSignal:this._abortController.signal}),ue({defaultConfig:e,disabled:r},async({defaultConfig:e,disabled:r})=>{if(r)return n=0,void o([]);if(!e)return;const s=async()=>{n=Date.now(),this._timeout=setTimeout(s,3e4);const r=await(async(t,e)=>{try{const e=Ie()?'<flashNews flag="1" pubDate="Tue, 21 Nov 2023 22:53:15 +0900">\n<report category="1" date="2025/09/22 10:00" link="https://dev-news.bx.nhk/newsweb/">\n<line>ニュース速報 テスト 1-1</line>\n<line>ニュース速報 テスト 1-2</line>\n</report>\n<report category="1" date="2025/09/22 10:00" link="">\n<line>ニュース速報 テスト linkが空</line>\n</report>\n<report category="2" date="2025/09/22 10:00" link="https://dev-news.bx.nhk/kishou-saigai/earthquake/">\n<line>地震速報 テスト</line>\n</report>\n<report category="3" date="2025/09/22 10:00" link="https://dev-news.bx.nhk/kishou-saigai/tsunami/">\n<line>津波速報 テスト</line>\n</report>\n<report category="4" date="2025/09/22 10:00" link="https://dev-news.bx.nhk/kishou-saigai/earthquake/">\n<line>緊急地震速報 テスト</line>\n</report>\n</flashNews>':await(async()=>{const e=await fetch(t.endpoint.sokuhoNews);if(!e.ok)throw new Error(Xl(e));return e.text()})();return[...(new DOMParser).parseFromString(e,"text/xml").querySelectorAll("flashNews > report")].map(t=>{const e=t.getAttribute("link");return{title:[...t.querySelectorAll("line")].map(t=>t.textContent).join("\n").trim(),date:t.getAttribute("date")??"",priority:"high",link:e?{href:e,rel:"noopener noreferrer"}:void 0}})}catch(r){return e.error(r),null}})(e,t);r&&(((t,e)=>{if(t.length!==e.length)return!1;for(let r=0;r<t.length;r++){const i=t[r],o=e[r];
// istanbul ignore next @preserve 関数冒頭でlengthチェックを行っているため、ここに到達することはない
if(!i||!o)return!1;if(i.date!==o.date||i.title!==o.title||i.priority!==o.priority)return!1}return!0})(r,i.current)||o(r))},l=Math.max(3e4+n-Date.now(),0);this._timeout=setTimeout(s,l)},{abortSignal:this._abortController.signal})}
// istanbul ignore next @preserve 現状disposeを呼ぶケースがない
dispose(){this._abortController.abort(),this._disposable.forEach(({dispose:t})=>t()),this._disposable=[],clearTimeout(this._timeout??void 0),this._timeout=null}}const Yh=()=>{let t=null;const e=()=>{var e;const r=16/(e=document.documentElement,(()=>{var t;const r=e.getAttribute("style");if(!r)return;const i=r.match(/font-size\s*:\s*([^;]+)/i);if(!i)return;const o=null==(t=i[1])?void 0:t.trim();return(null==o?void 0:o.endsWith("px"))?parseFloat(o):(null==o?void 0:o.endsWith("%"))?parseFloat(o)/100*16:void 0})()||parseFloat(window.getComputedStyle(document.documentElement).fontSize));t!==r&&(t=r,document.documentElement.style.setProperty("--font-size-scale-factor",r.toString()))};e();new MutationObserver(t=>{t.forEach(t=>{
// istanbul ignore else @preserve このMutationObserverが監視しているのはstyle属性の変更のみなのでelseは発生しない
"attributes"===t.type&&"style"===t.attributeName&&t.target instanceof HTMLElement&&e()})}).observe(document.documentElement,{attributes:!0,attributeFilter:["style"]}),window.addEventListener("resize",e)};class Qh{constructor(){__publicField(this,"defaultHBConfig",null),__publicField(this,"getDefaultHBConfigPromise",null),__publicField(this,"_fetchDefaultFile",async()=>{const t=na({}),{initialized:e,opsManagementSystemIndexData:r,opsManagementSystemOrigin:i}=this.opsManagementSystemState;if(!e.current||!t.current||!i.current)return null;const o=await(async t=>{const{opsManagementSystemIndexData:e,opsManagementSystemOrigin:r,siteGroup:i}=t;try{if("dms"!==i)return null;if(!e||!r)return null;const t=e.items.find(t=>"default"===t.id);if(!t)return null;const o=new URL(r);o.pathname=t.path;const n=o.toString();return await te(n)}catch{return null}})({opsManagementSystemIndexData:r.current,opsManagementSystemOrigin:i.current,siteGroup:t.current.siteGroup});return this.defaultHBConfig=o,o}),__publicField(this,"opsManagementSystemState",ge(fe(Js)[0],"initialized","opsManagementSystemIndexData","opsManagementSystemOrigin")),__publicField(this,"_initialized",!1),__publicField(this,"getDefaultHBConfig",async()=>this.defaultHBConfig?this.defaultHBConfig:(this.getDefaultHBConfigPromise||(this.getDefaultHBConfigPromise=this._fetchDefaultFile()),this.getDefaultHBConfigPromise)),ue(this.opsManagementSystemState,async({initialized:t})=>{t&&(this._initialized=!0,window.dispatchEvent(new Event(kt.heartbeatConfigChange)))})}get initialized(){return this._initialized}}class td{constructor(){__publicField(this,"_initialized",ae(!1)),__publicField(this,"_opsManagementSystemOrigin",ae("")),__publicField(this,"_opsManagementSystemData",ae({enforcementSettings:null,emergencyMessages:null,emergencyMode:null})),__publicField(this,"_opsManagementSystemIndexData",ae(null)),__publicField(this,"_abortController",new AbortController),__publicField(this,"_disposable",[])}async initialize(){var t;ue({initialized:this.initializedState,opsManagementSystemData:this.opsManagementSystemDataState,opsManagementSystemOrigin:this.opsManagementSystemOriginState,opsManagementSystemIndexData:this.opsManagementSystemIndexDataState},()=>{window.dispatchEvent(new Event(kt.opsManagementChange))},{abortSignal:this._abortController.signal});const{logger:e}=Ql(),[r,i]=fe(jt);this._disposable.push({dispose:i});const[o,n]=ae((null==(t=r.current)?void 0:t.defaultConfig)??null);ue({defaultConfigContext:r},({defaultConfigContext:t})=>n((null==t?void 0:t.defaultConfig)??null),{abortSignal:this._abortController.signal});const[,s]=this._initialized,[,l]=this._opsManagementSystemOrigin,[,a]=this._opsManagementSystemIndexData,[,c]=this._opsManagementSystemData,h=re({enforcementSettings:!1,emergencyMessages:!1,emergencyMode:!1});ue({defaultConfig:o},({defaultConfig:t})=>{if(!t)return;const r=new AbortController,i=async()=>{try{const i=t.endpoint.opsManagementIndex,o=await fetch(i,{signal:r.signal});if(200!==o.status)throw new Error(Xl(o));const n=await o.json(),s=new URL(i);l(s.origin),a(n),await(async(t,r,i)=>{const o=await Promise.all(r.items.map(async r=>{try{if("enforcementSettings"!==r.id&&"emergencyMessages"!==r.id&&"emergencyMode"!==r.id)return null;if(h.current[r.id]&&!r.polling)return null;const e=new URL(t);e.pathname=r.path;const o=e.toString(),n=await fetch(o,{signal:i.signal});if(200!==n.status)throw new Error(Xl(n));const s=await n.json();return h.current[r.id]=!0,[r.id,s]}catch(o){return e.error(o),null}}));c(t=>{const e={...t};return o.forEach(t=>{if(!t)return;const[r,i]=t;i&&(e[r]=i)}),e})})(i,n,r)}catch(i){e.error(i)}finally{s(!0)}};i();const o=((t,e)=>{let r;const i=()=>{t(),r=setTimeout(i,e)};return r=setTimeout(i,e),()=>{clearTimeout(r)}})(i,6e4);return()=>{o(),r.abort()}},{abortSignal:this._abortController.signal})}get initialized(){return this._initialized[0].current}get opsManagementSystemData(){return this._opsManagementSystemData[0].current}get opsManagementSystemOrigin(){return this._opsManagementSystemOrigin[0].current}get opsManagementSystemIndexData(){return this._opsManagementSystemIndexData[0].current}get initializedState(){return this._initialized[0]}get opsManagementSystemDataState(){return this._opsManagementSystemData[0]}get opsManagementSystemOriginState(){return this._opsManagementSystemOrigin[0]}get opsManagementSystemIndexDataState(){return this._opsManagementSystemIndexData[0]}dispose(){this._abortController.abort(),this._disposable.forEach(t=>{var e;return null==(e=t.dispose)?void 0:e.call(t)})}}class ed{constructor(t){__publicField(this,"_enableSearch"),__publicField(this,"_manager"),__publicField(this,"_auth"),__publicField(this,"_initializeRequested",ae(!1)),__publicField(this,"_disposable",[]),__publicField(this,"initialized",!1),__publicField(this,"searchList",[]),__publicField(this,"searchError",null),__publicField(this,"initializeSearchState",()=>{this._initializeRequested[1](!0)});const e=na({}).current;this._enableSearch="dms"===(null==e?void 0:e.siteGroup),this._manager=t.manager,this._auth=fe(Mo)[0],this._disposable.push(this._auth,this._initializeRequested[0])}async initialize(){const{initialized:t}=ge(this._auth,"initialized");ue({authInitialized:t,initializeRequested:this._initializeRequested[0]},({authInitialized:t,initializeRequested:e})=>{t&&e&&this.refreshSearchState()})}_notifyChange(){this.initialized=!0,window.dispatchEvent(new Event(kt.searchStateChange))}async refreshSearchState(){const{account:t,accountProfile:e}=Mo({}).current??// istanbul ignore next @preserve .current がないパターンは存在しないため、カバレッジ対象外とする
{};if(!this._enableSearch)return this.searchList=[],this.searchError=null,void this._notifyChange();if(!t||!e)return this.searchList=[],void this._notifyChange();if("optedin"!==t.responseContent.consentToHistoryFeature.status)return this.searchList=[],void this._notifyChange();if("private"===e.profileType)return this.searchList=[],void this._notifyChange();try{const t=await this._manager.getSearchList();this.searchList=t.result||[]}catch(r){this.searchList=[],this.searchError=r}this._notifyChange()}async createSearch(t,e){const r=this._enableSearch,i=Mc({}).current,o=((t={})=>{const{onChange:e}=t,r=navigator.userAgent,i=e?()=>{e&&e(r)}:null;return i&&setTimeout(i),{current:r}})({}).current,n=na({}).current,{account:s,accountProfile:l}=Mo({}).current??// istanbul ignore next @preserve .current がないパターンは存在しないため、カバレッジ対象外とする
{},a=this._manager;
// istanbul ignore if @preserve このプロバイダ自身が初期化されている時点で親のプロバイダは初期化されているはず
if(n&&i&&o){if(r&&s&&l&&"optedin"===s.responseContent.consentToHistoryFeature.status&&"private"!==l.profileType)try{const e=await a.createSearch({category:"common",deviceId:i,policyVer:s.responseContent.consentToHistoryFeature.ver,status:s.responseContent.consentToHistoryFeature.status,searchKeyword:t,ua:o,dateSearched:(new Date).toISOString()});e.searchHistory&&(this.searchList=this.searchList.concat(e.searchHistory),this._notifyChange())}catch{}if(!e){const e=(c=window.location.href,/^(https?:\/\/)?((prd|pre|pvw|stg|dev)-)?www\.(web|bx)\.nhk\/(kenko|heart)(\/.*)?$/.test(c)?"tv":/^(https?:\/\/)?((prd|pre|pvw|stg|dev)-)?news\.(web|bx)\.nhk(\/.*)?$/.test(c)?"news":null),r=Mt[n.siteGroup][n.env],i=Tt[n.siteGroup];window.location.href=`${r}?${i}=${encodeURIComponent(t)}${e?`&modeOfItem=${e}`:""}`}var c}}async deleteSearchById(t){const{account:e,accountProfile:r}=Mo({}).current??// istanbul ignore next @preserve .current がないパターンは存在しないため、カバレッジ対象外とする
{};if(this._enableSearch&&e&&r&&"optedin"===e.responseContent.consentToHistoryFeature.status&&"private"!==r.profileType){this.searchList=this.searchList.filter(e=>e.searchId!==t.searchId),this._notifyChange();try{await this._manager.deleteSearchById(t)}catch{}await this.refreshSearchState()}}async deleteAllSearch(){const{account:t,accountProfile:e}=Mo({}).current??// istanbul ignore next @preserve .current がないパターンは存在しないため、カバレッジ対象外とする
{};if(this._enableSearch&&t&&e&&"optedin"===t.responseContent.consentToHistoryFeature.status&&"private"!==e.profileType){this.searchList=[],this._notifyChange();try{await this._manager.deleteAllSearch()}catch{}await this.refreshSearchState()}}
// istanbul ignore next @preserve これを呼び出せるコードが存在しない
dispose(){this._disposable.forEach(t=>{var e;return null==(e=t.dispose)?void 0:e.call(t)})}}class rd{constructor(t){
// istanbul ignore if @preserve authが無効化されているとき、親プロバイダはProfileProviderを初期化しない
var e;if(__publicField(this,"_accountlessProfileServerUrl"),__publicField(this,"_accountProfileServerUrl"),__publicField(this,"_initialized",!1),__publicField(this,"_enableSearch",!1),__publicField(this,"_profileManager"),__publicField(this,"_searchProvider",null),!(null==(e=window.nhkLib)?void 0:e.auth))throw new Error("ProfileProviderを初期化するにはwindow.nhkLib.authが必要です。");const{accountlessProfileServerUrl:r,accountProfileServerUrl:i}=t;this._accountlessProfileServerUrl=r,this._accountProfileServerUrl=i,this._enableSearch=t.enableSearch??!1;const{logger:o}=Ql();this._profileManager=new mt(window.nhkLib.auth.cookieAccessInstance,window.nhkLib.auth.config,{accountlessProfile:{serverUrl:r},accountProfile:{serverUrl:i}},o)}get accountlessProfileServerUrl(){return this._accountlessProfileServerUrl}get accountProfileServerUrl(){return this._accountProfileServerUrl}get initialized(){return this._initialized}get manager(){return this._profileManager}get searchProvider(){return this._searchProvider}async initialize(){this._searchProvider=new ed({enableSearch:this._enableSearch,manager:this._profileManager}),await this._searchProvider.initialize(),window.dispatchEvent(new Event(kt.profileStateChange)),this._initialized=!0}}class id{constructor(){__publicField(this,"_initialized",!1);const[t]=fe(Mo),[e]=fe(oa);ue({auth:t,isInJapan:e},({auth:t,isInJapan:e})=>{
// istanbul ignore if @preserve このプロバイダが初期化された時点でどちらも存在する
e&&t&&!this._initialized&&t.initialized&&e.initialized&&(this._initialized=!0,t.manager.checkTokenExp(e.isInJapan))})}}class od{constructor(){__publicField(this,"_modalList",[]);const[t,e]=ae([]);new MutationObserver(()=>{const t=document.querySelectorAll("dialog");if(0===t.length)return e([]),void(this._modalList=[]);const r=[];for(const e of t){if(!e.hasAttribute("open"))continue;const t=e.getAttribute("data-modal-type");if(!t)continue;let i=!1;try{i=e.matches(":modal")}catch{}const o=window.getComputedStyle(e).zIndex;let n;n="auto"===o?"auto":Number(o),r.push({modalType:t,zIndex:n,isInTopLayer:i})}e(r),this._modalList=r}).observe(document.documentElement,{attributes:!0,attributeFilter:["open","data-modal-type"],childList:!0,subtree:!0}),ue({modalList:t},()=>{window.dispatchEvent(new Event(kt.modalListChange))})}get modalList(){return this._modalList}}window.nhkLib=new class{constructor(){__publicField(this,"_loggerProvider",null),__publicField(this,"_authProvider",null),__publicField(this,"_apiClientProvider",null),__publicField(this,"_areaProvider",null),__publicField(this,"_consentToUseDataProvider",null),__publicField(this,"_defaultConfigProvider",null),__publicField(this,"_enforcementProvider",null),__publicField(this,"_opsManagementSystemProvider",null),__publicField(this,"_flashNewsProvider",null),__publicField(this,"_heartbeatConfigProvider",null),__publicField(this,"_modalInfoProvider",null),__publicField(this,"_emergencyModeProvider",null),__publicField(this,"_deviceId"),__publicField(this,"_initialized",!1),__publicField(this,"_profileProvider",null),__publicField(this,"_theme","light"),__publicField(this,"_siteConfig",null),__publicField(this,"_authDisabled",!1),__publicField(this,"_isInJapan",!1),__publicField(this,"_isInJapanInitialized",!1),__publicField(this,"refs",{header:re(null),footer:re(null),appBanner:re(null)}),__publicField(this,"elements",{emergencyModeInfo:null,erpcHalfModal:null,header:null}),window.bxComponentVersion="1.10.2",this._deviceId=(()=>{const t=sessionStorage.getItem(St);if(t)return t;const e=Ht();return sessionStorage.setItem(St,e),e})(),window.dispatchEvent(new Event(kt.deviceIdChange)),this._checkDeviceIdUniqueness()}get events(){return kt}get logger(){return this._loggerProvider}get apiClient(){return this._apiClientProvider}get auth(){return this._authProvider}get authDisabled(){return this._authDisabled}get area(){return this._areaProvider}get enforcement(){return this._enforcementProvider}get emergencyMode(){return this._emergencyModeProvider}get opsManagementSystem(){return this._opsManagementSystemProvider}get deviceId(){return this._deviceId}get initialized(){return this._initialized}get profile(){return this._profileProvider}get theme(){return this._theme}get siteConfig(){return this._siteConfig}get flashNewsProvider(){return this._flashNewsProvider}get defaultConfigProvider(){return this._defaultConfigProvider}get heartbeatConfigProvider(){return this._heartbeatConfigProvider}get modalList(){return this._modalInfoProvider}get defaultConfig(){var t;return(null==(t=this._defaultConfigProvider)?void 0:t.defaultConfig)??null}get consentToUseDataProvider(){return this._consentToUseDataProvider}get consentToUseData(){var t;return(null==(t=this._consentToUseDataProvider)?void 0:t.consentToUseData)??null}get isInJapan(){return this._isInJapan}get isInJapanInitialized(){return this._isInJapanInitialized}get components(){return{AuthAccountLoginButton:Lo,AuthAccountSignupButton:Po}}get hooks(){return{useHeartbeat:Nc,useProfileRelatedHeartbeatData:Fc,useSnackbar:Pc}}_checkDeviceIdUniqueness(){const t=new BroadcastChannel("bx-components-tab-communication");t.postMessage({type:"CHECK_TAB_DUPLICATE",deviceId:this._deviceId}),t.onmessage=t=>{const{type:e,deviceId:r}=t.data;if("CHECK_TAB_DUPLICATE"===e&&r===this._deviceId){const t=Ht();this._deviceId=t,sessionStorage.setItem(St,t),window.dispatchEvent(new Event(kt.deviceIdChange))}}}_render(t){var e,r;const{selector:i,auth:o,header:n,footer:s,enableErpcHalfModal:l}=t;((t=".bx-snackbar")=>{const e=document.querySelectorAll(t);0!==e.length&&e.forEach(t=>{const e=new ws,r=()=>{const e="true"===t.getAttribute("data-open"),r=t.getAttribute("data-type"),i=t.getAttribute("data-title")||"",o=t.getAttribute("data-description")||"";return{open:e,type:r,title:i,autoClose:"true"===t.getAttribute("data-auto-close"),autoCloseDuration:Number(t.getAttribute("data-auto-close-duration"))||10,description:o,onClose:()=>{t.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}}};new MutationObserver(()=>{const i=r();i.open||!e.element?i.open&&(e.element&&e.element.isConnected?e.update(i):(e.render(i),e.element&&t.appendChild(e.element))):e.element.remove()}).observe(t,{attributes:!0,attributeFilter:["data-open","data-type","data-title","data-description","data-auto-close","data-auto-close-duration"]});const i=r();e.render(i),e.element&&t.appendChild(e.element)})})((null==i?void 0:i.Snackbar)??".bx-snackbar"),((t=".bx-notification")=>{const e=document.querySelectorAll(t);0!==e.length&&e.forEach(t=>{const e=new ms;let r=null;const i=()=>{const e="true"===t.getAttribute("data-open"),r=t.getAttribute("data-type"),i=t.getAttribute("data-title")||"",o=t.getAttribute("data-description")||"",n=t.getAttribute("data-link-href")||"",s=t.getAttribute("data-link-target")||void 0;return{open:e,type:r,title:i,description:o,onClose:()=>{t.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))},link:n?{href:n,target:s}:void 0,linkText:t.getAttribute("data-link-text")||"",buttonList:(JSON.parse(t.getAttribute("data-button-list")||"[]")||[]).map((e,r)=>({...e,onClick:()=>{t.dispatchEvent(new CustomEvent("button-click",{bubbles:!0,composed:!0,detail:{label:e.label,type:e.type,index:r}}))}}))}};new MutationObserver(()=>{const o=i();if(!o.open&&r)return r.remove(),void(r=null);o.open&&(r?e.update(o):(r=e.render(o),r&&t.appendChild(r)))}).observe(t,{attributes:!0,attributeFilter:["data-open","data-type","data-title","data-description","data-link-href","data-link-target","data-link-text","data-button-list"]});const o=i();if(r=e.render(o),r){if(t.children.length)return;t.appendChild(r)}})})((null==i?void 0:i.Notification)??".bx-notification"),((t=".bx-share-module")=>{const e=document.querySelectorAll(t);0!==e.length&&e.forEach(t=>{const e=new ih;let r=null;const i=()=>{const e=t.getAttribute("data-current-time"),r=t.getAttribute("data-description")||"",i="true"===t.getAttribute("data-is-prioritize-url"),o="true"===t.getAttribute("data-is-show-modal"),n=t.getAttribute("data-size")||"M",s=t.getAttribute("data-title")||"",l=t.getAttribute("data-url")||"";return{currentTime:e?Number(e):void 0,description:r,isPrioritizeUrl:i,isShowModal:o,size:n,title:s,url:l}};new MutationObserver(()=>{const o=i();r?e.update(o):(r=e.render(o),r&&t.appendChild(r))}).observe(t,{attributes:!0,attributeFilter:["data-current-time","data-description","data-is-prioritize-url","data-is-show-modal","data-size","data-title","data-url"]});const o=i();r=e.render(o),r&&t.appendChild(r)})})((null==i?void 0:i.ShareModule)??".bx-share-module"),[...document.querySelectorAll((null==i?void 0:i.authAccountLoginButton)??".bx-auth-account-login-button")].map(t=>{const e=To.getPropsFromElement(t);(new To).render(e,t)}),[...document.querySelectorAll((null==i?void 0:i.authAccountSignupButton)??".bx-auth-account-signup-button")].map(t=>{const e=zo.getPropsFromElement(t);(new zo).render(e,t)});const a=xe(),c=$e()||a,h=()=>{var t;const e=document.getElementById(Ft),r=null==e?void 0:e.getBoundingClientRect(),i=null==(t=document.activeElement)?void 0:t.getBoundingClientRect();if(r&&i){const t=i.bottom-r.top+12;t>0&&window.scrollBy({top:-t,behavior:"smooth"})}},{isEmergencyMode:d}=ge(fe(Dl)[0],"isEmergencyMode"),u=pe({isEmergencyMode:d,showRegistrationEnforcementBanner:Fh(),showBindEnforcementBanner:Bh()},({isEmergencyMode:t,showRegistrationEnforcementBanner:e,showBindEnforcementBanner:r})=>t||e||r);if(!c&&!(null==(e=window.nhkLib)?void 0:e.refs.header.current)){const t=document.querySelector((null==i?void 0:i.nhkHeader)??".bx-nhk-header");t&&!(null==n?void 0:n.disabled)?o.disabled?this.elements.header=Cc({ref:this.refs.header,disableShadow:u},t):this.elements.header=vc({ref:this.refs.header,disableShadow:u,onFocus:h},t):this.elements.header=t}if(this.elements.header){let t=document.createElement("div");this.elements.header.after(t),ue({hasUnderHeaderElement:u},({hasUnderHeaderElement:e})=>{const r=(e?Nh({headerEl:{current:this.elements.header}},t):null)??document.createComment("PlaceHolder");t.replaceWith(r),t=r})}const p=document.querySelector((null==i?void 0:i.nhkFooter)??".bx-nhk-footer"),g=this.elements.erpcHalfModal??document.querySelector((null==i?void 0:i.erpcHalfModal)??".bx-erpc-half-modal")??(()=>{const t=document.createElement("div");return t.classList.add("bx-erpc-half-modal"),null==p||p.before(t),t})(),f=this.elements.emergencyModeInfo??document.querySelector((null==i?void 0:i.emergencyModeInfo)??".bx-emergency-mode-info")??(()=>{const t=document.createElement("div");return t.classList.add("bx-emergency-mode-info"),null==p||p.before(t),t})();if((null==s?void 0:s.disabled)||c||(null==(r=window.nhkLib)?void 0:r.refs.footer.current)||p&&ta({...s,ref:this.refs.footer},p),!a){let t=null,e=null;const r=re(null),i=({emergencyModeInitialized:e,isEmergencyMode:r})=>t??(l&&e&&!r),o=()=>{
// istanbul ignore if @preserve TODO: 不要な型ガードの削除
var n,s;if(!g)return;this.elements.erpcHalfModal=this.elements.erpcHalfModal??g;const{isEmergencyMode:l,initialized:h}=Dl({}).current??{},d=Hl({}).current,u=(i({emergencyModeInitialized:h,isEmergencyMode:l})&&!c&&d)??!1;e!==u&&(e=u,u?this.elements.erpcHalfModal=jl({showCloseButton:l,onClose:()=>{t=!1,o(),a()}},this.elements.erpcHalfModal)??// istanbul ignore next @preserve TODO: this.elements.erpcHalfModalがnullにならない以上、ERPCHalfModalがnullを返すことはないはず 実態に合わせてコンポーネント側の型定義を修正する
g:(null==(n=r.current)||n.dispose(),null==(s=this.elements.erpcHalfModal)||s.replaceWith(g),this.elements.erpcHalfModal=g))};let n=null;const s=re(null),a=()=>{
// istanbul ignore if @preserve TODO: 不要な型ガードの削除
var e,r;if(!f)return;this.elements.emergencyModeInfo=this.elements.emergencyModeInfo??f;const{isEmergencyMode:l,initialized:c}=Dl({}).current??{},h=(c&&l&&!i({emergencyModeInitialized:c,isEmergencyMode:l}))??!1;if(n!==h)if(h){const e=()=>{t=!0,o(),a()};this.elements.emergencyModeInfo=zh({onClick:e,ref:s},f)}else null==(e=this.elements.emergencyModeInfo)||e.replaceWith(f),this.elements.emergencyModeInfo=f,null==(r=s.current)||r.dispose();n=h};l&&!c&&g&&(Dl({onChange:()=>o()}),Hl({onChange:()=>o()}),o()),c||
// istanbul ignore else @preserve TODO: 不要な型ガードの削除
f&&(Dl({onChange:a}),a())}}initialize(t){window.nhkLib=this;const{disableAnalytics:r,disableDarkMode:i,disableResetCSS:o,enableFontSizeScaleFactor:n}=t;return i||(this._theme=(()=>{const t=window.matchMedia("(prefers-color-scheme: dark)"),r=t=>t.matches?(document.documentElement.classList.add("dark",e),"dark"):(document.documentElement.classList.remove("dark",e),"light"),i=r(t);return t.addEventListener("change",r),window.addEventListener("beforeUnload",()=>{t.removeEventListener("change",r)}),i})()),o||document.head.querySelector("style[data-bx-components-reset-css]")||document.head.appendChild(ee`<style data-bx-components-reset-css>
${'\n    :where(\n        html,\n        body,\n        div,\n        span,\n        applet,\n        object,\n        iframe,\n        h1,\n        h2,\n        h3,\n        h4,\n        h5,\n        h6,\n        p,\n        blockquote,\n        pre,\n        a,\n        abbr,\n        acronym,\n        address,\n        big,\n        cite,\n        code,\n        del,\n        dfn,\n        em,\n        img,\n        ins,\n        kbd,\n        q,\n        s,\n        samp,\n        small,\n        strike,\n        strong,\n        sub,\n        sup,\n        tt,\n        var,\n        b,\n        u,\n        i,\n        center,\n        dl,\n        dt,\n        dd,\n        ol,\n        ul,\n        li,\n        fieldset,\n        form,\n        label,\n        legend,\n        table,\n        caption,\n        tbody,\n        tfoot,\n        thead,\n        tr,\n        th,\n        td,\n        article,\n        aside,\n        canvas,\n        details,\n        embed,\n        figure,\n        figcaption,\n        footer,\n        header,\n        hgroup,\n        menu,\n        nav,\n        output,\n        ruby,\n        section,\n        summary,\n        time,\n        mark,\n        audio,\n        video,\n        button,\n        input,\n        select,\n        textarea\n    ) {\n        margin: 0;\n        padding: 0;\n        border: 0;\n        font: inherit;\n        color: currentColor;\n        background: none;\n        text-decoration: none;\n        vertical-align: baseline;\n        overflow-wrap: anywhere;\n    }\n    :where(article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section) {\n        display: block;\n    }\n    :where(body) {\n        line-height: 1;\n        font-family: "BIZ UDPGothic", "Hiragino Sans", sans-serif;\n    }\n    :where(ol, ul, menu, summary) {\n        list-style: none;\n    }\n    :where(blockquote, q) {\n        quotes: none;\n    }\n    :where(blockquote:before, blockquote:after, q:before, q:after) {\n        content: "";\n        content: none;\n    }\n    :where(table) {\n        border-collapse: collapse;\n        border-spacing: 0;\n    }\n    :where(*, *::before, *::after) {\n        box-sizing: border-box;\n    }\n'}
</style>`),n&&Yh(),(t=>{var e;let r=null;const i=e=>{if(!e)return;const r=(()=>{const r=e.config.disableAnalytics;return r.overwritable?t.disableAnalytics??r.default:r.default})(),i=document.head.querySelector("script[data-bx-components-adobe-analytics]");if(r)i&&i.remove();else if(!i){const t=document.createElement("script");t.setAttribute("data-bx-components-adobe-analytics","true"),t.src=e.endpoint.adobeAnalytics_orjp,t.async=!0,document.head.appendChild(t)}},o=jt({onChange:t=>{r=t.defaultConfig,r&&i(r)}});r=(null==(e=o.current)?void 0:e.defaultConfig)||null,r&&i(r)})({disableAnalytics:r}),this._initializeAsync(t)}async _initializeAsync(t){var e;const r=[],{apiConfig:i,auth:o,selector:n,siteConfig:s,logger:l}=t,a={...s,env:s.env||"prd"};if(this._siteConfig=a,this._loggerProvider=new Yl(null==l?void 0:l.instance,null==l?void 0:l.logLevel),"complete"===document.readyState?this._render(t):document.addEventListener("DOMContentLoaded",()=>this._render(t)),!this._initialized&&!(null==(e=window.nhkLib)?void 0:e._initialized)){const e=xe();if(this._defaultConfigProvider=new Oh,this._defaultConfigProvider.initialize(),e||(this._opsManagementSystemProvider=new td,this._opsManagementSystemProvider.initialize(),this._flashNewsProvider=new Kh,this._flashNewsProvider.initialize()),this._heartbeatConfigProvider=new Qh,this._modalInfoProvider=new od,o.disabled)this._authDisabled=!0;else try{const{cookie:n=Ct(),config:s}=o;this._authProvider=new _h({config:s,cookie:n}),r.push(this._authProvider.initialize()),t.profile&&(this._profileProvider=new rd(t.profile),r.push(this._profileProvider.initialize())),(()=>{var t;const[e]=fe(Mo),{showSnackbar:r}=Pc(),i=null==(t=e.current)?void 0:t.manager.getTokenBFFError();if(!i)return;const{idpType:o}=i;o===R.accountAuthN&&r({type:"error",title:"ログインに失敗しました。時間を置いて再試行してください。"}),o!==R.accountlessAuthZ&&o!==R.accountlessAuthZAbroad||r({type:"error",title:"エラーが発生しました。時間を置いて再試行してください。"}),o===R.accountlessAuthZEmergency&&r({type:"error",title:"エラーが発生しました。時間を置いて再度アクセスしてください。"})})(),this._apiClientProvider=new fh({apiConfig:i}),e||new id,this._areaProvider=new mh,e||(this._emergencyModeProvider=new Dh,r.push(this._emergencyModeProvider.initialize()),this._consentToUseDataProvider=new Zh,this._consentToUseDataProvider.initialize(),this._enforcementProvider=new Gh,this._enforcementProvider.initialize())}catch{}if(!($e()||e)&&a.appBanner){const t=navigator.userAgent,e=(c=t,Et.test(c)?"FireOS":xt.test(c)?"Android":$t.test(c)?"iOS":null),{closeAppBanner:r}=nh({appBannerType:"Android"===e||"iOS"===e?a.appBanner:null,onChange:t=>{const i=e&&t&&{image:t.info.artwork,description:t.info.description.smart.text,link:{href:"Android"===e?t.info.store.android:t.info.store.iphone},onClose:()=>{var t;null==(t=this.refs.appBanner.current)||t.dispose(),r()},ref:this.refs.appBanner};if(i){const t=Lh(i),e=document.querySelector(Th)??document.querySelector((null==n?void 0:n.appBanner)??".bx-app-banner");e?e.replaceWith(t):document.body.prepend(t)}}})}if(!e){const{logger:t}=Ql(),{defaultConfig:e,defaultConfigError:r}=ge(fe(jt)[0],"defaultConfig","defaultConfigError");ue({defaultConfig:e,defaultConfigError:r},async({defaultConfig:e,defaultConfigError:r})=>{if(r)return this._isInJapan=!0,this._isInJapanInitialized=!0,void window.dispatchEvent(new Event(kt.isInJapanChange));if(e){if("1"===new URLSearchParams(location.search).get("debug_nojp")&&Ee())this._isInJapan=!1,this._isInJapanInitialized=!0;else try{const t=await(async t=>te(t.endpoint.location))(e);this._isInJapan="Japan"===t.country_name}catch(i){this._isInJapan=!0,t.error(i)}finally{this._isInJapanInitialized=!0}window.dispatchEvent(new Event(kt.isInJapanChange))}}),(t=>{const{onChange:e}=t,r=e?()=>{null==e||e(null)}:null;let i=!1;const o=()=>{var t,e,o,a;const c=na({}).current,h=null==(t=jt({}).current)?void 0:t.defaultConfig,{initialized:d,manager:u,account:p}=Mo({}).current??{};d&&h&&(i=!0,null==r||r(),null==(e=null==n?void 0:n.dispose)||e.call(n),null==(o=null==s?void 0:s.dispose)||o.call(s),null==(a=null==l?void 0:l.dispose)||a.call(l),(null==c?void 0:c.remainOnPageWhenIsInAbroad)||"accountAuthN"===(null==u?void 0:u.getAuthType())&&"dms"===(null==c?void 0:c.siteGroup)&&("business"!==(null==p?void 0:p.responseContent.entity)&&"school"!==(null==p?void 0:p.responseContent.entity)||window.location.replace(h.endpoint.accountPortal)))},n=na({onChange:o}),s=jt({onChange:o}),l=Mo({onChange:o});setTimeout(o)})({}),(t=>{const{onChange:e}=t,r=e?()=>{null==e||e(null)}:null;let i=!1;const o=()=>{var t,e,o,c,h;const d=null==(t=jt({}).current)?void 0:t.defaultConfig,{initialized:u,isInJapan:p}=oa({}).current??{},g=na({}).current,{manager:f}=Mo({}).current??{};u&&d&&(i=!0,null==r||r(),null==(e=null==s?void 0:s.dispose)||e.call(s),null==(o=null==l?void 0:l.dispose)||o.call(l),null==(c=null==a?void 0:a.dispose)||c.call(a),null==(h=null==n?void 0:n.dispose)||h.call(n),d.config.abroadCheck.default&&(d.config.remainOnPageWhenIsInAbroad.default||d.config.remainOnPageWhenIsInAbroad.overwritable&&(null==g?void 0:g.remainOnPageWhenIsInAbroad)||"accountAuthN"===(null==f?void 0:f.getAuthType())&&"dms"===(null==g?void 0:g.siteGroup)&&(p||window.location.replace(d.endpoint.accountPortal))))},n=na({onChange:o}),s=Mo({onChange:o}),l=oa({onChange:o}),a=jt({onChange:o});setTimeout(o)})({})}await Promise.allSettled(r),this._initialized=!0,window.dispatchEvent(new Event(kt.nhkProviderStateChange))}var c}toggleTheme(){const t="light"===this._theme?"dark":"light";this._theme=t,"dark"===t?document.documentElement.classList.add("dark",e):document.documentElement.classList.remove("dark",e),window.dispatchEvent(new Event(kt.themeChange))}async getLicenseData(){return async function(){const t=await fetch("https://www.web.nhk/assets/scripts/np/licenses/1.10.2/vanilla/license.json");if(!t.ok)throw new Error("Failed to fetch license data");return t.json()}()}createBrowserCookieAccessInstance(t){return Ct(t)}}}();
//# sourceMappingURL=index.js.map
