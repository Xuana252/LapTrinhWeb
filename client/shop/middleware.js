import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { cookies } from "next/headers";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    // Retrieve the 'OrderingState' cookie value (which should now be numeric)
    const orderingState = Number(cookies().get("OrderingState")?.value);

    // Define paths
    const isCheckoutPage = pathname.startsWith("/cart/checkout");
    const isPaymentPage = pathname.startsWith("/cart/checkout/payment");
    const isReceiptPage = pathname.startsWith("/cart/checkout/payment/receipt");


    
    // If the user is trying to access the Checkout page without state >= 1
    if (isCheckoutPage && orderingState < 1) {
      return NextResponse.redirect(new URL("/cart", req.url)); // Redirect to cart if not completed
    }

    // If the user is trying to access the Payment page without state >= 2
    if (isPaymentPage && orderingState < 2) {
      return NextResponse.redirect(
        orderingState < 1
          ? new URL("/cart", req.url) // Redirect to cart if not completed
          : new URL("/cart/checkout", req.url) // Redirect to checkout if not completed
      );
    }

    // If the user is trying to access the Receipt page without state >= 3
    if (isReceiptPage && orderingState < 3) {
      return NextResponse.redirect(
        orderingState < 1
          ? new URL("/cart", req.url) // Redirect to cart if not completed
          : orderingState < 2
          ? new URL("/cart/checkout", req.url) // Redirect to checkout if not completed
          : new URL("/cart/checkout/payment", req.url) // Redirect to payment if not completed
      );
    }

    // Allow access if conditions are met
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Only allow authenticated users
    },
  }
);

export const config = {
  matcher: ["/account/:path*", "/cart/:path*"],
};
