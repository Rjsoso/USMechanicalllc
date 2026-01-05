#!/bin/bash
# Test script to manually trigger Vercel deployment via webhook

echo "🔍 Testing Vercel Deploy Hook..."
echo ""
echo "Please provide your Vercel Deploy Hook URL"
echo "(Found at: https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/deploy-hooks)"
echo ""
read -p "Enter the webhook URL: " WEBHOOK_URL

if [ -z "$WEBHOOK_URL" ]; then
    echo "❌ No URL provided"
    exit 1
fi

echo ""
echo "🚀 Triggering deployment..."
echo ""

RESPONSE=$(curl -X POST "$WEBHOOK_URL" -w "\nHTTP_STATUS:%{http_code}" -s)
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)

echo "Response: $RESPONSE"
echo ""

if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "201" ]; then
    echo "✅ Webhook triggered successfully!"
    echo "✅ Check Vercel deployments: https://vercel.com/rjsosos-projects/us-mechanicalllc/deployments"
    echo "   A new deployment should appear within 30 seconds"
else
    echo "❌ Webhook failed with status: $HTTP_STATUS"
    echo "   This might not be a valid Deploy Hook URL"
fi

