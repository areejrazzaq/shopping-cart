<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Order Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .email-container {
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 14px;
        }
        .content {
            padding: 30px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
        }
        .stat-value {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }
        .stat-label {
            font-size: 14px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .section-title {
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
            margin: 30px 0 15px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid #e5e7eb;
        }
        .products-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .products-table thead {
            background-color: #f9fafb;
        }
        .products-table th {
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .products-table td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
            color: #4b5563;
        }
        .products-table tbody tr:hover {
            background-color: #f9fafb;
        }
        .products-table tbody tr:last-child td {
            border-bottom: none;
        }
        .price {
            font-weight: 600;
            color: #059669;
        }
        .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
            border-top: 1px solid #e5e7eb;
        }
        .no-products {
            text-align: center;
            padding: 40px 20px;
            color: #6b7280;
            font-style: italic;
        }
        @media only screen and (max-width: 600px) {
            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            .products-table {
                font-size: 12px;
            }
            .products-table th,
            .products-table td {
                padding: 8px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>📊 Daily Order Report</h1>
            <p>{{ now()->format('F j, Y') }}</p>
        </div>
        
        <div class="content">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">{{ number_format($totalOrders) }}</div>
                    <div class="stat-label">Total Orders</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${{ number_format($totalAmount, 2) }}</div>
                    <div class="stat-label">Total Revenue</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">{{ number_format($totalProducts) }}</div>
                    <div class="stat-label">Products Sold</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">{{ number_format($totalUsers) }}</div>
                    <div class="stat-label">Active Users</div>
                </div>
            </div>

            <h2 class="section-title">Products Ordered</h2>
            
            @if(!empty($products) && count($products) > 0)
                <table class="products-table">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Stock Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        @php
                            // Group products by ID to avoid duplicates and show unique products
                            $uniqueProducts = collect($products)->unique('id');
                        @endphp
                        @foreach($uniqueProducts as $product)
                            <tr>
                                <td>{{ $product->name }}</td>
                                <td class="price">${{ number_format($product->price, 2) }}</td>
                                <td>{{ number_format($product->stock_quantity) }} units</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @else
                <div class="no-products">
                    <p>No products were ordered in the last 24 hours.</p>
                </div>
            @endif
        </div>

        <div class="footer">
            <p>This is an automated daily report from your e-commerce system.</p>
            <p>Generated on {{ now()->format('F j, Y \a\t g:i A') }}</p>
        </div>
    </div>
</body>
</html>

