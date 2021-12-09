import { useContext, useEffect, useState } from "react";
import CartContext from "../../store/cart-context";
import CartIcon from "../Cart/CartIcon";
import classes from './HeaderCardButton.module.css'



const HeaderCartButton = props => {
    const [btnIsHighLighted, setBtnIsHighlighted] = useState(false);
    const cartCtx = useContext(CartContext);

    const { items } = cartCtx;

    const numOfCartItems = items.reduce((curNum, item) => {
        return curNum + item.amount;
    }, 0);



    const btnClasses = `${classes.button} ${btnIsHighLighted ? classes.bump : ''}`;


    useEffect(() => {
        if (items.length === 0) {
            return;
        }
        setBtnIsHighlighted(true)
        const timer = setTimeout(() => {
            setBtnIsHighlighted(false)
        }, 300)
        return () => {
            clearTimeout(timer)
        }
    }, [items])

    return (
        <button className={btnClasses} onClick={props.onClick}>
            <span className={classes.icon}>
                <CartIcon />
            </span>
            <span >Your Cart</span>
            <span className={classes.badge}>
                {numOfCartItems}
            </span>
        </button>
    )
}

export default HeaderCartButton;