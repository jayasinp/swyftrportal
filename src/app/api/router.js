// Import core modules
import express from 'express';
import authRouter from './auth/authRouter';
import userRouter from './user/userRouter';
import partnerRouter from './partner/partnerRouter';
import riderRouter from './rider/riderRouter';
import orderRouter from './order/orderRouter';
import storeRouter from './store/storeRouter';
import categoryRouter from './category/categoryRouter';
import productRouter from './inventory/productRouter';
import fileRouter from './file/fileRouter';
import paramsRouter from './params/paramsRouter';
import orderFriendRouter from './orderFriendReceive/orderFriendReceiveRouter';
import userRatingRouter from './userRating/userRatingRouter';
import reportRouter from './report/reportRouter';
import paymentInfoRouter from './paymentInfo/paymentInfoRouter';
import issuesRouter from './issues/issuesRouter';
import friendReceiveCollector from './friendReceiveCollector/friendReceiveCollectorRouter'

let router = new express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/rider', riderRouter);
router.use('/partner', partnerRouter);
router.use('/store', storeRouter);
router.use('/order', orderRouter);
router.use('/category', categoryRouter);
router.use('/product', productRouter);
router.use('/file', fileRouter);
router.use('/params', paramsRouter);
router.use('/orderFriend', orderFriendRouter);
router.use('/rating', userRatingRouter);
router.use('/report', reportRouter);
router.use('/paymentInfo', paymentInfoRouter);
router.use('/issues', issuesRouter);
router.use('/orderCollect', friendReceiveCollector);

export default router;
