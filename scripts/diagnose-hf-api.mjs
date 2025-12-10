#!/usr/bin/env node

/**
 * HF FastAPI Diagnostics Script
 * Quick check for HF FastAPI health and connectivity
 */

const HF_API_BASE = 'https://nzlouislu-nzlouis-property-api.hf.space';

async function checkEndpoint(url, name) {
  console.log(`\n🔍 Testing ${name}...`);
  console.log(`   URL: ${url}`);
  
  try {
    const response = await fetch(url);
    const status = response.status;
    const statusText = response.statusText;
    
    console.log(`   Status: ${status} ${statusText}`);
    
    if (response.ok) {
      try {
        const data = await response.json();
        console.log(`   ✅ Response: ${JSON.stringify(data).substring(0, 100)}...`);
        return true;
      } catch (e) {
        const text = await response.text();
        console.log(`   ✅ Response (text): ${text.substring(0, 100)}...`);
        return true;
      }
    } else {
      const text = await response.text();
      console.log(`   ❌ Error: ${text.substring(0, 200)}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('🏥 HF FastAPI Health Check Diagnostics');
  console.log('═══════════════════════════════════════════════════');
  
  const tests = [
    { url: `${HF_API_BASE}/`, name: 'Root Endpoint' },
    { url: `${HF_API_BASE}/health`, name: 'Health Check' },
    { url: `${HF_API_BASE}/docs`, name: 'Swagger UI' },
    { url: `${HF_API_BASE}/api/property?city=Wellington%20City&page=0&pageSize=2`, name: 'Property API (Sample)' },
    { url: `${HF_API_BASE}/api/regions`, name: 'Regions API' },
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await checkEndpoint(test.url, test.name);
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }
  
  console.log('\n═══════════════════════════════════════════════════');
  console.log(`📊 Results: ${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    console.log('\n⚠️  RECOMMENDATIONS:');
    console.log('   1. Check HF Space logs at:');
    console.log('      https://huggingface.co/spaces/NZLouislu/nzlouis-property-api');
    console.log('   2. Verify environment variables are set (SUPABASE_URL, SUPABASE_KEY)');
    console.log('   3. Ensure all FastAPI code is uploaded to HF Space');
    console.log('   4. Check requirements.txt includes all dependencies');
    console.log('\n   📖 See tasks/HF_FastAPI_500错误修复指南.md for details');
    console.log('\n   🔄 Temporary fix: Comment out NEXT_PUBLIC_HF_API_URL in .env');
    console.log('      to use local Next.js API instead');
  } else {
    console.log('✅ All tests passed! HF FastAPI is working correctly.');
  }
  
  console.log('═══════════════════════════════════════════════════\n');
}

main();
