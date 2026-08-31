async function testHttpSecurity() {
  console.log("==========================================");
  console.log("▶ TESTING REAL HTTP API ENDPOINTS SECURITY");
  console.log("==========================================\n");

  const baseUrl = "http://localhost:3000";
  const orderId = "cmqgyv6to00019ova1s0bgsci";

  // Test 1: GET Invoice without auth
  const resInvoice = await fetch(`${baseUrl}/api/admin/orders/${orderId}/invoice`);
  console.log(`GET /api/admin/orders/${orderId}/invoice status: ${resInvoice.status} (Expected 403)`);
  if (resInvoice.status !== 403) throw new Error("Invoice endpoint security failed!");

  // Test 2: GET AWB without auth
  const resAWB = await fetch(`${baseUrl}/api/admin/orders/${orderId}/awb`);
  console.log(`GET /api/admin/orders/${orderId}/awb status: ${resAWB.status} (Expected 403)`);
  if (resAWB.status !== 403) throw new Error("AWB endpoint security failed!");

  // Test 3: GET Combined without auth
  const resCombined = await fetch(`${baseUrl}/api/admin/orders/${orderId}/combined`);
  console.log(`GET /api/admin/orders/${orderId}/combined status: ${resCombined.status} (Expected 403)`);
  if (resCombined.status !== 403) throw new Error("Combined endpoint security failed!");

  // Test 4: PUT Shipping without auth
  const resShipping = await fetch(`${baseUrl}/api/admin/orders/${orderId}/shipping`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courier: "TCS" }),
  });
  console.log(`PUT /api/admin/orders/${orderId}/shipping status: ${resShipping.status} (Expected 403)`);
  if (resShipping.status !== 403) throw new Error("Shipping endpoint security failed!");

  console.log("\n✅ ALL HTTP API SECURITY CHECKS PASSED (403 FORBIDDEN CONFIRMED)");
}

testHttpSecurity().catch((err) => {
  console.error("❌ HTTP Security test failed:", err);
  process.exit(1);
});
