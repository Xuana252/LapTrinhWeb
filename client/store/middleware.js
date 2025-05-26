export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    /**
     * This regex matches everything EXCEPT routes that start with "/authentication"
     */
    "/((?!authentication).*)",
  ],
}