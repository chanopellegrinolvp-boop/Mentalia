import { NextResponse } from 'next/server';

export async function GET() {
  const assetlinks = [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'online.mentaliasalud.app',
        sha256_cert_fingerprints: [
          '38:6A:38:9D:88:AB:13:09:E4:1E:07:94:01:F0:C6:D8:36:54:66:D3:AD:0C:81:F6:9F:E9:F2:E6:99:A4:C1:65',
        ],
      },
    },
  ];

  return NextResponse.json(assetlinks);
}
