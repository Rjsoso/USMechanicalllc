#!/usr/bin/env node

/**
 * Webhook Verification Script
 * This script helps verify your webhook configuration
 */

const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function testWebhook(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(JSON.stringify({ test: true }));
    req.end();
  });
}

async function main() {
  console.log('\n🔍 Webhook Verification Tool\n');
  console.log('This tool will help you verify your webhook setup.\n');

  // Step 1: Get Vercel Deploy Hook URL
  console.log('📋 Step 1: Vercel Deploy Hook');
  console.log('Go to: https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/deploy-hooks\n');
  
  const vercelHookUrl = await question('Enter your Vercel Deploy Hook URL (or press Enter to skip): ');
  
  if (vercelHookUrl.trim()) {
    console.log('\n✅ Verifying Vercel Deploy Hook URL...');
    
    // Validate URL format
    if (!vercelHookUrl.startsWith('https://api.vercel.com/v1/integrations/deploy/')) {
      console.log('⚠️  Warning: URL should start with: https://api.vercel.com/v1/integrations/deploy/');
    } else {
      console.log('✅ URL format looks correct');
    }

    // Test the webhook
    try {
      console.log('\n🧪 Testing webhook (this will trigger a deployment)...');
      const response = await testWebhook(vercelHookUrl);
      
      if (response.statusCode === 200 || response.statusCode === 201) {
        console.log('✅ Webhook test successful! Status:', response.statusCode);
        console.log('✅ A deployment should have been triggered in Vercel');
      } else {
        console.log('⚠️  Unexpected status code:', response.statusCode);
        console.log('Response:', response.body);
      }
    } catch (error) {
      console.log('❌ Error testing webhook:', error.message);
      console.log('This might be normal if the webhook requires authentication');
    }
  }

  // Step 2: Check Sanity Webhook
  console.log('\n📋 Step 2: Sanity Webhook Configuration');
  console.log('Go to: https://www.sanity.io/manage/personal/project/3vpl3hho/api/webhooks\n');
  
  const sanityWebhookUrl = await question('Enter your Sanity Webhook URL (or press Enter to skip): ');
  
  if (sanityWebhookUrl.trim()) {
    console.log('\n✅ Verifying Sanity Webhook URL...');
    
    if (sanityWebhookUrl === vercelHookUrl) {
      console.log('✅ Sanity webhook URL matches Vercel hook URL');
    } else if (vercelHookUrl.trim()) {
      console.log('⚠️  Warning: Sanity webhook URL does not match Vercel hook URL');
      console.log('   They should be the same!');
    }
  }

  // Step 3: Configuration Checklist
  console.log('\n📋 Step 3: Configuration Checklist\n');
  
  const checks = [
    {
      name: 'Vercel Deploy Hook exists',
      check: () => vercelHookUrl.trim() !== '',
    },
    {
      name: 'Vercel Hook URL format is correct',
      check: () => vercelHookUrl.startsWith('https://api.vercel.com/v1/integrations/deploy/'),
    },
    {
      name: 'Sanity Webhook URL matches Vercel Hook',
      check: () => sanityWebhookUrl === vercelHookUrl && vercelHookUrl.trim() !== '',
    },
  ];

  checks.forEach((check, index) => {
    const result = check.check();
    console.log(`${result ? '✅' : '❌'} ${index + 1}. ${check.name}`);
  });

  // Step 4: Manual Verification Steps
  console.log('\n📋 Step 4: Manual Verification Steps\n');
  console.log('Please verify these settings manually:\n');
  
  console.log('Vercel Deploy Hook:');
  console.log('  - Name: "Sanity Content Updates"');
  console.log('  - Branch: "main"');
  console.log('  - Status: Active\n');
  
  console.log('Sanity Webhook:');
  console.log('  - Name: "Trigger Vercel Rebuild"');
  console.log('  - URL: [Should match Vercel hook URL]');
  console.log('  - Dataset: "production"');
  console.log('  - Triggers: create, update, delete (all checked)');
  console.log('  - HTTP Method: POST');
  console.log('  - API Version: v2021-03-25\n');

  // Step 5: Test Instructions
  console.log('📋 Step 5: Test the Webhook\n');
  console.log('1. Go to Sanity Studio: https://sanity-henna.vercel.app/structure');
  console.log('2. Edit any content (e.g., "Our Services Section")');
  console.log('3. Click "Publish"');
  console.log('4. Within 30 seconds, check Vercel:');
  console.log('   https://vercel.com/rjsosos-projects/us-mechanicalllc/deployments');
  console.log('5. You should see a new deployment starting automatically\n');

  rl.close();
}

main().catch(console.error);

