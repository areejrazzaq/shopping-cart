<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Low Stock Alert</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #dc2626;
            color: white;
            padding: 20px;
            border-radius: 5px 5px 0 0;
            text-align: center;
        }
        .content {
            background-color: #f9fafb;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-top: none;
        }
        .product-list {
            margin-top: 20px;
        }
        .product-item {
            background-color: white;
            padding: 15px;
            margin-bottom: 10px;
            border-left: 4px solid #dc2626;
            border-radius: 4px;
        }
        .product-name {
            font-weight: bold;
            font-size: 16px;
            color: #1f2937;
            margin-bottom: 5px;
        }
        .product-details {
            color: #6b7280;
            font-size: 14px;
        }
        .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
        }
        .alert-badge {
            display: inline-block;
            background-color: #fef2f2;
            color: #dc2626;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>⚠️ Low Stock Alert</h1>
    </div>
    
    <div class="content">
        <div class="alert-badge">
            ACTION REQUIRED
        </div>
        
        <p>Dear Admin,</p>
        
        <p>
            @if($productCount === 1)
                A product in your inventory is running low on stock and needs immediate attention.
            @else
                <strong>{{ $productCount }} products</strong> in your inventory are running low on stock and need immediate attention.
            @endif
        </p>

        <div class="product-list">
            @foreach($products as $product)
                <div class="product-item">
                    <div class="product-name">{{ $product->name }}</div>
                    <div class="product-details">
                        <strong>Current Stock:</strong> {{ $product->stock_quantity }} units<br>
                        <strong>Price:</strong> ${{ number_format($product->price, 2) }}<br>
                        <strong>Product ID:</strong> #{{ $product->id }}
                    </div>
                </div>
            @endforeach
        </div>
    </div>

    <div class="footer">
        <p>This is an automated notification from your e-commerce system.</p>
        <p>Please do not reply to this email.</p>
    </div>
</body>
</html>

