CREATE TRIGGER deleteOrder AFTER DELETE ON ORDER_BRANCH_STOCK
FOR EACH ROW
UPDATE BRANCH_STOCK SET qty = qty + OLD.quantity WHERE id = OLD.branch_stock_id;