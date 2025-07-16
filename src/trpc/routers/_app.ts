
import { createTRPCRouter } from '../init';

import { authRouter } from '@/modules/auth/server/procedures';
import { categoriesRouter } from '@/modules/categories/server/procedures';
import { productsRouter } from '@/modules/products/server/procedures';
import { cartRouter } from '@/modules/cart/server/procedures';
import { ordersRouter } from '@/modules/orders/server/procedures';


export const appRouter = createTRPCRouter({
  auth: authRouter,
  products: productsRouter,
  categories: categoriesRouter,
  cart: cartRouter,
  orders: ordersRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;