import { NextResponse } from 'next/server';
import { ipAddress } from '@vercel/edge'; // Vercel Edge Functions を利用する場合

// ホワイトリストに設定するIPアドレス帯域 (CIDR表記)
const whitelist = [
 // IPv4アドレス帯域
 '192.168.1.0/24', // 例：192.168.1.0 ~ 192.168.1.255
 '10.0.0.0/16',    // 例：10.0.0.0 ~ 10.0.255.255
 // IPv6アドレス帯域
 '2001:db8::/32',  // 例：2001:db8:: ~ 2001:db8:ffff:ffff:ffff:ffff:ffff:ffff
 'fe80::/10'       // リンクローカルアドレス
];

// IPv4およびIPv6アドレスを整数に変換する関数
function ipToInt(ip) {
 if (ip.includes(':')) { // IPv6
  // IPv6アドレスの正規化（省略形を完全な形式に展開）
  const normalizedIP = normalizeIPv6(ip);
  const sections = normalizedIP.split(':').map(section => parseInt(section, 16));
  return sections.reduce((acc, val) => (acc << 16n) + BigInt(val), 0n);
 } else { // IPv4
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
 }
}

// IPv6アドレスを正規化する関数（省略形を完全な形式に展開）
function normalizeIPv6(ip) {
 // :: を適切な数の 0: で置き換える
 if (ip.includes('::')) {
  const parts = ip.split('::');
  const missing = 8 - (parts[0].split(':').filter(Boolean).length + parts[1].split(':').filter(Boolean).length);
  const zeros = Array(missing).fill('0').join(':');
  ip = parts[0] + (parts[0] ? ':' : '') + zeros + (parts[1] ? ':' : '') + parts[1];
 }

 // 各セクションを4桁の16進数に正規化
 return ip.split(':').map(section => section.padStart(4, '0')).join(':');
}

// CIDR表記のネットワークにIPアドレスが含まれるかどうかを判定する関数
function cidrCheck(ip, cidr) {
 let [range, bits] = cidr.split('/');
 bits = parseInt(bits, 10);

 // IPv6アドレスの場合
 if (ip.includes(':')) {
  // CIDRのネットワークアドレスもIPv6形式であることを確認
  if (!range.includes(':')) {
   console.warn(`IPv6アドレス ${ip} に対して、IPv4形式のCIDR ${cidr} が指定されました。`);
   return false;
  }

  const ipInt = ipToInt(ip);
  const rangeInt = ipToInt(range);

  // ビット数が128を超えないようにする
  bits = Math.min(bits, 128);

  // マスクを計算（ビット反転のために ~mask を使用）
  const mask = ~((1n << (128n - BigInt(bits))) - 1n);

  return (ipInt & mask) === (rangeInt & mask);
 }
 // IPv4アドレスの場合
 else {
  // CIDRのネットワークアドレスもIPv4形式であることを確認
  if (range.includes(':')) {
   console.warn(`IPv4アドレス ${ip} に対して、IPv6形式のCIDR ${cidr} が指定されました。`);
   return false;
  }

  const ipInt = ipToInt(ip);
  const rangeInt = ipToInt(range);

  // ビット数が32を超えないようにする
  bits = Math.min(bits, 32);

  // マスクを計算
  const mask = ~((1 << (32 - bits)) - 1) >>> 0;

  return (ipInt & mask) === (rangeInt & mask);
 }
}

export function middleware(request) {
 // クライアントのIPアドレスを取得
 let clientIp;
 if (process.env.VERCEL) {
  // Vercel Edge Functions の場合
  clientIp = ipAddress(request);
 } else {
  // ローカル環境や他の環境の場合
  const forwardedIps = request.headers.get('x-forwarded-for');
  if (forwardedIps) {
   // 信頼できるプロキシからの最初のIPを使用
   clientIp = forwardedIps.split(',')[0].trim();
  } else {
   clientIp = request.socket?.remoteAddress;
  }
 }

 // IPアドレスが取得できない場合は、エラーを返す
 if (!clientIp) {
  console.warn('クライアントIPアドレスを取得できませんでした。');
  return new NextResponse(
   'サーバー側の問題によりIPアドレスを取得できませんでした。',
   { status: 503 }
  );
 }

 // ホワイトリストに含まれているか確認
 const isWhitelisted = whitelist.some(cidr => cidrCheck(clientIp, cidr));

 if (!isWhitelisted) {
  console.log(`IPアドレス ${clientIp} はホワイトリストに含まれていません。アクセスを拒否します。`);
  // ホワイトリストに含まれていない場合の処理
  return new NextResponse(
   'このIPアドレスからのアクセスは許可されていません。',
   { status: 403 }
  );
 }

 // ホワイトリストに含まれている場合は、リクエストを許可
 return NextResponse.next();
}

// マッチさせるパスを設定
export const config = {
 matcher: [
  /*
   * `/api/auth/:path*`を除外:
   * - ファイルベース認証機能のNextAuth.js(`/api/auth`)によって使用される内部パス。
   * - カスタムAPIルートに影響を与えないように保護する。
   * すべてのパスを一致させるには：/((?!api/auth).*)
   */
  '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
 ],
};
