import React from "react";
import { Link } from "react-router";

export const HomeOrdersSection: React.FC = () => {
  return (
    <section className="orders-section">
      <div className="section-header">
        <h2>Recent Orders</h2>

        <Link to="%" className="view-all">
          View All
        </Link>
      </div>

      <div className="card-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Table / Type</th>
              <th>Items</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="order-id">#1042</td>
              <td>Table 04</td>
              <td className="text-muted">
                Truffle Risotto, Wagyu...
              </td>
              <td>
                <span className="status-pill status-preparing">
                  Preparing
                </span>
              </td>
              <td className="order-total">
                $145.00
              </td>
            </tr>


            <tr>
              <td className="order-id">#1041</td>
              <td>Delivery</td>
              <td className="text-muted">
                Spicy Rigatoni, Burrata
              </td>
              <td>
                <span className="status-pill status-ready">
                  Ready
                </span>
              </td>
              <td className="order-total">
                $82.50
              </td>
            </tr>


            <tr>
              <td className="order-id">#1040</td>
              <td>Table 12</td>
              <td className="text-muted">
                Seafood Tower, Chablis
              </td>
              <td>
                <span className="status-pill status-served">
                  Served
                </span>
              </td>
              <td className="order-total">
                $310.00
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

