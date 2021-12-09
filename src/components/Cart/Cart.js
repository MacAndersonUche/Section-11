import Modal from '../UI/Modal'
import classes from './Cart.module.css'
import React, { useContext, useState } from 'react'
import CartContext from '../../store/cart-context'
import CartItem from './CartItem'
import Checkout from './Checkout'




const Cart = props => {
    const [isCheckOut, setIsCheckOut] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [didSubmit, setDidSubmit] = useState(false);

    const cartCtx = useContext(CartContext);

    const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`

    const hasItems = cartCtx.items.length > 0;

    const cartItemRemoveHandler = (id) => {
        cartCtx.removeItem(id)
    };

    const cartItemAddHandler = (item) => {
        cartCtx.addItem(item)
    }


    const orderHandler = () => {
        setIsCheckOut(true)
    }

    const submitOrderHandler = async (userData) => {
        setIsSubmitting(true)
        try {
            const response = await fetch('https://reacthttp-18a6f-default-rtdb.europe-west1.firebasedatabase.app/order.json', {
                method: 'POST',
                body: JSON.stringify({
                    user: userData,
                    orderedItems: cartCtx.items
                })
            })

            if (response.ok) {
                await response.json()
                setIsSubmitting(false)
                setDidSubmit(true);

                cartCtx.clearCart();
            }

            throw new Error('Not working ')
        } catch (error) {
            return <p>{error}</p>
        }

    }

    const cartItems = (
        <ul>
            {cartCtx.items.map((item) =>
                <CartItem
                    key={item.id}
                    name={item.name}
                    amount={item.amount}
                    price={item.price}
                    onRemove={cartItemRemoveHandler.bind(null, item.id)}
                    onAdd={cartItemAddHandler.bind(null, item)} />
            )}
        </ul>)


    const modalActions = (
        <div className={classes.actions}>
            <button className={classes['button--alt']} onClick={props.onClose}>Close</button>
            {hasItems && <button className={classes.button} onClick={orderHandler}>Order</button>}

        </div>)


    const cartModalContent = (
        <React.Fragment>
            {cartItems}
            <div className={classes.total}>
                <span >Total Amount</span>
                <span>{totalAmount}</span>
            </div>
            {isCheckOut && <Checkout onConfirm={submitOrderHandler}
                onCancel={props.onClose} />}
            {!isCheckOut && modalActions}

        </React.Fragment>);



    const isSubmittingModalContent = <p>Sending Order Data</p>

    const didSubmitModal = (<React.Fragment>
        <p>Successfully sent the order!</p>
        <div className={classes.actions}>
            <button className={classes.button} onClick={props.onClose}>Close</button>
        </div>

    </React.Fragment>)
    return (
        <Modal onClose={props.onClose}>
            {!isSubmitting && !didSubmit && cartModalContent}
            {isSubmitting && isSubmittingModalContent}
            {!isSubmitting && didSubmit && didSubmitModal}
        </Modal>
    )
}

export default Cart