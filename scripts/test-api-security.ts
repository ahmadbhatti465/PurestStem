import { GET as invoiceGET } from "../src/app/api/admin/orders/[id]/invoice/route";
import { GET as awbGET } from "../src/app/api/admin/orders/[id]/awb/route";
import { GET as combinedGET } from "../src/app/api/admin/orders/[id]/combined/route";
import { PUT as shippingPUT } from "../src/app/api/admin/orders/[id]/shipping/route";
import { NextRequest } from "next/server";

async function testSecurity() {
  console.log("==========================================");
  console.log("▶ TESTING API AUTHORIZATION & SECURITY");
  console.log("==========================================\n");

  const dummyOrderId = "cmqgyv6to00019ova1s0bgsci";
  const params = Promise.resolve({ id: dummyOrderId });

  // Test unauthenticated GET invoice
  const req1 = new NextRequest("http://localhost:3000/api/admin/orders/123/invoice");
  const res1 = await invoiceGET(req1, { params });
  console.log(`Invoice unauthenticated status: ${res1.status} (Expected 403)`);
  if (res1.status !== 403) throw new Error("Security check failed on Invoice API!");

  // Test unauthenticated GET AWB
  const req2 = new NextRequest("http://localhost:3000/api/admin/orders/123/awb");
  const res2 = await awbGET(req2, { params });
  console.log(`AWB unauthenticated status: ${res2.status} (Expected 403)`);
  if (res2.status !== 403) throw new Error("Security check failed on AWB API!");

  // Test unauthenticated GET Combined
  const req3 = new NextRequest("http://localhost:3000/api/admin/orders/123/combined");
  const res3 = await combinedGET(req3, { params });
  console.log(`Combined unauthenticated status: ${res3.status} (Expected 403)`);
  if (res3.status !== 403) throw new Error("Security check failed on Combined API!");

  // Test unauthenticated PUT Shipping
  const req4 = new NextRequest("http://localhost:3000/api/admin/orders/123/shipping", {
    method: "PUT",
    body: JSON.stringify({ courier: "TCS" }),
  });
  const res4 = await shippingPUT(req4, { params });
  console.log(`Shipping update unauthenticated status: ${res4.status} (Expected 403)`);
  if (res4.status !== 403) throw new Error("Security check failed on Shipping API!");

  console.log("\n✅ ALL API SECURITY CHECKS PASSED (403 FORBIDDEN ENFORCED)");
}

testSecurity().catch((err) => {
  console.error("❌ Security test failed:", err);
  process.exit(1);
});
